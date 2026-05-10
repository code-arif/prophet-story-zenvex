import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';

export default function AdminPageBuilderIndex({ pages }) {
  function handleDelete(id) {
    if (!confirm('Delete this page?')) return;
    router.delete(`/admin/page-builder/${id}`);
  }

  return (
    <AdminShell title="Page Builder">
      <Head title="Page Builder" />

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm text-[hsl(var(--muted-foreground))]">
          Create visually designed pages with the drag-and-drop builder.
        </div>
        <Button asChild>
          <Link href="/admin/page-builder/create">New Page</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-3xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))]">
        <div className="divide-y divide-[hsl(var(--border))]">
          {(pages || []).map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{p.title}</div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="truncate text-xs text-[hsl(var(--muted-foreground))]">/p/{p.slug}</span>
                  {p.use_builder && (
                    <span className="rounded-full bg-violet-950/40 px-2 py-0.5 text-xs text-violet-300 ring-1 ring-violet-900/50">
                      Builder
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={
                    'rounded-full px-2 py-1 text-xs ring-1 ' +
                    (p.is_published
                      ? 'bg-emerald-950/40 text-emerald-200 ring-emerald-900/50'
                      : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] ring-[hsl(var(--border))]')
                  }
                >
                  {p.is_published ? 'Published' : 'Draft'}
                </span>
                <Button variant="secondary" asChild size="sm">
                  <Link href={`/admin/page-builder/${p.id}/edit`}>Edit</Link>
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleDelete(p.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}

          {(!pages || pages.length === 0) && (
            <div className="p-6 text-sm text-[hsl(var(--muted-foreground))]">
              No pages yet. Click <strong>New Page</strong> to get started.
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
