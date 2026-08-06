import React from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

import AdminShell from '../../../../layouts/AdminShell';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Paginator } from '../parts';

export default function AdminVocabIndex({ decks, filters }) {
  const [search, setSearch] = React.useState(filters?.search || '');
  const deleteForm = useForm({});

  React.useEffect(() => {
    const timer = setTimeout(() => {
      router.get('/admin/learner/vocabulary', { search }, { preserveState: true, preserveScroll: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  function destroy(id) {
    if (!confirm('ডেকটি মুছে যাবে (শব্দগুলো অন্য ডেকে থাকলে থেকে যাবে)। আপনি কি নিশ্চিত?')) return;
    deleteForm.delete(`/admin/learner/vocabulary/${id}`, { preserveScroll: true });
  }

  return (
    <AdminShell title="Vocabulary Decks">
      <Head title="Vocabulary Decks" />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">Vocabulary Decks</h1>
          <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">ফ্ল্যাশকার্ড ডেক — শব্দগুলো ডেকের ভেতরেই এডিট হয়</p>
        </div>
        <Button asChild>
          <Link href="/admin/learner/vocabulary/create">
            <Plus className="mr-1.5 size-4" /> New Deck
          </Link>
        </Button>
      </div>

      <div className="rounded-3xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))]">
        <div className="border-b border-[hsl(var(--border))] p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search decks…" className="pl-9" />
          </div>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.data.map((d) => (
            <div key={d.id} className="flex flex-col rounded-2xl border border-[hsl(var(--border))] p-4 transition-colors hover:bg-[hsl(var(--muted))]/40">
              <div className="flex items-start justify-between gap-2">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[hsl(var(--muted))] text-sm font-bold uppercase">
                  {d.name?.slice(0, 1)}
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/learner/vocabulary/${d.id}/edit`}
                    className="inline-flex size-8 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
                    title="Edit"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <button
                    onClick={() => destroy(d.id)}
                    className="inline-flex size-8 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--destructive))]/10 hover:text-[hsl(var(--destructive))]"
                    title="Delete"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              <Link href={`/admin/learner/vocabulary/${d.id}/edit`} className="mt-3 font-semibold text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]">
                {d.name}
              </Link>
              <div className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">{d.slug}</div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-[hsl(var(--muted-foreground))]">
                  {d.words_count} শব্দ · {d.level}
                </span>
                <span className={d.is_published ? 'text-emerald-600 dark:text-emerald-400' : 'text-[hsl(var(--muted-foreground))]'}>
                  {d.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          ))}
          {decks.data.length === 0 && (
            <div className="col-span-full px-4 py-12 text-center text-sm text-[hsl(var(--muted-foreground))]">
              কোনো ডেক পাওয়া যায়নি — প্রথমে একটি তৈরি করুন।
            </div>
          )}
        </div>

        <div className="border-t border-[hsl(var(--border))] p-4">
          <Paginator meta={decks} />
        </div>
      </div>
    </AdminShell>
  );
}
