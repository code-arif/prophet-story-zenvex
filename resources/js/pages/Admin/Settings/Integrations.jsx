import React from 'react';
import { Head, useForm } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';
import SettingsNav from '../../../components/admin/SettingsNav';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function AdminSettingsIntegrations({ integrations }) {
  const form = useForm({
    mailer: integrations?.mailer || 'log',
    smtp_host: integrations?.smtp_host || '',
    smtp_port: integrations?.smtp_port || '',
    smtp_username: integrations?.smtp_username || '',
    smtp_password: '',
    mail_from_address: integrations?.mail_from_address || '',
    mail_from_name: integrations?.mail_from_name || '',

    bdapps_base_url: integrations?.bdapps_base_url || '',
    bdapps_sms_url: integrations?.bdapps_sms_url || '',
    bdapps_ussd_url: integrations?.bdapps_ussd_url || '',
    bdapps_app_id: integrations?.bdapps_app_id || '',
    bdapps_password: '',
    bdapps_source_address: integrations?.bdapps_source_address || '',
    bdapps_use_platform_subscription: integrations?.bdapps_use_platform_subscription || false,
  });

  const BDAPPS_PRESETS = {
    dev: {
      baseUrl: 'http://localhost:7000',
      smsUrl: 'http://localhost:7000/sms/send',
      ussdUrl: 'http://localhost:7000/ussd/send',
    },
    production: {
      baseUrl: 'https://developer.bdapps.com',
      smsUrl: 'https://developer.bdapps.com/sms/send',
      ussdUrl: 'https://developer.bdapps.com/ussd/send',
    },
  };

  function submit(e) {
    e.preventDefault();
    form.post('/admin/settings/integrations');
  }

  return (
    <AdminShell title="Settings">
      <Head title="SMTP / SMS" />

      <div className="grid gap-4">

        <div>
          <form onSubmit={submit} className="space-y-4">
            <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
              <div className="text-lg font-semibold">SMTP</div>
              <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                These settings are saved in DB and applied at runtime (recommended to also keep env vars in production).
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Mailer</label>
                  <select
                    className="h-11 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm"
                    value={form.data.mailer}
                    onChange={(e) => form.setData('mailer', e.target.value)}
                  >
                    <option value="log">log</option>
                    <option value="smtp">smtp</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">SMTP host</label>
                  <Input value={form.data.smtp_host} onChange={(e) => form.setData('smtp_host', e.target.value)} />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">SMTP port</label>
                  <Input value={form.data.smtp_port} onChange={(e) => form.setData('smtp_port', e.target.value)} />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">SMTP username</label>
                  <Input value={form.data.smtp_username} onChange={(e) => form.setData('smtp_username', e.target.value)} />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">SMTP password</label>
                  <Input
                    type="password"
                    placeholder={integrations?.smtp_password_set ? '•••••••• (saved)' : ''}
                    value={form.data.smtp_password}
                    onChange={(e) => form.setData('smtp_password', e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">From address</label>
                  <Input value={form.data.mail_from_address} onChange={(e) => form.setData('mail_from_address', e.target.value)} />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">From name</label>
                  <Input value={form.data.mail_from_name} onChange={(e) => form.setData('mail_from_name', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
              <div className="text-lg font-semibold">BDApps SMS</div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-sm text-[hsl(var(--muted-foreground))]">API server</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1 text-xs"
                        onClick={() => form.setData('bdapps_base_url', BDAPPS_PRESETS.dev.baseUrl)}
                      >
                        dev
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1 text-xs"
                        onClick={() => form.setData('bdapps_base_url', BDAPPS_PRESETS.production.baseUrl)}
                      >
                        production
                      </button>
                    </div>
                  </div>
                  <Input value={form.data.bdapps_base_url} onChange={(e) => form.setData('bdapps_base_url', e.target.value)} />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-sm text-[hsl(var(--muted-foreground))]">SMS URL</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1 text-xs"
                        onClick={() => form.setData('bdapps_sms_url', BDAPPS_PRESETS.dev.smsUrl)}
                      >
                        dev
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1 text-xs"
                        onClick={() => form.setData('bdapps_sms_url', BDAPPS_PRESETS.production.smsUrl)}
                      >
                        production
                      </button>
                    </div>
                  </div>
                  <Input value={form.data.bdapps_sms_url} onChange={(e) => form.setData('bdapps_sms_url', e.target.value)} />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-sm text-[hsl(var(--muted-foreground))]">USSD URL</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1 text-xs"
                        onClick={() => form.setData('bdapps_ussd_url', BDAPPS_PRESETS.dev.ussdUrl)}
                      >
                        dev
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1 text-xs"
                        onClick={() => form.setData('bdapps_ussd_url', BDAPPS_PRESETS.production.ussdUrl)}
                      >
                        production
                      </button>
                    </div>
                  </div>
                  <Input value={form.data.bdapps_ussd_url} onChange={(e) => form.setData('bdapps_ussd_url', e.target.value)} />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">App ID</label>
                  <Input value={form.data.bdapps_app_id} onChange={(e) => form.setData('bdapps_app_id', e.target.value)} />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Password</label>
                  <Input
                    type="password"
                    placeholder={integrations?.bdapps_password_set ? '•••••••• (saved)' : ''}
                    value={form.data.bdapps_password}
                    onChange={(e) => form.setData('bdapps_password', e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Source address</label>
                  <Input value={form.data.bdapps_source_address} onChange={(e) => form.setData('bdapps_source_address', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.data.bdapps_use_platform_subscription || false}
                      onChange={(e) => form.setData('bdapps_use_platform_subscription', e.target.checked)}
                      className="rounded border-[hsl(var(--border))] text-[hsl(var(--primary))] focus:ring-[hsl(var(--ring))]"
                    />
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">Enable Platform Subscription API calls</span>
                  </label>
                </div>
              </div>
            </div>

            <Button disabled={form.processing}>{form.processing ? 'Saving…' : 'Save'}</Button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
