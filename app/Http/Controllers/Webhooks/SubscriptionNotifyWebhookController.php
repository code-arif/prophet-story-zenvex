<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use App\Models\Subscription;
use App\Services\BdAppsApiClient;
use App\Services\SubscriberSync;
use App\Services\SubscriptionNotifier;
use App\Support\Msisdn;
use Illuminate\Http\Request;

class SubscriptionNotifyWebhookController extends Controller
{
    public function __invoke(
        Request $request,
        BdAppsApiClient $client,
        SubscriberSync $sync,
        SubscriptionNotifier $notifier
    ) {
        $payload = $request->json()->all();

        $client->logIn('subscription.notify', $this->headersToArray($request), $payload);

        // Extract subscription data from BdApps notification
        $subscriberId = (string) ($payload['subscriberId'] ?? '');
        $status = strtoupper(trim((string) ($payload['status'] ?? '')));
        $frequency = (string) ($payload['frequency'] ?? 'daily');

        // Normalize MSISDN from subscriberId (tel:8801... or 8801...)
        $msisdn = Msisdn::normalizeBd($subscriberId);

        if ($msisdn === '' || $status === '') {
            return response()->json([
                'statusCode' => 'S1000',
                'statusDetail' => 'Success',
            ]);
        }

        // Process subscription based on status
        if ($status === 'REGISTERED') {
            $this->handleRegistration($msisdn, $subscriberId, $frequency, $sync, $notifier);
        } elseif ($status === 'UNREGISTERED') {
            $this->handleUnregistration($msisdn, $subscriberId, $sync, $notifier);
        }

        return response()->json([
            'statusCode' => 'S1000',
            'statusDetail' => 'Success',
        ]);
    }

    private function handleRegistration(
        string $msisdn,
        string $subscriberId,
        string $frequency,
        SubscriberSync $sync,
        SubscriptionNotifier $notifier
    ): void {
        // Ensure subscriber exists
        $sync->ensureExists($msisdn);

        // Store/update the BdApps subscriber ID
        Subscriber::query()
            ->where('msisdn', $msisdn)
            ->update(['bdapps_subscriber_id' => $subscriberId]);

        // Remove any canceled subscriptions for this MSISDN
        Subscription::query()
            ->where('msisdn', $msisdn)
            ->where('status', Subscription::STATUS_CANCELED)
            ->delete();

        // Create or update active subscription
        Subscription::query()->updateOrCreate(
            ['msisdn' => $msisdn, 'status' => Subscription::STATUS_ACTIVE],
            [
                'starts_at' => now(),
                'ends_at' => null,
                'channel' => 'bdapps',
                'last_message' => "BdApps notify: REGISTERED ($frequency)",
            ]
        );

        // Send notification SMS
        try {
            $notifier->notifySubscribed($msisdn);
        } catch (\Throwable $e) {
            // Don't block webhook processing
            \Log::channel('bdapps')->error('Failed to send subscription notification', [
                'msisdn' => $msisdn,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function handleUnregistration(
        string $msisdn,
        string $subscriberId,
        SubscriberSync $sync,
        SubscriptionNotifier $notifier
    ): void {
        // Ensure subscriber exists
        $sync->ensureExists($msisdn);

        // Update the BdApps subscriber ID if needed
        Subscriber::query()
            ->where('msisdn', $msisdn)
            ->update(['bdapps_subscriber_id' => $subscriberId]);

        // Remove any active subscriptions for this MSISDN
        Subscription::query()
            ->where('msisdn', $msisdn)
            ->where('status', Subscription::STATUS_ACTIVE)
            ->delete();

        // Create or update canceled subscription
        Subscription::query()->updateOrCreate(
            ['msisdn' => $msisdn, 'status' => Subscription::STATUS_CANCELED],
            [
                'starts_at' => null,
                'ends_at' => now(),
                'channel' => 'bdapps',
                'last_message' => 'BdApps notify: UNREGISTERED',
            ]
        );

        // Send notification SMS
        try {
            $notifier->notifyUnsubscribed($msisdn);
        } catch (\Throwable $e) {
            // Don't block webhook processing
            \Log::channel('bdapps')->error('Failed to send unsubscription notification', [
                'msisdn' => $msisdn,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function headersToArray(Request $request): array
    {
        $out = [];
        foreach ($request->headers->all() as $key => $values) {
            $out[$key] = count($values) === 1 ? $values[0] : $values;
        }
        return $out;
    }
}
