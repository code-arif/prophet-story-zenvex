<?php

namespace App\Services;

use App\Models\BdAppsEvent;
use App\Models\Subscriber;
use App\Support\Msisdn;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;

/**
 * BdAppsApiClient - HTTP client for BdApps platform API
 * 
 * This service handles all API communications with the BdApps platform,
 * including OTP requests/verification, subscriptions, SMS, USSD, and CAAS (balance/debit).
 * It manages authentication, logging, and error handling for all BdApps API interactions.
 * 
 * Features:
 * - Automatic MSISDN normalization
 * - Request/response logging to database and log channels
 * - Retry logic for certain error conditions
 * - Support for multiple BdApps services (SMS, USSD, Subscription, CAAS)
 */
class BdAppsApiClient
{
    public function otpRequest(string $msisdn, ?string $applicationHash = null, ?array $applicationMetaData = null): array
    {
        $payload = [
            'applicationId' => $this->appId(),
            'password' => $this->password(),
            'subscriberId' => $this->toTel($msisdn),
        ];

        if ($applicationHash) {
            $payload['applicationHash'] = $applicationHash;
        }
        
        // Ensure applicationMetaData has required structure
        if ($applicationMetaData) {
            // BDApps expects specific keys: client, device, os, appCode
            $metadata = [
                'client' => $applicationMetaData['client'] ?? 'MOBILEAPP',
                'device' => $applicationMetaData['device'] ?? 'Google Pixel 4a',
                'os' => $applicationMetaData['os'] ?? 'android 11',
                'appCode' => $applicationMetaData['appCode'] ?? 'https://play.google.com/store/apps/details?id=com.bdelection.app',
            ];
            $payload['applicationMetaData'] = $metadata;
        }

        // Log request
        \Log::channel('bdapps')->info('OTP Request - API Client', [
            'method' => 'POST',
            'url' => $this->resolveUrl('/subscription/otp/request'),
            'body' => array_merge($payload, ['password' => '******']),
            'timestamp' => now()->toDateTimeString(),
        ]);

        $response = $this->post('/subscription/otp/request', $payload, 'otp.request');

        // Log response
        \Log::channel('bdapps')->info('OTP Request - API Response', [
            'method' => 'POST',
            'url' => $this->resolveUrl('/subscription/otp/request'),
            'statusCode' => $response['statusCode'] ?? null,
            'statusDetail' => $response['statusDetail'] ?? null,
            'referenceNo' => $response['referenceNo'] ?? null,
            'response' => $response,
            'timestamp' => now()->toDateTimeString(),
        ]);

        return $response;
    }

    public function otpVerify(string $referenceNo, string $otp): array
    {
        $payload = [
            'applicationId' => $this->appId(),
            'password' => $this->password(),
            'referenceNo' => $referenceNo,
            'otp' => $otp,
        ];
        
        // Log request (mask OTP)
        \Log::channel('bdapps')->info('OTP Verify - API Client', [
            'method' => 'POST',
            'url' => $this->resolveUrl('/subscription/otp/verify'),
            'body' => array_merge($payload, ['password' => '******', 'otp' => '******']),
            'timestamp' => now()->toDateTimeString(),
        ]);
        
        $response = $this->post('/subscription/otp/verify', $payload, 'otp.verify');
        
        // Log response
        \Log::channel('bdapps')->info('OTP Verify - API Response', [
            'method' => 'POST',
            'url' => $this->resolveUrl('/subscription/otp/verify'),
            'statusCode' => $response['statusCode'] ?? null,
            'statusDetail' => $response['statusDetail'] ?? null,
            'response' => $response,
            'timestamp' => now()->toDateTimeString(),
        ]);
        
        // Handle E1601 - Subscription failed but OTP was valid
        // This happens when OTP is correct but auto-subscription fails
        // if (isset($response['statusCode']) && $response['statusCode'] === 'S1000') {
        //     // OTP was valid, just subscription failed
        //     // We'll handle subscription separately
        //     return [
        //         'statusCode' => 'S1000',
        //         'statusDetail' => 'OTP verified successfully',
        //         'originalStatusCode' => 'E1601',
        //         'originalStatusDetail' => $response['statusDetail'] ?? 'Subscription failed',
        //     ];
        // }
        
        return $response;
    }

    /**
     * Subscribe/unsubscribe using action enum:
     * 1 = subscription, 0 = unsubscription.
     */
    public function setSubscription(string $msisdn, bool $subscribe): array
    {
        $normalizedMsisdn = Msisdn::normalizeBd($msisdn) ?: $msisdn;

        // Prefer stored bdapps_subscriber_id when available (canonical id returned by platform)
        $subscriber = Subscriber::query()->where('msisdn', $normalizedMsisdn)->first();
        $subscriberId = null;
        if ($subscriber && !empty($subscriber->bdapps_subscriber_id)) {
            $subscriberId = $subscriber->bdapps_subscriber_id;
        } else {
            $subscriberId = $this->toTel($msisdn);
        }

        $payload = [
            'applicationId' => $this->appId(),
            'password' => $this->password(),
            'subscriberId' => $subscriberId,
            'action' => $subscribe ? '1' : '0',
        ];

        // Log request
        \Log::channel('bdapps')->info('Set Subscription - API Client', [
            'method' => 'POST',
            'url' => $this->resolveUrl('/subscription/send'),
            'body' => array_merge($payload, ['password' => '******']),
            'action' => $subscribe ? 'subscribe' : 'unsubscribe',
            'timestamp' => now()->toDateTimeString(),
        ]);

        $response = $this->post('/subscription/send', $payload, 'subscription.send');

        // If BDApps reports invalid address / unregistered (E1951) and we used a tel: number,
        // attempt a single retry using platform-provided subscriberId when available.
        $statusCode = (string) ($response['statusCode'] ?? '');
        $statusDetail = (string) ($response['statusDetail'] ?? '');
        if ($statusCode === 'E1951') {
            // If we started with tel: and the subscriber record has bdapps id, retry
            if ($subscriber && !empty($subscriber->bdapps_subscriber_id) && $subscriber->bdapps_subscriber_id !== $payload['subscriberId']) {
                \Log::channel('bdapps')->info('Retrying setSubscription with stored bdapps_subscriber_id', [
                    'msisdn' => $msisdn,
                    'original_subscriberId' => $payload['subscriberId'],
                    'retry_subscriberId' => $subscriber->bdapps_subscriber_id,
                ]);

                $payload['subscriberId'] = $subscriber->bdapps_subscriber_id;
                $response = $this->post('/subscription/send', $payload, 'subscription.send');
            } else {
                // Try to read returned destinationResponses address (encoded) and retry once
                if (is_array($response) && isset($response['destinationResponses']) && is_array($response['destinationResponses']) && isset($response['destinationResponses'][0]['address'])) {
                    $addr = (string) $response['destinationResponses'][0]['address'];
                    if ($addr !== '' && $addr !== $payload['subscriberId']) {
                        \Log::channel('bdapps')->info('Retrying setSubscription with destinationResponses address', [
                            'msisdn' => $msisdn,
                            'original_subscriberId' => $payload['subscriberId'],
                            'retry_subscriberId' => $addr,
                        ]);
                        $payload['subscriberId'] = $addr;
                        $response = $this->post('/subscription/send', $payload, 'subscription.send');
                    }
                }
            }
        }

        // Log response
        \Log::channel('bdapps')->info('Set Subscription - API Response', [
            'method' => 'POST',
            'url' => $this->resolveUrl('/subscription/send'),
            'statusCode' => $response['statusCode'] ?? null,
            'statusDetail' => $response['statusDetail'] ?? null,
            'response' => $response,
            'timestamp' => now()->toDateTimeString(),
        ]);

        return $response;
    }

    public function getSubscriptionStatus(string $msisdn): array
    {
        $payload = [
            'applicationId' => $this->appId(),
            'password' => $this->password(),
            'subscriberId' => $this->resolveSubscriberIdForMsisdn($msisdn),
        ];

        // Log request
        \Log::channel('bdapps')->info('Get Subscription Status - API Client', [
            'method' => 'POST',
            'url' => $this->resolveUrl('/subscription/getStatus'),
            'body' => array_merge($payload, ['password' => '******']),
            'timestamp' => now()->toDateTimeString(),
        ]);

        $response = $this->post('/subscription/getStatus', $payload, 'subscription.getStatus');

        // Log response
        \Log::channel('bdapps')->info('Get Subscription Status - API Response', [
            'method' => 'POST',
            'url' => $this->resolveUrl('/subscription/getStatus'),
            'statusCode' => $response['statusCode'] ?? null,
            'statusDetail' => $response['statusDetail'] ?? null,
            'subscriptionStatus' => $response['subscriptionStatus'] ?? null,
            'response' => $response,
            'timestamp' => now()->toDateTimeString(),
        ]);

        return $response;
    }

    public function getBaseSize(): array
    {
        return $this->post('/subscription/query-base', [
            'applicationId' => $this->appId(),
            'password' => $this->password(),
        ], 'subscription.queryBase');
    }

    public function queryBalance(string $msisdn, string $paymentInstrumentName, ?string $accountId = null): array
    {
        $payload = [
            'applicationId' => $this->appId(),
            'password' => $this->password(),
            'subscriberId' => $this->resolveSubscriberIdForMsisdn($msisdn),
            'paymentInstrumentName' => $paymentInstrumentName,
        ];
        if ($accountId) {
            $payload['accountId'] = $accountId;
        }

        return $this->post('/caas/get/balance', $payload, 'caas.queryBalance');
    }

    public function directDebit(
        string $msisdn,
        string $paymentInstrumentName,
        string $amount,
        string $externalTrxId,
        ?string $currency = null,
        ?string $accountId = null
    ): array {
        $payload = [
            'applicationId' => $this->appId(),
            'password' => $this->password(),
            'externalTrxId' => $externalTrxId,
            'subscriberId' => $this->resolveSubscriberIdForMsisdn($msisdn),
            'paymentInstrumentName' => $paymentInstrumentName,
            'amount' => $amount,
        ];

        if ($currency) {
            $payload['currency'] = $currency;
        }
        if ($accountId) {
            $payload['accountId'] = $accountId;
        }

        return $this->post('/caas/direct/debit', $payload, 'caas.directDebit');
    }

    public function sendSms(array $payload): array
    {
        // Allows passing full schema; this helper auto-fills appId/password.
        $payload = array_merge([
            'applicationId' => $this->appId(),
            'password' => $this->password(),
            'version' => (string) config('services.bdapps.sms_version', '1.0'),
        ], $payload);

        $smsUrl = (string) config('services.bdapps.sms_url', '');
        return $this->post($smsUrl !== '' ? $smsUrl : '/sms/send', $payload, 'sms.send');
    }

    public function sendUssd(array $payload): array
    {
        $payload = array_merge([
            'applicationId' => $this->appId(),
            'password' => $this->password(),
            'version' => (string) config('services.bdapps.ussd_version', '1.0'),
        ], $payload);

        $ussdUrl = (string) config('services.bdapps.ussd_url', '');
        return $this->post($ussdUrl !== '' ? $ussdUrl : '/ussd/send', $payload, 'ussd.send');
    }

    /**
     * Low-level POST using cURL (legacy method).
     * 
     * This method sends raw JSON payload via cURL. Used for compatibility
     * with BdApps API which may require specific cURL settings.
     * 
     * @param string $jsonStream JSON-encoded payload
     * @param string $url Full URL to send request to
     * @return string Raw response from server
     */
    public function sendRequest($jsonStream, $url)
    {
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonStream);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $res = curl_exec($ch);
        curl_close($ch);
		return $res;
	}

    /**
     * Send a POST request to BdApps API.
     * 
     * This is the main method for sending API requests. It handles:
     * - JSON encoding of payload
     * - cURL request execution
     * - Response decoding and validation
     * - Error logging
     * 
     * @param string $path API endpoint path (e.g., '/subscription/otp/request')
     * @param array $payload Request payload
     * @param string $service Service identifier for logging (e.g., 'otp.request')
     * @return array Decoded JSON response from API
     * @throws \RuntimeException If request fails or response is invalid
     */
    public function post(string $path, array $payload, string $service): array
    {
        $url = $this->resolveUrl($path);

        $responseBody = null;
        $decoded = null;

        try {
            // sendRequest returns raw string response from curl
            $responseBody = $this->sendRequest(json_encode($payload), $url);
            
            // Try to decode JSON response
            $decoded = json_decode($responseBody, true);

            $this->logOut($service, $url, $payload, is_array($decoded) ? $decoded : null, null, null);

            // Check if response is valid JSON
            if (json_last_error() !== JSON_ERROR_NONE) {
                $details = $responseBody !== '' ? substr($responseBody, 0, 200) : 'No response body.';
                throw new \RuntimeException("BDApps request failed - Invalid JSON response. " . $details);
            }

            // Check for error status codes in response
            if (is_array($decoded) && isset($decoded['statusCode'])) {
                $statusCode = (string) $decoded['statusCode'];
                // S1000 means success in BDApps API
                if ($statusCode !== 'S1000' && strpos($statusCode, 'E') === 0) {
                    $statusDetail = $decoded['statusDetail'] ?? 'Unknown error';
                    // Don't throw for some errors, let caller handle them
                    // Just log and return the response
                }
            }

            return is_array($decoded) ? $decoded : ['raw' => $responseBody];
        } catch (\Throwable $e) {
            $this->logOut($service, $url, $payload, is_array($decoded) ? $decoded : null, null, $e->getMessage());
            throw $e;
        }
    }

    public function safePost(string $path, array $payload, string $service): array
    {
        try {
            return $this->post($path, $payload, $service);
        } catch (\Throwable $e) {
            return ['statusCode' => 'E1601', 'statusDetail' => $e->getMessage()];
        }
    }

    public function logIn(string $service, array $headers, array $payload): void
    {
        if (!Schema::hasTable('bdapps_events')) {
            return;
        }

        BdAppsEvent::query()->create([
            'direction' => 'in',
            'service' => $service,
            'http_method' => 'POST',
            'headers' => $headers,
            'request' => $payload,
        ]);
    }

    private function logOut(string $service, string $url, array $request, ?array $response, ?int $statusCode, ?string $error): void
    {
        if (!Schema::hasTable('bdapps_events')) {
            return;
        }

        BdAppsEvent::query()->create([
            'direction' => 'out',
            'service' => $service,
            'http_method' => 'POST',
            'url' => $url,
            'status_code' => $statusCode,
            'request' => $request,
            'response' => $response,
            'error' => $error,
        ]);
    }

    private function http(): PendingRequest
    {
        return Http::timeout((int) config('services.bdapps.timeout', 15))
            ->withOptions([
                'verify' => false, // CURLOPT_SSL_VERIFYPEER = false
            ])
            ->asJson()
            ->acceptJson()
            ->withHeaders([
                // Some gateways reject the charset parameter; keep it strict.
                'Content-Type' => 'application/json',
            ]);
    }

    private function resolveUrl(string $path): string
    {
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        $base = (string) config('services.bdapps.base_url', '');
        $base = rtrim($base, '/');

        if ($base === '') {
            // Fallback: infer base from sms_url if provided.
            $smsUrl = (string) config('services.bdapps.sms_url', '');
            $parsed = parse_url($smsUrl);
            if (is_array($parsed) && isset($parsed['scheme'], $parsed['host'])) {
                $base = $parsed['scheme'].'://'.$parsed['host'];
            } else {
                $base = 'https://developer.bdapps.com';
            }
        }

        return $base.'/'.ltrim($path, '/');
    }

    private function appId(): string
    {
        // AppServiceProvider loads DB settings into config at boot,
        // so we can directly use config which will contain DB values if set
        $id = (string) config('services.bdapps.app_id');
        
        if ($id === '') {
            throw new \RuntimeException('BDApps app_id is not configured.');
        }
        return $id;
    }

    private function password(): string
    {
        // AppServiceProvider loads DB settings into config at boot,
        // so we can directly use config which will contain DB values if set
        $pwd = (string) config('services.bdapps.password');
        
        if ($pwd === '') {
            throw new \RuntimeException('BDApps password is not configured.');
        }

        // Swagger examples show an MD5-like token. We keep the configured value as-is.
        // If your provider requires base64 encoding, set BDAPPS_PASSWORD_BASE64=true.
        if ((bool) config('services.bdapps.password_base64', false)) {
            return base64_encode($pwd);
        }

        return $pwd;
    }

    private function toTel(string $msisdn): string
    {
        $tel = Msisdn::toTelBd($msisdn);
        if ($tel !== '') {
            return $tel;
        }

        // If already in tel: form but failed parsing, still pass through.
        $msisdn = trim($msisdn);
        return str_starts_with($msisdn, 'tel:') ? $msisdn : ('tel:'.$msisdn);
    }

    /**
     * Resolve the subscriberId value to use for BDApps calls.
     * Preference order:
     * 1. Subscriber.bdapps_subscriber_id (if present)
     * 2. Look in recent bdapps_events for a response containing subscriberId
     * 3. Fallback to tel: formatted msisdn
     */
    private function resolveSubscriberIdForMsisdn(string $msisdn): string
    {
        $normalized = Msisdn::normalizeBd($msisdn) ?: $msisdn;

        // 1) Subscriber record
        try {
            $subscriber = Subscriber::query()->where('msisdn', $normalized)->first();
            if ($subscriber && !empty($subscriber->bdapps_subscriber_id)) {
                return $subscriber->bdapps_subscriber_id;
            }
        } catch (\Throwable $e) {
            // ignore DB errors and continue to event search
        }

        // 2) Search recent bdapps_events for response subscriberId where request matched this msisdn
        try {
            $events = BdAppsEvent::query()->whereNotNull('request')->orderByDesc('id')->limit(200)->get();
            foreach ($events as $ev) {
                $req = $ev->request ?? [];
                $resp = $ev->response ?? [];

                // If request included subscriberId matching our msisdn, and response has subscriberId - return it
                if (is_array($req) && isset($req['subscriberId'])) {
                    $reqId = (string) $req['subscriberId'];
                    if ($reqId !== '' && (str_contains($reqId, $normalized) || str_contains($reqId, Msisdn::toTelBd($normalized)))) {
                        if (is_array($resp) && isset($resp['subscriberId']) && $resp['subscriberId'] !== '') {
                            return (string) $resp['subscriberId'];
                        }
                        // Fallback: destinationResponses address
                        if (is_array($resp) && isset($resp['destinationResponses'][0]['address']) && $resp['destinationResponses'][0]['address'] !== '') {
                            return (string) $resp['destinationResponses'][0]['address'];
                        }
                    }
                }
            }
        } catch (\Throwable $e) {
            // ignore event lookup errors
        }

        // 3) Fallback to tel: msisdn
        return $this->toTel($msisdn);
    }

    /**
     * Extract subscriber ID from various API response formats.
     * Returns null if not found.
     */
    public function extractSubscriberIdFromResponse(array $response): ?string
    {
        // Direct subscriberId field
        if (isset($response['subscriberId']) && $response['subscriberId'] !== '') {
            return (string) $response['subscriberId'];
        }

        // From destinationResponses array (common in SMS/subscription responses)
        if (isset($response['destinationResponses']) && is_array($response['destinationResponses'])) {
            foreach ($response['destinationResponses'] as $dest) {
                if (isset($dest['address']) && $dest['address'] !== '') {
                    return (string) $dest['address'];
                }
            }
        }

        // From nested data fields (some responses nest data)
        if (isset($response['data']['subscriberId']) && $response['data']['subscriberId'] !== '') {
            return (string) $response['data']['subscriberId'];
        }

        return null;
    }
}
