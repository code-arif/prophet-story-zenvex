<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    // Email services
    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | BdApps Platform Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for BdApps API integration (SMS, USSD, Subscriptions)
    |
    | Base URL: The BdApps API base URL
    | Timeout: Request timeout in seconds
    | SMS/ USSD URLs: Specific endpoints (optional, derived from base URL if empty)
    | App ID/Password: Credentials for BdApps platform
    | OTP Debug: Enable to skip actual OTP sending (for development)
    |
    | Feature Toggles:
    | - use_platform_otp: Use BdApps OTP instead of local OTP
    | - use_platform_subscription: Use BdApps subscription instead of local
    |
    | SMS/USSD Settings: TAP API parameters for messaging
    */
    'bdapps' => [
        'base_url' => env('BDAPPS_BASE_URL', 'https://developer.bdapps.com'),
        'timeout' => env('BDAPPS_TIMEOUT', 15),
        'sms_url' => env('BDAPPS_SMS_URL', ''),
        'ussd_url' => env('BDAPPS_USSD_URL', ''),
        'app_id' => env('BDAPPS_APP_ID', ''),
        'password' => env('BDAPPS_PASSWORD', ''),
        'password_base64' => env('BDAPPS_PASSWORD_BASE64', false),
        'source_address' => env('BDAPPS_SOURCE_ADDRESS', ''),
        'otp_debug' => env('BDAPPS_OTP_DEBUG', false),

        // Optional feature toggles (keep current local OTP/subscription as default)
        'use_platform_otp' => env('BDAPPS_USE_PLATFORM_OTP', false),
        'use_platform_subscription' => env('BDAPPS_USE_PLATFORM_SUBSCRIPTION', false),

        // SMS (TAP API / php-app library)
        'sms_delivery_status_request' => env('BDAPPS_SMS_DELIVERY_STATUS_REQUEST', '1'),
        'sms_charging_amount' => env('BDAPPS_SMS_CHARGING_AMOUNT', ''),
        'sms_encoding' => env('BDAPPS_SMS_ENCODING', '245'),
        'sms_version' => env('BDAPPS_SMS_VERSION', '1.0'),
        'sms_binary_header' => env('BDAPPS_SMS_BINARY_HEADER', ''),

        // USSD (TAP API / php-app library)
        'ussd_encoding' => env('BDAPPS_USSD_ENCODING', '440'),
        'ussd_version' => env('BDAPPS_USSD_VERSION', '1.0'),
        'ussd_charging_amount' => env('BDAPPS_USSD_CHARGING_AMOUNT', ''),
    ],

];
