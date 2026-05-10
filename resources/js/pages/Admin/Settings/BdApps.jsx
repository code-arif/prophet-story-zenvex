import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';
import SettingsNav from '../../../components/admin/SettingsNav';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

function CodeBlock({ value }) {
  return (
    <pre className="mt-2 overflow-auto whitespace-pre-wrap rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3 text-xs text-[hsl(var(--foreground))]">
      {value}
    </pre>
  );
}

export default function AdminSettingsBdApps({ bdapps }) {
  const { flash } = usePage().props;

  const test = useForm({
    msisdn: '',
    message: '',
    encoding: bdapps?.smsEncoding || '245',
    deliveryStatusRequest: bdapps?.smsDeliveryStatusRequest || '1',
    sourceAddress: bdapps?.sourceAddress || '',
  });

  const notify = useForm({
    subscribeEnabled: Boolean(bdapps?.notify?.subscribeEnabled ?? true),
    subscribeText: bdapps?.notify?.subscribeText ?? '',
    unsubscribeEnabled: Boolean(bdapps?.notify?.unsubscribeEnabled ?? true),
    unsubscribeText: bdapps?.notify?.unsubscribeText ?? '',
  });

  const swaggerPresets = bdapps?.swaggerUrlPresets || {
    dev: 'http://localhost:7000/swagger-ui',
    production: 'https://developer.bdapps.com/swagger-ui',
  };

  const exampleSmsPayload = {
    version: '1.0',
    applicationId: '<your_app_id>',
    password: '<your_password>',
    message: 'Hello from BD Election Daily',
    destinationAddresses: ['tel:8801XXXXXXXXX'],
    sourceAddress: bdapps?.sourceAddress || '<optional>',
    deliveryStatusRequest: bdapps?.smsDeliveryStatusRequest || '1',
    encoding: bdapps?.smsEncoding || '245',
  };

  function submitTest(e) {
    e.preventDefault();
    test.post('/admin/settings/bdapps/test-sms');
  }

  function submitNotify(e) {
    e.preventDefault();
    notify.post('/admin/settings/bdapps/notifications', { preserveScroll: true });
  }

  const last = flash?.bdappsTest;

  return (
    <AdminShell title="Settings">
      <Head title="BDApps API docs / test" />

      <div className="grid gap-4">

        <div>
          <div className="space-y-4">
            <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
              <div className="text-lg font-semibold">BDApps API Docs</div>
              <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                Quick links + reference payloads. (Docs/Swagger URLs can vary by platform deployment.)
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-semibold">API server</div>
                  <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{bdapps?.baseUrl || '—'}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold">SMS endpoint</div>
                  <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{bdapps?.smsUrl || '(auto: /sms/send)'} </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="secondary" asChild>
                  <a href={bdapps?.baseUrl || 'https://developer.bdapps.com'} target="_blank" rel="noreferrer">
                    Open API server
                  </a>
                </Button>
                <Button variant="secondary" asChild>
                  <a href={swaggerPresets.production} target="_blank" rel="noreferrer">
                    Open Swagger (prod preset)
                  </a>
                </Button>
                <Button variant="secondary" asChild>
                  <a href={swaggerPresets.dev} target="_blank" rel="noreferrer">
                    Open Swagger (dev preset)
                  </a>
                </Button>
              </div>

              <div className="mt-6">
                <div className="text-sm font-semibold">Example: POST /sms/send</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">
                  This app sends JSON and treats <span className="font-semibold">statusCode=S1000</span> as success.
                </div>
                <CodeBlock value={JSON.stringify(exampleSmsPayload, null, 2)} />
              </div>

              <div className="mt-6">
                <div className="text-sm font-semibold">This app’s webhook endpoints (operator callbacks)</div>
                <CodeBlock
                  value={[
                    'POST /api/webhooks/sms',
                    'POST /api/webhooks/sms/report',
                    'POST /api/webhooks/ussd',
                    'POST /api/webhooks/subscription/notify',
                  ].join('\n')}
                />
              </div>
            </div>

            <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
              <div className="text-lg font-semibold">BDApps API Test (Send SMS)</div>
              <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                Uses the credentials/URLs from “SMTP / SMS” settings and sends a real request.
              </div>

              <form onSubmit={submitTest} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">MSISDN</label>
                    <Input
                      placeholder="01XXXXXXXXX"
                      value={test.data.msisdn}
                      onChange={(e) => test.setData('msisdn', e.target.value)}
                    />
                    {test.errors.msisdn ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{test.errors.msisdn}</div> : null}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Source address (optional)</label>
                    <Input
                      value={test.data.sourceAddress}
                      onChange={(e) => test.setData('sourceAddress', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Message</label>
                  <textarea
                    className="min-h-28 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    value={test.data.message}
                    onChange={(e) => test.setData('message', e.target.value)}
                  />
                  {test.errors.message ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{test.errors.message}</div> : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Encoding</label>
                    <Input value={test.data.encoding} onChange={(e) => test.setData('encoding', e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Delivery status request</label>
                    <Input
                      value={test.data.deliveryStatusRequest}
                      onChange={(e) => test.setData('deliveryStatusRequest', e.target.value)}
                    />
                  </div>
                </div>

                <Button disabled={test.processing}>{test.processing ? 'Sending…' : 'Send test SMS'}</Button>
              </form>

              {last ? (
                <div className="mt-6">
                  <div className="text-sm font-semibold">Last test result</div>
                  <CodeBlock value={JSON.stringify(last, null, 2)} />
                </div>
              ) : null}
            </div>

            <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
              <div className="text-lg font-semibold">Subscription notifications (SMS)</div>
              <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                Controls the SMS sent after OTP verify auto-subscribe and when a user unsubscribes.
              </div>

              <form onSubmit={submitNotify} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={notify.data.subscribeEnabled}
                      onChange={(e) => notify.setData('subscribeEnabled', e.target.checked)}
                    />
                    Send SMS on subscribe
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={notify.data.unsubscribeEnabled}
                      onChange={(e) => notify.setData('unsubscribeEnabled', e.target.checked)}
                    />
                    Send SMS on unsubscribe
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Subscribe SMS text</label>
                    <textarea
                      className="min-h-24 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                      value={notify.data.subscribeText}
                      onChange={(e) => notify.setData('subscribeText', e.target.value)}
                    />
                    {notify.errors.subscribeText ? (
                      <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{notify.errors.subscribeText}</div>
                    ) : null}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Unsubscribe SMS text</label>
                    <textarea
                      className="min-h-24 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                      value={notify.data.unsubscribeText}
                      onChange={(e) => notify.setData('unsubscribeText', e.target.value)}
                    />
                    {notify.errors.unsubscribeText ? (
                      <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{notify.errors.unsubscribeText}</div>
                    ) : null}
                  </div>
                </div>

                <Button disabled={notify.processing}>{notify.processing ? 'Saving…' : 'Save notification settings'}</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
