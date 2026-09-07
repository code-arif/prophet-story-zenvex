import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';

export default function AdminStoryChaptersEdit({ mode, chapter, prophets }) {
  const form = useForm({
    prophet_id: chapter?.prophet_id ?? '',
    chapter_number: chapter?.chapter_number ?? 1,
    title: chapter?.title || '',
    content_standard: chapter?.content_standard || '',
    content_kid_friendly: chapter?.content_kid_friendly || '',
    illustration_path: chapter?.illustration_path || '',
    audio_path: chapter?.audio_path || '',
    audio: null,
    remove_audio: false,
    moral_lesson: chapter?.moral_lesson || '',
    source_reference: chapter?.source_reference || '',
    save_and_add: false,
  });

  const isEdit = mode === 'edit';

  function submit(saveAndAdd = false) {
    if (saveAndAdd) {
      form.setData('save_and_add', true);
    }
    if (isEdit) {
      form.put(`/admin/story-chapters/${chapter.id}`);
    } else {
      form.post('/admin/story-chapters');
    }
  }

  return (
    <AdminShell title={isEdit ? 'Edit Chapter' : 'New Chapter'}>
      <Head title={isEdit ? 'Edit Chapter' : 'New Chapter'} />

      <form onSubmit={(e) => { e.preventDefault(); submit(false); }} className="space-y-4">
        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Prophet *</label>
              <select
                value={String(form.data.prophet_id)}
                onChange={(e) => form.setData('prophet_id', e.target.value ? Number(e.target.value) : '')}
                className="h-11 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-base"
              >
                <option value="">— Choose a Prophet —</option>
                {(prophets || []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}{p.name_arabic ? ` (${p.name_arabic})` : ''}
                  </option>
                ))}
              </select>
              {form.errors.prophet_id ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.prophet_id}</div> : null}
            </div>

            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Chapter number *</label>
              <Input
                type="number"
                min="1"
                max="9999"
                value={String(form.data.chapter_number)}
                onChange={(e) => form.setData('chapter_number', e.target.value)}
              />
              {form.errors.chapter_number ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.chapter_number}</div> : null}
            </div>

            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Title *</label>
              <Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} placeholder="The Ark and the Flood" />
              {form.errors.title ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.title}</div> : null}
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Content — standard / adult reading mode *</label>
            <Textarea
              rows={8}
              value={form.data.content_standard}
              onChange={(e) => form.setData('content_standard', e.target.value)}
              placeholder="Full account of the chapter from authentic sources…"
            />
            {form.errors.content_standard ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.content_standard}</div> : null}
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Content — kid-friendly version *</label>
            <Textarea
              rows={6}
              value={form.data.content_kid_friendly}
              onChange={(e) => form.setData('content_kid_friendly', e.target.value)}
              placeholder="Simplified, gentler language for the illustrated kid mode…"
            />
            <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">A simplified retelling in gentle language for kid mode.</p>
            {form.errors.content_kid_friendly ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.content_kid_friendly}</div> : null}
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Illustration path (kid mode)</label>
            <Input value={form.data.illustration_path} onChange={(e) => form.setData('illustration_path', e.target.value)} placeholder="/storage/chapters/nuh-ark.png" />
            {form.errors.illustration_path ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.illustration_path}</div> : null}
          </div>

          {/* Narrated audio: upload a file or paste a path/URL */}
          <div className="mt-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)] p-4">
            <label className="mb-2 block text-sm font-semibold">Narrated audio</label>

            {isEdit && chapter?.audio_url && (
              <div className="mb-3">
                <audio controls src={chapter.audio_url} className="w-full" preload="none" />
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                  <input
                    type="checkbox"
                    checked={!!form.data.remove_audio}
                    onChange={(e) => form.setData('remove_audio', e.target.checked)}
                  />
                  Remove current audio
                </label>
              </div>
            )}

            <label className="mb-1 block text-xs text-[hsl(var(--muted-foreground))]">Upload audio file (mp3/ogg/m4a … up to 25 MB)</label>
            <input
              type="file"
              accept="audio/*,.mp3,.ogg,.wav,.m4a,.aac,.oga,.opus,.webm"
              onChange={(e) => form.setData('audio', e.target.files?.[0] || null)}
              className="block w-full text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-[hsl(var(--primary))] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-[hsl(var(--primary-foreground))]"
            />
            {form.data.audio && (
              <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                Will replace any current audio with “{form.data.audio.name}”.
              </p>
            )}
            {form.errors.audio ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.audio}</div> : null}

            <label className="mb-1 mt-3 block text-xs text-[hsl(var(--muted-foreground))]">…or paste an audio path / URL</label>
            <Input value={form.data.audio_path} onChange={(e) => form.setData('audio_path', e.target.value)} placeholder="/storage/chapter-audio/nuh-ark.mp3 or https://…" />
            {form.errors.audio_path ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.audio_path}</div> : null}
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Moral lesson — "what we learn from this" *</label>
            <Textarea
              rows={3}
              value={form.data.moral_lesson}
              onChange={(e) => form.setData('moral_lesson', e.target.value)}
              placeholder="Shown at the end of the chapter…"
            />
            {form.errors.moral_lesson ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.moral_lesson}</div> : null}
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Source reference *</label>
            <Textarea
              rows={2}
              value={form.data.source_reference}
              onChange={(e) => form.setData('source_reference', e.target.value)}
              placeholder="e.g. Qur'an 11:25–49; Sahih al-Bukhari 3340"
            />
            <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
              Required citation for this account — the basis of content trust in this app.
            </p>
            {form.errors.source_reference ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.source_reference}</div> : null}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button disabled={form.processing}>{form.processing ? 'Saving…' : 'Save'}</Button>
            {!isEdit && (
              <Button
                variant="secondary"
                type="button"
                disabled={form.processing}
                onClick={() => submit(true)}
              >
                Save & Add Another Chapter
              </Button>
            )}
            <Button variant="ghost" asChild>
              <Link href="/admin/story-chapters">Back</Link>
            </Button>
          </div>
        </div>
      </form>
    </AdminShell>
  );
}