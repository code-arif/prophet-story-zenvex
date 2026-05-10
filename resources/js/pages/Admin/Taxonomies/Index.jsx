import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';

export default function AdminTaxonomiesIndex({ taxonomies }) {
  const form = useForm({});

  function destroy(id) {
    if (!confirm('Delete this taxonomy? Categories under it will lose their taxonomy assignment.')) return;
    form.delete(`/admin/taxonomies/${id}`);
  }

  return (
    <AdminShell title="Taxonomies">
      <Head title="Taxonomies" />

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm text-[hsl(var(--muted-foreground))]">
          Taxonomies group categories under a post type (e.g. "category" under "post").
        </div>
        <Button asChild>
          <Link href="/admin/taxonomies/create">New Taxonomy</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-3xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))]">
        <div className="divide-y divide-[hsl(var(--border))]">
          {(taxonomies || []).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold">{tx.name}</span>
                  {!tx.is_active && (
                    <span className="rounded bg-[hsl(var(--muted))] px-2 py-0.5 text-xs text-[hsl(var(--muted-foreground))]">Inactive</span>
                  )}
                </div>
                <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  slug: <code className="font-mono">{tx.slug}</code> •{' '}
                  Post type: <span className="font-medium">{tx.post_type?.name ?? '—'}</span> •{' '}
                  {tx.categories_count ?? 0} categories
                </div>
                {tx.description && (
                  <div className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">{tx.description}</div>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="secondary" asChild>
                  <Link href={`/admin/taxonomies/${tx.id}/edit`}>Edit</Link>
                </Button>
                <Button variant="destructive" type="button" onClick={() => destroy(tx.id)}>Delete</Button>
              </div>
            </div>
          ))}
          {(!taxonomies || taxonomies.length === 0) && (
            <div className="p-6 text-sm text-[hsl(var(--muted-foreground))]">No taxonomies yet.</div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
