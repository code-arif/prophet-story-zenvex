import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

import AdminShell from '../../../../layouts/AdminShell';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Field, TextArea, Select, Toggle, SectionCard, RepeatList, OptionsEditor } from '../parts';

export default function AdminLessonEdit({ mode, levels, lesson }) {
  const form = useForm({
    level: lesson.level || 'A1',
    unit_no: lesson.unit_no ?? 1,
    order_index: lesson.order_index ?? 0,
    title_en: lesson.title_en || '',
    title_bn: lesson.title_bn || '',
    subtitle_bn: lesson.subtitle_bn || '',
    explanation_bn: lesson.explanation_bn || '',
    examples: (lesson.examples || []).length ? lesson.examples : [{ en: '', bn: '' }],
    exercises: (lesson.exercises || []).length ? lesson.exercises : [{ typeBn: 'শূন্যস্থান পূরণ', q: '', options: ['', ''], answer: 0, explanationBn: '' }],
    estimated_minutes: lesson.estimated_minutes ?? 5,
    is_published: lesson.is_published !== false,
  });

  function submit(e) {
    e.preventDefault();
    if (mode === 'create') {
      form.post('/admin/learner/lessons');
    } else {
      form.put(`/admin/learner/lessons/${lesson.id}`);
    }
  }

  const setExample = (i, key, val) => {
    const next = [...form.data.examples];
    next[i] = { ...next[i], [key]: val };
    form.setData('examples', next);
  };
  const setExercise = (i, key, val) => {
    const next = [...form.data.exercises];
    next[i] = { ...next[i], [key]: val };
    form.setData('exercises', next);
  };
  const move = (arr, i, dir, setter) => {
    const next = [...arr];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setter(next);
  };

  return (
    <AdminShell title={mode === 'create' ? 'New Lesson' : `Edit — ${lesson.title_en}`}>
      <Head title={mode === 'create' ? 'New Lesson' : 'Edit Lesson'} />

      <form onSubmit={submit} className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">
              {mode === 'create' ? 'New Lesson' : 'Edit Lesson'}
            </h1>
            <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">লেসন প্লেয়ারে যা দেখানো হবে</p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={form.processing}>
              {mode === 'create' ? 'Create Lesson' : 'Save Changes'}
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/admin/learner/lessons">Cancel</Link>
            </Button>
          </div>
        </div>

        <SectionCard title="মূল তথ্য">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Level" error={form.errors.level}>
              <Select value={form.data.level} onChange={(v) => form.setData('level', v)} options={levels} />
            </Field>
            <Field label="Unit number" error={form.errors.unit_no}>
              <Input type="number" min={1} value={String(form.data.unit_no)} onChange={(e) => form.setData('unit_no', Number(e.target.value))} />
            </Field>
            <Field label="Order inside unit">
              <Input type="number" min={0} value={String(form.data.order_index)} onChange={(e) => form.setData('order_index', Number(e.target.value))} />
            </Field>
            <Field label="Minutes" error={form.errors.estimated_minutes}>
              <Input type="number" min={1} value={String(form.data.estimated_minutes)} onChange={(e) => form.setData('estimated_minutes', Number(e.target.value))} />
            </Field>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Title (English) *" error={form.errors.title_en}>
              <Input value={form.data.title_en} onChange={(e) => form.setData('title_en', e.target.value)} placeholder="e.g. Past Simple" />
            </Field>
            <Field label="Title (বাংলা)">
              <Input value={form.data.title_bn} onChange={(e) => form.setData('title_bn', e.target.value)} placeholder="e.g. অতীত কাল" />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Subtitle (বাংলা)">
              <Input value={form.data.subtitle_bn} onChange={(e) => form.setData('subtitle_bn', e.target.value)} placeholder="এক লাইনের পরিচিতি" />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Explanation (বাংলা) *" error={form.errors.explanation_bn}>
              <TextArea
                value={form.data.explanation_bn}
                onChange={(e) => form.setData('explanation_bn', e.target.value)}
                placeholder="নিয়মটি সহজ বাংলায় ব্যাখ্যা করুন…"
                className="min-h-[140px]"
              />
            </Field>
          </div>

          <div className="mt-5">
            <Toggle
              label={form.data.is_published ? 'Published — লেসনে দেখা যাবে' : 'Draft — লুকানো'}
              checked={form.data.is_published}
              onChange={(v) => form.setData('is_published', v)}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="উদাহরণ (Examples)"
          subtitle="শিক্ষার্থীকে দেখানোর জন্য EN + BN জোড়া"
          right={<span className="text-xs text-[hsl(var(--muted-foreground))]">{form.data.examples.length}টি</span>}
        >
          <RepeatList
            items={form.data.examples}
            onAdd={() => form.setData('examples', [...form.data.examples, { en: '', bn: '' }])}
            onRemove={(i) => form.setData('examples', form.data.examples.filter((_, idx) => idx !== i))}
            onMove={(i, d) => move(form.data.examples, i, d, (v) => form.setData('examples', v))}
            addLabel="Add example"
          >
            {(ex, i) => (
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="English">
                  <Input value={ex.en} onChange={(e) => setExample(i, 'en', e.target.value)} placeholder="I am a student." />
                </Field>
                <Field label="বাংলা">
                  <Input value={ex.bn} onChange={(e) => setExample(i, 'bn', e.target.value)} placeholder="আমি একজন শিক্ষার্থী।" />
                </Field>
              </div>
            )}
          </RepeatList>
        </SectionCard>

        <SectionCard
          title="ব্যায়াম (Exercises)"
          subtitle="প্রতিটি ব্যায়ামে সঠিক উত্তরটি রেডিও দিয়ে চিহ্নিত করুন"
          right={<span className="text-xs text-[hsl(var(--muted-foreground))]">{form.data.exercises.length}টি</span>}
        >
          <RepeatList
            items={form.data.exercises}
            onAdd={() => form.setData('exercises', [...form.data.exercises, { typeBn: 'শূন্যস্থান পূরণ', q: '', options: ['', ''], answer: 0, explanationBn: '' }])}
            onRemove={(i) => form.setData('exercises', form.data.exercises.filter((_, idx) => idx !== i))}
            onMove={(i, d) => move(form.data.exercises, i, d, (v) => form.setData('exercises', v))}
            addLabel="Add exercise"
          >
            {(ex, i) => (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
                  <Field label="প্রশ্ন *">
                    <Input value={ex.q} onChange={(e) => setExercise(i, 'q', e.target.value)} placeholder="I ___ a teacher." />
                  </Field>
                  <Field label="ধরন">
                    <Input value={ex.typeBn} onChange={(e) => setExercise(i, 'typeBn', e.target.value)} placeholder="শূন্যস্থান পূরণ" />
                  </Field>
                </div>
                <Field label="Options (সঠিক উত্তর চিহ্নিত করুন)">
                  <OptionsEditor
                    options={ex.options}
                    answer={ex.answer}
                    onChange={(options, answer) => {
                      const next = [...form.data.exercises];
                      next[i] = { ...next[i], options, answer };
                      form.setData('exercises', next);
                    }}
                  />
                </Field>
                <Field label="ব্যাখ্যা (বাংলা)">
                  <Input
                    value={ex.explanationBn || ''}
                    onChange={(e) => setExercise(i, 'explanationBn', e.target.value)}
                    placeholder="উত্তর ভুল হলে কী দেখানো হবে"
                  />
                </Field>
              </div>
            )}
          </RepeatList>
        </SectionCard>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={form.processing}>
            {mode === 'create' ? 'Create Lesson' : 'Save Changes'}
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/admin/learner/lessons">Cancel</Link>
          </Button>
        </div>
      </form>
    </AdminShell>
  );
}
