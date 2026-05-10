import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function AdminCategoriesEdit({ mode, category, taxonomies }) {
  const form = useForm({
    taxonomy_id: category?.taxonomy_id ?? '',
    name: category?.name || '',
    slug: category?.slug || '',
    sort_order: category?.sort_order ?? 0,
    is_active: !!category?.is_active,
    show_in_nav: category?.show_in_nav ?? true,
  });

  function submit(e) {
    e.preventDefault();
    if (mode === 'create') {
      form.post('/admin/categories');
    } else {
      form.put(`/admin/categories/${category.id}`);
    }
  }

  return (
    <AdminShell title={mode === 'create' ? 'New Category' : 'Edit Category'}>
      <Head title={mode === 'create' ? 'New Category' : 'Edit Category'} />

      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">

          {(taxonomies && taxonomies.length > 0) && (
            <div className="mb-4">
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Taxonomy (Post Type)</label>
              <select
                value={String(form.data.taxonomy_id)}
                onChange={(e) => form.setData('taxonomy_id', e.target.value ? Number(e.target.value) : '')}
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm"
              >
                <option value="">— None (legacy category) —</option>
                {(taxonomies || []).map((tx) => (
                  <option key={tx.id} value={tx.id}>
                    {tx.post_type?.name ?? ''} › {tx.name}
                  </option>
                ))}
              </select>
              {form.errors.taxonomy_id && (
                <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.taxonomy_id}</div>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Name</label>
              <Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
              {form.errors.name ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.name}</div> : null}
            </div>

            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Slug</label>
              <Input value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} />
              {form.errors.slug ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.slug}</div> : null}
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Sort order</label>
              <Input
                type="number"
                value={String(form.data.sort_order)}
                onChange={(e) => form.setData('sort_order', e.target.value)}
              />
              {form.errors.sort_order ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.sort_order}</div> : null}
            </div>

            <div className="flex items-center gap-2 pt-8">
              <input
                type="checkbox"
                checked={!!form.data.is_active}
                onChange={(e) => form.setData('is_active', e.target.checked)}
              />
              <div className="text-sm">Active</div>
            </div>

            <div className="flex items-center gap-2 pt-8">
              <input
                type="checkbox"
                checked={!!form.data.show_in_nav}
                onChange={(e) => form.setData('show_in_nav', e.target.checked)}
              />
              <div className="text-sm">Show in nav</div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button disabled={form.processing}>{form.processing ? 'Saving…' : 'Save'}</Button>
            <Button variant="secondary" asChild>
              <Link href="/admin/categories">Back</Link>
            </Button>
          </div>
        </div>
      </form>
    </AdminShell>
  );
}
