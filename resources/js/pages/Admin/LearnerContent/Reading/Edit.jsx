import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

import AdminShell from '../../../../layouts/AdminShell';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Field, TextArea, Select, Toggle, SectionCard, RepeatList, OptionsEditor } from '../parts';

export default function AdminReadingEdit({ mode, levels, passage }) {
  const form = useForm({
    level: passage.level || 'A1',
    title_en: passage.title_en || '',
    summary_bn: passage.summary_bn || '',
    content: passage.content || '',
    glossary: (passage.glossary || []).length ? passage.glossary : [{ token: '', ipa: '', bn: '', exampleEn: '', exampleBn: '' }],
    questions: (passage.questions || []).length ? passage.questions : [{ q: '', options: ['', '', '', ''], answer: 0 }],
    words: passage.words ?? 0,
    minutes: passage.minutes ?? 3,
    sort_order: passage.sort_order ?? 0,
    is_published: passage.is_published !== false,
  });

  function submit(e) {
    e.preventDefault();
    if (mode === 'create') {
      form.post('/admin/learner/reading');
    } else {
      form.put(`/admin/learner/reading/${passage.id}`);
    }
  }

  const setGlossary = (i, key, val) => {
    const next = [...form.data.glossary];
    next[i] = { ...next[i], [key]: val };
    form.setData('glossary', next);
  };
  const setQuestion = (i, key, val) => {
    const next = [...form.data.questions];
    next[i] = { ...next[i], [key]: val };
    form.setData('questions', next);
  };
  const move = (arr, i, d, setter) => {
    const next = [...arr];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setter(next);
  };

  return (
    <AdminShell title={mode === 'create' ? 'New Passage' : `Edit — ${passage.title_en}`}>
      <Head title={mode === 'create' ? 'New Passage' : 'Edit Passage'} />

      <form onSubmit={submit} className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">
              {mode === 'create' ? 'New Passage' : 'Edit Passage'}
            </h1>
            <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">রিডার টেক্সটের শব্দ গ্লোসারির সাথে মিলিয়ে ট্যাপযোগ্য হয়</p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={form.processing}>
              {mode === 'create' ? 'Create Passage' : 'Save Changes'}
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/admin/learner/reading">Cancel</Link>
            </Button>
          </div>
        </div>

        <SectionCard title="মূল তথ্য">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Level">
              <Select value={form.data.level} onChange={(v) => form.setData('level', v)} options={levels} />
            </Field>
            <Field label="Title (English) *" error={form.errors.title_en}>
              <Input value={form.data.title_en} onChange={(e) => form.setData('title_en', e.target.value)} placeholder="A Day in Dhaka" />
            </Field>
            <Field label="Words" hint="খালি রাখলে অটো-গণনা">
              <Input type="number" min={0} value={String(form.data.words)} onChange={(e) => form.setData('words', Number(e.target.value))} />
            </Field>
            <Field label="Minutes">
              <Input type="number" min={1} value={String(form.data.minutes)} onChange={(e) => form.setData('minutes', Number(e.target.value))} />
            </Field>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_180px]">
            <Field label="সারাংশ (বাংলা)">
              <Input value={form.data.summary_bn} onChange={(e) => form.setData('summary_bn', e.target.value)} placeholder="তালিকার জন্য এক-লাইনের সারাংশ" />
            </Field>
            <Field label="Sort order">
              <Input type="number" min={0} value={String(form.data.sort_order)} onChange={(e) => form.setData('sort_order', Number(e.target.value))} />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="টেক্সট (English) *" error={form.errors.content} hint="যে শব্দগুলো গ্লোসারিতে আছে সেগুলো রিডারে ট্যাপযোগ্য হবে">
              <TextArea
                value={form.data.content}
                onChange={(e) => form.setData('content', e.target.value)}
                placeholder="The full passage text…"
                className="min-h-[180px] font-mono text-[13px] leading-relaxed"
              />
            </Field>
          </div>

          <div className="mt-5">
            <Toggle
              label={form.data.is_published ? 'Published' : 'Draft'}
              checked={form.data.is_published}
              onChange={(v) => form.setData('is_published', v)}
            />
          </div>
        </SectionCard>

        <SectionCard
          title={`গ্লোসারি (${form.data.glossary.filter((g) => g.token).length}টি শব্দ)`}
          subtitle="টোকেন টেক্সটের শব্দের সাথে হুবহু মিলতে হবে (case-sensitive)"
        >
          <RepeatList
            items={form.data.glossary}
            onAdd={() => form.setData('glossary', [...form.data.glossary, { token: '', ipa: '', bn: '', exampleEn: '', exampleBn: '' }])}
            onRemove={(i) => form.setData('glossary', form.data.glossary.filter((_, idx) => idx !== i))}
            onMove={(i, d) => move(form.data.glossary, i, d, (v) => form.setData('glossary', v))}
            addLabel="Add word"
          >
            {(g, i) => (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Field label="Token *">
                  <Input value={g.token} onChange={(e) => setGlossary(i, 'token', e.target.value)} placeholder="market" className="font-mono" />
                </Field>
                <Field label="IPA">
                  <Input value={g.ipa} onChange={(e) => setGlossary(i, 'ipa', e.target.value)} placeholder="/ˈmɑː.kɪt/" />
                </Field>
                <Field label="অর্থ (বাংলা)">
                  <Input value={g.bn} onChange={(e) => setGlossary(i, 'bn', e.target.value)} placeholder="বাজার" />
                </Field>
                <Field label="Example (EN)">
                  <Input value={g.exampleEn} onChange={(e) => setGlossary(i, 'exampleEn', e.target.value)} placeholder="I buy fish at the market." />
                </Field>
                <Field label="Example (বাংলা)">
                  <Input value={g.exampleBn} onChange={(e) => setGlossary(i, 'exampleBn', e.target.value)} placeholder="আমি বাজারে মাছ কিনি।" />
                </Field>
              </div>
            )}
          </RepeatList>
        </SectionCard>

        <SectionCard
          title={`কম্প্রিহেনশন প্রশ্ন (${form.data.questions.length}টি)`}
          subtitle="সঠিক উত্তরটি রেডিও দিয়ে চিহ্নিত করুন"
        >
          <RepeatList
            items={form.data.questions}
            onAdd={() => form.setData('questions', [...form.data.questions, { q: '', options: ['', '', '', ''], answer: 0 }])}
            onRemove={(i) => form.setData('questions', form.data.questions.filter((_, idx) => idx !== i))}
            onMove={(i, d) => move(form.data.questions, i, d, (v) => form.setData('questions', v))}
            addLabel="Add question"
          >
            {(q, i) => (
              <div className="space-y-3">
                <Field label="প্রশ্ন *">
                  <Input value={q.q} onChange={(e) => setQuestion(i, 'q', e.target.value)} placeholder="Where does the story take place?" />
                </Field>
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
              </div>
            )}
          </RepeatList>
        </SectionCard>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={form.processing}>
            {mode === 'create' ? 'Create Passage' : 'Save Changes'}
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/admin/learner/reading">Cancel</Link>
          </Button>
        </div>
      </form>
    </AdminShell>
  );
}
