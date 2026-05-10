<?php

namespace App\Jobs;

use App\Services\BdAppsSmsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * SendSmsToMsisdnJob - Queued job for sending SMS messages
 * 
 * This job handles sending SMS messages asynchronously via the queue.
 * It uses the BdAppsSmsService to send messages safely (with error handling).
 * 
 * Usage: SendSmsToMsisdnJob::dispatch($msisdn, $message, 'tag');
 * 
 * The job implements ShouldQueue to indicate it should be queued,
 * and uses the standard Laravel job traits for queueability and serialization.
 */
class SendSmsToMsisdnJob implements ShouldQueue
{
    use Dispatchable;      // Allows dispatching the job
    use InteractsWithQueue; // Provides queue interaction methods
    use Queueable;         // Makes the job queueable
    use SerializesModels;   // Handles model serialization for the queue

    /**
     * Create a new job instance.
     * 
     * @param string $msisdn Recipient phone number
     * @param string $message SMS message content
     * @param string|null $tag Optional tag for categorizing SMS (e.g., 'otp', 'notification')
     */
    public function __construct(
        public readonly string $msisdn,
        public readonly string $message,
        public readonly ?string $tag = null,
    ) {
    }

    /**
     * Execute the job.
     * 
     * This method is called when the job is processed by the queue worker.
     * It sends the SMS using the BdApps SMS service (with error handling).
     * 
     * @param BdAppsSmsService $sms The SMS service (injected by container)
     * @return void
     */
    public function handle(BdAppsSmsService $sms): void
    {
        $sms->safeSend($this->msisdn, $this->message);
    }
}
