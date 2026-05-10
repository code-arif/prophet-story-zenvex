<?php

namespace App\Services;

use Illuminate\Support\Str;

class SubscriptionNotifier
{
    public function __construct(
        private readonly AppSettings $settings,
        private readonly BdAppsSmsService $sms,
    ) {
    }

    public function notifySubscribed(string $msisdn): void
    {
        if (!$this->isEnabled('subscription.notify_subscribe_enabled', false)) {
            return;
        }

        $message = (string) $this->settings->get(
            'subscription.notify_subscribe_text',
            'Subscription active. Visit the site to read subscriber-only articles.'
        );

        $message = $this->sanitizeMessage($message);
        if ($message === '') {
            return;
        }

        $this->sms->safeSend($msisdn, $message);
    }

    public function notifyUnsubscribed(string $msisdn): void
    {
        if (!$this->isEnabled('subscription.notify_unsubscribe_enabled', false)) {
            return;
        }

        $message = (string) $this->settings->get(
            'subscription.notify_unsubscribe_text',
            'Subscription canceled.'
        );

        $message = $this->sanitizeMessage($message);
        if ($message === '') {
            return;
        }

        $this->sms->safeSend($msisdn, $message);
    }

    private function sanitizeMessage(string $message): string
    {
        $message = str_replace("\r\n", "\n", $message);
        $message = trim($message);

        if ($message === '') {
            return '';
        }

        // Keep within our validation used elsewhere.
        return Str::limit($message, 480, '');
    }

    private function isEnabled(string $key, bool $default): bool
    {
        $raw = $this->settings->get($key, $default);

        if (is_bool($raw)) {
            return $raw;
        }

        if (is_numeric($raw)) {
            return (int) $raw === 1;
        }

        $raw = strtolower(trim((string) $raw));
        if ($raw === '') {
            return $default;
        }

        return in_array($raw, ['1', 'true', 'yes', 'on', 'enabled'], true);
    }
}
