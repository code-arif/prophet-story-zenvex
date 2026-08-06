import React from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

import AdminShell from '../../../../layouts/AdminShell';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Paginator } from '../parts';

function LevelBadge({ level }) {
  const tones = {
    A1: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    A2: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
    B1: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[level] || tones.A1}`}>
      {level}
    </span>
  );
}

export default function AdminLessonsIndex({ lessons, filters, levels }) {
  const [search, setSearch] = React.useState(filters?.search || '');
  const deleteForm = useForm({});

  React.useEffect(() => {
    const timer = setTimeout(() => {
      router.get('/admin/learner/lessons', { search, level: filters.level }, { preserveState: true, preserveScroll: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  function destroy(id) {
    if (!confirm('এই লেসনটি স্থায়ীভাবে মুছে যাবে। আপনি কি নিশ্চিত?')) return;
    deleteForm.delete(`/admin/learner/lessons/${id}`, { preserveScroll: true });
  }

  return (
    <AdminShell title="Lessons">
      <Head title="Lessons" />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">Lessons</h1>
          <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">
            লেসন সিঁড়ি — level → unit → ordered lessons (A1–B1)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/learner/lessons/create">
            <Plus className="mr-1.5 size-4" /> New Lesson
          </Link>
        </Button>
      </div>

      <div className="rounded-3xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))]">
        <div className="flex flex-wrap items-center gap-2 border-b border-[hsl(var(--border))] p-4">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lessons…"
              className="pl-9"
            />
          </div>
          <div className="flex gap-1 rounded-xl bg-[hsl(var(--muted))] p-1">
            {['', ...levels].map((lv) => (
              <button
                key={lv || 'all'}
                onClick={() => router.get('/admin/learner/lessons', { search, level: lv }, { preserveState: true, preserveScroll: true })}
                className={
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ' +
                  (filters.level === lv
                    ? 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]')
                }
              >
                {lv || 'All'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] text-left text-xs uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                <th className="px-4 py-3 font-semibold">Lesson</th>
                <th className="px-4 py-3 font-semibold">Level</th>
                <th className="px-4 py-3 font-semibold">Unit</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Exercises</th>
                <th className="px-4 py-3 font-semibold">Minutes</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.data.map((l) => (
                <tr key={l.id} className="border-b border-[hsl(var(--border))]/60 last:border-0 hover:bg-[hsl(var(--muted))]/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/learner/lessons/${l.id}/edit`} className="font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]">
                      {l.title_en}
                    </Link>
                    {l.title_bn && <div className="text-xs text-[hsl(var(--muted-foreground))]">{l.title_bn}</div>}
                  </td>
                  <td className="px-4 py-3"><LevelBadge level={l.level} /></td>
                  <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">Unit {l.unit_no}</td>
                  <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{l.order_index}</td>
                  <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{Array.isArray(l.exercises) ? l.exercises.length : 0}</td>
                  <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{l.estimated_minutes} min</td>
                  <td className="px-4 py-3">
                    <span className={l.is_published ? 'text-emerald-600 dark:text-emerald-400' : 'text-[hsl(var(--muted-foreground))]'}>
                      {l.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/learner/lessons/${l.id}/edit`}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
                        title="Edit"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <button
                        onClick={() => destroy(l.id)}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--destructive))]/10 hover:text-[hsl(var(--destructive))]"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {lessons.data.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-[hsl(var(--muted-foreground))]">
                    কোনো লেসন পাওয়া যায়নি — প্রথমে একটি তৈরি করুন।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[hsl(var(--border))] p-4">
          <Paginator meta={lessons} />
        </div>
      </div>
    </AdminShell>
  );
}
