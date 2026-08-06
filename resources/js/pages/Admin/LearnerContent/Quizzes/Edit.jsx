import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

import AdminShell from '../../../../layouts/AdminShell';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Field, Select, Toggle, SectionCard, RepeatList, OptionsEditor } from '../parts';

const KIND_LABELS = { quick: 'Quick', topic: 'Topic', level: 'Level' };

export default function AdminQuizEdit({ mode, levels, kinds, quiz }) {
  const form = useForm({
    slug: quiz.slug || '',
    kind: quiz.kind || 'quick',
    title_bn: quiz.title_bn || '',
    description_bn: quiz.description_bn || '',
    topic: quiz.topic || '',
    level: quiz.level || 'A2',
    questions: (quiz.questions || []).length ? quiz.questions : [{ topic: '', q: '', options: ['', '', '', ''], answer: 0, reasonBn: '' }],
    duration_minutes: quiz.duration_minutes ?? 3,
    sort_order: quiz.sort_order ?? 0,
    is_active: quiz.is_active !== false,
  });

  function submit(e) {
    e.preventDefault();
    if (mode === 'create') {
      form.post('/admin/learner/quizzes');
    } else {
      form.put(`/admin/learner/quizzes/${quiz.id}`);
    }
  }

  const setQuestion = (i, key, val) => {
    const next = [...form.data.questions];
    next[i] = { ...next[i], [key]: val };
    form.setData('questions', next);
  };
  const move = (i, d) => {
    const next = [...form.data.questions];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    form.setData('questions', next);
  };

  return (
    <AdminShell title={mode === 'create' ? 'New Quiz' : `Edit — ${quiz.title_bn}`}>
      <Head title={mode === 'create' ? 'New Quiz' : 'Edit Quiz'} />

      <form onSubmit={submit} className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">
              {mode === 'create' ? 'New Quiz' : 'Edit Quiz'}
            </h1>
            <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">কুইজ সেশন ও স্কোরিং এর জন্য প্রশ্নগুলো</p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={form.processing}>
              {mode === 'create' ? 'Create Quiz' : 'Save Changes'}
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/admin/learner/quizzes">Cancel</Link>
            </Button>
          </div>
        </div>

        <SectionCard title="কুইজের তথ্য">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Title (বাংলা) *" error={form.errors.title_bn}>
              <Input value={form.data.title_bn} onChange={(e) => form.setData('title_bn', e.target.value)} placeholder="Tense চ্যালেঞ্জ" />
            </Field>
            <Field label="Kind">
              <Select value={form.data.kind} onChange={(v) => form.setData('kind', v)} options={kinds.map((k) => ({ value: k, label: KIND_LABELS[k] || k }))} />
            </Field>
            <Field label="Topic" hint="যেমন Tense / Article">
              <Input value={form.data.topic} onChange={(e) => form.setData('topic', e.target.value)} placeholder="Tense" />
            </Field>
            <Field label="Level">
              <Select value={form.data.level} onChange={(v) => form.setData('level', v)} options={levels} />
            </Field>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="বর্ণনা (বাংলা)" className="sm:col-span-1">
              <Input value={form.data.description_bn} onChange={(e) => form.setData('description_bn', e.target.value)} placeholder="সংক্ষিপ্ত বর্ণনা" />
            </Field>
            <Field label="Duration (minutes)">
              <Input type="number" min={1} value={String(form.data.duration_minutes)} onChange={(e) => form.setData('duration_minutes', Number(e.target.value))} />
            </Field>
            <Field label="Sort order">
              <Input type="number" min={0} value={String(form.data.sort_order)} onChange={(e) => form.setData('sort_order', Number(e.target.value))} />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Slug" hint="খালি রাখলে নাম থেকে তৈরি হবে">
              <Input value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} placeholder="auto" />
            </Field>
          </div>

          <div className="mt-5">
            <Toggle
              label={form.data.is_active ? 'Active — কুইজ সেন্টারে দেখা যাবে' : 'Hidden'}
              checked={form.data.is_active}
              onChange={(v) => form.setData('is_active', v)}
            />
          </div>
        </SectionCard>

        <SectionCard
          title={`প্রশ্ন (${form.data.questions.length}টি)`}
          subtitle="প্রতিটি প্রশ্নে সঠিক উত্তরটি রেডিও দিয়ে চিহ্নিত করুন"
        >
          <RepeatList
            items={form.data.questions}
            onAdd={() => form.setData('questions', [...form.data.questions, { topic: '', q: '', options: ['', '', '', ''], answer: 0, reasonBn: '' }])}
            onRemove={(i) => form.setData('questions', form.data.questions.filter((_, idx) => idx !== i))}
            onMove={(i, d) => move(i, d)}
            addLabel="Add question"
          >
            {(q, i) => (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
                  <Field label="প্রশ্ন *">
                    <Input value={q.q} onChange={(e) => setQuestion(i, 'q', e.target.value)} placeholder="She ___ to school every day." />
                  </Field>
                  <Field label="Topic (ঐচ্ছিক)">
                    <Input value={q.topic || ''} onChange={(e) => setQuestion(i, 'topic', e.target.value)} placeholder="Tense" />
                  </Field>
                </div>
                <Field label="Options (সঠিক উত্তর চিহ্নিত করুন)">
                  <OptionsEditor
                    options={q.options}
                    answer={q.answer}
                    onChange={(options, answer) => {
                      const next = [...form.data.questions];
                      next[i] = { ...next[i], options, answer };
                      form.setData('questions', next);
                    }}
                  />
                </Field>
                <Field label="ব্যাখ্যা (বাংলা, ঐচ্ছিক)">
                  <Input
                    value={q.reasonBn || ''}
                    onChange={(e) => setQuestion(i, 'reasonBn', e.target.value)}
                    placeholder="উত্তর কেন সঠিক"
                  />
                </Field>
              </div>
            )}
          </RepeatList>
        </SectionCard>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={form.processing}>
            {mode === 'create' ? 'Create Quiz' : 'Save Changes'}
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/admin/learner/quizzes">Cancel</Link>
          </Button>
        </div>
      </form>
    </AdminShell>
  );
}
