import React from 'react';
import { Head, useForm } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';

export default function AdminSettingsUssdMenu({ ussd }) {
  const form = useForm({
    menu_text: ussd?.menu_text || '',
    start_keywords_csv: (ussd?.start_keywords || []).filter((v) => v !== '').join(', '),
    subscribe_code: ussd?.subscribe_code || '1',
    cancel_code: ussd?.cancel_code || '2',
    subscribe_reply: ussd?.subscribe_reply || '',
    cancel_reply: ussd?.cancel_reply || '',
    invalid_reply: ussd?.invalid_reply || '',
    invalid_with_menu: Boolean(ussd?.invalid_with_menu ?? true),
  });

  function submit(e) {
    e.preventDefault();
    form.post('/admin/settings/ussd-menu');
  }

  return (
    <AdminShell title="Settings">
      <Head title="USSD Menu" />

      <div className="grid gap-4">

        <div>
          <form onSubmit={submit} className="space-y-4">
            <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
              <div className="text-lg font-semibold">USSD menu behavior</div>
              <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                These values control the responses from the USSD webhook. Incoming user input is trimmed and compared in upper-case.
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Menu text</label>
                  <textarea
                    className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm"
                    rows={5}
                    value={form.data.menu_text}
                    onChange={(e) => form.setData('menu_text', e.target.value)}
                    placeholder="BD Election Daily\n1. Subscribe\n2. Cancel\n"
                  />
                  {form.errors.menu_text && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{form.errors.menu_text}</div>}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Start keywords (comma-separated)</label>
                  <input
                    className="h-11 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm"
                    value={form.data.start_keywords_csv}
                    onChange={(e) => form.setData('start_keywords_csv', e.target.value)}
                    placeholder="MENU, MO-INIT"
                  />
                  <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Empty message always shows menu automatically.</div>
                  {form.errors.start_keywords_csv && (
                    <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{form.errors.start_keywords_csv}</div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Subscribe code</label>
                    <input
                      className="h-11 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm"
                      value={form.data.subscribe_code}
                      onChange={(e) => form.setData('subscribe_code', e.target.value)}
                      placeholder="1"
                    />
                    {form.errors.subscribe_code && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{form.errors.subscribe_code}</div>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Cancel code</label>
                    <input
                      className="h-11 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm"
                      value={form.data.cancel_code}
                      onChange={(e) => form.setData('cancel_code', e.target.value)}
                      placeholder="2"
                    />
                    {form.errors.cancel_code && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{form.errors.cancel_code}</div>}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Subscribe reply</label>
                    <textarea
                      className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm"
                      rows={3}
                      value={form.data.subscribe_reply}
                      onChange={(e) => form.setData('subscribe_reply', e.target.value)}
                      placeholder="Subscription active."
                    />
                    {form.errors.subscribe_reply && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{form.errors.subscribe_reply}</div>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Cancel reply</label>
                    <textarea
                      className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm"
                      rows={3}
                      value={form.data.cancel_reply}
                      onChange={(e) => form.setData('cancel_reply', e.target.value)}
                      placeholder="Subscription canceled."
                    />
                    {form.errors.cancel_reply && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{form.errors.cancel_reply}</div>}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Invalid option reply</label>
                  <textarea
                    className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm"
                    rows={3}
                    value={form.data.invalid_reply}
                    onChange={(e) => form.setData('invalid_reply', e.target.value)}
                    placeholder="Invalid option."
                  />
                  {form.errors.invalid_reply && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{form.errors.invalid_reply}</div>}
                </div>

                <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4">
                  <label className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={form.data.invalid_with_menu}
                      onChange={(e) => form.setData('invalid_with_menu', e.target.checked)}
                    />
                    Show menu again on invalid input
                  </label>
                  <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                    If enabled, user sees “Invalid option” + the menu and can try again.
                  </div>
                </div>
              </div>
            </div>

            <Button disabled={form.processing}>{form.processing ? 'Saving…' : 'Save USSD Menu'}</Button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
