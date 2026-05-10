<?php

namespace App\Services;

use App\Models\SmsMessage;
use App\Support\Msisdn;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

/**
 * BdAppsSmsService - Handles SMS sending via BdApps platform
 * 
 * This service provides methods to send SMS messages through the BdApps API.
 * It supports both safe sending (with error handling) and direct sending.
 * All SMS operations are logged to the database for auditing.
 * 
 * Features:
 * - MSISDN normalization for Bangladesh numbers
 * - Database logging of all SMS attempts
 * - Configurable SMS parameters (encoding, source address, etc.)
 * - Best-effort sending that doesn't throw exceptions
 */
class BdAppsSmsService
{
    /**
     * Create a new SMS service instance.
     * 
     * @param BdAppsApiClient $client The BdApps API client for making requests
     */
    public function __construct(private readonly BdAppsApiClient $client)
    {
    }

    /**
     * Best-effort SMS send that doesn't throw exceptions.
     * 
     * This method attempts to send an SMS and logs the result to the database.
     * If sending fails, it logs the error but doesn't throw an exception.
     * Useful for non-critical SMS notifications where failures can be tolerated.
     * 
     * @param string $msisdn Recipient phone number
     * @param string $message SMS message content
     * @return void
     */
    public function safeSend(string $msisdn, string $message): void
    {
        $normalizedMsisdn = Msisdn::normalizeBd($msisdn) ?: $msisdn;

        $smsRowId = null;
        if (Schema::hasTable('sms_messages')) {
            $smsRowId = SmsMessage::query()->insertGetId([
                'msisdn' => $normalizedMsisdn,
                'message' => $message,
                'provider' => 'bdapps',
                'status' => 'queued',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        try {
            $ok = $this->send($msisdn, $message);

            if ($smsRowId) {
                SmsMessage::query()->whereKey($smsRowId)->update([
                    'status' => $ok ? 'sent' : 'failed',
                    'updated_at' => now(),
                ]);
            }
        } catch (\Throwable $e) {
            Log::warning('BDApps SMS send failed', [
                'msisdn' => $normalizedMsisdn,
                'error' => $e->getMessage(),
            ]);

            if ($smsRowId) {
                SmsMessage::query()->whereKey($smsRowId)->update([
                    'status' => 'failed',
                    'error' => $e->getMessage(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    /**
     * Send an SMS via BDApps platform.
     * 
     * This method sends an SMS and throws an exception if sending fails.
     * It normalizes the MSISDN, builds the payload with configured parameters,
     * and uses the BdApps API client to send the message.
     * 
     * @param string $msisdn Recipient phone number
     * @param string $message SMS message content
     * @return bool True if SMS was sent successfully
     * @throws \RuntimeException If sending fails or MSISDN is invalid
     */
    public function send(string $msisdn, string $message): bool
    {
        $destination = Msisdn::toTelBd($msisdn);
        if ($destination === '') {
            throw new \RuntimeException('Invalid destination MSISDN.');
        }

        $payload = [
            'message' => $message,
            'destinationAddresses' => [$destination],
        ];

        $source = trim((string) config('services.bdapps.source_address', ''));
        if ($source !== '') {
            $payload['sourceAddress'] = $source;
        }

        // Defaults align with BDApps SMS API examples.
        $deliveryStatusRequest = (string) config('services.bdapps.sms_delivery_status_request', '1');
        if ($deliveryStatusRequest !== '') {
            $payload['deliveryStatusRequest'] = $deliveryStatusRequest;
        }

        $encoding = (string) config('services.bdapps.sms_encoding', '245');
        if ($encoding !== '') {
            $payload['encoding'] = $encoding;
        }

        $binaryHeader = trim((string) config('services.bdapps.sms_binary_header', ''));
        if ($binaryHeader !== '') {
            $payload['binaryHeader'] = $binaryHeader;
        }

        $resp = $this->client->sendSms($payload);

        $statusCode = (string) ($resp['statusCode'] ?? '');
        if ($statusCode === 'S1000') {
            return true;
        }

        $detail = (string) ($resp['statusDetail'] ?? json_encode($resp));
        throw new \RuntimeException('BDApps SMS send failed: '.$detail);
    }
}
