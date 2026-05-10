import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function AdminPostTypesEdit({ mode, postType }) {
  const form = useForm({
    name: postType?.name || '',
    slug: postType?.slug || '',
    description: postType?.description || '',
    icon: postType?.icon || '',
    is_active: postType?.is_active !== false,
    sort_order: postType?.sort_order ?? 0,
  });

  function submit(e) {
    e.preventDefault();
    if (mode === 'create') {
      form.post('/admin/post-types');
    } else {
      form.put(`/admin/post-types/${postType.id}`);
    }
  }

  return (
    <AdminShell title={mode === 'create' ? 'New Post Type' : 'Edit Post Type'}>
      <Head title={mode === 'create' ? 'New Post Type' : 'Edit Post Type'} />

      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
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

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Description</label>
              <Input value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Icon (emoji or text)</label>
              <Input value={form.data.icon} onChange={(e) => form.setData('icon', e.target.value)} placeholder="e.g. 📰 or post" />
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Sort order</label>
              <Input type="number" value={String(form.data.sort_order)} onChange={(e) => form.setData('sort_order', Number(e.target.value))} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-6">
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
            <Link href="/admin/post-types">Cancel</Link>
          </Button>
        </div>
      </form>
    </AdminShell>
  );
}
