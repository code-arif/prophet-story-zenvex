import React from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

import AdminShell from '../../../../layouts/AdminShell';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Paginator } from '../parts';

const KIND_LABELS = { quick: '⚡ Quick', topic: '📚 Topic', level: '🎯 Level' };

export default function AdminQuizzesIndex({ quizzes, filters, kinds }) {
  const [search, setSearch] = React.useState(filters?.search || '');
  const deleteForm = useForm({});

  React.useEffect(() => {
    const timer = setTimeout(() => {
      router.get('/admin/learner/quizzes', { search, kind: filters.kind }, { preserveState: true, preserveScroll: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  function destroy(id) {
    if (!confirm('কুইজটি স্থায়ীভাবে মুছে যাবে (আগের অ্যাটেম্পটগুলোও)। আপনি কি নিশ্চিত?')) return;
    deleteForm.delete(`/admin/learner/quizzes/${id}`, { preserveScroll: true });
  }

  return (
    <AdminShell title="Quizzes">
      <Head title="Quizzes" />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">Quizzes</h1>
          <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">কুইজ সেন্টার — quick / topic / level</p>
        </div>
        <Button asChild>
          <Link href="/admin/learner/quizzes/create">
            <Plus className="mr-1.5 size-4" /> New Quiz
          </Link>
        </Button>
      </div>

      <div className="rounded-3xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))]">
        <div className="flex flex-wrap items-center gap-2 border-b border-[hsl(var(--border))] p-4">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search quizzes…" className="pl-9" />
          </div>
          <div className="flex gap-1 rounded-xl bg-[hsl(var(--muted))] p-1">
            {['', ...kinds].map((k) => (
              <button
                key={k || 'all'}
                onClick={() => router.get('/admin/learner/quizzes', { search, kind: k }, { preserveState: true, preserveScroll: true })}
                className={
                  'rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ' +
                  (filters.kind === k
                    ? 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]')
                }
              >
                {k || 'All'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] text-left text-xs uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Kind</th>
                <th className="px-4 py-3 font-semibold">Topic</th>
                <th className="px-4 py-3 font-semibold">Level</th>
                <th className="px-4 py-3 font-semibold">Questions</th>
                <th className="px-4 py-3 font-semibold">Duration</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.data.map((q) => (
                <tr key={q.id} className="border-b border-[hsl(var(--border))]/60 last:border-0 hover:bg-[hsl(var(--muted))]/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/learner/quizzes/${q.id}/edit`} className="font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]">
                      {q.title_bn}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{KIND_LABELS[q.kind] || q.kind}</td>
                  <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{q.topic || '—'}</td>
                  <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{q.level}</td>
                  <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{Array.isArray(q.questions) ? q.questions.length : 0}</td>
                  <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{q.duration_minutes} min</td>
                  <td className="px-4 py-3">
                    <span className={q.is_active ? 'text-emerald-600 dark:text-emerald-400' : 'text-[hsl(var(--muted-foreground))]'}>
                      {q.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/learner/quizzes/${q.id}/edit`}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
                        title="Edit"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <button
                        onClick={() => destroy(q.id)}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--destructive))]/10 hover:text-[hsl(var(--destructive))]"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {quizzes.data.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-[hsl(var(--muted-foreground))]">
                    কোনো কুইজ পাওয়া যায়নি — প্রথমে একটি তৈরি করুন।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[hsl(var(--border))] p-4">
          <Paginator meta={quizzes} />
        </div>
      </div>
    </AdminShell>
  );
}
