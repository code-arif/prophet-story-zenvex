import React from 'react';
import { Head, useForm } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';
import SettingsNav from '../../../components/admin/SettingsNav';
import { Button } from '../../../components/ui/button';

export default function AdminSettingsMenu({ menu }) {
  const form = useForm({
    itemsJson: JSON.stringify(menu?.items || [], null, 2),
  });

  function submit(e) {
    e.preventDefault();
    form.post('/admin/settings/menu/admin');
  }

  return (
    <AdminShell title="Settings">
      <Head title="Admin menu (advanced)" />

      <div className="grid gap-4">

        <div>
          <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
            <div className="text-lg font-semibold">Admin sidebar menu (advanced)</div>
            <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Provide JSON array like: <span className="font-mono">[{`{"label":"Articles","href":"/admin/articles"}`}]</span>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <textarea
                className="min-h-64 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                value={form.data.itemsJson}
                onChange={(e) => form.setData('itemsJson', e.target.value)}
              />

              <Button disabled={form.processing}>{form.processing ? 'Saving…' : 'Save'}</Button>
            </form>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
