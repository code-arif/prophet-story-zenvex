<?php

namespace App\Support;

class Msisdn
{
    /**
    * Normalize Bangladesh MSISDN to digits-only international format (8801XXXXXXXXX).
    *
    * Accepts: tel:880..., +880..., 880..., 01..., 1...
     */
    public static function normalizeBd(string $value): string
    {
        $value = trim($value);
        if ($value === '') {
            return '';
        }

        if (str_starts_with($value, 'tel:')) {
            $value = substr($value, 4);
        }

        $value = trim($value);
        $value = str_replace([' ', '-', '(', ')'], '', $value);

        // Convert 00-prefixed international numbers.
        if (str_starts_with($value, '00')) {
            $value = substr($value, 2);
        }

        // Keep only digits and '+'.
        $value = preg_replace('/[^\d\+]/', '', $value) ?? '';

        // Drop leading '+', we store digits-only.
        if (str_starts_with($value, '+')) {
            $value = substr($value, 1);
        }

        // Bangladesh local format 01XXXXXXXXX => 8801XXXXXXXXX
        if (preg_match('/^01\d{9}$/', $value) === 1) {
            $value = '880'.substr($value, 1);
        }

        // If someone enters 1XXXXXXXXX => 8801XXXXXXXXX
        if (preg_match('/^1\d{9}$/', $value) === 1) {
            $value = '880'.$value;
        }

        // Final strict check for BD mobile numbers.
        if (preg_match('/^8801\d{9}$/', $value) !== 1) {
            return '';
        }

        return $value;
    }

    /**
     * Convert a normalized BD MSISDN (8801XXXXXXXXX) into tel: format used by BDApps TAP APIs.
     */
    public static function toTelBd(string $msisdn): string
    {
        $normalized = self::normalizeBd($msisdn);
        if ($normalized === '') {
            return '';
        }

        // TAP sample uses tel:880... (no +)
        return 'tel:'.$normalized;
    }
}
