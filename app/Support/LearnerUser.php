<?php

namespace App\Support;

use App\Models\Subscriber;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

/**
 * Resolves the authenticated Subscriber to a User record for easy-rise tables.
 * Easy-rise tables use user_id (FK → users), but auth uses the subscriber guard.
 */
class LearnerUser
{
    /**
     * Get the User record for the authenticated subscriber.
     * Creates one if it doesn't exist.
     */
    public static function resolve(): ?User
    {
        $subscriber = Auth::guard('subscriber')->user();
        if (!$subscriber) {
            return null;
        }

        // Find or create a user linked to this subscriber's msisdn
        $email = $subscriber->msisdn . '@easyrise.dev';

        return User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $subscriber->name ?? $subscriber->msisdn,
                'password' => bcrypt('password'),
            ]
        );
    }
}
