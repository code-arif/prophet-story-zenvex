import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';

export default function AdminPostTypesIndex({ postTypes }) {
  const form = useForm({});

  function destroy(id) {
    if (!confirm('Delete this post type? All articles of this type will lose their type assignment.')) return;
    form.delete(`/admin/post-types/${id}`);
  }

  return (
    <AdminShell title="Post Types">
      <Head title="Post Types" />

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm text-[hsl(var(--muted-foreground))]">Define content types (e.g. post, hajj, video).</div>
        <Button asChild>
          <Link href="/admin/post-types/create">New Post Type</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-3xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))]">
        <div className="divide-y divide-[hsl(var(--border))]">
          {(postTypes || []).map((pt) => (
            <div key={pt.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {pt.icon && <span className="text-lg">{pt.icon}</span>}
                  <span className="truncate font-semibold">{pt.name}</span>
                  {!pt.is_active && (
                    <span className="rounded bg-[hsl(var(--muted))] px-2 py-0.5 text-xs text-[hsl(var(--muted-foreground))]">Inactive</span>
                  )}
                </div>
                <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  slug: <code className="font-mono">{pt.slug}</code> • {pt.taxonomies_count ?? 0} taxonomies
                </div>
                {pt.description && (
                  <div className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">{pt.description}</div>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="secondary" asChild>
                  <Link href={`/admin/taxonomies?post_type=${pt.slug}`}>Taxonomies</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href={`/admin/post-types/${pt.id}/edit`}>Edit</Link>
                </Button>
                <Button variant="destructive" type="button" onClick={() => destroy(pt.id)}>Delete</Button>
              </div>
            </div>
          ))}
          {(!postTypes || postTypes.length === 0) && (
            <div className="p-6 text-sm text-[hsl(var(--muted-foreground))]">No post types yet.</div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
