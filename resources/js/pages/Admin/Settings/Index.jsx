import React from 'react';
import { Head } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';

export default function AdminSettingsIndex() {
  return (
    <AdminShell title="Settings">
      <Head title="Admin Settings" />
      <div className="rounded-3xl bg-[hsl(var(--card))] p-5 text-sm text-[hsl(var(--muted-foreground))] ring-1 ring-[hsl(var(--border))]">
        Choose a settings section.
      </div>
    </AdminShell>
  );
}
