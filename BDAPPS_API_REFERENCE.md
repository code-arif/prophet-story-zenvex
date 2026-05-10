# BdApps API Response Codes Reference

This document provides a comprehensive list of all API response codes and status details observed in the system for decision-making purposes.

## Summary Statistics
- **Total API calls analyzed**: 100 recent events
- **Unique response combinations**: 16
- **Services monitored**: otp.request, otp.verify, subscription.send, subscription.getStatus, sms.send

---

## Complete API Response Reference

### Success Responses

| Status Code | Status Detail | Service | Logic |
|-------------|---------------|---------|-------|
| **S1000** | Request was successfully processed. | subscription.getStatus, otp.request | ✅ Allow - Standard success |
| **S1000** | Success | otp.verify, subscription.send | ✅ Allow - Standard success |
| **S1000** | Successfully validated OTP for tel:* | otp.verify | ✅ Allow - OTP verified |
| **S1000** | Successfully send OTP challenge to tel:* | otp.request | ✅ Allow - OTP sent |

### Registration Status Responses

| Status Code | Status Detail | Service | Logic |
|-------------|---------------|---------|-------|
| **E1351** | user already registered | subscription.send, otp.request | ✅ **ALLOW LOGIN & ACTIVATE** - User is already registered on platform |
| **E1356** | not registered | subscription.send | ❌ Deny - User needs to register first |
| **E1338** | User confirmation required for subscription. | subscription.send | ⚠️ Pending - Wait for user confirmation |

### Authentication & Validation Errors

| Status Code | Status Detail | Service | Logic |
|-------------|---------------|---------|-------|
| **E1850** | Invalid OTP | otp.verify | ❌ Deny - Wrong OTP code entered |

### Authorization & Access Errors

| Status Code | Status Detail | Service | Logic |
|-------------|---------------|---------|-------|
| **E1303** | IP address, which the request originates from, is not listed withing the allowed-host-address list. | otp.request | ❌ Block - Server IP not whitelisted |
| **E1301** | Requested ApplicationID is not allowed within the System for operator unknown. | otp.request | ❌ Block - Invalid app ID or operator |
| **E1342** | Sorry, Your phone number is blacklisted to use this application eleb2. | otp.request | ❌ Block - User blacklisted |
| **E1343** | Non white listed mobile number accessing services of application * | otp.request | ❌ Block - Number not whitelisted |

### Format & Validation Errors

| Status Code | Status Detail | Service | Logic |
|-------------|---------------|---------|-------|
| **E1325** | Format of the address is invalid. | subscription.send | ❌ Deny - Invalid MSISDN format |
| **E1312** | Invalid request. | sms.send | ❌ Deny - Malformed request |

### Unknown/Missing Responses

| Status Code | Status Detail | Service | Logic |
|-------------|---------------|---------|-------|
| **N/A** | N/A | otp.request, subscription.send | ⚠️ Error - Network/API failure |

---

## Decision Making Guidelines

### Login Flow
```
1. Check OTP verification → S1000 "Success" → Proceed to step 2
2. Check subscription status:
   - E1351 "user already registered" → ✅ ALLOW LOGIN (exact match required)
   - S1000 "Success" → ✅ ALLOW LOGIN (active subscription)
   - E1356 "not registered" → ❌ Redirect to registration
   - E1338 "User confirmation required" → ⚠️ Show pending message
   - Any other error → ❌ Show error message
```

### Subscribe Flow
```
1. Check if already registered:
   - E1351 "user already registered" → Proceed with OTP fallback
   - E1356 "not registered" → Show manual registration SMS instructions
2. On successful subscription:
   - S1000 "Success" → ✅ Create database subscription
3. On failure:
   - E1303 → Show IP whitelist error
   - E1325 → Show invalid phone format error
   - E1338 → Show pending confirmation message
```

### Unsubscribe Flow
```
1. Check unsubscribe status:
   - S1000 "Success" → ✅ Cancel database subscription
   - E1356 "not registered" → ✅ Treat as success (already unsubscribed)
2. On failure:
   - Show manual SMS unsubscribe instructions
```

---

## Frequency Analysis (Last 100 Events)

| Count | Status Code | Status Detail | Primary Service |
|-------|-------------|---------------|-----------------|
| 20 | S1000 | Success | otp.verify |
| 19 | S1000 | Request was successfully processed. | subscription.getStatus |
| 18 | E1312 | Invalid request. | sms.send |
| 12 | **E1351** | **user already registered** | **subscription.send** |
| 6 | E1338 | User confirmation required for subscription. | subscription.send |
| 5 | E1301 | Requested ApplicationID is not allowed within the System for operator unknown. | otp.request |
| 4 | E1850 | Invalid OTP | otp.verify |
| 4 | N/A | N/A | otp.request |
| 2 | E1356 | not registered | subscription.send |
| 2 | E1325 | Format of the address is invalid. | subscription.send |
| 2 | E1342 | Sorry, Your phone number is blacklisted to use this application eleb2. | otp.request |
| 2 | S1000 | Successfully validated OTP for tel:8801883388580 | otp.verify |
| 1 | E1343 | Non white listed mobile number accessing services of application Entertaint. | otp.request |
| 1 | E1303 | IP address, which the request originates from, is not listed withing the allowed-host-address list. | otp.request |
| 1 | S1000 | Successfully validated OTP for tel:8801519607646 | otp.verify |
| 1 | S1000 | Successfully send OTP challenge to tel:8801519607646 | otp.request |
| 1 | S1000 | Successfully send OTP challenge to tel:8801883388580 | otp.request |

---

## Critical Implementation Notes

### Exact String Matching Required
When checking for **"user already registered"** (E1351), use **EXACT MATCH** only:
```php
if ($statusCode === 'E1351' && $statusDetail === 'user already registered') {
    // Allow login - user is registered on platform
}
```

**Do NOT use**:
- `str_contains()` - Too permissive
- Case-insensitive matching - Status details are case-sensitive
- Partial matching - Must be exact

### Multiple S1000 Variants
The S1000 success code has multiple status detail variations:
- Generic: "Success"
- Generic: "Request was successfully processed."
- Specific: "Successfully validated OTP for tel:*"
- Specific: "Successfully send OTP challenge to tel:*"

All S1000 responses should be treated as success regardless of detail text.

---

**Last Updated**: 2026-03-27  
**Data Source**: bdapps_events table (100 most recent records)
