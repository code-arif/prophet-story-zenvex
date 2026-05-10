<?php

namespace App\Services;

use App\Support\Msisdn;
use Illuminate\Support\Facades\Log;

/**
 * BdAppsUssdService - Handles USSD operations via BdApps platform
 * 
 * This service manages USSD (Unstructured Supplementary Service Data) interactions
 * through the BdApps TAP API. USSD allows real-time interactive sessions
 * with mobile subscribers (like mobile banking menus).
 * 
 * Features:
 * - USSD MT (Mobile Terminated) message sending
 * - Session-based USSD operations
 * - Support for different USSD operations (mt-cont, mt-fin, etc.)
 * - Configurable encoding and charging
 */
class BdAppsUssdService
{
    /**
     * Create a new USSD service instance.
     * 
     * @param BdAppsApiClient $client The BdApps API client for making requests
     */
    public function __construct(private readonly BdAppsApiClient $client)
    {
    }

    /**
     * Best-effort USSD send that doesn't throw exceptions.
     * 
     * Sends a USSD message without throwing exceptions on failure.
     * Logs warnings if sending fails but continues execution.
     * 
     * @param string $msisdn Recipient phone number
     * @param string $sessionId USSD session identifier
     * @param string $ussdOperation USSD operation type (mt-cont, mt-fin, etc.)
     * @param string $message USSD message content
     * @return void
     */
    public function safeSend(string $msisdn, string $sessionId, string $ussdOperation, string $message): void
    {
        try {
            $this->send($msisdn, $sessionId, $ussdOperation, $message);
        } catch (\Throwable $e) {
            Log::warning('BDApps USSD send failed', [
                'msisdn' => $msisdn,
                'sessionId' => $sessionId,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send USSD MT (Mobile Terminated) message via BdApps TAP API.
     * 
     * This method sends a USSD message to a subscriber as part of a USSD session.
     * It supports different USSD operations and can include charging information.
     * 
     * USSD Operations:
     * - mt-cont: Continue USSD session (user can reply)
     * - mt-fin: Final message (ends USSD session)
     * 
     * @param string $msisdn Recipient phone number
     * @param string $sessionId USSD session identifier
     * @param string $ussdOperation USSD operation type
     * @param string $message USSD message content
     * @return array API response from BdApps
     * @throws \RuntimeException If sending fails or MSISDN is invalid
     */
    public function send(string $msisdn, string $sessionId, string $ussdOperation, string $message): array
    {
        $destination = Msisdn::toTelBd($msisdn);
        if ($destination === '') {
            throw new \RuntimeException('Invalid destination MSISDN for USSD.');
        }

        $payload = [
            'message' => $message,
            'destinationAddress' => $destination,
            'sessionId' => $sessionId,
            'ussdOperation' => $ussdOperation,
            'encoding' => (string) config('services.bdapps.ussd_encoding', '440'),
        ];

        $chargingAmount = (string) config('services.bdapps.ussd_charging_amount', '');
        if ($chargingAmount !== '') {
            $payload['chargingAmount'] = $chargingAmount;
        }

        return $this->client->sendUssd($payload);
    }
}
