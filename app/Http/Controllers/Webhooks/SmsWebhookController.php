<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use App\Models\Subscription;
use App\Services\BdAppsSmsService;
use App\Services\SubscriptionNotifier;
use App\Services\SubscriberSync;
use App\Support\Msisdn;
use Illuminate\Http\Request;

class SmsWebhookController extends Controller
{
    public function __invoke(Request $request, BdAppsSmsService $sms, SubscriberSync $sync)
    {
        $payload = $request->json()->all();

        $source = (string) ($payload['sourceAddress'] ?? $payload['address'] ?? '');
        $message = trim((string) ($payload['message'] ?? ''));

        $msisdn = Msisdn::normalizeBd($source);

        if ($msisdn === '' || $message === '') {
            return response()->json([
                'statusCode' => 'E1312',
                'statusDetail' => 'Request is Invalid.',
            ], 400);
        }

        $upper = strtoupper($message);
        $status = null;

        if (in_array($upper, ['SUB', 'SUBSCRIBE', 'START'], true)) {
            $status = Subscription::STATUS_ACTIVE;
        } elseif (in_array($upper, ['STOP', 'UNSUB', 'UNSUBSCRIBE', 'CANCEL'], true)) {
            $status = Subscription::STATUS_CANCELED;
        }

        if ($status !== null) {
            $sync->ensureExists($msisdn);

            // Keep one current status per MSISDN.
            if ($status === Subscription::STATUS_ACTIVE) {
                Subscription::query()
                    ->where('msisdn', $msisdn)
                    ->where('status', Subscription::STATUS_CANCELED)
                    ->delete();
            } else {
                Subscription::query()
                    ->where('msisdn', $msisdn)
                    ->where('status', Subscription::STATUS_ACTIVE)
                    ->delete();
            }

            Subscription::query()->updateOrCreate(
                ['msisdn' => $msisdn, 'status' => $status],
                [
                    'starts_at' => $status === Subscription::STATUS_ACTIVE ? now() : null,
                    'ends_at' => $status === Subscription::STATUS_CANCELED ? now() : null,
                    'channel' => 'sms',
                    'last_message' => $message,
                ]
            );

            if ($status === Subscription::STATUS_ACTIVE) {
                try {
                    app(SubscriptionNotifier::class)->notifySubscribed($msisdn);
                } catch (\Throwable $e) {
                    // do not block webhook
                }
            } else {
                try {
                    app(SubscriptionNotifier::class)->notifyUnsubscribed($msisdn);
                } catch (\Throwable $e) {
                    // do not block webhook
                }
            }
        } else {
            $sms->safeSend($msisdn, "Unknown command. Reply SUB to subscribe, STOP to cancel.");
        }

        return response()->json([
            'statusCode' => 'S1000',
            'statusDetail' => 'Process completed successfully.',
        ]);
    }

    // MSISDN normalization handled by App\Support\Msisdn.
}
