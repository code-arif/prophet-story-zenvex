<?php

namespace App\Http\Controllers;

use App\Models\MediaFile;
use App\Models\Subscriber;
use App\Models\Subscription;
use App\Services\AppSettings;
use App\Services\BdAppsApiClient;
use App\Services\SubscriptionNotifier;
use App\Services\SubscriberSync;
use App\Support\Msisdn;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * ProfileController - Manages user profile and subscription management
 * 
 * This controller handles:
 * - Displaying user profile with subscription status
 * - Updating profile information (name, DOB, avatar)
 * - Managing subscriptions (subscribe/unsubscribe)
 * - Downloading APK updates
 * 
 * Features:
 * - MSISDN-based authentication
 * - Profile picture upload to storage
 * - Subscription status checking via BdApps API
 * - APK download tracking
 */
class ProfileController extends Controller
{
    public function show(Request $request, AppSettings $settings)
    {
        $msisdn = (string) $request->session()->get('msisdn', '');
        $msisdn = Msisdn::normalizeBd($msisdn) ?: $msisdn;
        if ($msisdn === '') {
            return redirect()->route('login.show');
        }

        $request->session()->put('msisdn', $msisdn);

        $subscriber = Subscriber::query()->where('msisdn', $msisdn)->first();
        $subscriptions = Subscription::query()->where('msisdn', $msisdn)->orderByDesc('starts_at')->get();
        $activeApk = MediaFile::activeApk();
        
        // Check if user has an active subscription
        $isActive = Subscription::query()
            ->where('msisdn', $msisdn)
            ->where('status', Subscription::STATUS_ACTIVE)
            ->exists();

        return Inertia::render('Profile/Index', [
            'msisdn' => $msisdn,
            'subscriber' => $subscriber ? array_merge($subscriber->toArray(), ['is_active' => $isActive]) : null,
            'subscriptions' => $subscriptions->map(function ($sub) {
                return [
                    'id' => $sub->id,
                    'status' => $sub->status,
                    'startsAt' => $sub->starts_at ? $sub->starts_at->format('M d, Y') : null,
                    'endsAt' => $sub->ends_at ? $sub->ends_at->format('M d, Y') : null,
                    'channel' => $sub->channel,
                    'lastMessage' => $sub->last_message,
                ];
            }),
            'brandName' => $settings->brandName(),
            'logoUrl' => $settings->logoUrl(),
            'apk' => $activeApk ? [
                'id' => $activeApk->id,
                'name' => $activeApk->name,
                'version' => $activeApk->version,
                'description' => $activeApk->description,
                'size' => $activeApk->formattedSize(),
                'downloadCount' => $activeApk->download_count,
                'updatedAt' => $activeApk->updated_at->format('M d, Y'),
            ] : null,
        ]);
    }

    public function update(Request $request)
    {
        $msisdn = (string) $request->session()->get('msisdn', '');
        $msisdn = Msisdn::normalizeBd($msisdn) ?: $msisdn;
        if ($msisdn === '') {
            return redirect()->route('login.show');
        }

        $request->session()->put('msisdn', $msisdn);

        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:80'],
            'dob' => ['nullable', 'date'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        $subscriber = Subscriber::firstOrCreate(['msisdn' => $msisdn]);
        $subscriber->name = $validated['name'] ?? $subscriber->name;
        $subscriber->dob = $validated['dob'] ?? $subscriber->dob;

        // A name here completes the learner profile — clear any skip marker.
        if (!empty($validated['name'])) {
            $subscriber->profile_skipped_at = null;
        }

        if ($request->hasFile('avatar')) {
            if ($subscriber->avatar_path) {
                Storage::disk('public')->delete($subscriber->avatar_path);
            }

            $file = $request->file('avatar');
            $path = $file->storePubliclyAs(
                'avatars',
                Str::uuid()->toString().'.'.$file->getClientOriginalExtension(),
                'public'
            );
            $subscriber->avatar_path = $path;
        }

        $subscriber->save();

        return redirect()->route('profile')->with('status', 'Profile updated.');
    }

    public function subscribe(Request $request)
    {
        $msisdn = (string) $request->session()->get('msisdn', '');
        $msisdn = Msisdn::normalizeBd($msisdn) ?: $msisdn;
        if ($msisdn === '') {
            return redirect()->route('login.show');
        }

        // Check if already subscribed
        if (Subscription::where('msisdn', $msisdn)->where('status', Subscription::STATUS_ACTIVE)->exists()) {
            return redirect()->route('profile')->with('status', 'You are already subscribed.');
        }

        app(SubscriberSync::class)->ensureExists($msisdn);

        // Call BdApps API to activate subscription
        try {
            $response = app(BdAppsApiClient::class)->setSubscription($msisdn, true);
            $statusCode = (string) ($response['statusCode'] ?? '');
            $statusDetail = trim((string) ($response['statusDetail'] ?? ''));
            $subscriptionStatus = trim((string) ($response['subscriptionStatus'] ?? ''));
            
            \Log::channel('bdapps')->info('Subscribe response', [
                'msisdn' => $msisdn,
                'statusCode' => $statusCode,
                'statusDetail' => $statusDetail,
                'subscriptionStatus' => $subscriptionStatus
            ]);
            
            // Handle response patterns based on documentation
            
            // S1000 - Success with various subscription states
            if ($statusCode === 'S1000') {
                if (in_array($subscriptionStatus, ['REGISTERED', 'INITIAL CHARGING PENDING'])) {
                    return $this->activateSubscription($msisdn, 'Subscribed successfully.');
                }
                
                if ($subscriptionStatus === 'UNREGISTERED') {
                    return redirect()->route('profile')->with('error', 'Subscription failed. Please try again.');
                }
                
                // Default S1000 success
                return $this->activateSubscription($msisdn, 'Subscribed successfully.');
            }
            
            // E1351 - Already registered (may have different subscription states)
            if ($statusCode === 'E1351' && str_contains(strtolower($statusDetail), 'already registered')) {
                if (in_array($subscriptionStatus, ['REGISTERED', 'INITIAL CHARGING PENDING', ''])) {
                    return $this->activateSubscription($msisdn, 'Subscription activated. You are now subscribed.');
                }
            }
            
            // E1338 - Pending user confirmation via SMS
            if ($statusCode === 'E1338' || $subscriptionStatus === 'PENDING CONFIRMATION') {
                \Log::channel('bdapps')->info('Subscription pending confirmation', ['msisdn' => $msisdn]);
                return redirect()->route('profile')->with('info', 
                    'Subscription is pending. Please check your SMS and confirm the subscription request.'
                );
            }
            
            // E1951 - Invalid/unregistered (error for subscribe action)
            if ($statusCode === 'E1951') {
                return redirect()->route('profile')->with('error', 
                    'Unable to subscribe. Please ensure your number is valid and try again.'
                );
            }
            
            // E1325 - Invalid address format
            if ($statusCode === 'E1325') {
                return redirect()->route('profile')->with('error', 
                    'Invalid phone number format. Please contact support.'
                );
            }
            
            // E1343 - Not whitelisted
            if ($statusCode === 'E1343') {
                return redirect()->route('profile')->with('error', 
                    'Your number is not authorized for this service. Please contact support.'
                );
            }
            
            // E1301 - Application not allowed for operator
            if ($statusCode === 'E1301') {
                return redirect()->route('profile')->with('error', 
                    'Service not available for your operator. Please contact support.'
                );
            }
            
            // Unknown error
            \Log::channel('bdapps')->warning('Subscribe unknown response', [
                'msisdn' => $msisdn, 
                'response' => $response
            ]);
            
            return redirect()->route('profile')->with('error', 
                $statusDetail ?: 'Subscription request failed. Please try again or contact support.'
            );
            
        } catch (\Throwable $e) {
            \Log::channel('bdapps')->error('Subscribe API exception', [
                'msisdn' => $msisdn, 
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->route('profile')->with('error', 
                'Network error occurred. Please check your connection and try again.'
            );
        }
    }

    /**
     * Activate subscription in database and send notification
     */
    private function activateSubscription(string $msisdn, string $message): \Illuminate\Http\RedirectResponse
    {
        // Remove any canceled subscriptions
        Subscription::query()
            ->where('msisdn', $msisdn)
            ->where('status', Subscription::STATUS_CANCELED)
            ->delete();
        
        // Create or update active subscription
        Subscription::updateOrCreate(
            ['msisdn' => $msisdn, 'status' => Subscription::STATUS_ACTIVE],
            [
                'starts_at' => now(), 
                'ends_at' => null, 
                'channel' => 'web', 
                'last_message' => 'subscribed'
            ]
        );
        
        // Send notification (non-blocking)
        try {
            app(SubscriptionNotifier::class)->notifySubscribed($msisdn);
        } catch (\Throwable $e) {
            \Log::channel('bdapps')->warning('Notification failed', [
                'msisdn' => $msisdn, 
                'error' => $e->getMessage()
            ]);
        }
        
        return redirect()->route('profile')->with('status', $message);
    }

    public function unsubscribe(Request $request)
    {
        $msisdn = (string) $request->session()->get('msisdn', '');
        $msisdn = Msisdn::normalizeBd($msisdn) ?: $msisdn;
        if ($msisdn === '') {
            return redirect()->route('home');
        }

        // Check if active subscription exists
        if (!Subscription::where('msisdn', $msisdn)->where('status', Subscription::STATUS_ACTIVE)->exists()) {
            return redirect()->route('profile')->with('info', 'You do not have an active subscription.');
        }

        app(SubscriberSync::class)->ensureExists($msisdn);

        // Call BdApps API to unsubscribe
        try {
            $response = app(BdAppsApiClient::class)->setSubscription($msisdn, false);
            $statusCode = (string) ($response['statusCode'] ?? '');
            $statusDetail = trim((string) ($response['statusDetail'] ?? ''));
            $subscriptionStatus = trim((string) ($response['subscriptionStatus'] ?? ''));
            
            \Log::channel('bdapps')->info('Unsubscribe response', [
                'msisdn' => $msisdn,
                'statusCode' => $statusCode,
                'statusDetail' => $statusDetail,
                'subscriptionStatus' => $subscriptionStatus
            ]);
            
            // Handle response patterns
            
            // S1000 with UNREGISTERED - Success
            if ($statusCode === 'S1000' && $subscriptionStatus === 'UNREGISTERED') {
                return $this->cancelSubscription($msisdn, 'Unsubscribed successfully.');
            }
            
            // S1000 with Success status detail
            if ($statusCode === 'S1000' && str_contains(strtolower($statusDetail), 'success')) {
                return $this->cancelSubscription($msisdn, 'Unsubscribed successfully.');
            }
            
            // E1951 - Already unregistered (treat as success)
            if ($statusCode === 'E1951' && str_contains(strtolower($statusDetail), 'unregistered')) {
                return $this->cancelSubscription($msisdn, 'Unsubscribed successfully.');
            }
            
            // E1325 - Invalid address format
            if ($statusCode === 'E1325') {
                \Log::channel('bdapps')->warning('Unsubscribe invalid format', [
                    'msisdn' => $msisdn, 
                    'response' => $response
                ]);
                return $this->showManualUnsubscribeInstructions(
                    'Unable to process unsubscription automatically. Please send SMS:'
                );
            }
            
            // Any other error - show manual instructions
            \Log::channel('bdapps')->warning('Unsubscribe API failed', [
                'msisdn' => $msisdn, 
                'response' => $response
            ]);
            
            return $this->showManualUnsubscribeInstructions(
                'Automatic unsubscription failed. Please send SMS:'
            );
            
        } catch (\Throwable $e) {
            \Log::channel('bdapps')->error('Unsubscribe API exception', [
                'msisdn' => $msisdn, 
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->showManualUnsubscribeInstructions(
                'Network error occurred. Please send SMS to unsubscribe:'
            );
        }
    }

    /**
     * Cancel subscription in database, send notification, and auto-logout
     */
    private function cancelSubscription(string $msisdn, string $message): \Illuminate\Http\RedirectResponse
    {
        // Remove active subscription
        Subscription::query()
            ->where('msisdn', $msisdn)
            ->where('status', Subscription::STATUS_ACTIVE)
            ->delete();
        
        // Create canceled subscription record
        Subscription::updateOrCreate(
            ['msisdn' => $msisdn, 'status' => Subscription::STATUS_CANCELED],
            [
                'starts_at' => null, 
                'ends_at' => now(), 
                'channel' => 'web', 
                'last_message' => 'unsubscribed'
            ]
        );

        // Send notification (non-blocking)
        try {
            app(SubscriptionNotifier::class)->notifyUnsubscribed($msisdn);
        } catch (\Throwable $e) {
            \Log::channel('bdapps')->warning('Unsubscribe notification failed', [
                'msisdn' => $msisdn, 
                'error' => $e->getMessage()
            ]);
        }

        // Auto-logout after unsubscribe
        Auth::guard('subscriber')->logout();
        request()->session()->forget('msisdn');
        request()->session()->forget('is_guest');

        return redirect()->route('login.show')->with('status', $message . ' You have been logged out.');
    }

    /**
     * Show manual unsubscribe instructions
     */
    private function showManualUnsubscribeInstructions(string $message): \Illuminate\Http\RedirectResponse
    {
        $sourceAddress = config('services.bdapps.source_address', '');
        
        return redirect()->route('profile')->with('unsubscribe_manual', [
            'message' => $message,
            'instruction' => "STOP {$sourceAddress} to 21213"
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('subscriber')->logout();
        
        $request->session()->forget('msisdn');
        $request->session()->forget('is_guest');
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login.show')->with('status', 'Logged out successfully.');
    }
}
