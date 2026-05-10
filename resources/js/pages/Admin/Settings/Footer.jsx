import React from 'react';
import { Head, useForm } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';
import SettingsNav from '../../../components/admin/SettingsNav';
import { Button } from '../../../components/ui/button';

export default function AdminSettingsFooter({ footer }) {
  const form = useForm({
    linksJson: JSON.stringify(footer?.links || [], null, 2),
  });

  function submit(e) {
    e.preventDefault();
    form.post('/admin/settings/footer');
  }

  return (
    <AdminShell title="Settings">
      <Head title="Footer links" />

      <div className="grid gap-4">

        <div>
          <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
            <div className="text-lg font-semibold">Footer links</div>
            <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Provide JSON array like: <span className="font-mono">[{`{"label":"About","url":"/about"}`}]</span>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <textarea
                className="min-h-64 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                value={form.data.linksJson}
                onChange={(e) => form.setData('linksJson', e.target.value)}
              />

              <Button disabled={form.processing}>{form.processing ? 'Saving…' : 'Save'}</Button>
            </form>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
