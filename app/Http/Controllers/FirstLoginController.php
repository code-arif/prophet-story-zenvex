<?php

namespace App\Http\Controllers;

use App\Models\Subscriber;
use App\Models\Subscription;
use App\Services\AppSettings;
use App\Services\BdAppsApiClient;
use App\Services\BdAppsSmsService;
use App\Services\SubscriberSync;
use App\Services\SubscriptionNotifier;
use App\Support\Msisdn;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * FirstLoginController - Handles user authentication and login flow
 * 
 * This controller manages the complete login flow:
 * - Phone number login with OTP verification
 * - Guest mode access
 * - BdApps platform integration (OTP, subscription)
 * - Auto-login for existing subscribers
 * 
 * Features:
 * - MSISDN normalization for Bangladesh numbers
 * - Platform OTP or local OTP modes
 * - Subscription verification via BdApps API
 * - Guest mode support
 * - Session management
 */
class FirstLoginController extends Controller
{
    private function getRedirectUrl(Request $request): string
    {
        // After login, always land on the Prophet Library — not the public landing page.
        return route('library.index');
    }

    public function show(Request $request, AppSettings $settings)
    {
        // If already logged in, redirect to provider dashboard or browse page
        $msisdn = (string) $request->session()->get('msisdn', '');
        if ($msisdn !== '' && !$request->session()->get('is_guest', false)) {
            return redirect($this->getRedirectUrl($request));
        }

        return Inertia::render('Auth/PhoneLogin', [
            'brandName' => $settings->brandName(),
            'logoUrl' => $settings->logoUrl(),
            'guestModeEnabled' => (bool) $settings->get('guest_mode_enabled', $settings->get('guest_mode.enabled', false)),
            'appChargeText' => (string) $settings->get('app.download_charge_text', $settings->get('app_charge_text', 'Charge: Tk 4.00+ (VAT+SD+SC) per day with Auto Renewal.')),
        ]);
    }

    public function guest(Request $request)
    {
        $request->session()->put('is_guest', true);
        $request->session()->put('msisdn', 'guest_' . uniqid());

        return redirect($this->getRedirectUrl($request));
    }

    public function sendOtp(Request $request, BdAppsSmsService $sms, BdAppsApiClient $client, AppSettings $settings)
    {
        $validated = $request->validate([
            'msisdn' => ['required', 'string', 'max:32'],
        ]);

        $msisdn = Msisdn::normalizeBd((string) $validated['msisdn']);
        if ($msisdn === '') {
            return redirect()->route('login.show')->with('error', 'Invalid Bangladesh phone number. Use format 8801XXXXXXXXX.');
        }

        // When use_platform_subscription is false, skip ALL BdApps API calls:
        // just create a local session + subscriber record + active subscription.
        $usePlatformSubscription = (bool) config('services.bdapps.use_platform_subscription', true);
        if (!$usePlatformSubscription) {
            return $this->loginLocally($request, $msisdn, 'direct login (platform subscription disabled)');
        }



        // Try auto-login if user already registered on platform
        $autoLoginResult = $this->attemptAutoLogin($request, $client, $msisdn);
        if ($autoLoginResult) {
            return $autoLoginResult;
        }

        // Proceed with OTP verification
        $usePlatformOtp = (bool) config('services.bdapps.use_platform_otp', true);
        $userAgent = $request->userAgent() ?? '';
        $applicationMetaData = $this->detectApplicationMetaData($userAgent, $request, $settings);

        if ($usePlatformOtp) {
            return $this->handlePlatformOtp($request, $client, $msisdn, $applicationMetaData);
        }

        return $this->handleLocalOtp($request, $sms, $settings, $msisdn);
    }

    public function verifyShow(Request $request, AppSettings $settings)
    {
        $pending = (string) $request->session()->get('login.pending_msisdn', '');
        if ($pending === '') {
            return redirect($this->getRedirectUrl($request));
        }

        return Inertia::render('Auth/VerifyOtp', [
            'brandName' => $settings->brandName(),
            'logoUrl' => $settings->logoUrl(),
            'pending' => $pending,
            'appChargeText' => (string) $settings->get('app.download_charge_text', $settings->get('app_charge_text', 'Charge: Tk 4.00+ (VAT+SD+SC) per day with Auto Renewal.')),
        ]);
    }

    public function verify(Request $request, BdAppsApiClient $client)
    {
        $validated = $request->validate([
            'otp' => ['required', 'string', 'max:6'],
        ]);

        $pending = (string) $request->session()->get('login.pending_msisdn', '');
        $referenceNo = (string) $request->session()->get('login.bdapps_reference_no', '');

        // Verify OTP (platform or local)
        if ($referenceNo !== '') {
            $verifyResult = $this->verifyPlatformOtp($request, $client, $pending, $referenceNo, $validated['otp']);
            if ($verifyResult) {
                return $verifyResult; // Error response
            }
        } else {
            $verifyResult = $this->verifyLocalOtp($request, $pending, $validated['otp']);
            if ($verifyResult) {
                return $verifyResult; // Error response
            }
        }

        // Complete login process
        return $this->completeLogin($request, $client, $pending);
    }

    /**
     * Attempt auto-login if user is already registered on BdApps platform
     */
    private function attemptAutoLogin(Request $request, BdAppsApiClient $client, string $msisdn): ?\Illuminate\Http\RedirectResponse
    {
        try {
            $apiResponse = $client->getSubscriptionStatus($msisdn);
            $statusCode = (string) ($apiResponse['statusCode'] ?? '');
            $statusDetail = strtolower(trim((string) ($apiResponse['statusDetail'] ?? '')));
            $apiStatus = (string) ($apiResponse['subscriptionStatus'] ?? '');

            // E1351 - Already registered, auto-login and activate subscription
            if ($statusCode === 'E1351' && $statusDetail === 'user already registered') {
                $this->updateSubscriberFromApi($client, $msisdn, $apiResponse);
                
                $request->session()->put('msisdn', $msisdn);
                $request->session()->forget('is_guest');

                $subscriber = Subscriber::where('msisdn', $msisdn)->first();
                if ($subscriber) {
                    Auth::guard('subscriber')->login($subscriber, true);
                }
                
                // Auto-activate subscription on login
                $this->createActiveSubscription($msisdn, 'auto-subscribed on login (E1351 auto)');
                
                \Log::channel('bdapps')->info('Auto-login and subscribe: E1351', ['msisdn' => $msisdn]);
                return redirect()->intended($this->getRedirectUrl($request))->with('status', 'Welcome back! You are subscribed.');
            }

            // S1000 with active subscription - auto-login and ensure subscription
            if ($statusCode === 'S1000' && $apiStatus === '1') {
                $this->updateSubscriberFromApi($client, $msisdn, $apiResponse);
                
                $request->session()->put('msisdn', $msisdn);
                $request->session()->forget('is_guest');

                $subscriber = Subscriber::where('msisdn', $msisdn)->first();
                if ($subscriber) {
                    Auth::guard('subscriber')->login($subscriber, true);
                }
                
                // Ensure subscription is active in DB
                $this->createActiveSubscription($msisdn, 'auto-subscribed on login (S1000)');
                
                \Log::channel('bdapps')->info('Auto-login and subscribe: S1000', ['msisdn' => $msisdn]);
                return redirect()->intended($this->getRedirectUrl($request))->with('status', 'Welcome back! You are subscribed.');
            }

            // Log other cases for debugging
            if ($statusCode !== 'E1951') {
                \Log::channel('bdapps')->info('Auto-login skipped, require OTP', [
                    'msisdn' => $msisdn,
                    'statusCode' => $statusCode,
                    'statusDetail' => $statusDetail
                ]);
            }
        } catch (\Throwable $e) {
            \Log::channel('bdapps')->warning('Auto-login check failed', [
                'msisdn' => $msisdn,
                'error' => $e->getMessage()
            ]);
        }

        return null; // Require OTP
    }

    /**
     * Handle BdApps platform OTP request
     */
    private function handlePlatformOtp(Request $request, BdAppsApiClient $client, string $msisdn, array $applicationMetaData): \Illuminate\Http\RedirectResponse
    {
        try {
            $resp = $client->otpRequest($msisdn, 'abcdefg', $applicationMetaData);
        } catch (\Throwable $e) {
            return redirect()->route('login.show')->with('error', $e->getMessage());
        }

        $statusCode = (string) ($resp['statusCode'] ?? '');
        $statusDetail = strtolower(trim((string) ($resp['statusDetail'] ?? '')));
        $referenceNo = (string) ($resp['referenceNo'] ?? '');

        // E1343 - Not whitelisted
        if ($statusCode === 'E1343') {
            \Log::channel('bdapps')->warning('OTP blocked: E1343 not whitelisted', ['msisdn' => $msisdn]);
            return redirect()->route('login.show')->with('error', 'Your number is not whitelisted. Please contact support.');
        }

        // E1342 - Blacklisted
        if ($statusCode === 'E1342') {
            \Log::channel('bdapps')->warning('OTP blocked: E1342 blacklisted', ['msisdn' => $msisdn]);
            return redirect()->route('login.show')->with('error', (string) ($resp['statusDetail'] ?? 'Your number is blacklisted.'));
        }

        // E1301 - Application not allowed for operator
        if ($statusCode === 'E1301') {
            \Log::channel('bdapps')->warning('OTP blocked: E1301 app not allowed', ['msisdn' => $msisdn]);
            return redirect()->route('login.show')->with('error', 'Service not available for your operator. Please contact support.');
        }

        // E1351 - Already registered, auto-login and activate subscription
        if ($statusCode === 'E1351' && $statusDetail === 'user already registered') {
            $request->session()->put('msisdn', $msisdn);
            $request->session()->forget('is_guest');
            
            $subscriber = app(SubscriberSync::class)->ensureExists($msisdn);
            Auth::guard('subscriber')->login($subscriber, true);
            
            // Auto-activate subscription on login
            $this->createActiveSubscription($msisdn, 'auto-subscribed on login (E1351)');
            
            \Log::channel('bdapps')->info('Auto-login and subscribe: E1351', ['msisdn' => $msisdn]);
            return redirect()->intended($this->getRedirectUrl($request))->with('status', 'Welcome back! You are subscribed.');
        }

        // S1000 - OTP sent successfully
        if ($statusCode === 'S1000' && $referenceNo !== '') {
            $request->session()->put('login.pending_msisdn', $msisdn);
            $request->session()->put('login.bdapps_reference_no', $referenceNo);
            return redirect()->route('login.verify.show')->with('status', 'OTP sent.');
        }

        // Other errors
        $detail = (string) ($resp['statusDetail'] ?? 'OTP request failed.');
        return redirect()->route('login.show')->with('error', $detail);
    }

    /**
     * Handle local OTP generation and sending
     */
    private function handleLocalOtp(Request $request, BdAppsSmsService $sms, AppSettings $settings, string $msisdn): \Illuminate\Http\RedirectResponse
    {
        $otp = (string) random_int(100000, 999999);

        $request->session()->put('login.pending_msisdn', $msisdn);
        $request->session()->put('login.otp_hash', Hash::make($otp));
        $request->session()->put('login.otp_expires_at', now()->addMinutes(5)->timestamp);

        $sms->safeSend($msisdn, "{$settings->brandName()} OTP: {$otp}. Valid for 5 minutes.");

        if (config('services.bdapps.otp_debug', false) || config('app.debug')) {
            return redirect()->route('login.verify.show')->with('status', "DEV OTP: {$otp}");
        }

        return redirect()->route('login.verify.show')->with('status', 'OTP sent.');
    }

    /**
     * Verify BdApps platform OTP
     * @return \Illuminate\Http\RedirectResponse|null Returns error response or null on success
     */
    private function verifyPlatformOtp(Request $request, BdAppsApiClient $client, string $pending, string $referenceNo, string $otp): ?\Illuminate\Http\RedirectResponse
    {
        if ($pending === '' || $referenceNo === '') {
            return redirect()->route('login.show')->with('error', 'Session expired. Please try again.');
        }

        $otp = preg_replace('/\D/', '', $otp) ?? '';
        if ($otp === '' || strlen($otp) !== 6) {
            return redirect()->route('login.verify.show')->with('error', 'Invalid OTP.');
        }

        try {
            $resp = $client->otpVerify($referenceNo, $otp);
        } catch (\Throwable $e) {
            return redirect()->route('login.verify.show')->with('error', $e->getMessage());
        }

        $statusCode = (string) ($resp['statusCode'] ?? '');
        
        // E1850 - Invalid OTP
        if ($statusCode === 'E1850') {
            return redirect()->route('login.verify.show')->with('error', 'Invalid OTP. Please try again.');
        }

        // S1000 - Success
        if ($statusCode !== 'S1000') {
            $detail = (string) ($resp['statusDetail'] ?? 'Invalid OTP.');
            return redirect()->route('login.verify.show')->with('error', $detail);
        }

        // Extract and store subscriber_id from response
        $subscriberId = $client->extractSubscriberIdFromResponse($resp);
        if ($subscriberId) {
            app(SubscriberSync::class)->ensureExists($pending);
            app(SubscriberSync::class)->updateSubscriberId($pending, $subscriberId);
            \Log::channel('bdapps')->info('Updated subscriber_id after OTP verify', ['msisdn' => $pending, 'subscriberId' => $subscriberId]);
        }

        $request->session()->forget('login.bdapps_reference_no');
        return null; // Success
    }

    /**
     * Verify local OTP
     * @return \Illuminate\Http\RedirectResponse|null Returns error response or null on success
     */
    private function verifyLocalOtp(Request $request, string $pending, string $otp): ?\Illuminate\Http\RedirectResponse
    {
        $hash = (string) $request->session()->get('login.otp_hash', '');
        $expiresAt = (int) $request->session()->get('login.otp_expires_at', 0);

        if ($pending === '' || $hash === '' || $expiresAt === 0) {
            return redirect()->route('login.show')->with('error', 'Session expired. Please try again.');
        }

        if (now()->timestamp > $expiresAt) {
            $this->clearOtpSession($request);
            return redirect()->route('login.show')->with('error', 'OTP expired. Please request a new one.');
        }

        $otp = preg_replace('/\D/', '', $otp) ?? '';
        if ($otp === '' || strlen($otp) !== 6 || !Hash::check($otp, $hash)) {
            return redirect()->route('login.verify.show')->with('error', 'Invalid OTP.');
        }

        return null; // Success
    }

    /**
     * Local-only login: no BdApps API calls.
     * Used when use_platform_subscription is disabled, or as a fallback.
     */
    private function loginLocally(Request $request, string $msisdn, string $reason = 'local login'): \Illuminate\Http\RedirectResponse
    {
        $request->session()->put('msisdn', $msisdn);
        $request->session()->forget('is_guest');

        $subscriber = app(SubscriberSync::class)->ensureExists($msisdn);
        Auth::guard('subscriber')->login($subscriber, true);

        $this->createActiveSubscription($msisdn, $reason);
        $this->clearOtpSession($request);

        return redirect()->intended($this->getRedirectUrl($request))->with('status', 'Login successful.');
    }

    /**
     * Complete login process with subscription activation
     */
    private function completeLogin(Request $request, BdAppsApiClient $client, string $msisdn): \Illuminate\Http\RedirectResponse
    {
        $request->session()->put('msisdn', $msisdn);
        $request->session()->forget('is_guest');

        $subscriber = app(SubscriberSync::class)->ensureExists($msisdn);
        Auth::guard('subscriber')->login($subscriber, true);

        // Try platform subscription if enabled
        if ((bool) config('services.bdapps.use_platform_subscription', true)) {
            try {
                $subResp = $client->setSubscription($msisdn, true);
                $statusCode = (string) ($subResp['statusCode'] ?? '');
                $statusDetail = (string) ($subResp['statusDetail'] ?? '');
                $subscriptionStatus = (string) ($subResp['subscriptionStatus'] ?? '');

                // S1000 with INITIAL CHARGING PENDING or REGISTERED - Success
                if ($statusCode === 'S1000' && in_array($subscriptionStatus, ['INITIAL CHARGING PENDING', 'REGISTERED'])) {
                    $this->updateSubscriberFromApi($client, $msisdn, $subResp);
                    $this->createActiveSubscription($msisdn, 'auto-subscribed on login');
                    $this->clearOtpSession($request);
                    
                    \Log::channel('bdapps')->info('Platform subscription successful', ['msisdn' => $msisdn]);
                    return redirect()->intended($this->getRedirectUrl($request))->with('status', 'Login successful. You are now subscribed.');
                }

                // E1351 - Already registered, activate subscription
                if ($statusCode === 'E1351' && str_contains(strtolower($statusDetail), 'already registered')) {
                    $this->updateSubscriberFromApi($client, $msisdn, $subResp);
                    $this->createActiveSubscription($msisdn, 'auto-subscribed on login (E1351)');
                    $this->clearOtpSession($request);
                    
                    \Log::channel('bdapps')->info('Platform subscription: E1351 already registered', ['msisdn' => $msisdn]);
                    return redirect()->intended($this->getRedirectUrl($request))->with('status', 'Login successful. You are subscribed.');
                }

                // E1951 - Block login for invalid/unregistered
                if ($statusCode === 'E1951') {
                    $this->clearOtpSession($request);
                    \Log::channel('bdapps')->warning('Login blocked: E1951 on setSubscription', ['msisdn' => $msisdn]);
                    return redirect()->route('login.show')->with('error', 'Unable to activate subscription. Please try again later.');
                }

                // Extract subscriber_id from response
                $subId = $client->extractSubscriberIdFromResponse($subResp);
                if ($subId) {
                    app(SubscriberSync::class)->updateSubscriberId($msisdn, $subId);
                }

                // Log non-success responses
                if ($statusCode !== 'S1000') {
                    \Log::channel('bdapps')->warning('Platform subscription returned non-success', [
                        'msisdn' => $msisdn,
                        'statusCode' => $statusCode,
                        'subscriptionStatus' => $subscriptionStatus
                    ]);
                }
            } catch (\Throwable $e) {
                \Log::channel('bdapps')->error('Platform subscription exception', [
                    'msisdn' => $msisdn,
                    'error' => $e->getMessage()
                ]);
            }
        }

        // Create local subscription
        $this->createActiveSubscription($msisdn, 'auto-subscribed on login');
        $this->clearOtpSession($request);

        return redirect()->intended($this->getRedirectUrl($request))->with('status', 'Phone verified.');
    }

    /**
     * Update subscriber information from API response
     */
    private function updateSubscriberFromApi(BdAppsApiClient $client, string $msisdn, array $apiResponse): void
    {
        app(SubscriberSync::class)->ensureExists($msisdn);
        
        $subscriberId = $client->extractSubscriberIdFromResponse($apiResponse);
        if ($subscriberId) {
            app(SubscriberSync::class)->updateSubscriberId($msisdn, $subscriberId);
        }
    }

    /**
     * Sync subscription status with BdApps API (non-blocking)
     */
    private function syncSubscriptionStatus(BdAppsApiClient $client, string $msisdn): void
    {
        try {
            $apiResponse = $client->getSubscriptionStatus($msisdn);
            $apiStatus = (string) ($apiResponse['subscriptionStatus'] ?? '');
            $statusCode = (string) ($apiResponse['statusCode'] ?? '');

            $this->updateSubscriberFromApi($client, $msisdn, $apiResponse);

            if ($statusCode === 'S1000' && $apiStatus === '1') {
                $this->createActiveSubscription($msisdn, 'synced from platform');
            }
        } catch (\Throwable $e) {
            \Log::channel('bdapps')->warning('Subscription sync failed', [
                'msisdn' => $msisdn,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Create or update active subscription in database
     */
    private function createActiveSubscription(string $msisdn, string $message): void
    {
        Subscription::query()
            ->where('msisdn', $msisdn)
            ->where('status', Subscription::STATUS_CANCELED)
            ->delete();

        Subscription::updateOrCreate(
            ['msisdn' => $msisdn, 'status' => Subscription::STATUS_ACTIVE],
            [
                'starts_at' => now(),
                'ends_at' => null,
                'channel' => 'web',
                'last_message' => $message,
            ]
        );

        // Send notification (non-blocking)
        try {
            app(SubscriptionNotifier::class)->notifySubscribed($msisdn);
        } catch (\Throwable $e) {
            \Log::channel('bdapps')->warning('Subscription notification failed', [
                'msisdn' => $msisdn,
                'error' => $e->getMessage()
            ]);
        }
    }

    private function clearOtpSession(Request $request): void
    {
        $request->session()->forget([
            'login.pending_msisdn',
            'login.otp_hash',
            'login.otp_expires_at',
            'login.bdapps_reference_no',
        ]);
    }

    /**
     * Detect application metadata from User-Agent and request
     */
    private function detectApplicationMetaData(string $userAgent, Request $request, AppSettings $settings): array
    {
        $userAgent = strtolower($userAgent);

        // Detect OS
        $os = 'Unknown';
        if (str_contains($userAgent, 'android')) {
            $os = 'Android';
        } elseif (str_contains($userAgent, 'iphone') || str_contains($userAgent, 'ipad') || str_contains($userAgent, 'ipod')) {
            $os = 'iOS';
        } elseif (str_contains($userAgent, 'windows phone')) {
            $os = 'Windows Phone';
        } elseif (str_contains($userAgent, 'windows')) {
            $os = 'Windows';
        } elseif (str_contains($userAgent, 'macintosh') || str_contains($userAgent, 'mac os')) {
            $os = 'macOS';
        } elseif (str_contains($userAgent, 'linux')) {
            $os = 'Linux';
        }

        // Detect device type
        $device = 'Desktop';
        $isMobile = str_contains($userAgent, 'mobile') 
            || str_contains($userAgent, 'android') 
            || str_contains($userAgent, 'iphone') 
            || str_contains($userAgent, 'ipod')
            || str_contains($userAgent, 'windows phone')
            || str_contains($userAgent, 'blackberry');
        
        $isTablet = str_contains($userAgent, 'tablet') 
            || str_contains($userAgent, 'ipad') 
            || (str_contains($userAgent, 'android') && !str_contains($userAgent, 'mobile'));

        if ($isTablet) {
            $device = 'Tablet';
        } elseif ($isMobile) {
            $device = 'Mobile';
        }

        // Detect client type
        $client = 'WEBAPP';
        if ($isMobile && $request->hasHeader('X-Requested-With')) {
            $client = 'MOBILEAPP';
        }

        return [
            'client' => $client,
            'device' => $device,
            'os' => $os,
            'appCode' => url('/app'),
        ];
    }
}
