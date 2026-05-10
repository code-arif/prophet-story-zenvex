<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Services\AppSettings;
use App\Services\BdAppsUssdService;
use App\Services\SubscriberSync;
use App\Support\Msisdn;
use Illuminate\Http\Request;

class UssdWebhookController extends Controller
{
    public function __invoke(Request $request, BdAppsUssdService $ussd, AppSettings $settings, SubscriberSync $sync)
    {
        $payload = $request->json()->all();

        $source = (string) ($payload['sourceAddress'] ?? '');
        $message = trim((string) ($payload['message'] ?? ''));
        $sessionId = (string) ($payload['sessionId'] ?? '');

        $msisdn = Msisdn::normalizeBd($source);

        if ($msisdn === '') {
            return response()->json([
                'statusCode' => 'E1312',
                'statusDetail' => 'Request is Invalid.',
            ], 400);
        }

        $upper = strtoupper($message);

        // Operators often send inputs like: "1#", "1*", or multi-step like "MO-INIT*1".
        // Normalize by splitting on * and # and using:
        // - first token for menu/start-keyword detection
        // - last token as the actual user selection
        $tokens = preg_split('/[\*#]+/', $upper) ?: [];
        $tokens = array_values(array_filter(array_map('trim', $tokens), fn ($v) => $v !== ''));
        $firstToken = $tokens[0] ?? $upper;
        $lastToken = $tokens !== [] ? $tokens[count($tokens) - 1] : $upper;

        $menuText = (string) $settings->get('ussd.menu_text', "BD Election Daily\n1. Subscribe\n2. Cancel\n");
        $subscribeCode = strtoupper(trim((string) $settings->get('ussd.subscribe_code', '1')));
        $cancelCode = strtoupper(trim((string) $settings->get('ussd.cancel_code', '2')));
        $subscribeReply = (string) $settings->get('ussd.subscribe_reply', "Subscription active.\n");
        $cancelReply = (string) $settings->get('ussd.cancel_reply', "Subscription canceled.\n");
        $invalidReply = (string) $settings->get('ussd.invalid_reply', "Invalid option.\n");
        $invalidWithMenu = (bool) $settings->get('ussd.invalid_with_menu', true);

        $startKeywords = $settings->get('ussd.start_keywords', ['MENU', 'MO-INIT']);
        if (!is_array($startKeywords)) {
            $startKeywords = ['MENU', 'MO-INIT'];
        }
        $startKeywords = collect($startKeywords)
            ->map(fn ($v) => strtoupper(trim((string) $v)))
            ->filter(fn ($v) => $v !== '')
            ->unique()
            ->values()
            ->all();

        // TAP API pattern:
        // - Reply to MO callback with S1000 immediately
        // - Send the actual USSD response via BdAppsUssdService (HTTP POST to BDApps)

        $responseMessage = null;
        $mtOperation = 'mt-cont';

        if ($firstToken === '' || in_array($firstToken, $startKeywords, true)) {
            $responseMessage = $menuText;
            $mtOperation = 'mt-cont';
        }

        if ($responseMessage === null && $lastToken === $subscribeCode) {
            $sync->ensureExists($msisdn);

            // Keep one current status per MSISDN.
            Subscription::query()
                ->where('msisdn', $msisdn)
                ->where('status', Subscription::STATUS_CANCELED)
                ->delete();

            Subscription::query()->updateOrCreate(
                ['msisdn' => $msisdn, 'status' => Subscription::STATUS_ACTIVE],
                [
                    'starts_at' => now(),
                    'ends_at' => null,
                    'channel' => 'ussd',
                    'last_message' => $message,
                ]
            );

            $responseMessage = $subscribeReply;
            $mtOperation = 'mt-fin';
        }

        if ($responseMessage === null && $lastToken === $cancelCode) {
            $sync->ensureExists($msisdn);

            // Keep one current status per MSISDN.
            Subscription::query()
                ->where('msisdn', $msisdn)
                ->where('status', Subscription::STATUS_ACTIVE)
                ->delete();

            Subscription::query()->updateOrCreate(
                ['msisdn' => $msisdn, 'status' => Subscription::STATUS_CANCELED],
                [
                    'starts_at' => null,
                    'ends_at' => now(),
                    'channel' => 'ussd',
                    'last_message' => $message,
                ]
            );

            $responseMessage = $cancelReply;
            $mtOperation = 'mt-fin';
        }

        if ($responseMessage === null) {
            if ($invalidWithMenu) {
                $responseMessage = rtrim($invalidReply)."\n".ltrim($menuText);
                $mtOperation = 'mt-cont';
            } else {
                $responseMessage = $invalidReply;
                $mtOperation = 'mt-fin';
            }
        }

        if ($sessionId !== '') {
            $ussd->safeSend($msisdn, $sessionId, $mtOperation, $responseMessage);
        }

        return response()->json([
            'statusCode' => 'S1000',
            'statusDetail' => 'Success',
        ]);
    }

    // MSISDN normalization handled by App\Support\Msisdn.
}
