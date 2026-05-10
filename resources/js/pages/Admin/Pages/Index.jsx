import React from 'react';
import { Head, Link } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';

export default function AdminPagesIndex({ pages }) {
  function handleDelete(id) {
    if (!confirm('Delete this page?')) return;
    router.delete(`/admin/page-builder/${id}`);
  }
  
  return (
    <AdminShell title="Pages">
      <Head title="Admin Pages" />

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm text-[hsl(var(--muted-foreground))]">Manage dynamic pages (About, Help, etc.).</div>
        <Button asChild>
          <Link href="/admin/pages/create">New page</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-3xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))]">
        <div className="divide-y divide-[hsl(var(--border))]">
          {(pages || []).map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="truncate font-semibold">{p.title}</div>
                <div className="truncate text-xs text-[hsl(var(--muted-foreground))]">/p/{p.slug}</div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={
                    'rounded-full px-2 py-1 text-xs ring-1 ' +
                    (p.visibility === 'public'
                      ? 'bg-green-100 text-green-800 ring-green-300'
                      : p.visibility === 'private'
                      ? 'bg-yellow-100 text-yellow-800 ring-yellow-300'
                      : 'bg-gray-100 text-gray-800 ring-gray-300')
                  }
                >
                  {p.visibility}
                </span>
                <Button variant="secondary" asChild>
                  <Link href={`/admin/pages/${p.id}/edit`}>Edit</Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href={`/p/${p.slug}`} target="_blank" rel="noopener noreferrer">View</a>
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleDelete(p.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}

          {(!pages || pages.length === 0) && (
            <div className="p-6 text-sm text-[hsl(var(--muted-foreground))]">No pages yet.</div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
