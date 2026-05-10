import React, { useState, useCallback, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  Monitor, Tablet, Smartphone,
  Plus, Trash2, ChevronUp, ChevronDown,
  Save, ArrowLeft, Eye, EyeOff,
  Type, AlignLeft, Image, Square, LayoutGrid,
  Minus, Layers, Star, Code2, Layout, AlignCenter,
} from 'lucide-react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

/* ─────────────────────────────────────────────────
   Block definitions
───────────────────────────────────────────────── */
const BLOCK_PALETTE = [
  {
    group: 'Layout',
    items: [
      { type: 'section',   label: 'Section',   icon: Layout,     defaultProps: { paddingY: 'py-8', background: '' } },
      { type: 'container', label: 'Container',  icon: Square,     defaultProps: { maxWidth: 'max-w-4xl', centered: true } },
      { type: 'grid',      label: 'Grid',       icon: LayoutGrid, defaultProps: { cols: '2', gap: 'gap-6' } },
    ],
  },
  {
    group: 'Typography',
    items: [
      { type: 'heading',   label: 'Heading',    icon: Type,       defaultProps: { text: 'Heading Text', level: 'h2', align: 'text-left', size: 'text-3xl', weight: 'font-bold', color: '' } },
      { type: 'paragraph', label: 'Paragraph',  icon: AlignLeft,  defaultProps: { text: 'Enter your paragraph text here.', align: 'text-left', size: 'text-base', color: '' } },
    ],
  },
  {
    group: 'Media',
    items: [
      { type: 'image',     label: 'Image',      icon: Image,      defaultProps: { src: '', alt: '', rounded: 'rounded-lg', width: 'w-full', objectFit: 'object-cover', height: 'h-64' } },
    ],
  },
  {
    group: 'Interactive',
    items: [
      { type: 'button',    label: 'Button',     icon: Star,       defaultProps: { text: 'Click Me', href: '#', variant: 'bg-primary text-primary-foreground', size: 'px-6 py-3', rounded: 'rounded-xl', align: 'text-left' } },
    ],
  },
  {
    group: 'Components',
    items: [
      { type: 'hero',      label: 'Hero',       icon: AlignCenter, defaultProps: { title: 'Hero Title', subtitle: 'Hero subtitle text', background: 'bg-primary', textColor: 'text-primary-foreground', paddingY: 'py-20', align: 'text-center' } },
      { type: 'card',      label: 'Card',       icon: Layers,     defaultProps: { title: 'Card Title', body: 'Card body text goes here.', padding: 'p-6', rounded: 'rounded-2xl', shadow: 'shadow-sm', background: 'bg-card', ring: 'ring-1 ring-[hsl(var(--border))]' } },
      { type: 'spacer',    label: 'Spacer',     icon: Minus,      defaultProps: { height: 'h-8' } },
      { type: 'divider',   label: 'Divider',    icon: Minus,      defaultProps: { color: 'border-[hsl(var(--border))]', thickness: 'border-t' } },
      { type: 'html',      label: 'Custom HTML',icon: Code2,      defaultProps: { code: '<p>Custom HTML here</p>' } },
    ],
  },
  {
    group: 'Dynamic',
    items: [
      { type: 'postLoop',      label: 'Post Loop',     icon: LayoutGrid, defaultProps: { perPage: '6', orderBy: 'latest', cols: 'grid-cols-2', gap: 'gap-4', cardBg: 'bg-card', cardRounded: 'rounded-xl', cardBorder: 'border border-border', cardPadding: 'p-4', imageHeight: 'h-40', showImage: true, showCategory: true, showDate: true, showExcerpt: false, showPagination: true, postTypeId: '', categoryId: '' } },
      { type: 'categoryLoop',  label: 'Category Loop', icon: Layers,     defaultProps: { count: '8', cols: 'grid-cols-2', gap: 'gap-3', cardBg: 'bg-card', cardRounded: 'rounded-xl', cardBorder: 'border border-border', cardPadding: 'p-4', showCount: true, taxonomyId: '' } },
    ],
  },
];

const ALL_BLOCK_DEFAULTS = Object.fromEntries(
  BLOCK_PALETTE.flatMap((g) => g.items).map((b) => [b.type, b.defaultProps])
);

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* ─────────────────────────────────────────────────
   Block Preview (canvas) renderer
───────────────────────────────────────────────── */
function BlockPreview({ block }) {
  const p = block.props || {};
  switch (block.type) {
    case 'heading':
      const Tag = p.level || 'h2';
      return <Tag className={[p.align, p.size, p.weight, p.color].filter(Boolean).join(' ')}>{p.text}</Tag>;
    case 'paragraph':
      return <p className={[p.align, p.size, p.color].filter(Boolean).join(' ')}>{p.text}</p>;
    case 'image':
      return p.src
        ? <img src={p.src} alt={p.alt || ''} className={[p.width, p.height, p.objectFit, p.rounded].filter(Boolean).join(' ')} />
        : <div className={[p.width, p.height, p.rounded, 'bg-[hsl(var(--muted))] flex items-center justify-center text-xs text-[hsl(var(--muted-foreground))]'].filter(Boolean).join(' ')}>Image placeholder</div>;
    case 'button':
      return (
        <div className={p.align}>
          <a href={p.href || '#'} className={[p.variant, p.size, p.rounded, 'inline-block font-medium'].filter(Boolean).join(' ')}>
            {p.text}
          </a>
        </div>
      );
    case 'spacer':
      return <div className={p.height} />;
    case 'divider':
      return <hr className={[p.color, p.thickness].filter(Boolean).join(' ')} />;
    case 'hero':
      return (
        <div className={[p.background, p.paddingY, p.align].filter(Boolean).join(' ')}>
          <div className="max-w-3xl mx-auto px-4">
            <h1 className={['text-4xl font-bold mb-4', p.textColor].filter(Boolean).join(' ')}>{p.title}</h1>
            <p className={['text-lg', p.textColor].filter(Boolean).join(' ')}>{p.subtitle}</p>
          </div>
        </div>
      );
    case 'card':
      return (
        <div className={[p.background, p.padding, p.rounded, p.shadow, p.ring].filter(Boolean).join(' ')}>
          <h3 className="font-semibold text-base mb-2">{p.title}</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{p.body}</p>
        </div>
      );
    case 'section':
      return (
        <div className={[p.paddingY, p.background].filter(Boolean).join(' ')}>
          <div className="text-xs text-[hsl(var(--muted-foreground))] border border-dashed border-[hsl(var(--border))] rounded p-3 text-center">
            Section block (children go here)
          </div>
        </div>
      );
    case 'container':
      return (
        <div className={[p.centered ? 'mx-auto' : '', p.maxWidth].filter(Boolean).join(' ')}>
          <div className="text-xs text-[hsl(var(--muted-foreground))] border border-dashed border-[hsl(var(--border))] rounded p-3 text-center">
            Container block
          </div>
        </div>
      );
    case 'grid':
      return (
        <div className={[`grid grid-cols-${p.cols}`, p.gap].filter(Boolean).join(' ')}>
          {Array.from({ length: Number(p.cols) || 2 }).map((_, i) => (
            <div key={i} className="border border-dashed border-[hsl(var(--border))] rounded p-3 text-xs text-[hsl(var(--muted-foreground))] text-center">
              Col {i + 1}
            </div>
          ))}
        </div>
      );
    case 'html':
      // eslint-disable-next-line react/no-danger
      return <div dangerouslySetInnerHTML={{ __html: p.code || '' }} />;
    case 'postLoop':
      return (
        <div className="border border-dashed border-[hsl(var(--border))] rounded-xl p-4 text-center space-y-1">
          <div className="text-xs font-semibold text-[hsl(var(--primary))]">Post Loop</div>
          <div className="text-xs text-[hsl(var(--muted-foreground))]">
            {p.perPage || 6} posts · {p.cols || 'grid-cols-2'} · order: {p.orderBy || 'latest'}
            {p.postTypeId ? ` · type: ${p.postTypeId}` : ''}
            {p.categoryId ? ` · cat: ${p.categoryId}` : ''}
            {p.showPagination !== false ? ' · paginated' : ''}
          </div>
        </div>
      );
    case 'categoryLoop':
      return (
        <div className="border border-dashed border-[hsl(var(--border))] rounded-xl p-4 text-center space-y-1">
          <div className="text-xs font-semibold text-[hsl(var(--primary))]">Category Loop</div>
          <div className="text-xs text-[hsl(var(--muted-foreground))]">
            {p.count || 8} categories · {p.cols || 'grid-cols-2'}
            {p.taxonomyId ? ` · taxonomy: ${p.taxonomyId}` : ''}
          </div>
        </div>
      );
    default:
      return <div className="text-xs text-[hsl(var(--muted-foreground))]">[{block.type}]</div>;
  }
}

/* ─────────────────────────────────────────────────
   Props Editor panel
───────────────────────────────────────────────── */
function PropsEditor({ block, onChange, postTypes = [], categories = [] }) {
  if (!block) {
    return (
      <div className="p-4 text-sm text-[hsl(var(--muted-foreground))]">
        Select a block on the canvas to edit its properties.
      </div>
    );
  }

  const p = block.props || {};

  function set(key, value) {
    onChange({ ...block, props: { ...p, [key]: value } });
  }

  function Field({ label, propKey, type = 'text', options }) {
    if (options) {
      return (
        <div className="space-y-1">
          <label className="text-xs text-[hsl(var(--muted-foreground))]">{label}</label>
          <select
            value={p[propKey] || ''}
            onChange={(e) => set(propKey, e.target.value)}
            className="block w-full rounded-xl bg-[hsl(var(--background))] px-3 py-2 text-xs ring-1 ring-[hsl(var(--border))]"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      );
    }
    if (type === 'textarea') {
      return (
        <div className="space-y-1">
          <label className="text-xs text-[hsl(var(--muted-foreground))]">{label}</label>
          <textarea
            value={p[propKey] || ''}
            onChange={(e) => set(propKey, e.target.value)}
            rows={4}
            className="block w-full rounded-xl bg-[hsl(var(--background))] px-3 py-2 text-xs ring-1 ring-[hsl(var(--border))]"
          />
        </div>
      );
    }
    return (
      <div className="space-y-1">
        <label className="text-xs text-[hsl(var(--muted-foreground))]">{label}</label>
        <Input
          value={p[propKey] || ''}
          onChange={(e) => set(propKey, e.target.value)}
          className="text-xs h-8"
        />
      </div>
    );
  }

  const renderFields = () => {
    switch (block.type) {
      case 'heading':
        return (
          <>
            <Field label="Text" propKey="text" />
            <Field label="Level" propKey="level" options={[
              { value: 'h1', label: 'H1' }, { value: 'h2', label: 'H2' },
              { value: 'h3', label: 'H3' }, { value: 'h4', label: 'H4' },
            ]} />
            <Field label="Size (Tailwind)" propKey="size" />
            <Field label="Weight (Tailwind)" propKey="weight" />
            <Field label="Align" propKey="align" options={[
              { value: 'text-left', label: 'Left' }, { value: 'text-center', label: 'Center' },
              { value: 'text-right', label: 'Right' },
            ]} />
            <Field label="Color (Tailwind)" propKey="color" />
          </>
        );
      case 'paragraph':
        return (
          <>
            <Field label="Text" propKey="text" type="textarea" />
            <Field label="Size (Tailwind)" propKey="size" />
            <Field label="Align" propKey="align" options={[
              { value: 'text-left', label: 'Left' }, { value: 'text-center', label: 'Center' },
              { value: 'text-right', label: 'Right' },
            ]} />
            <Field label="Color (Tailwind)" propKey="color" />
          </>
        );
      case 'image':
        return (
          <>
            <Field label="Image URL" propKey="src" />
            <Field label="Alt Text" propKey="alt" />
            <Field label="Width (Tailwind)" propKey="width" />
            <Field label="Height (Tailwind)" propKey="height" />
            <Field label="Object Fit" propKey="objectFit" options={[
              { value: 'object-cover', label: 'Cover' }, { value: 'object-contain', label: 'Contain' },
              { value: 'object-fill', label: 'Fill' },
            ]} />
            <Field label="Rounded (Tailwind)" propKey="rounded" />
          </>
        );
      case 'button':
        return (
          <>
            <Field label="Button Text" propKey="text" />
            <Field label="Link URL" propKey="href" />
            <Field label="Variant Classes" propKey="variant" />
            <Field label="Size Classes" propKey="size" />
            <Field label="Rounded (Tailwind)" propKey="rounded" />
            <Field label="Align" propKey="align" options={[
              { value: 'text-left', label: 'Left' }, { value: 'text-center', label: 'Center' },
              { value: 'text-right', label: 'Right' },
            ]} />
          </>
        );
      case 'hero':
        return (
          <>
            <Field label="Title" propKey="title" />
            <Field label="Subtitle" propKey="subtitle" type="textarea" />
            <Field label="Background (Tailwind)" propKey="background" />
            <Field label="Text Color (Tailwind)" propKey="textColor" />
            <Field label="Padding Y (Tailwind)" propKey="paddingY" />
            <Field label="Align" propKey="align" options={[
              { value: 'text-left', label: 'Left' }, { value: 'text-center', label: 'Center' },
              { value: 'text-right', label: 'Right' },
            ]} />
          </>
        );
      case 'card':
        return (
          <>
            <Field label="Title" propKey="title" />
            <Field label="Body Text" propKey="body" type="textarea" />
            <Field label="Padding (Tailwind)" propKey="padding" />
            <Field label="Rounded (Tailwind)" propKey="rounded" />
            <Field label="Shadow (Tailwind)" propKey="shadow" />
            <Field label="Background (Tailwind)" propKey="background" />
            <Field label="Ring/Border (Tailwind)" propKey="ring" />
          </>
        );
      case 'grid':
        return (
          <>
            <Field label="Columns" propKey="cols" options={[
              { value: '1', label: '1 col' }, { value: '2', label: '2 cols' },
              { value: '3', label: '3 cols' }, { value: '4', label: '4 cols' },
            ]} />
            <Field label="Gap (Tailwind)" propKey="gap" />
          </>
        );
      case 'section':
        return (
          <>
            <Field label="Padding Y (Tailwind)" propKey="paddingY" />
            <Field label="Background (Tailwind)" propKey="background" />
          </>
        );
      case 'container':
        return (
          <>
            <Field label="Max Width (Tailwind)" propKey="maxWidth" />
            <Field label="Centered" propKey="centered" options={[
              { value: true, label: 'Yes' }, { value: false, label: 'No' },
            ]} />
          </>
        );
      case 'spacer':
        return <Field label="Height (Tailwind)" propKey="height" />;
      case 'divider':
        return (
          <>
            <Field label="Border Style (Tailwind)" propKey="thickness" />
            <Field label="Color (Tailwind)" propKey="color" />
          </>
        );
      case 'html':
        return <Field label="HTML Code" propKey="code" type="textarea" />;
      case 'postLoop':
        return (
          <>
            <Field label="Posts per page" propKey="perPage" />
            <Field label="Order By" propKey="orderBy" options={[
              { value: 'latest', label: 'Latest' },
              { value: 'oldest', label: 'Oldest' },
              { value: 'popular', label: 'Most Popular' },
            ]} />
            <Field label="Post Type" propKey="postTypeId" options={[
              { value: '', label: '— All types —' },
              ...postTypes.map((pt) => ({ value: String(pt.id), label: pt.name })),
            ]} />
            <Field label="Category" propKey="categoryId" options={[
              { value: '', label: '— All categories —' },
              ...categories.map((c) => ({ value: String(c.id), label: c.name })),
            ]} />
            <Field label="Columns" propKey="cols" options={[
              { value: 'grid-cols-1', label: '1 col' },
              { value: 'grid-cols-2', label: '2 cols' },
              { value: 'grid-cols-3', label: '3 cols' },
              { value: 'grid-cols-4', label: '4 cols' },
            ]} />
            <Field label="Gap (Tailwind)" propKey="gap" />
            <Field label="Show Pagination" propKey="showPagination" options={[
              { value: true, label: 'Yes' }, { value: false, label: 'No' },
            ]} />
            <Field label="Show Image" propKey="showImage" options={[
              { value: true, label: 'Yes' }, { value: false, label: 'No' },
            ]} />
            <Field label="Image Height (Tailwind)" propKey="imageHeight" />
            <Field label="Show Category" propKey="showCategory" options={[
              { value: true, label: 'Yes' }, { value: false, label: 'No' },
            ]} />
            <Field label="Show Date" propKey="showDate" options={[
              { value: true, label: 'Yes' }, { value: false, label: 'No' },
            ]} />
            <Field label="Show Excerpt" propKey="showExcerpt" options={[
              { value: true, label: 'Yes' }, { value: false, label: 'No' },
            ]} />
            <Field label="Card BG (Tailwind)" propKey="cardBg" />
            <Field label="Card Rounded (Tailwind)" propKey="cardRounded" />
            <Field label="Card Border (Tailwind)" propKey="cardBorder" />
            <Field label="Card Padding (Tailwind)" propKey="cardPadding" />
          </>
        );
      case 'categoryLoop':
        return (
          <>
            <Field label="Count" propKey="count" />
            <Field label="Taxonomy" propKey="taxonomyId" options={[
              { value: '', label: '— All taxonomies —' },
              ...postTypes.map((pt) => ({ value: String(pt.id), label: pt.name })),
            ]} />
            <Field label="Columns" propKey="cols" options={[
              { value: 'grid-cols-1', label: '1 col' },
              { value: 'grid-cols-2', label: '2 cols' },
              { value: 'grid-cols-3', label: '3 cols' },
              { value: 'grid-cols-4', label: '4 cols' },
            ]} />
            <Field label="Gap (Tailwind)" propKey="gap" />
            <Field label="Show Post Count" propKey="showCount" options={[
              { value: true, label: 'Yes' }, { value: false, label: 'No' },
            ]} />
            <Field label="Card BG (Tailwind)" propKey="cardBg" />
            <Field label="Card Rounded (Tailwind)" propKey="cardRounded" />
            <Field label="Card Border (Tailwind)" propKey="cardBorder" />
            <Field label="Card Padding (Tailwind)" propKey="cardPadding" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-3 space-y-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))] mb-2">
        {block.type} Properties
      </div>
      {renderFields()}

      {/* Responsive CSS overrides */}
      <ResponsiveOverrides block={block} onChange={onChange} />
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Responsive CSS overrides per block
───────────────────────────────────────────────── */
function ResponsiveOverrides({ block, onChange }) {
  const [tab, setTab] = useState('sm');
  const responsive = block.responsive || {};

  function setClasses(bp, value) {
    onChange({
      ...block,
      responsive: { ...responsive, [bp]: value },
    });
  }

  return (
    <div className="mt-4 rounded-xl ring-1 ring-[hsl(var(--border))] overflow-hidden">
      <div className="flex border-b border-[hsl(var(--border))]">
        {['sm', 'md', 'lg'].map((bp) => (
          <button
            key={bp}
            onClick={() => setTab(bp)}
            className={
              'flex-1 py-1.5 text-xs font-medium transition-colors ' +
              (tab === bp
                ? 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'
                : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]')
            }
          >
            {bp === 'sm' ? '📱 sm' : bp === 'md' ? '📟 md' : '🖥 lg'}
          </button>
        ))}
      </div>
      <div className="p-3 space-y-1">
        <label className="text-xs text-[hsl(var(--muted-foreground))]">
          Additional {tab}: classes
        </label>
        <Input
          value={responsive[tab] || ''}
          onChange={(e) => setClasses(tab, e.target.value)}
          placeholder={`${tab}:hidden ${tab}:text-lg ...`}
          className="text-xs h-8"
        />
        <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
          These classes will be applied at the <strong>{tab}</strong> breakpoint.
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Main Builder page
───────────────────────────────────────────────── */
const BREAKPOINTS = [
  { id: 'desktop', label: 'Desktop', icon: Monitor, canvasClass: 'w-full' },
  { id: 'tablet',  label: 'Tablet',  icon: Tablet,  canvasClass: 'w-[768px]' },
  { id: 'mobile',  label: 'Mobile',  icon: Smartphone, canvasClass: 'w-[390px]' },
];

export default function AdminPageBuilderPage({ page, postTypes = [], categories = [] }) {
  const isEdit = !!page?.id;

  const [title, setTitle] = useState(page?.title || '');
  const [slug, setSlug] = useState(page?.slug || '');
  const [isPublished, setIsPublished] = useState(page?.is_published ?? false);
  const [visibility, setVisibility] = useState(page?.visibility || 'public');
  const [blocks, setBlocks] = useState(page?.builder_data || []);
  const [selectedId, setSelectedId] = useState(null);
  const [breakpoint, setBreakpoint] = useState('desktop');
  const [saving, setSaving] = useState(false);

  const selectedBlock = blocks.find((b) => b.id === selectedId) || null;

  // ── palette click ──
  function addBlock(blockDef) {
    const newBlock = {
      id: uid(),
      type: blockDef.type,
      props: { ...blockDef.defaultProps },
      responsive: { sm: '', md: '', lg: '' },
    };
    setBlocks((prev) => [...prev, newBlock]);
    setSelectedId(newBlock.id);
  }

  // ── update selected block props ──
  const updateBlock = useCallback((updatedBlock) => {
    setBlocks((prev) => prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)));
  }, []);

  // ── delete ──
  function deleteBlock(id) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setSelectedId(null);
  }

  // ── move ──
  function moveBlock(id, dir) {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  // ── save ──
  function save() {
    if (!title.trim()) { alert('Please enter a page title.'); return; }
    setSaving(true);
    const payload = { title, slug, is_published: isPublished, visibility, use_builder: true, builder_data: blocks };
    if (isEdit) {
      router.put(`/admin/page-builder/${page.id}`, payload, {
        onFinish: () => setSaving(false),
      });
    } else {
      router.post('/admin/page-builder', payload, {
        onFinish: () => setSaving(false),
      });
    }
  }

  const bp = BREAKPOINTS.find((b) => b.id === breakpoint);

  return (
    <AdminShell title="Page Builder" noPadding>
      <Head title={isEdit ? `Edit: ${page.title}` : 'New Page — Builder'} />

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3">
        <Button variant="ghost" size="icon" asChild>
          <a href="/admin/page-builder"><ArrowLeft className="size-4" /></a>
        </Button>

        <div className="flex-1 flex items-center gap-3 min-w-0">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Page title..."
            className="max-w-xs h-8 text-sm"
          />
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="page-slug"
            className="max-w-50 h-8 text-xs"
          />
        </div>

        {/* Breakpoint switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-[hsl(var(--muted))] p-1">
          {BREAKPOINTS.map((bp) => (
            <button
              key={bp.id}
              onClick={() => setBreakpoint(bp.id)}
              title={bp.label}
              className={
                'rounded-lg p-1.5 transition-colors ' +
                (breakpoint === bp.id
                  ? 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-sm'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]')
              }
            >
              <bp.icon className="size-4" />
            </button>
          ))}
        </div>

        {/* Published toggle */}
        <button
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

        {/* Visibility selector */}
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

        <Button size="sm" onClick={save} disabled={saving}>
          <Save className="mr-1.5 size-3.5" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {/* ── Three-column layout ── */}
      <div className="flex h-[calc(100vh-112px)] overflow-hidden">

        {/* Left sidebar — Component palette */}
        <div className="w-56 shrink-0 overflow-y-auto border-r border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
            Components
          </div>
          {BLOCK_PALETTE.map((group) => (
            <div key={group.group} className="mb-2">
              <div className="px-3 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))]">
                {group.group}
              </div>
              <div className="space-y-0.5 px-2">
                {group.items.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addBlock(item)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                  >
                    <item.icon className="size-3.5 shrink-0 text-[hsl(var(--muted-foreground))]" />
                    {item.label}
                    <Plus className="ml-auto size-3 shrink-0 text-[hsl(var(--muted-foreground))]" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Center — Canvas */}
        <div className="flex-1 overflow-auto bg-[hsl(var(--muted))] p-6">
          <div
            className={
              'mx-auto min-h-full bg-[hsl(var(--background))] shadow-lg ring-1 ring-[hsl(var(--border))] ' +
              bp.canvasClass
            }
          >
            {blocks.length === 0 && (
              <div className="flex h-64 items-center justify-center text-sm text-[hsl(var(--muted-foreground))]">
                Click a component on the left to add it to the canvas.
              </div>
            )}

            {blocks.map((block, idx) => {
              const isSelected = block.id === selectedId;
              return (
                <div
                  key={block.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedId(block.id); }}
                  className={
                    'relative group cursor-pointer transition-all ' +
                    (isSelected ? 'ring-2 ring-[hsl(var(--primary))]' : 'hover:ring-1 hover:ring-[hsl(var(--border))]')
                  }
                >
                  {/* Block controls */}
                  <div className="absolute right-1 top-1 z-10 hidden group-hover:flex items-center gap-0.5 rounded-lg bg-[hsl(var(--card))] p-0.5 shadow ring-1 ring-[hsl(var(--border))]">
                    <button
                      onClick={(e) => { e.stopPropagation(); moveBlock(block.id, -1); }}
                      disabled={idx === 0}
                      className="rounded p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] disabled:opacity-30"
                    >
                      <ChevronUp className="size-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 1); }}
                      disabled={idx === blocks.length - 1}
                      className="rounded p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] disabled:opacity-30"
                    >
                      <ChevronDown className="size-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
                      className="rounded p-1 text-[hsl(var(--destructive))] hover:opacity-80"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>

                  {/* Block type label */}
                  {isSelected && (
                    <div className="absolute left-1 top-1 z-10 rounded bg-[hsl(var(--primary))] px-1.5 py-0.5 text-xs font-medium text-[hsl(var(--primary-foreground))]">
                      {block.type}
                    </div>
                  )}

                  {/* Preview */}
                  <div className="p-2">
                    <BlockPreview block={block} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel — Properties editor */}
        <div className="w-64 shrink-0 overflow-y-auto border-l border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
            Properties
          </div>
          <PropsEditor
            block={selectedBlock}
            onChange={updateBlock}
            postTypes={postTypes}
            categories={categories}
          />
        </div>
      </div>
    </AdminShell>
  );
}
