<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Services\BdAppsApiClient;
use Illuminate\Http\Request;

class SmsReportWebhookController extends Controller
{
    public function __invoke(Request $request, BdAppsApiClient $client)
    {
        $payload = $request->json()->all();

        $client->logIn('sms.report', $this->headersToArray($request), $payload);

        // For now, accept and store the report. You can later link messageId to sms_messages.
        return response()->json([
            'statusCode' => 'S1000',
            'statusDetail' => 'Success',
        ]);
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
