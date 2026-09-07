import React from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';

export default function AdminStoryChaptersIndex({ chapters, prophets, filters }) {
  const form = useForm({});
  const filterProphet = filters?.prophet || '';

  function onFilterChange(e) {
    const value = e.target.value;
    router.get('/admin/story-chapters', value ? { prophet: value } : {}, {
      preserveState: true,
      replace: true,
    });
  }

  function destroy(id) {
    if (!confirm(
      'এই অধ্যায়টি স্থায়ীভাবে মুছে যাবে — পুনরুদ্ধার সম্ভব নয়।\n\nআপনি কি নিশ্চিত?'
    )) return;
    form.delete(`/admin/story-chapters/${id}`, { preserveScroll: true });
  }

  const rows = chapters?.data || [];
  const createHref = `/admin/story-chapters/create${filterProphet ? `?prophet=${filterProphet}` : ''}`;

  return (
    <AdminShell title="Story Chapters">
      <Head title="Story Chapters — Admin" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <select
            value={String(filterProphet)}
            onChange={onFilterChange}
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm"
          >
            <option value="">All prophets</option>
            {(prophets || []).map((p) => (
              <option key={p.id} value={p.id}>{p.name}{p.name_arabic ? ` (${p.name_arabic})` : ''}</option>
            ))}
          </select>
          <span className="text-sm text-[hsl(var(--muted-foreground))]">
            {chapters?.total || 0} chapters
          </span>
        </div>
        <Button asChild>
          <Link href={createHref}>New Chapter</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-3xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))]">
        <div className="divide-y divide-[hsl(var(--border))]">
          {rows.map((ch) => (
            <div key={ch.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="truncate font-semibold">
                  <span className="mr-2 rounded-md bg-[hsl(var(--muted))] px-1.5 py-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                    {ch.chapter_number}
                  </span>
                  {ch.title}
                </div>
                <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  {ch.prophet?.name || '—'}
                </div>
                <div className="mt-0.5 truncate text-xs text-[hsl(var(--muted-foreground))]">
                  Source: {ch.source_reference}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" asChild>
                  <Link href={`/admin/story-chapters/${ch.id}/edit`}>Edit</Link>
                </Button>
                <Button
                  variant="destructive"
                  type="button"
                  disabled={form.processing}
                  onClick={() => destroy(ch.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}

          {rows.length === 0 && (
            <div className="p-6 text-sm text-[hsl(var(--muted-foreground))]">
              No chapters found.
            </div>
          )}
        </div>
      </div>

      {(chapters?.prev_page_url || chapters?.next_page_url) && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-[hsl(var(--muted-foreground))]">
            Showing {chapters.from || 0} to {chapters.to || 0} of {chapters.total || 0}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!chapters.prev_page_url}
              onClick={() => chapters.prev_page_url && router.get(chapters.prev_page_url)}
            >
              <ChevronLeft className="size-4" />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!chapters.next_page_url}
              onClick={() => chapters.next_page_url && router.get(chapters.next_page_url)}
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}