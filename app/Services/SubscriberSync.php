<?php

namespace App\Services;

use App\Models\Subscriber;

/**
 * SubscriberSync - Synchronizes subscriber data with BdApps platform
 * 
 * This service ensures that subscriber records exist in the local database
 * and keeps the BdApps subscriber ID in sync. It handles:
 * - Creating subscriber records if they don't exist
 * - Updating BdApps subscriber IDs when available
 * 
 * Used during login/subscription flows to maintain data consistency.
 */
class SubscriberSync
{
    /**
     * Ensure a subscriber record exists, optionally updating BdApps ID.
     * 
     * If the subscriber doesn't exist, it will be created.
     * If a BdApps subscriber ID is provided and not already set, it will be updated.
     * 
     * @param string $msisdn The subscriber's phone number
     * @param string|null $bdappsSubscriberId BdApps platform subscriber ID
     * @return void
     */
    public function ensureExists(string $msisdn, ?string $bdappsSubscriberId = null): Subscriber
    {
        if ($msisdn === '') {
             throw new \InvalidArgumentException('MSISDN cannot be empty');
        }

        $subscriber = Subscriber::query()->firstOrCreate(
            ['msisdn' => $msisdn],
            ['name' => null]
        );

        // Update bdapps_subscriber_id if provided and not already set
        if ($bdappsSubscriberId !== null && $bdappsSubscriberId !== '' && $subscriber->bdapps_subscriber_id === null) {
            $subscriber->bdapps_subscriber_id = $bdappsSubscriberId;
            $subscriber->save();
        }

        return $subscriber;
    }

    /**
     * Update the BdApps subscriber ID for an existing subscriber.
     * 
     * This is used when we receive a subscriber ID from BdApps platform
     * and need to update our local record.
     * 
     * @param string $msisdn The subscriber's phone number
     * @param string $bdappsSubscriberId The BdApps subscriber ID
     * @return void
     */
    public function updateSubscriberId(string $msisdn, string $bdappsSubscriberId): void
    {
        if ($msisdn === '' || $bdappsSubscriberId === '') {
            return;
        }

        Subscriber::query()
            ->where('msisdn', $msisdn)
            ->update(['bdapps_subscriber_id' => $bdappsSubscriberId]);
    }
}
