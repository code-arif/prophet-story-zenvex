import React from 'react';
import { Head, useForm } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';
import SettingsNav from '../../../components/admin/SettingsNav';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function AdminSettingsWidgets({ widgets }) {
  const form = useForm({
    refreshSeconds: typeof widgets?.refreshSeconds === 'number' ? widgets.refreshSeconds : 0,
    electionCountdownTitle: widgets?.electionCountdownTitle || 'Count Down',
    electionCountdownAt: widgets?.electionCountdownAt || '',
  });

  function submit(e) {
    e.preventDefault();
    form.post('/admin/settings/widgets');
  }

  return (
    <AdminShell title="Settings">
      <Head title="Admin Settings" />

      <div className="grid gap-4">

        <div>
          <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
            <div className="text-lg font-semibold">Widgets</div>
            <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Control admin widget auto-refresh (Dashboard / Metrics).
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Auto-refresh interval (seconds)</label>
                <Input
                  type="number"
                  min={0}
                  max={3600}
                  value={form.data.refreshSeconds}
                  onChange={(e) => form.setData('refreshSeconds', Number(e.target.value || 0))}
                />
                {form.errors.refreshSeconds ? (
                  <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.refreshSeconds}</div>
                ) : null}
                <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  Use <span className="font-semibold">0</span> to disable. Suggested: 30–60 seconds.
                </div>
              </div>

              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4">
                <div className="text-sm font-semibold text-[hsl(var(--foreground))]">Public widget: Count Down</div>
                <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  This controls the “Count Down” box on the public home feed.
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-1">
                  <div>
                    <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Title</label>
                    <Input
                      value={form.data.electionCountdownTitle}
                      onChange={(e) => form.setData('electionCountdownTitle', e.target.value)}
                      placeholder="Count Down"
                    />
                    {form.errors.electionCountdownTitle ? (
                      <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.electionCountdownTitle}</div>
                    ) : null}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Target date & time</label>
                    <div className="flex gap-2">
                      <Input
                        type="datetime-local"
                        value={form.data.electionCountdownAt}
                        onChange={(e) => form.setData('electionCountdownAt', e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => form.setData('electionCountdownAt', '')}
                      >
                        Clear
                      </Button>
                    </div>
                    {form.errors.electionCountdownAt ? (
                      <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.electionCountdownAt}</div>
                    ) : null}
                    <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                      Uses your browser/local time. If empty, the widget will show “Not set”.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button disabled={form.processing}>{form.processing ? 'Saving…' : 'Save settings'}</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
