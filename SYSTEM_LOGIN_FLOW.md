# System Login Flow (Appsbanglaweb)

This document describes the application's login flow, decision points, and code excerpts used to determine whether to allow login, prompt OTP, or direct users to subscription steps. Use this reference for debugging, policy changes, and development.

---

## Overview

- The app uses BDApps platform for OTP and subscription status checks when enabled.
- "Login" means storing the verified MSISDN in session (`msisdn`) and optionally creating/updating a `Subscription` record.
- Primary API responses of interest:
  - `S1000` — Success
  - `E1351` — `user already registered`
  - `E1951` — `Format of the address is invalid Or User Already UnRegistered`
  - `E1356` — `not registered`

---

## High-level sequence

1. User submits MSISDN to `sendOtp()`.
2. If a local subscription exists and is `STATUS_ACTIVE`, the app calls `BdAppsApiClient::getSubscriptionStatus()` to verify platform state.
3. Based on API response the app may:
   - Allow immediate login
   - Update DB to canceled and fall through to OTP
   - Require OTP (platform or local)
4. OTP verification (`verify()`) may use BDApps platform (`otpVerify`) or local hash verification.
5. After OTP success, the app sets `msisdn` in session and attempts a platform `setSubscription()` if `use_platform_subscription` is enabled; errors may show manual SMS instructions.

---

## Decision rules (STRICT POLICY)

**✅ ONLY 2 CONDITIONS ALLOW AUTO-LOGIN:**

1. **E1351** with exact `statusDetail === "user already registered"` → ALLOW LOGIN
2. **S1000** with `subscriptionStatus === '1'` → ALLOW LOGIN (active subscription)

**❌ ALL OTHER CASES REQUIRE OTP VERIFICATION:**

- E1951 (not registered) → Require OTP, no auto-login
- E1343 (non-whitelisted) → Block with error message
- E1342 (blacklisted) → Block with error message
- S1000 with subscriptionStatus !== '1' → Require OTP
- Any API error → Require OTP
- No session `msisdn` stored until OTP verified or one of 2 allowed conditions met

---

## Key code excerpts

### 1) Initial subscription check (from `sendOtp()`) - STRICT

```php
// After calling $client->getSubscriptionStatus($msisdn)
$statusCode = (string) ($apiResponse['statusCode'] ?? '');
$statusDetail = strtolower(trim((string) ($apiResponse['statusDetail'] ?? '')));
$apiStatus = (string) ($apiResponse['subscriptionStatus'] ?? '');

// ✅ ALLOW: E1351 exact match
if ($statusCode === 'E1351' && $statusDetail === 'user already registered') {
    Log::channel('bdapps')->info('✅ Login allowed - E1351 user already registered', ['msisdn' => $msisdn]);
    app(SubscriberSync::class)->ensureExists($msisdn);
    $request->session()->put('msisdn', $msisdn);
    return redirect()->intended(route('home'))->with('status', 'Welcome back! You are already registered.');
}

// ✅ ALLOW: S1000 with active subscription (status=1)
if ($statusCode === 'S1000' && $apiStatus === '1') {
    Log::channel('bdapps')->info('✅ Login allowed - S1000 active subscription', ['msisdn' => $msisdn]);
    app(SubscriberSync::class)->ensureExists($msisdn);
    $request->session()->put('msisdn', $msisdn);
    return redirect()->intended(route('home'))->with('status', 'Welcome back! You are already subscribed.');
}

// ❌ BLOCK: All other cases - require OTP verification
Log::channel('bdapps')->warning('❌ Auto-login blocked - require OTP verification', [
    'msisdn' => $msisdn,
    'statusCode' => $statusCode,
    'statusDetail' => $apiResponse['statusDetail'] ?? '',
]);

// Update DB if needed
if ($statusCode === 'E1951' || ($statusCode === 'S1000' && $apiStatus !== '1')) {
    $subscription->update(['status' => Subscription::STATUS_CANCELED]);
}

// Fall through to OTP verification - DO NOT store msisdn in session yet
```


### 2) OTP request handling (platform OTP path)

```php
$resp = $client->otpRequest($msisdn, $hashedOtp, $applicationMetaData);
$statusCode = (string) ($resp['statusCode'] ?? '');
$statusDetail = strtolower(trim((string) ($resp['statusDetail'] ?? '')));

// If OTP request returns E1351 with exact match -> allow login
if ($statusCode === 'E1351' && $statusDetail === 'user already registered') {
    Log::channel('bdapps')->info('E1351 exact match - user already registered, allowing immediate login', ['msisdn' => $msisdn]);
    $request->session()->put('msisdn', $msisdn);
    app(SubscriberSync::class)->ensureExists($msisdn);
    return redirect()->intended(route('home'))->with('status', 'Welcome! You are registered.');
}

// Normal success -> store reference and redirect to verify
if ($statusCode !== 'S1000' || $referenceNo === '') {
    return redirect()->route('login.show')->with('error', (string) ($resp['statusDetail'] ?? 'OTP request failed.'));
}

$request->session()->put('login.pending_msisdn', $msisdn);
$request->session()->put('login.bdapps_reference_no', $referenceNo);
return redirect()->route('login.verify.show')->with('status', 'OTP sent.');
```


### 3) OTP verify (platform) and subscriber_id sync

```php
$resp = $client->otpVerify($referenceNo, $otp);
$statusCode = (string) ($resp['statusCode'] ?? '');
if ($statusCode !== 'S1000') {
    return redirect()->route('login.verify.show')->with('error', (string) ($resp['statusDetail'] ?? 'Invalid OTP.'));
}

// Extract subscriber_id from OTP response if present
$subscriberId = $client->extractSubscriberIdFromResponse($resp);
if ($subscriberId) {
    app(SubscriberSync::class)->ensureExists($pending, $subscriberId);
}

$request->session()->forget('login.bdapps_reference_no');
```


### 4) Post-OTP login: setSubscription() on login (if configured)

After OTP/local verification and setting `msisdn` in session, if `services.bdapps.use_platform_subscription` is true, the controller attempts to call `setSubscription($msisdn, true)` to register the user on-platform. If that call fails with `E1951` the user is shown manual SMS instructions; non-S1000 responses are logged but do not block local login (depending on route).

Excerpt:

```php
$subResp = app(BdAppsApiClient::class)->setSubscription($pending, true);
$statusCode = (string) ($subResp['statusCode'] ?? '');
$statusDetail = (string) ($subResp['statusDetail'] ?? '');

if ($statusCode === 'E1951') {
    // block or provide instruction
    return redirect()->route('login.show')->with('error', "Subscription failed: {$statusDetail}. If you were previously subscribed, please send SMS: STOP {$sourceAddress} to 21213, then try again.");
}

if ($statusCode !== 'S1000') {
    Log::channel('bdapps')->warning('Platform subscription API returned non-success', [...]);
}

$subId = app(BdAppsApiClient::class)->extractSubscriberIdFromResponse($subResp);
if ($subId) {
    app(SubscriberSync::class)->updateSubscriberId($pending, $subId);
}
```

---

## Practical notes & recommendations

- Use **exact matching** for `E1351` with `statusDetail === "user already registered"` to permit login. This avoids false positives.
- Continue to log and monitor `E1951` occurrences; they often require manual deregistration (show SMS instructions).
- Prefer non-blocking attempts to sync `subscriber_id` — allow login and collect `subscriber_id` later when possible.
- Keep `BDAPPS_API_REFERENCE.md` updated when new `statusDetail` strings appear in logs.

---

## Related files

- Login controller: [app/Http/Controllers/FirstLoginController.php](app/Http/Controllers/FirstLoginController.php)
- Subscription controller: [app/Http/Controllers/SubscribeController.php](app/Http/Controllers/SubscribeController.php)
- API reference: [BDAPPS_API_REFERENCE.md](BDAPPS_API_REFERENCE.md)

---

_Last updated: 2026-03-27_
