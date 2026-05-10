import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';

export default function AdminCategoriesIndex({ categories, filters, activeTaxonomy }) {
  const form = useForm({});
  const taxonomySlug = filters?.taxonomy || '';

  function destroy(id) {
    if (!confirm(
      'এই ক্যাটাগরিটি স্থায়ীভাবে মুছে যাবে — পুনরুদ্ধার সম্ভব নয়।\n\nআপনি কি নিশ্চিত?'
    )) return;
    form.delete(`/admin/categories/${id}`, { preserveScroll: true });
  }

  const pageTitle = activeTaxonomy ? `${activeTaxonomy.icon || '🏷️'} ${activeTaxonomy.name}` : 'Categories';
  const newHref = `/admin/categories/create${taxonomySlug ? `?taxonomy=${taxonomySlug}` : ''}`;

  return (
    <AdminShell title={pageTitle}>
      <Head title={activeTaxonomy ? `${activeTaxonomy.name} — Admin` : 'Admin Categories'} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-[hsl(var(--muted-foreground))]">
          {categories?.length || 0} {activeTaxonomy ? activeTaxonomy.name : 'categories'}
          {activeTaxonomy && (
            <span className="ml-2 rounded-full bg-[hsl(var(--primary)/0.1)] px-2 py-0.5 text-xs text-[hsl(var(--primary))]">
              {activeTaxonomy.slug}
            </span>
          )}
        </div>
        <Button asChild>
          <Link href={newHref}>New {activeTaxonomy ? activeTaxonomy.name : 'Category'}</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-3xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))]">
        <div className="divide-y divide-[hsl(var(--border))]">
          {(categories || []).map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="truncate font-semibold">{c.name}</div>
                <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">slug: {c.slug} • order: {c.sort_order}</div>
                <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  {c.is_active ? 'Active' : 'Hidden'} • {c.show_in_nav ? 'Shown in nav' : 'Not in nav'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" asChild>
                  <Link href={`/admin/categories/${c.id}/edit${taxonomySlug ? `?taxonomy=${taxonomySlug}` : ''}`}>Edit</Link>
                </Button>
                <Button
                  variant="destructive"
                  type="button"
                  disabled={form.processing}
                  onClick={() => destroy(c.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}

          {(!categories || categories.length === 0) && (
            <div className="p-6 text-sm text-[hsl(var(--muted-foreground))]">
              {activeTaxonomy ? `No ${activeTaxonomy.name} yet.` : 'No categories yet.'}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
