# BdApps API Unique Response Types

**Generated:** 2026-04-24 00:09:16
**Total Events Analyzed:** 200

This document shows unique response patterns from BdApps API.

---

## Service: otp.request

**Total Requests:** 65

**Unique Response Patterns:** 5

### Pattern: E1351

**Occurrences:** 26  
**Status Code:** `E1351`  
**Status Detail:** `user already registered`  
**First Seen:** 2026-04-01 10:36:14  
**Last Seen:** 2026-04-01 10:36:14  

#### Sample Request

```json
{
    "applicationId": "APP_135775",
    "password": "2e0b096d836325215fc9f5e78a708a23",
    "subscriberId": "tel:8801847052193",
    "applicationHash": "abcdefg",
    "applicationMetaData": {
        "client": "MOBILEAPP",
        "device": "Mobile",
        "os": "Android",
        "appCode": "https://recipes.appsbangla.com/app"
    }
}
```

#### Full Response Example

```json
{
    "statusDetail": "user already registered",
    "version": "1.0",
    "statusCode": "E1351"
}
```

---

### Pattern: S1000

**Occurrences:** 17  
**Status Code:** `S1000`  
**Status Detail:** `Request was successfully processed.`  
**First Seen:** 2026-04-01 10:35:21  
**Last Seen:** 2026-04-01 10:35:21  

#### Sample Request

```json
{
    "applicationId": "APP_135775",
    "password": "2e0b096d836325215fc9f5e78a708a23",
    "subscriberId": "tel:8801847052193",
    "applicationHash": "abcdefg",
    "applicationMetaData": {
        "client": "MOBILEAPP",
        "device": "Mobile",
        "os": "Android",
        "appCode": "https://recipes.appsbangla.com/app"
    }
}
```

#### Full Response Example

```json
{
    "referenceNo": "8801847052193177503972073333798",
    "statusDetail": "Request was successfully processed.",
    "version": "1.0",
    "statusCode": "S1000"
}
```

---

### Pattern: E1343

**Occurrences:** 15  
**Status Code:** `E1343`  
**Status Detail:** `Non white listed mobile number accessing services of application Recipes.`  
**First Seen:** 2026-03-31 08:47:02  
**Last Seen:** 2026-03-31 08:47:02  

#### Sample Request

```json
{
    "applicationId": "APP_135775",
    "password": "2e0b096d836325215fc9f5e78a708a23",
    "subscriberId": "tel:8801883388580",
    "applicationHash": "abcdefg",
    "applicationMetaData": {
        "client": "WEBAPP",
        "device": "Desktop",
        "os": "Windows",
        "appCode": "https://recipes.appsbangla.com/app"
    }
}
```

#### Full Response Example

```json
{
    "statusDetail": "Non white listed mobile number accessing services of application Recipes.",
    "version": "1.0",
    "statusCode": "E1343"
}
```

---

### Pattern: E1301

**Occurrences:** 6  
**Status Code:** `E1301`  
**Status Detail:** `Requested ApplicationID is not allowed within the System for operator unknown.`  
**First Seen:** 2026-03-27 20:41:28  
**Last Seen:** 2026-03-27 20:41:28  

#### Sample Request

```json
{
    "applicationId": "APP_135775",
    "password": "2e0b096d836325215fc9f5e78a708a23",
    "subscriberId": "tel:ZDY4NGI4YjYzZmFlOTkwYTdhM2RjY2IzOGJjZTNhMjRmOGZiMTY3ZWM1MDczNTdkZTg0YTExN2EyZjBiNjc1Mjpyb2Jp",
    "applicationHash": "abcdefg",
    "applicationMetaData": {
        "client": "WEBAPP",
        "device": "Desktop",
        "os": "Windows",
        "appCode": "http://recipes.appsbangla.com/app"
    }
}
```

#### Full Response Example

```json
{
    "statusDetail": "Requested ApplicationID is not allowed within the System for operator unknown.",
    "version": "1.0",
    "statusCode": "E1301"
}
```

---

### Pattern: E1303

**Occurrences:** 1  
**Status Code:** `E1303`  
**Status Detail:** `IP address, which the request originates from, is not listed withing the allowed-host-address list.`  
**First Seen:** 2026-04-15 15:47:41  
**Last Seen:** 2026-04-15 15:47:41  

#### Sample Request

```json
{
    "applicationId": "APP_135775",
    "password": "2e0b096d836325215fc9f5e78a708a23",
    "subscriberId": "tel:8801519607646",
    "applicationHash": "abcdefg",
    "applicationMetaData": {
        "client": "WEBAPP",
        "device": "Desktop",
        "os": "Windows",
        "appCode": "http://192.168.0.105:8000/app"
    }
}
```

#### Full Response Example

```json
{
    "statusDetail": "IP address, which the request originates from, is not listed withing the allowed-host-address list.",
    "version": "1.0",
    "statusCode": "E1303"
}
```

---

## Service: subscription.getStatus

**Total Requests:** 62

**Unique Response Patterns:** 6

### Pattern: E1951

**Occurrences:** 39  
**Status Code:** `E1951`  
**Status Detail:** `Format of the address is invalid Or User Already UnRegistered`  
**First Seen:** 2026-03-31 08:27:18  
**Last Seen:** 2026-03-31 08:27:18  

#### Sample Request

```json
{
    "applicationId": "APP_135775",
    "password": "2e0b096d836325215fc9f5e78a708a23",
    "subscriberId": "tel:NGEzNzAwMTdlODc3YTM2YzBhM2UyNjRmZDA5NjJjNGZjYzkzNGFhOGM1ZTY5OGEyM2I0ODU4MWE3NTNjMTM3ZTpyb2Jp"
}
```

#### Full Response Example

```json
{
    "statusDetail": "Format of the address is invalid Or User Already UnRegistered",
    "version": "1.0",
    "statusCode": "E1951"
}
```

---

### Pattern: S1000

**Occurrences:** 10  
**Status Code:** `S1000`  
**Status Detail:** `Request was successfully processed.`  
**Subscription Status:** `REGISTERED`  
**First Seen:** 2026-03-29 13:42:20  
**Last Seen:** 2026-03-29 13:42:20  

#### Sample Request

```json
{
    "applicationId": "APP_135775",
    "password": "2e0b096d836325215fc9f5e78a708a23",
    "subscriberId": "tel:OTIwNWZhY2NiZjU5MDQzNTMxODU3ODI1N2Y4MDkwMWM2Y2NhM2EyYjczNmFhODBjMjNjMzYwNTY0OTcxOWM0Zjpyb2Jp"
}
```

#### Full Response Example

```json
{
    "subscriptionStatus": "REGISTERED",
    "statusDetail": "Request was successfully processed.",
    "version": "1.0",
    "statusCode": "S1000"
}
```

---

### Pattern: S1000

**Occurrences:** 7  
**Status Code:** `S1000`  
**Status Detail:** `Request was successfully processed.`  
**Subscription Status:** `INITIAL CHARGING PENDING`  
**First Seen:** 2026-04-01 10:36:14  
**Last Seen:** 2026-04-01 10:36:14  

#### Sample Request

```json
{
    "applicationId": "APP_135775",
    "password": "2e0b096d836325215fc9f5e78a708a23",
    "subscriberId": "tel:8801847052193"
}
```

#### Full Response Example

```json
{
    "subscriptionStatus": "INITIAL CHARGING PENDING",
    "statusDetail": "Request was successfully processed.",
    "version": "1.0",
    "statusCode": "S1000"
}
```

---

### Pattern: E1325

**Occurrences:** 4  
**Status Code:** `E1325`  
**Status Detail:** `Format of the address is invalid.`  
**First Seen:** 2026-04-01 10:35:20  
**Last Seen:** 2026-04-01 10:35:20  

#### Sample Request

```json
{
    "applicationId": "APP_135775",
    "password": "2e0b096d836325215fc9f5e78a708a23",
    "subscriberId": "tel:NGEzNzAwMTdlODc3YTM2YzBhM2UyNjRmZDA5NjJjNGZjYzkzNGFhOGM1ZTY5OGEyM2I0ODU4MWE3NTNjMTM3ZTpyb2Jp"
}
```

#### Full Response Example

```json
{
    "statusDetail": "Format of the address is invalid.",
    "version": "1.0",
    "statusCode": "E1325"
}
```

---

### Pattern: E1303

**Occurrences:** 1  
**Status Code:** `E1303`  
**Status Detail:** `IP address, which the request originates from, is not listed withing the allowed-host-address list.`  
**First Seen:** 2026-04-15 15:47:41  
**Last Seen:** 2026-04-15 15:47:41  

#### Sample Request

```json
{
    "applicationId": "APP_135775",
    "password": "2e0b096d836325215fc9f5e78a708a23",
    "subscriberId": "tel:8801519607646"
}
```

#### Full Response Example

```json
{
    "statusDetail": "IP address, which the request originates from, is not listed withing the allowed-host-address list.",
    "version": "1.0",
    "statusCode": "E1303"
}
```

---

### Pattern: S1000

**Occurrences:** 1  
**Status Code:** `S1000`  
**Status Detail:** `Request was successfully processed.`  
**Subscription Status:** `UNREGISTERED`  
**First Seen:** 2026-03-31 16:29:25  
**Last Seen:** 2026-03-31 16:29:25  

#### Sample Request

```json
{
    "applicationId": "APP_135775",
    "password": "2e0b096d836325215fc9f5e78a708a23",
    "subscriberId": "tel:8801622884979"
}
```

#### Full Response Example

```json
{
    "subscriptionStatus": "UNREGISTERED",
    "statusDetail": "Request was successfully processed.",
    "version": "1.0",
    "statusCode": "S1000"
}
```

---

## Service: subscription.send

**Total Requests:** 58

**Unique Response Patterns:** 5

### Pattern: E1951

**Occurrences:** 32  
**Status Code:** `E1951`  
**Status Detail:** `Format of the address is invalid Or User Already UnRegistered`  
**First Seen:** 2026-03-31 08:27:18  
**Last Seen:** 2026-03-31 08:27:18  

#### Sample Request

```json
{
    "applicationId": "APP_135775",
    "password": "2e0b096d836325215fc9f5e78a708a23",
    "subscriberId": "tel:NGEzNzAwMTdlODc3YTM2YzBhM2UyNjRmZDA5NjJjNGZjYzkzNGFhOGM1ZTY5OGEyM2I0ODU4MWE3NTNjMTM3ZTpyb2Jp",
    "action": "1"
}
```

#### Full Response Example

```json
{
    "statusDetail": "Format of the address is invalid Or User Already UnRegistered",
    "version": "1.0",
    "statusCode": "E1951"
}
```

---

### Pattern: E1351

**Occurrences:** 12  
**Status Code:** `E1351`  
**Status Detail:** `user already registered`  
**Subscription Status:** `INITIAL CHARGING PENDING`  
**First Seen:** 2026-04-01 10:37:29  
**Last Seen:** 2026-04-01 10:37:29  

#### Sample Request

```json
{
    "applicationId": "APP_135775",
    "password": "2e0b096d836325215fc9f5e78a708a23",
    "subscriberId": "tel:8801847052193",
    "action": "1"
}
```

#### Full Response Example

```json
{
    "subscriptionStatus": "INITIAL CHARGING PENDING",
    "statusDetail": "user already registered",
    "version": "1.0",
    "statusCode": "E1351"
}
```

---

### Pattern: S1000

**Occurrences:** 9  
**Status Code:** `S1000`  
**Status Detail:** `Success`  
**Subscription Status:** `UNREGISTERED`  
**First Seen:** 2026-04-01 10:37:47  
**Last Seen:** 2026-04-01 10:37:47  

#### Sample Request

```json
{
    "applicationId": "APP_135775",
    "password": "2e0b096d836325215fc9f5e78a708a23",
    "subscriberId": "tel:8801847052193",
    "action": "0"
}
```

#### Full Response Example

```json
{
    "subscriptionStatus": "UNREGISTERED",
    "statusDetail": "Success",
    "version": "1.0",
    "statusCode": "S1000"
}
```

---

### Pattern: E1338

**Occurrences:** 3  
**Status Code:** `E1338`  
**Status Detail:** `User confirmation required for subscription.`  
**Subscription Status:** `PENDING CONFIRMATION`  
**First Seen:** 2026-04-01 10:38:07  
**Last Seen:** 2026-04-01 10:38:07  

#### Sample Request

```json
{
    "applicationId": "APP_135775",
    "password": "2e0b096d836325215fc9f5e78a708a23",
    "subscriberId": "tel:8801847052193",
    "action": "1"
}
```

#### Full Response Example

```json
{
    "subscriptionStatus": "PENDING CONFIRMATION",
    "statusDetail": "User confirmation required for subscription.",
    "version": "1.0",
    "statusCode": "E1338"
}
```

---

### Pattern: E1351

**Occurrences:** 2  
**Status Code:** `E1351`  
**Status Detail:** `user already registered`  
**Subscription Status:** `REGISTERED`  
**First Seen:** 2026-03-29 13:42:57  
**Last Seen:** 2026-03-29 13:42:57  

#### Sample Request

```json
{
    "applicationId": "APP_135775",
    "password": "2e0b096d836325215fc9f5e78a708a23",
    "subscriberId": "tel:OTIwNWZhY2NiZjU5MDQzNTMxODU3ODI1N2Y4MDkwMWM2Y2NhM2EyYjczNmFhODBjMjNjMzYwNTY0OTcxOWM0Zjpyb2Jp",
    "action": "1"
}
```

#### Full Response Example

```json
{
    "subscriptionStatus": "REGISTERED",
    "statusDetail": "user already registered",
    "version": "1.0",
    "statusCode": "E1351"
}
```

---

## Service: otp.verify

**Total Requests:** 15

**Unique Response Patterns:** 2

### Pattern: S1000

**Occurrences:** 14  
**Status Code:** `S1000`  
**Status Detail:** `Success`  
**Subscription Status:** `INITIAL CHARGING PENDING`  
**First Seen:** 2026-04-01 10:35:31  
**Last Seen:** 2026-04-01 10:35:31  

#### Sample Request

```json
{
    "applicationId": "APP_135775",
    "password": "2e0b096d836325215fc9f5e78a708a23",
    "referenceNo": "8801847052193177503972073333798",
    "otp": "416691"
}
```

#### Full Response Example

```json
{
    "subscriptionStatus": "INITIAL CHARGING PENDING",
    "subscriberId": "tel:8801847052193",
    "statusDetail": "Success",
    "version": "1.0",
    "statusCode": "S1000"
}
```

---

### Pattern: E1850

**Occurrences:** 1  
**Status Code:** `E1850`  
**Status Detail:** `Invalid OTP`  
**First Seen:** 2026-03-29 13:44:25  
**Last Seen:** 2026-03-29 13:44:25  

#### Sample Request

```json
{
    "applicationId": "APP_135775",
    "password": "2e0b096d836325215fc9f5e78a708a23",
    "referenceNo": "88018211715541774791852060429652",
    "otp": "327392"
}
```

#### Full Response Example

```json
{
    "statusDetail": "Invalid OTP",
    "version": "1.0",
    "statusCode": "E1850"
}
```

---

