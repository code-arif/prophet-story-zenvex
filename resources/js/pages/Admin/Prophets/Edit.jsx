import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';

export default function AdminProphetsEdit({ mode, prophet, chapters }) {
  const form = useForm({
    name: prophet?.name || '',
    name_arabic: prophet?.name_arabic || '',
    short_intro: prophet?.short_intro || '',
    cover_image_path: prophet?.cover_image_path || '',
    chronological_order: prophet?.chronological_order ?? 1,
  });

  const isEdit = mode === 'edit';

  function submit(e) {
    e.preventDefault();
    if (isEdit) {
      form.put(`/admin/prophets/${prophet.id}`);
    } else {
      form.post('/admin/prophets');
    }
  }

  return (
    <AdminShell title={isEdit ? 'Edit Prophet' : 'New Prophet'}>
      <Head title={isEdit ? 'Edit Prophet' : 'New Prophet'} />

      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Name *</label>
              <Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} placeholder="আদম (আঃ)" />
              {form.errors.name ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.name}</div> : null}
            </div>

            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Name (Arabic)</label>
              <Input value={form.data.name_arabic} onChange={(e) => form.setData('name_arabic', e.target.value)} placeholder="آدم" />
              {form.errors.name_arabic ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.name_arabic}</div> : null}
            </div>

            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Chronological order *</label>
              <Input
                type="number"
                min="0"
                max="9999"
                value={String(form.data.chronological_order)}
                onChange={(e) => form.setData('chronological_order', e.target.value)}
              />
              {form.errors.chronological_order ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.chronological_order}</div> : null}
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Short intro *</label>
            <Textarea
              rows={3}
              value={form.data.short_intro}
              onChange={(e) => form.setData('short_intro', e.target.value)}
              placeholder="One-two line introduction shown on the library card."
            />
            {form.errors.short_intro ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.short_intro}</div> : null}
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Cover image path *</label>
            <Input
              value={form.data.cover_image_path}
              onChange={(e) => form.setData('cover_image_path', e.target.value)}
              placeholder="/storage/prophets/adam.jpg or https://…"
            />
            {form.errors.cover_image_path ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.cover_image_path}</div> : null}
            {isEdit && prophet?.cover_image_url && (
              <div className="mt-2 flex items-center gap-3">
                <img src={prophet.cover_image_url} alt="Cover preview" className="h-16 w-16 rounded-xl object-cover ring-1 ring-[hsl(var(--border))]" />
                <span className="text-xs text-[hsl(var(--muted-foreground))]">Current cover preview</span>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button disabled={form.processing}>{form.processing ? 'Saving…' : 'Save'}</Button>
            <Button variant="secondary" asChild>
              <Link href="/admin/prophets">Back</Link>
            </Button>
          </div>
        </div>
      </form>

      {/* Chapters of this prophet */}
      {isEdit && (
        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold">
              Chapters {chapters?.length > 0 ? `(${chapters.length})` : ''}
            </h3>
            <Button size="sm" asChild>
              <Link href={`/admin/story-chapters/create?prophet=${prophet.id}`}>New Chapter</Link>
            </Button>
          </div>

          <div className="divide-y divide-[hsl(var(--border))]">
            {(chapters || []).map((ch) => (
              <div key={ch.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    <span className="mr-2 rounded-md bg-[hsl(var(--muted))] px-1.5 py-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                      {ch.chapter_number}
                    </span>
                    {ch.title}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-[hsl(var(--muted-foreground))]">
                    {ch.source_reference}
                  </div>
                </div>
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/admin/story-chapters/${ch.id}/edit`}>Edit</Link>
                </Button>
              </div>
            ))}
            {(!chapters || chapters.length === 0) && (
              <p className="py-2 text-sm text-[hsl(var(--muted-foreground))]">No chapters yet.</p>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}