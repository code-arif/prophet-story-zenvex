import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

import AdminShell from '../../../../layouts/AdminShell';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Field, Select, Toggle, SectionCard, RepeatList, RemoveButton } from '../parts';

export default function AdminVocabEdit({ mode, levels, iconKeys, tintClasses, deck }) {
  const form = useForm({
    slug: deck.slug || '',
    name: deck.name || '',
    icon_key: deck.icon_key || 'home',
    tint_class: deck.tint_class || '',
    level: deck.level || 'A1',
    description: deck.description || '',
    sort_order: deck.sort_order ?? 0,
    is_published: deck.is_published !== false,
    words: (deck.words || []).length ? deck.words : [{ word: '', ipa: '', meaning_bn: '', example_en: '', example_bn: '', level: deck.level || 'A1' }],
  });

  function submit(e) {
    e.preventDefault();
    if (mode === 'create') {
      form.post('/admin/learner/vocabulary');
    } else {
      form.put(`/admin/learner/vocabulary/${deck.id}`);
    }
  }

  const setWord = (i, key, val) => {
    const next = [...form.data.words];
    next[i] = { ...next[i], [key]: val };
    form.setData('words', next);
  };
  const removeWord = (i) => {
    const next = [...form.data.words];
    if (next[i].id) {
      next[i] = { ...next[i], _remove: true };
    } else {
      next.splice(i, 1);
    }
    form.setData('words', next);
  };

  const iconLabels = {
    home: '🏠 Daily life',
    briefcase: '💼 Job',
    graduation: '🎓 Academic',
    plane: '✈️ Travel',
    star: '⭐ Mixed',
    book: '📖 Book',
  };

  return (
    <AdminShell title={mode === 'create' ? 'New Deck' : `Edit — ${deck.name}`}>
      <Head title={mode === 'create' ? 'New Deck' : 'Edit Deck'} />

      <form onSubmit={submit} className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[hsl(var(--foreground))]}">
              {mode === 'create' ? 'New Deck' : 'Edit Deck'}
            </h1>
            <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]}">ভোকাবুলারি স্ক্রিনে ডেক হিসেবে দেখা যাবে</p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={form.processing}>
              {mode === 'create' ? 'Create Deck' : 'Save Changes'}
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/admin/learner/vocabulary">Cancel</Link>
            </Button>
          </div>
        </div>

        <SectionCard title="ডেকের তথ্য">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="নাম *" error={form.errors.name}>
              <Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} placeholder="দৈনন্দিন জীবন" />
            </Field>
            <Field label="Slug" hint="খালি রাখলে নাম থেকে তৈরি হবে">
              <Input value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} placeholder="auto" />
            </Field>
            <Field label="Level">
              <Select value={form.data.level} onChange={(v) => form.setData('level', v)} options={levels} />
            </Field>
            <Field label="Sort order">
              <Input type="number" min={0} value={String(form.data.sort_order)} onChange={(e) => form.setData('sort_order', Number(e.target.value))} />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="আইকন">
              <div className="flex flex-wrap gap-2">
                {iconKeys.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => form.setData('icon_key', key)}
                    className={
                      'rounded-xl border px-3 py-2 text-xs font-medium transition-colors ' +
                      (form.data.icon_key === key
                        ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]'
                        : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]')
                    }
                  >
                    {iconLabels[key] || key}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Tint">
              <div className="flex flex-wrap gap-2">
                {tintClasses.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => form.setData('tint_class', t.value)}
                    className={
                      'rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ' +
                      (form.data.tint_class === t.value
                        ? 'border-[hsl(var(--primary))] ring-2 ring-[hsl(var(--primary))]/30'
                        : 'border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]')
                    }
                  >
                    <span className={`inline-block rounded-full px-2 py-0.5 ${t.value}`}>{t.label}</span>
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <div className="mt-4">
            <Field label="বর্ণনা (বাংলা)">
              <Input value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} placeholder="ডেকের এক-লাইনের বর্ণনা" />
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
          title={`শব্দ (${form.data.words.filter((w) => !w._remove).length}টি)`}
          subtitle="প্রতিটি কার্ডের সামনের অংশ ইংরেজি, পেছনের অংশ বাংলা"
        >
          <div className="space-y-3">
            {(() => {
              let cardNo = 0;
              return form.data.words.map((w, i) => {
                if (w._remove) return null;
                cardNo++;
                return (
                <div key={w.id || `w-${i}`} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                      Card #{cardNo}
                    </span>
                    <RemoveButton onClick={() => removeWord(i)} title="Remove word" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <Field label="Word *">
                      <Input value={w.word} onChange={(e) => setWord(i, 'word', e.target.value)} placeholder="apple" />
                    </Field>
                    <Field label="IPA">
                      <Input value={w.ipa} onChange={(e) => setWord(i, 'ipa', e.target.value)} placeholder="/ˈæp.əl/" />
                    </Field>
                    <Field label="অর্থ (বাংলা)">
                      <Input value={w.meaning_bn} onChange={(e) => setWord(i, 'meaning_bn', e.target.value)} placeholder="আপেল" />
                    </Field>
                    <Field label="Example (EN)">
                      <Input value={w.example_en} onChange={(e) => setWord(i, 'example_en', e.target.value)} placeholder="I ate an apple." />
                    </Field>
                    <Field label="Example (বাংলা)">
                      <Input value={w.example_bn} onChange={(e) => setWord(i, 'example_bn', e.target.value)} placeholder="আমি একটি আপেল খেয়েছি।" />
                    </Field>
                    <Field label="Level">
                      <Select value={w.level} onChange={(v) => setWord(i, 'level', v)} options={levels} />
                    </Field>
                  </div>
                </div>
                );
              });
            })()}
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() =>
                form.setData('words', [
                  ...form.data.words,
                  { word: '', ipa: '', meaning_bn: '', example_en: '', example_bn: '', level: form.data.level },
                ])
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-[hsl(var(--border))] px-3.5 py-2 text-sm font-medium text-[hsl(var(--primary))] transition-colors hover:bg-[hsl(var(--primary))]/5"
            >
              + Add word
            </button>
          </div>
        </SectionCard>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={form.processing}>
            {mode === 'create' ? 'Create Deck' : 'Save Changes'}
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/admin/learner/vocabulary">Cancel</Link>
          </Button>
        </div>
      </form>
    </AdminShell>
  );
}
