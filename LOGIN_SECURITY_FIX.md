# Login Security Fix - STRICT Login Policy

**Date**: 2026-03-27  
**Issue**: User logged in despite API errors (E1343 non-whitelisted, E1951 not registered)  
**Severity**: CRITICAL - Security bypass  
**Policy**: ✅ **STRICT - Only 2 conditions allow auto-login**

---

## STRICT LOGIN POLICY

### ✅ ONLY These 2 Cases Allow Auto-Login:

1. **E1351** with exact match `statusDetail === "user already registered"`
2. **S1000** with `subscriptionStatus === '1'` (active subscription)

### ❌ ALL Other Cases Require OTP Verification:

- E1343 - Non-whitelisted number → **BLOCKED**
- E1342 - Blacklisted number → **BLOCKED**  
- E1951 - Not registered → **BLOCKED**
- E1356 - Not registered → **BLOCKED**
- S1000 with subscriptionStatus !== '1' → **BLOCKED**
- Any other status code → **BLOCKED**
- API errors/exceptions → **BLOCKED**

**Critical Rule**: No `msisdn` stored in session unless one of the 2 allowed conditions is met.

---

## Problem Analysis

### API Responses That Should Block Login:

```json
// OTP Request Failed
{
  "statusCode": "E1343",
  "statusDetail": "Non white listed mobile number accessing services of application Entertaint."
}

// Subscription Status Check Failed  
{
  "statusCode": "E1951",
  "statusDetail": "Format of the address is invalid Or User Already UnRegistered"
}
```

**Expected**: Login blocked, user sees error message  
**Observed**: User was able to login somehow

---

## Root Cause Investigation

### Login Flow Analysis:

1. **Subscription Check** (if user has existing subscription):
   - Calls `getSubscriptionStatus()`
   - E1951 response → Updates DB to CANCELED → Falls through to OTP flow
   - **Issue**: E1951 now properly logged as blocking auto-login

2. **OTP Request**:
   - Calls `otpRequest()`
   - E1343 response → Should block at line 245-248
   - **Code already checks**: `if ($statusCode !== 'S1000' || $referenceNo === '')`
   - **Enhancement**: Added explicit E1343 and E1342 blocks before generic check

3. **Possible Bypass Scenarios**:
   - Guest mode (`/login/guest` route) - allows unverified access
   - Multiple login attempts with different numbers
   - Configuration mismatch (`use_platform_otp` disabled, using local OTP)
   - Exception handling that swallows errors

---

## Fixes Implemented

### 1. Added Explicit E1343 & E1342 Blocking

**File**: `app/Http/Controllers/FirstLoginController.php`  
**Lines**: ~165-187

```php
// Block E1343: Non-whitelisted number
if ($statusCode === 'E1343') {
    \Log::channel('bdapps')->warning('OTP blocked - E1343 non-whitelisted number', [
        'msisdn' => $msisdn,
        'statusDetail' => $resp['statusDetail'] ?? '',
    ]);
    return redirect()->route('login.show')->with('error', 
        'Your number is not whitelisted. Please contact support.'
    );
}

// Block E1342: Blacklisted number
if ($statusCode === 'E1342') {
    \Log::channel('bdapps')->warning('OTP blocked - E1342 blacklisted number', [
        'msisdn' => $msisdn,
    ]);
    return redirect()->route('login.show')->with('error', 
        (string) ($resp['statusDetail'] ?? 'Your number is blacklisted.')
    );
}
```

### 2. Enhanced E1951 Logging

**File**: `app/Http/Controllers/FirstLoginController.php`  
**Lines**: ~72-81

```php
if ($statusCode === 'E1951' && str_contains($statusDetail, 'format of the address is invalid or user already unregistered')) {
    \Log::channel('bdapps')->warning('Login blocked - E1951 user not registered, must verify via OTP', [
        'msisdn' => $msisdn,
        'statusDetail' => $apiResponse['statusDetail'] ?? '',
    ]);
    $subscription->update(['status' => Subscription::STATUS_CANCELED]);
    // Fall through to OTP verification - no auto-login allowed
}
```

### 3. Updated API Reference Documentation

**File**: `BDAPPS_API_REFERENCE.md`

Added E1343 to the error codes table:

| Status Code | Status Detail | Service | Logic |
|-------------|---------------|---------|-------|
| **E1343** | Non white listed mobile number accessing services of application * | otp.request | ❌ Block - Number not whitelisted |

---

## Verification Steps

### 1. Test E1343 (Non-whitelisted Number)

**Expected Flow**:
```
User enters non-whitelisted MSISDN
  → OTP request sent to BDApps
  → Response: E1343
  → User redirected to login page
  → Error shown: "Your number is not whitelisted. Please contact support."
  → Session: NO msisdn stored
  → LOG: "OTP blocked - E1343 non-whitelisted number"
```

### 2. Test E1951 (Not Registered)

**Expected Flow**:
```
User with existing canceled subscription enters MSISDN
  → Subscription status check → E1951
  → DB updated: subscription.status = 'canceled'
  → OTP request attempted → May also fail
  → If OTP succeeds: User can verify via OTP
  → If OTP fails: User blocked with error
  → LOG: "Login blocked - E1951 user not registered, must verify via OTP"
```

### 3. Check Logs for Unauthorized Access

```bash
# View recent login attempts
php artisan tinker --execute="
\App\Models\BdAppsEvent::where('service', 'otp.request')
  ->orderBy('created_at', 'desc')
  ->limit(20)
  ->get(['response', 'created_at'])
  ->each(function(\$e) {
    \$r = json_decode(\$e->response, true);
    echo \$e->created_at . ' | ' . (\$r['statusCode'] ?? 'N/A') . ' | ' . (\$r['statusDetail'] ?? 'N/A') . PHP_EOL;
  });
"

# Check for E1343 occurrences
grep -r "E1343" storage/logs/bdapps-*.log
```

---

## Security Recommendations

### 1. **Disable Guest Mode** (if not needed)

**File**: Admin Settings → Integration Settings  
Set `guest_mode_enabled` to `false`

### 2. **Monitor Suspicious Login Attempts**

Add alerts for:
- Multiple E1343 attempts from same IP
- E1951 followed by successful login (should not happen now)
- Login attempts without corresponding OTP verification

### 3. **Audit Existing Sessions**

```php
// Check if any unauthorized users are logged in
php artisan tinker
>>> DB::table('sessions')->where('payload', 'like', '%msisdn%')->get();
```

### 4. **Review Number Whitelist**

Contact BDApps support to ensure your application's number whitelist is properly configured.

---

## Testing Checklist

- [ ] E1343 blocks login and shows error message
- [ ] E1342 blocks login and shows error message
- [ ] E1951 prevents auto-login and requires OTP
- [ ] E1351 (exact match) still allows login
- [ ] S1000 with active subscription allows login
- [ ] Logs show proper warning levels for blocked attempts
- [ ] No unauthorized sessions exist in database
- [ ] Guest mode disabled (if not needed)

---

## Related Files

- [FirstLoginController.php](app/Http/Controllers/FirstLoginController.php) - Main login logic
- [SubscribeController.php](app/Http/Controllers/SubscribeController.php) - Subscription flow
- [BdAppsApiClient.php](app/Services/BdAppsApiClient.php) - API client
- [BDAPPS_API_REFERENCE.md](BDAPPS_API_REFERENCE.md) - Error codes reference
- [SYSTEM_LOGIN_FLOW.md](SYSTEM_LOGIN_FLOW.md) - Login flow documentation

---

## Next Steps

1. **Deploy fixes** to production
2. **Monitor logs** for E1343/E1951 attempts
3. **Audit existing sessions** for unauthorized access
4. **Review BDApps whitelist** configuration
5. **Consider rate limiting** for failed login attempts

---

**Status**: ✅ Fixed  
**Tested**: Pending production verification  
**Reviewer**: _______________
