<?php

namespace App\Support;

use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * CurrentSubscriber - Resolves the phone-based reader identity.
 *
 * The subscriber-facing app authenticates via an `msisdn` session value set
 * by the OTP login flow (with `Auth::guard('subscriber')` as the
 * remember-me fallback). Controllers that report per-reader state
 * (bookmarks, progress) use this to find the Subscriber row, or null when
 * the visitor is anonymous (guest browsing).
 */
class CurrentSubscriber
{
    public static function get(Request $request): ?Subscriber
    {
        $msisdn = self::msisdn($request);
        if ($msisdn === null) {
            return null;
        }

        return Subscriber::query()->where('msisdn', $msisdn)->first();
    }

    public static function id(Request $request): ?int
    {
        $subscriber = self::get($request);
        return $subscriber?->id;
    }

    private static function msisdn(Request $request): ?string
    {
        $msisdn = (string) $request->session()->get('msisdn', '');
        if ($msisdn === '' && Auth::guard('subscriber')->check()) {
            $msisdn = (string) Auth::guard('subscriber')->user()->msisdn;
        }

        return $msisdn === '' ? null : $msisdn;
    }
}