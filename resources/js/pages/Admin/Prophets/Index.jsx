import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';

export default function AdminProphetsIndex({ prophets }) {
  const form = useForm({});

  function destroy(id) {
    if (!confirm(
      'এই নবীকে স্থায়ীভাবে মুছে ফেলা হবে — পুনরুদ্ধার সম্ভব নয়।\n\nআপনি কি নিশ্চিত?'
    )) return;
    form.delete(`/admin/prophets/${id}`, { preserveScroll: true });
  }

  return (
    <AdminShell title="Prophets">
      <Head title="Prophets — Admin" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-[hsl(var(--muted-foreground))]">
          {prophets?.length || 0} prophets
        </div>
        <Button asChild>
          <Link href="/admin/prophets/create">New Prophet</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-3xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))]">
        <div className="divide-y divide-[hsl(var(--border))]">
          {(prophets || []).map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex min-w-0 items-center gap-3">
                {p.cover_image_url ? (
                  <img
                    src={p.cover_image_url}
                    alt={p.name}
                    className="size-12 shrink-0 rounded-xl object-cover ring-1 ring-[hsl(var(--border))]"
                  />
                ) : (
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--muted))] text-lg">
                    🕌
                  </div>
                )}
                <div className="min-w-0">
                  <div className="truncate font-semibold">
                    {p.name}
                    {p.name_arabic ? (
                      <span className="ml-2 text-xs text-[hsl(var(--muted-foreground))]">{p.name_arabic}</span>
                    ) : null}
                  </div>
                  <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                    order: {p.chronological_order} • {p.chapters_count} chapter{p.chapters_count === 1 ? '' : 's'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" asChild>
                  <Link href={`/admin/prophets/${p.id}/edit`}>Edit</Link>
                </Button>
                <Button
                  variant="destructive"
                  type="button"
                  disabled={form.processing}
                  onClick={() => destroy(p.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}

          {(!prophets || prophets.length === 0) && (
            <div className="p-6 text-sm text-[hsl(var(--muted-foreground))]">
              No prophets yet. Create the first one to start building stories.
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}