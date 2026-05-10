import React, { useMemo, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';

export default function AdminBulkSms() {
  const { props } = usePage();
  const stats = props.stats ?? {};

  const form = useForm({
    segment: 'active_subscribers',
    message: '',
    custom_msisdns: '',
    delay_seconds: 1,
  });

  const customCount = useMemo(() => {
    const raw = form.data.custom_msisdns || '';
    const parts = raw.split(/[\s,;]+/).map((v) => v.trim()).filter(Boolean);
    return new Set(parts).size;
  }, [form.data.custom_msisdns]);

  return (
    <AdminShell title="Bulk SMS">
      <Head title="Admin Bulk SMS" />

      <div className="space-y-4">
        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
          <div className="text-lg font-semibold">Send SMS</div>
          <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
            Uses BDApps SMS service. Messages are queued as background jobs (or run immediately if queue driver is sync).
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[hsl(var(--background))] p-4 ring-1 ring-[hsl(var(--border))]">
              <div className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">Subscribers total</div>
              <div className="mt-1 text-xl font-semibold">{stats.subscribersTotal ?? '-'}</div>
            </div>
            <div className="rounded-2xl bg-[hsl(var(--background))] p-4 ring-1 ring-[hsl(var(--border))]">
              <div className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">Active subscriptions</div>
              <div className="mt-1 text-xl font-semibold">{stats.activeSubscriptions ?? '-'}</div>
            </div>
            <div className="rounded-2xl bg-[hsl(var(--background))] p-4 ring-1 ring-[hsl(var(--border))]">
              <div className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">Inactive estimate</div>
              <div className="mt-1 text-xl font-semibold">{stats.inactiveEstimate ?? '-'}</div>
            </div>
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.post('/admin/sms/bulk', { preserveScroll: true });
            }}
          >
            <div>
              <div className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">Audience</div>
              <select
                className="mt-1 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm"
                value={form.data.segment}
                onChange={(e) => form.setData('segment', e.target.value)}
              >
                <option value="all_subscribers">All subscribers (subscribers table)</option>
                <option value="active_subscribers">Active subscriptions (active + ends_at NULL)</option>
                <option value="inactive_subscribers">Inactive subscribers (subscribers minus active)</option>
                <option value="custom">Custom MSISDN list</option>
              </select>
              {form.errors.segment && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{form.errors.segment}</div>}
            </div>

            {form.data.segment === 'custom' && (
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">Custom MSISDNs</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">Count: {customCount}</div>
                </div>
                <textarea
                  className="mt-1 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm"
                  rows={6}
                  placeholder="Paste numbers separated by space/comma/newline (e.g. 8801xxxxxxxxx)"
                  value={form.data.custom_msisdns}
                  onChange={(e) => form.setData('custom_msisdns', e.target.value)}
                />
                {form.errors.custom_msisdns && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{form.errors.custom_msisdns}</div>}
              </div>
            )}

            <div>
              <div className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">Message</div>
              <textarea
                className="mt-1 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm"
                rows={5}
                placeholder="Type your message (max 480 chars)"
                value={form.data.message}
                onChange={(e) => form.setData('message', e.target.value)}
              />
              {form.errors.message && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{form.errors.message}</div>}
            </div>

            <div>
              <div className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">Throttle (seconds)</div>
              <input
                type="number"
                min={0}
                max={10}
                className="mt-1 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm"
                value={form.data.delay_seconds}
                onChange={(e) => form.setData('delay_seconds', Number(e.target.value))}
              />
              <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Dispatch is staggered per ~20 messages.</div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={form.processing}>
                {form.processing ? 'Sending…' : 'Queue SMS'}
              </Button>
            </div>

            {form.errors.error && <div className="mt-2 text-sm text-[hsl(var(--destructive))]">{form.errors.error}</div>}
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
