import React from 'react';
import { Head, Link } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';

export default function AdminSubscribersIndex({ subscribers }) {
  return (
    <AdminShell title="Subscribers">
      <Head title="Admin Subscribers" />

      <div className="overflow-hidden rounded-3xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))]">
        <div className="divide-y divide-[hsl(var(--border))]">
          {(subscribers || []).map((s) => (
            <div key={s.msisdn} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="truncate font-semibold">{s.name || s.msisdn}</div>
                <div className="truncate text-xs text-[hsl(var(--muted-foreground))]">{s.msisdn}</div>
              </div>
              <Button variant="secondary" asChild>
                <Link href={`/admin/subscribers/${encodeURIComponent(s.msisdn)}`}>Details</Link>
              </Button>
            </div>
          ))}

          {(!subscribers || subscribers.length === 0) && (
            <div className="p-6 text-sm text-[hsl(var(--muted-foreground))]">No subscribers yet.</div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
