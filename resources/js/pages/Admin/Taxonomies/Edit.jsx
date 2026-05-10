import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function AdminTaxonomiesEdit({ mode, taxonomy, postTypes }) {
  const form = useForm({
    post_type_id: taxonomy?.post_type_id ?? '',
    name: taxonomy?.name || '',
    slug: taxonomy?.slug || '',
    description: taxonomy?.description || '',
    is_active: taxonomy?.is_active !== false,
    sort_order: taxonomy?.sort_order ?? 0,
  });

  function submit(e) {
    e.preventDefault();
    if (mode === 'create') {
      form.post('/admin/taxonomies');
    } else {
      form.put(`/admin/taxonomies/${taxonomy.id}`);
    }
  }

  return (
    <AdminShell title={mode === 'create' ? 'New Taxonomy' : 'Edit Taxonomy'}>
      <Head title={mode === 'create' ? 'New Taxonomy' : 'Edit Taxonomy'} />

      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">

          <div className="mb-4">
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Post Type</label>
            <select
              value={String(form.data.post_type_id)}
              onChange={(e) => form.setData('post_type_id', Number(e.target.value))}
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm"
            >
              <option value="">— Select post type —</option>
              {(postTypes || []).map((pt) => (
                <option key={pt.id} value={pt.id}>{pt.name}</option>
              ))}
            </select>
            {form.errors.post_type_id && (
              <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.post_type_id}</div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Name</label>
              <Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
              {form.errors.name && <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.name}</div>}
            </div>
            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Slug</label>
              <Input value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} placeholder="auto-generated" />
              {form.errors.slug && <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.slug}</div>}
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Description</label>
            <Input value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Sort order</label>
              <Input type="number" value={String(form.data.sort_order)} onChange={(e) => form.setData('sort_order', Number(e.target.value))} />
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!form.data.is_active}
                onChange={(e) => form.setData('is_active', e.target.checked)}
                className="rounded"
              />
              Active
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={form.processing}>
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/admin/taxonomies">Cancel</Link>
          </Button>
        </div>
      </form>
    </AdminShell>
  );
}
