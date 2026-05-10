import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import MediaPicker from '../../../components/MediaPicker';
import { SBuilder, renderBlocks } from '../../../lib/sbuilder';

export default function AdminPagesEdit({ mode, page, postTypes = [], categories = [], taxonomies = [] }) {
  const isEdit = !!page?.id;

  const [title, setTitle] = useState(page?.title || '');
  const [slug, setSlug] = useState(page?.slug || '');
  const [isPublished, setIsPublished] = useState(page?.is_published ?? false);
  const [visibility, setVisibility] = useState(page?.visibility || 'public');
  const [saving, setSaving] = useState(false);

  // ── Load builder_data; for legacy pages with only content, wrap in html block ──
  const initialBlocks = (() => {
    if (page?.builder_data && Array.isArray(page.builder_data) && page.builder_data.length > 0) {
      return page.builder_data;
    }
    if (page?.content && !page?.use_builder) {
      return [{
        id: Math.random().toString(36).slice(2, 9),
        type: 'html',
        props: { code: page.content },
        responsive: { sm: '', md: '', lg: '' },
      }];
    }
    return [];
  })();

  const blocksRef = useRef(initialBlocks);

  // ── Media picker bridge ──
  const [mediaPicker, setMediaPicker] = useState(false);
  const mediaCallbackRef = useRef(null);

  function openMediaPicker(onSelected) {
    mediaCallbackRef.current = onSelected;
    setMediaPicker(true);
  }

  function handleMediaSelect(file) {
    const url = file.url || `/storage/${file.path}`;
    mediaCallbackRef.current?.(url);
    mediaCallbackRef.current = null;
    setMediaPicker(false);
  }

  // ── Save ──
  function save() {
    if (!title.trim()) { alert('Please enter a page title.'); return; }
    setSaving(true);

    const blocks = blocksRef.current;
    const renderedHtml = renderBlocks(blocks);

    const payload = {
      title,
      slug,
      is_published: isPublished,
      visibility,
      use_builder: true,
      builder_data: blocks,
      content: renderedHtml,
    };

    if (isEdit) {
      router.put(`/admin/pages/${page.id}`, payload, {
        onFinish: () => setSaving(false),
      });
    } else {
      router.post('/admin/pages', payload, {
        onFinish: () => setSaving(false),
      });
    }
  }

  function destroy() {
    if (!page?.id) return;
    if (!confirm('Delete this page?')) return;
    router.delete(`/admin/pages/${page.id}`);
  }

  return (
    <AdminShell title="S Builder" noPadding>
      <Head title={isEdit ? `Edit: ${page.title}` : 'New Page — S Builder'} />

      <div className="flex flex-col" style={{ height: 'calc(100dvh - 56px)' }}>
      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2.5 shrink-0">
        <Button variant="ghost" size="icon" asChild>
          <a href="/admin/pages"><ArrowLeft className="size-4" /></a>
        </Button>

        <div className="flex-1 flex items-center gap-3 min-w-0">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Page title…"
            className="max-w-xs h-8 text-sm"
          />
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="page-slug"
            className="max-w-48 h-8 text-xs"
          />
          <span className="hidden lg:inline text-[10px] text-[hsl(var(--muted-foreground))]">
            /p/{slug || 'slug'}
          </span>
        </div>

        {/* Published toggle */}
        <button
          type="button"
          onClick={() => setIsPublished((v) => !v)}
          className={
            'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium ring-1 transition-colors ' +
            (isPublished
              ? 'bg-emerald-950/40 text-emerald-300 ring-emerald-900/50'
              : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] ring-[hsl(var(--border))]')
          }
        >
          {isPublished ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
          {isPublished ? 'Published' : 'Draft'}
        </button>

        {/* Visibility */}
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="rounded-xl bg-[hsl(var(--muted))] px-2 py-1.5 text-xs text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--border))]"
        >
          <option value="public">🌐 Public</option>
          <option value="private">🔒 Private</option>
          <option value="premium">⭐ Premium</option>
          <option value="draft">📝 Draft</option>
        </select>

        {isEdit && (
          <Button variant="destructive" size="sm" onClick={destroy}>Delete</Button>
        )}

        <Button size="sm" onClick={save} disabled={saving}>
          <Save className="mr-1.5 size-3.5" />
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </div>

      {/* ── S Builder ── */}
      <div className="flex-1 min-h-0">
        <SBuilder
          blocks={initialBlocks}
          onChange={(blocks) => { blocksRef.current = blocks; }}
          onMediaPick={openMediaPicker}
          postTypes={postTypes}
          categories={categories}
          taxonomies={taxonomies}
        />
      </div>
      </div>

      {/* ── Media Picker Modal ── */}
      <MediaPicker
        open={mediaPicker}
        onClose={() => setMediaPicker(false)}
        onSelect={handleMediaSelect}
        accept="image"
        title="Select Image"
      />
    </AdminShell>
  );
}
