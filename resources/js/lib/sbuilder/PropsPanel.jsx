/**
 * S Builder — Props Panel
 * Right sidebar property editor with visual preset dropdowns.
 */
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Input } from '../../components/ui/input';
import { Monitor, Tablet, Smartphone, Plus, Trash2 } from 'lucide-react';

const TinyMCEEditor = lazy(() => import('../../components/TinyMCEEditor'));

/* ─── Style Presets ───────────────────────────── */
const P = {
  fontSize: [
    { v: 'text-xs', l: 'XS' }, { v: 'text-sm', l: 'SM' }, { v: 'text-base', l: 'Base' },
    { v: 'text-lg', l: 'LG' }, { v: 'text-xl', l: 'XL' }, { v: 'text-2xl', l: '2XL' },
    { v: 'text-3xl', l: '3XL' }, { v: 'text-4xl', l: '4XL' }, { v: 'text-5xl', l: '5XL' },
  ],
  fontWeight: [
    { v: 'font-normal', l: 'Normal' }, { v: 'font-medium', l: 'Medium' },
    { v: 'font-semibold', l: 'Semibold' }, { v: 'font-bold', l: 'Bold' },
    { v: 'font-extrabold', l: 'Extra Bold' },
  ],
  textAlign: [
    { v: 'text-left', l: '← Left' }, { v: 'text-center', l: '↔ Center' },
    { v: 'text-right', l: '→ Right' },
  ],
  color: [
    { v: '', l: 'Default' }, { v: 'text-primary', l: '● Primary' },
    { v: 'text-foreground', l: '● Foreground' }, { v: 'text-muted-foreground', l: '● Muted' },
    { v: 'text-primary-foreground', l: '● Primary FG' }, { v: 'text-white', l: '○ White' },
  ],
  bgType: [
    { v: 'none', l: 'None' }, { v: 'color', l: 'Solid Color' },
    { v: 'gradient', l: 'Gradient' }, { v: 'image', l: 'Image' },
  ],
  bgColorPreset: [
    { v: '', l: 'Custom…' }, { v: 'bg-primary', l: '● Primary' },
    { v: 'bg-card', l: '● Card' }, { v: 'bg-muted', l: '● Muted' },
    { v: 'bg-background', l: '● Background' }, { v: 'bg-foreground', l: '● Foreground' },
    { v: 'bg-destructive', l: '● Destructive' },
  ],
  bgGradientDir: [
    { v: 'to-r', l: '→ Right' }, { v: 'to-l', l: '← Left' },
    { v: 'to-t', l: '↑ Up' }, { v: 'to-b', l: '↓ Down' },
    { v: 'to-br', l: '↘ Bottom Right' }, { v: 'to-bl', l: '↙ Bottom Left' },
    { v: 'to-tr', l: '↗ Top Right' }, { v: 'to-tl', l: '↖ Top Left' },
  ],
  bgPosition: [
    { v: 'center', l: 'Center' }, { v: 'top', l: 'Top' }, { v: 'bottom', l: 'Bottom' },
    { v: 'left', l: 'Left' }, { v: 'right', l: 'Right' },
    { v: 'left top', l: 'Top Left' }, { v: 'right top', l: 'Top Right' },
    { v: 'left bottom', l: 'Bottom Left' }, { v: 'right bottom', l: 'Bottom Right' },
  ],
  bgSize: [
    { v: 'cover', l: 'Cover' }, { v: 'contain', l: 'Contain' }, { v: 'auto', l: 'Auto' },
  ],
  overlayOpacity: [
    { v: '0', l: '0%' }, { v: '10', l: '10%' }, { v: '20', l: '20%' },
    { v: '30', l: '30%' }, { v: '40', l: '40%' }, { v: '50', l: '50%' },
    { v: '60', l: '60%' }, { v: '70', l: '70%' }, { v: '80', l: '80%' },
    { v: '90', l: '90%' },
  ],
  paddingY: [
    { v: '', l: 'None' }, { v: 'py-2', l: '2' }, { v: 'py-4', l: '4' },
    { v: 'py-6', l: '6' }, { v: 'py-8', l: '8' }, { v: 'py-12', l: '12' },
    { v: 'py-16', l: '16' }, { v: 'py-20', l: '20' },
  ],
  padding: [
    { v: '', l: 'None' }, { v: 'p-2', l: '2' }, { v: 'p-3', l: '3' },
    { v: 'p-4', l: '4' }, { v: 'p-6', l: '6' }, { v: 'p-8', l: '8' }, { v: 'p-12', l: '12' },
  ],
  rounded: [
    { v: 'rounded-none', l: 'None' }, { v: 'rounded', l: 'SM' },
    { v: 'rounded-lg', l: 'LG' }, { v: 'rounded-xl', l: 'XL' },
    { v: 'rounded-2xl', l: '2XL' }, { v: 'rounded-3xl', l: '3XL' },
    { v: 'rounded-full', l: 'Full' },
  ],
  shadow: [
    { v: '', l: 'None' }, { v: 'shadow-sm', l: 'SM' }, { v: 'shadow', l: 'MD' },
    { v: 'shadow-lg', l: 'LG' }, { v: 'shadow-xl', l: 'XL' },
  ],
  height: [
    { v: 'h-2', l: '2' }, { v: 'h-4', l: '4' }, { v: 'h-6', l: '6' },
    { v: 'h-8', l: '8' }, { v: 'h-12', l: '12' }, { v: 'h-16', l: '16' },
    { v: 'h-24', l: '24' }, { v: 'h-32', l: '32' }, { v: 'h-48', l: '48' },
    { v: 'h-64', l: '64' }, { v: 'h-auto', l: 'Auto' },
  ],
  objectFit: [
    { v: 'object-cover', l: 'Cover' }, { v: 'object-contain', l: 'Contain' },
    { v: 'object-fill', l: 'Fill' }, { v: 'object-none', l: 'None' },
  ],
  headingLevel: [
    { v: 'h1', l: 'H1' }, { v: 'h2', l: 'H2' }, { v: 'h3', l: 'H3' },
    { v: 'h4', l: 'H4' }, { v: 'h5', l: 'H5' }, { v: 'h6', l: 'H6' },
  ],
  gridCols: [
    { v: '1', l: '1 Column' }, { v: '2', l: '2 Columns' },
    { v: '3', l: '3 Columns' }, { v: '4', l: '4 Columns' },
  ],
  gap: [
    { v: 'gap-1', l: '1' }, { v: 'gap-2', l: '2' }, { v: 'gap-3', l: '3' },
    { v: 'gap-4', l: '4' }, { v: 'gap-6', l: '6' }, { v: 'gap-8', l: '8' },
  ],
  width: [
    { v: 'w-full', l: 'Full' }, { v: 'w-1/2', l: '50%' },
    { v: 'w-1/3', l: '33%' }, { v: 'w-2/3', l: '67%' },
    { v: 'w-auto', l: 'Auto' },
  ],
  lineHeight: [
    { v: '', l: 'Default' }, { v: 'leading-tight', l: 'Tight' },
    { v: 'leading-normal', l: 'Normal' }, { v: 'leading-relaxed', l: 'Relaxed' },
    { v: 'leading-loose', l: 'Loose' },
  ],
  buttonVariant: [
    { v: 'bg-primary text-primary-foreground', l: 'Primary' },
    { v: 'bg-card text-foreground ring-1 ring-[hsl(var(--border))]', l: 'Outline' },
    { v: 'bg-muted text-foreground', l: 'Secondary' },
    { v: 'bg-emerald-600 text-white', l: 'Success' },
    { v: 'bg-red-600 text-white', l: 'Danger' },
  ],
  spacing: [
    { v: 'space-y-1', l: '1' }, { v: 'space-y-2', l: '2' },
    { v: 'space-y-3', l: '3' }, { v: 'space-y-4', l: '4' },
  ],
  border: [
    { v: '', l: 'None' },
    { v: 'ring-1 ring-[hsl(var(--border))]', l: 'Ring' },
    { v: 'border border-border', l: 'Border' },
    { v: 'border-2 border-primary', l: 'Primary Border' },
  ],
  maxWidth: [
    { v: 'max-w-3xl mx-auto', l: '3XL' }, { v: 'max-w-4xl mx-auto', l: '4XL' },
    { v: 'max-w-5xl mx-auto', l: '5XL' }, { v: 'max-w-6xl mx-auto', l: '6XL' },
    { v: 'max-w-7xl mx-auto', l: '7XL' }, { v: '', l: 'Full' },
  ],
  alertType: [
    { v: 'info', l: 'ℹ️ Info' }, { v: 'success', l: '✅ Success' },
    { v: 'warning', l: '⚠️ Warning' }, { v: 'error', l: '❌ Error' },
  ],
  aspectRatio: [
    { v: 'aspect-video', l: '16:9 Video' }, { v: 'aspect-square', l: '1:1 Square' },
    { v: 'aspect-[4/3]', l: '4:3' }, { v: 'aspect-[21/9]', l: '21:9 Cinematic' },
  ],
  alignItems: [
    { v: 'items-start', l: 'Top' }, { v: 'items-center', l: 'Center' },
    { v: 'items-end', l: 'Bottom' }, { v: 'items-stretch', l: 'Stretch' },
  ],
  orderBy: [
    { v: 'latest', l: '↓ Latest First' },
    { v: 'oldest', l: '↑ Oldest First' },
    { v: 'popular', l: '★ Most Popular' },
  ],
  sliderSource: [
    { v: 'manual', l: 'Manual Slides' },
    { v: 'posts', l: 'From Posts / Articles' },
  ],
  loopCols: [
    { v: 'grid-cols-1', l: '1 Column' }, { v: 'grid-cols-2', l: '2 Columns' },
    { v: 'grid-cols-3', l: '3 Columns' }, { v: 'grid-cols-4', l: '4 Columns' },
  ],
};

/* ─── Shared Field Components ─────────────────── */
const selectCls = 'block w-full rounded-xl bg-[hsl(var(--background))] px-3 py-2 text-xs ring-1 ring-[hsl(var(--border))] focus:ring-[hsl(var(--primary))] outline-none';
const labelCls = 'text-[11px] text-[hsl(var(--muted-foreground))] font-medium uppercase tracking-wide';

function Select({ label, value, onChange, options, allowCustom, overridden }) {
  const opts = options.map((o) => (typeof o === 'string' ? { v: o, l: o } : o));
  const isCustom = value && !opts.some((o) => o.v === value);
  const [customMode, setCustomMode] = useState(!!isCustom);
  // Sync when the block selection changes (value becomes a preset again)
  useEffect(() => { setCustomMode(!!isCustom); }, [isCustom]);

  return (
    <div className="space-y-1">
      <label className={labelCls + ' flex items-center gap-1'}>
        {label}
        {overridden && <span className="size-1.5 rounded-full bg-[hsl(var(--primary))] inline-block shrink-0" title="Responsive override active" />}
      </label>
      <select value={customMode ? '__custom__' : (value || '')} onChange={(e) => {
        if (e.target.value === '__custom__') { setCustomMode(true); return; }
        setCustomMode(false);
        onChange(e.target.value);
      }} className={selectCls + (overridden ? ' ring-[hsl(var(--primary))]/60' : '')}>
        {opts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
        {allowCustom && <option value="__custom__">Custom…</option>}
      </select>
      {allowCustom && customMode && (
        <Input value={value || ''} onChange={(e) => onChange(e.target.value)} className="text-xs h-7 mt-1" placeholder="Custom value" />
      )}
    </div>
  );
}

function TextField({ label, value, onChange, multiline, placeholder }) {
  return (
    <div className="space-y-1">
      <label className={labelCls}>{label}</label>
      {multiline ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={selectCls + ' resize-y'}
          placeholder={placeholder}
        />
      ) : (
        <Input value={value || ''} onChange={(e) => onChange(e.target.value)} className="text-xs h-8" placeholder={placeholder} />
      )}
    </div>
  );
}

function ImageField({ label, value, onBrowse }) {
  return (
    <div className="space-y-1">
      <label className={labelCls}>{label}</label>
      <div className="flex gap-1.5">
        <Input value={value || ''} readOnly className="text-xs h-8 flex-1" placeholder="Select image…" />
        <button
          type="button"
          onClick={onBrowse}
          className="shrink-0 rounded-xl bg-[hsl(var(--primary))] px-3 text-xs text-[hsl(var(--primary-foreground))] hover:opacity-90"
        >
          Browse
        </button>
      </div>
      {value && <img src={value} alt="" className="mt-1.5 h-16 w-full rounded-lg object-cover ring-1 ring-[hsl(var(--border))]" />}
    </div>
  );
}

function SectionDivider({ label }) {
  return (
    <div className="pt-3 pb-1 border-t border-[hsl(var(--border))] mt-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">{label}</span>
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  const hex = value && /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000';
  return (
    <div className="space-y-1">
      <label className={labelCls}>{label}</label>
      <div className="flex gap-1.5 items-center">
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          className="size-8 shrink-0 rounded cursor-pointer border-0 p-0.5 bg-transparent"
        />
        <Input value={value || ''} onChange={(e) => onChange(e.target.value)} className="text-xs h-8 flex-1" placeholder="#000000" />
      </div>
    </div>
  );
}

/* ─── Background Controls (Global) ────────────── */
function BackgroundControls({ props: p, set, onMediaPick }) {
  const bgType = p.bgType ?? (p.background ? 'color' : 'none');
  const bgColor = p.bgColor ?? p.background ?? '';

  return (
    <>
      <Select label="Type" value={bgType} onChange={(v) => set('bgType', v)} options={P.bgType} />

      {bgType === 'color' && (
        <>
          <Select label="Preset" value={bgColor} onChange={(v) => set('bgColor', v)} options={P.bgColorPreset} allowCustom />
          <ColorField label="Pick Color" value={bgColor.startsWith('#') ? bgColor : ''} onChange={(v) => set('bgColor', v)} />
        </>
      )}

      {bgType === 'gradient' && (
        <>
          <Select label="Direction" value={p.bgGradientDir || 'to-br'} onChange={(v) => set('bgGradientDir', v)} options={P.bgGradientDir} />
          <ColorField label="From" value={p.bgGradientFrom || '#3b82f6'} onChange={(v) => set('bgGradientFrom', v)} />
          <ColorField label="To" value={p.bgGradientTo || '#8b5cf6'} onChange={(v) => set('bgGradientTo', v)} />
        </>
      )}

      {bgType === 'image' && (
        <>
          <ImageField label="Image" value={p.bgImage} onBrowse={() => onMediaPick?.((url) => set('bgImage', url))} />
          <Select label="Position" value={p.bgPosition || 'center'} onChange={(v) => set('bgPosition', v)} options={P.bgPosition} />
          <Select label="Size" value={p.bgSize || 'cover'} onChange={(v) => set('bgSize', v)} options={P.bgSize} />
          <ColorField label="Overlay Color" value={p.bgOverlayColor || '#000000'} onChange={(v) => set('bgOverlayColor', v)} />
          <Select label="Overlay Opacity" value={String(p.bgOverlayOpacity ?? '50')} onChange={(v) => set('bgOverlayOpacity', v)} options={P.overlayOpacity} />
        </>
      )}
    </>
  );
}

/* ─── Tailwind Autocomplete ──────────────────── */
const TAILWIND_HINTS = [
  // Layout
  'hidden','block','inline','inline-block','flex','inline-flex','grid','inline-grid',
  'items-start','items-end','items-center','items-baseline','items-stretch',
  'justify-start','justify-end','justify-center','justify-between','justify-around','justify-evenly',
  'flex-row','flex-col','flex-wrap','flex-1','flex-auto','flex-none','grow','shrink',
  'overflow-hidden','overflow-auto','overflow-scroll','overflow-visible',
  'overflow-x-hidden','overflow-y-auto','overflow-y-hidden',
  'relative','absolute','fixed','sticky','inset-0','z-0','z-10','z-20','z-30','z-40','z-50',
  // Sizing
  'w-full','w-auto','w-screen','w-fit','w-1/2','w-1/3','w-2/3','w-1/4','w-3/4',
  'w-4','w-6','w-8','w-10','w-12','w-16','w-20','w-24','w-32','w-40','w-48','w-64','w-80','w-96',
  'h-full','h-auto','h-screen','h-fit','h-4','h-6','h-8','h-10','h-12','h-16','h-20','h-24','h-32','h-48','h-64','h-80',
  'min-w-0','min-h-0','min-h-full','min-h-screen',
  'max-w-xs','max-w-sm','max-w-md','max-w-lg','max-w-xl','max-w-2xl','max-w-3xl','max-w-4xl','max-w-5xl','max-w-6xl','max-w-7xl','max-w-full',
  'max-h-48','max-h-64','max-h-96','max-h-full','max-h-screen',
  // Spacing
  'p-0','p-1','p-2','p-3','p-4','p-5','p-6','p-8','p-10','p-12','p-16','p-20',
  'px-0','px-1','px-2','px-3','px-4','px-5','px-6','px-8','px-10','px-12',
  'py-0','py-1','py-2','py-3','py-4','py-5','py-6','py-8','py-10','py-12','py-16','py-20',
  'pt-0','pt-2','pt-4','pt-6','pt-8','pt-10','pr-0','pr-2','pr-4','pr-6','pr-8',
  'pb-0','pb-2','pb-4','pb-6','pb-8','pb-10','pl-0','pl-2','pl-4','pl-5','pl-6','pl-8',
  'm-0','m-1','m-2','m-3','m-4','m-5','m-6','m-8','m-10','m-auto',
  'mx-auto','mx-0','mx-1','mx-2','mx-4','mx-6','mx-8',
  'my-0','my-1','my-2','my-4','my-6','my-8','my-10','my-12','my-auto',
  'mt-0','mt-1','mt-2','mt-3','mt-4','mt-6','mt-8','mt-10','mt-12','mt-16','mt-20',
  'mb-0','mb-1','mb-2','mb-3','mb-4','mb-6','mb-8','mb-10','mb-12','mb-16',
  'ml-0','ml-1','ml-2','ml-4','ml-6','ml-auto','mr-0','mr-1','mr-2','mr-4','mr-6','mr-auto',
  'space-x-1','space-x-2','space-x-3','space-x-4','space-x-6','space-x-8',
  'space-y-0','space-y-1','space-y-2','space-y-3','space-y-4','space-y-6','space-y-8',
  // Typography
  'text-xs','text-sm','text-base','text-lg','text-xl','text-2xl','text-3xl','text-4xl','text-5xl','text-6xl','text-7xl',
  'font-thin','font-light','font-normal','font-medium','font-semibold','font-bold','font-extrabold','font-black',
  'text-left','text-center','text-right','text-justify',
  'leading-none','leading-tight','leading-snug','leading-normal','leading-relaxed','leading-loose',
  'tracking-tighter','tracking-tight','tracking-normal','tracking-wide','tracking-wider','tracking-widest',
  'uppercase','lowercase','capitalize','normal-case',
  'italic','not-italic','underline','line-through','no-underline',
  'truncate','break-words','break-all','whitespace-nowrap','whitespace-pre-wrap',
  'list-none','list-disc','list-decimal',
  // Colors — text
  'text-white','text-black','text-transparent',
  'text-primary','text-foreground','text-muted-foreground','text-primary-foreground','text-destructive',
  'text-slate-400','text-slate-600','text-slate-900',
  'text-gray-400','text-gray-500','text-gray-600','text-gray-700','text-gray-900',
  'text-red-400','text-red-500','text-red-600','text-orange-500','text-amber-500',
  'text-yellow-500','text-yellow-600','text-green-400','text-green-500','text-green-600',
  'text-emerald-500','text-emerald-600','text-teal-500','text-cyan-500',
  'text-sky-500','text-blue-400','text-blue-500','text-blue-600','text-indigo-500',
  'text-violet-500','text-purple-500','text-pink-500','text-rose-500',
  // Colors — background
  'bg-white','bg-black','bg-transparent',
  'bg-primary','bg-card','bg-muted','bg-background','bg-foreground','bg-secondary','bg-accent','bg-destructive',
  'bg-gray-50','bg-gray-100','bg-gray-200','bg-gray-800','bg-gray-900',
  'bg-slate-50','bg-slate-100','bg-slate-800','bg-slate-900',
  'bg-red-50','bg-red-100','bg-red-500','bg-red-600','bg-red-900',
  'bg-orange-50','bg-orange-100','bg-orange-500','bg-amber-50','bg-amber-500',
  'bg-yellow-50','bg-yellow-100','bg-yellow-500','bg-green-50','bg-green-100','bg-green-500','bg-green-600',
  'bg-emerald-50','bg-emerald-500','bg-emerald-600','bg-teal-50','bg-teal-500',
  'bg-cyan-50','bg-cyan-500','bg-sky-50','bg-sky-500',
  'bg-blue-50','bg-blue-100','bg-blue-500','bg-blue-600','bg-blue-900',
  'bg-indigo-50','bg-indigo-500','bg-violet-50','bg-violet-500',
  'bg-purple-50','bg-purple-500','bg-purple-600','bg-pink-50','bg-pink-500','bg-rose-50','bg-rose-500',
  // Borders
  'border','border-0','border-2','border-4','border-x','border-y',
  'border-t','border-r','border-b','border-l','border-t-2','border-b-2',
  'border-solid','border-dashed','border-dotted','border-none',
  'border-transparent','border-white','border-black','border-border','border-primary',
  'border-gray-200','border-gray-300','border-gray-400','border-gray-700',
  'border-red-400','border-green-400','border-blue-400',
  'rounded-none','rounded-sm','rounded','rounded-md','rounded-lg','rounded-xl','rounded-2xl','rounded-3xl','rounded-full',
  'ring-0','ring-1','ring-2','ring-4','ring-8','ring-inset','ring-transparent','ring-border','ring-primary',
  'outline-none','outline','outline-2','outline-offset-2',
  // Shadows
  'shadow-none','shadow-sm','shadow','shadow-md','shadow-lg','shadow-xl','shadow-2xl','shadow-inner',
  // Opacity
  'opacity-0','opacity-10','opacity-20','opacity-25','opacity-30','opacity-40','opacity-50','opacity-60','opacity-70','opacity-75','opacity-80','opacity-90','opacity-100',
  // Background positioning
  'bg-cover','bg-contain','bg-auto','bg-center','bg-top','bg-bottom','bg-left','bg-right',
  'bg-no-repeat','bg-repeat','bg-fixed','bg-local',
  // Grid helpers
  'gap-0','gap-1','gap-2','gap-3','gap-4','gap-5','gap-6','gap-8','gap-10','gap-12',
  'gap-x-2','gap-x-4','gap-x-6','gap-y-2','gap-y-4','gap-y-6',
  'grid-cols-1','grid-cols-2','grid-cols-3','grid-cols-4','grid-cols-6','grid-cols-12',
  'col-span-1','col-span-2','col-span-3','col-span-4','col-span-full',
  'row-span-1','row-span-2','row-span-3',
  // Transitions & animation
  'transition','transition-all','transition-colors','transition-opacity','transition-transform',
  'duration-75','duration-100','duration-150','duration-200','duration-300','duration-500','duration-700',
  'ease-linear','ease-in','ease-out','ease-in-out',
  'animate-none','animate-spin','animate-pulse','animate-bounce','animate-ping',
  // Transforms
  'scale-0','scale-50','scale-75','scale-90','scale-95','scale-100','scale-105','scale-110','scale-125',
  'rotate-0','rotate-45','rotate-90','rotate-180','-rotate-45','-rotate-90',
  'translate-x-0','-translate-x-full','translate-y-0','-translate-y-full',
  // Misc
  'pointer-events-none','pointer-events-auto','select-none','select-text','select-all',
  'cursor-auto','cursor-default','cursor-pointer','cursor-wait','cursor-text','cursor-not-allowed',
  'resize','resize-none','resize-x','resize-y',
  'aspect-auto','aspect-square','aspect-video',
  'object-contain','object-cover','object-fill','object-center','object-top','object-bottom',
  // Hover / Focus
  'hover:opacity-75','hover:opacity-90','hover:scale-105','hover:shadow-lg',
  'hover:bg-muted','hover:bg-primary','hover:text-primary','hover:underline','hover:no-underline',
  'focus:outline-none','focus:ring-2','focus:ring-primary',
  // Responsive prefixes
  'sm:hidden','md:hidden','lg:hidden','sm:block','md:block','lg:block',
  'sm:flex','md:flex','sm:grid','md:grid','sm:flex-col','md:flex-col','sm:flex-row','md:flex-row',
  'sm:text-sm','sm:text-base','sm:text-lg','sm:text-xl','sm:text-2xl','sm:text-3xl',
  'md:text-sm','md:text-base','md:text-lg','md:text-xl','md:text-2xl','md:text-3xl','md:text-4xl',
  'sm:font-normal','sm:font-semibold','sm:font-bold',
  'md:font-normal','md:font-semibold','md:font-bold',
  'sm:text-left','sm:text-center','sm:text-right','md:text-left','md:text-center','md:text-right',
  'sm:grid-cols-1','sm:grid-cols-2','sm:grid-cols-3',
  'md:grid-cols-1','md:grid-cols-2','md:grid-cols-3','md:grid-cols-4',
  'sm:py-4','sm:py-6','sm:py-8','md:py-8','md:py-12','md:py-16','md:py-20',
  'sm:p-2','sm:p-4','md:p-4','md:p-6','md:p-8',
  'sm:w-full','sm:w-1/2','md:w-full','md:w-1/2','md:w-auto',
  'sm:gap-2','sm:gap-4','md:gap-4','md:gap-6','md:gap-8',
];

function TailwindClassInput({ label, value, onChange, overridden }) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const tokens = (value || '').trim().split(/\s+/);
  const lastToken = tokens[tokens.length - 1] || '';

  const suggestions = lastToken.length >= 1
    ? [
        ...TAILWIND_HINTS.filter((c) => c.startsWith(lastToken)),
        ...TAILWIND_HINTS.filter((c) => !c.startsWith(lastToken) && c.includes(lastToken)),
      ].slice(0, 12)
    : [];

  function selectSuggestion(cls) {
    const existing = tokens.slice(0, -1);
    onChange([...existing, cls, ''].join(' ').trimStart());
    setOpen(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <div className="space-y-1 relative">
      <label className={labelCls + ' flex items-center gap-1'}>
        {label}
        {overridden && <span className="size-1.5 rounded-full bg-[hsl(var(--primary))] inline-block shrink-0" />}
      </label>
      <Input
        ref={inputRef}
        value={value || ''}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 160)}
        className="text-xs h-8 font-mono"
        placeholder="flex items-center gap-4 md:text-lg…"
      />
      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 z-[100] mt-0.5 max-h-44 overflow-y-auto rounded-xl bg-[hsl(var(--background))] ring-1 ring-[hsl(var(--border))] shadow-xl">
          {suggestions.map((cls) => (
            <button
              key={cls}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); selectSuggestion(cls); }}
              className="w-full px-3 py-1.5 text-left text-[11px] font-mono hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]"
            >
              {cls}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Feature Grid Item Editor ────────────────── */
function FeatureGridItemsEditor({ items, onChange }) {
  function updateItem(index, key, value) {
    const next = items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    onChange(next);
  }

  function addItem() {
    onChange([...items, { icon: '✨', title: 'New Item', desc: 'Description', href: '' }]);
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={labelCls}>Grid Items</label>
        <button type="button" onClick={addItem} className="rounded-lg bg-[hsl(var(--primary))] p-1 text-[hsl(var(--primary-foreground))]">
          <Plus className="size-3" />
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl bg-[hsl(var(--muted))] p-2.5 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Input value={item.icon || ''} onChange={(e) => updateItem(i, 'icon', e.target.value)} className="text-xs h-7 w-12 text-center" placeholder="🔥" />
            <Input value={item.title || ''} onChange={(e) => updateItem(i, 'title', e.target.value)} className="text-xs h-7 flex-1" placeholder="Title" />
            <button type="button" onClick={() => removeItem(i)} className="text-[hsl(var(--destructive))] p-1 rounded hover:opacity-70">
              <Trash2 className="size-3" />
            </button>
          </div>
          <Input value={item.desc || ''} onChange={(e) => updateItem(i, 'desc', e.target.value)} className="text-xs h-7" placeholder="Description" />
          <Input value={item.href || ''} onChange={(e) => updateItem(i, 'href', e.target.value)} className="text-xs h-7" placeholder="Link URL (optional)" />
        </div>
      ))}
    </div>
  );
}

/* ─── List Items Editor ───────────────────────── */
function ListItemsEditor({ items, onChange }) {
  function updateItem(index, value) {
    const next = items.map((item, i) => (i === index ? value : item));
    onChange(next);
  }
  function addItem() { onChange([...items, 'New item']); }
  function removeItem(index) { onChange(items.filter((_, i) => i !== index)); }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className={labelCls}>List Items</label>
        <button type="button" onClick={addItem} className="rounded-lg bg-[hsl(var(--primary))] p-1 text-[hsl(var(--primary-foreground))]">
          <Plus className="size-3" />
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-1.5">
          <Input value={item} onChange={(e) => updateItem(i, e.target.value)} className="text-xs h-7 flex-1" />
          <button type="button" onClick={() => removeItem(i)} className="text-[hsl(var(--destructive))] p-1 rounded hover:opacity-70">
            <Trash2 className="size-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Slide Items Editor ──────────────────────── */
function SlideItemsEditor({ items, onChange, onMediaPick }) {
  function updateItem(index, key, value) {
    onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }
  function addItem() { onChange([...items, { image: '', title: '', desc: '', href: '' }]); }
  function removeItem(index) { onChange(items.filter((_, i) => i !== index)); }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={labelCls}>Slides</label>
        <button type="button" onClick={addItem} className="rounded-lg bg-[hsl(var(--primary))] p-1 text-[hsl(var(--primary-foreground))]">
          <Plus className="size-3" />
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl bg-[hsl(var(--muted))] p-2 space-y-1.5">
          <div className="flex gap-1.5 items-center">
            <Input value={item.image || ''} readOnly className="text-xs h-7 flex-1" placeholder="Image URL…" />
            <button type="button" onClick={() => onMediaPick?.((url) => updateItem(i, 'image', url))} className="shrink-0 rounded-lg bg-[hsl(var(--primary))] px-2 text-xs text-[hsl(var(--primary-foreground))] h-7">Pick</button>
            <button type="button" onClick={() => removeItem(i)} className="text-[hsl(var(--destructive))] p-1 rounded hover:opacity-70"><Trash2 className="size-3" /></button>
          </div>
          {item.image && <img src={item.image} alt="" className="h-12 w-full rounded object-cover" />}
          <Input value={item.title || ''} onChange={(e) => updateItem(i, 'title', e.target.value)} className="text-xs h-7" placeholder="Title" />
          <Input value={item.desc || ''} onChange={(e) => updateItem(i, 'desc', e.target.value)} className="text-xs h-7" placeholder="Description (optional)" />
          <Input value={item.href || ''} onChange={(e) => updateItem(i, 'href', e.target.value)} className="text-xs h-7" placeholder="Link URL (optional)" />
        </div>
      ))}
    </div>
  );
}

/* ─── Gallery Items Editor ────────────────────── */
function GalleryItemsEditor({ items, onChange, onMediaPick }) {
  function updateItem(index, key, value) {
    onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }
  function addItem() { onChange([...items, { src: '', alt: '' }]); }
  function removeItem(index) { onChange(items.filter((_, i) => i !== index)); }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={labelCls}>Images</label>
        <button type="button" onClick={addItem} className="rounded-lg bg-[hsl(var(--primary))] p-1 text-[hsl(var(--primary-foreground))]">
          <Plus className="size-3" />
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl bg-[hsl(var(--muted))] p-2 space-y-1.5">
          <div className="flex gap-1.5 items-center">
            <Input value={item.src || ''} readOnly className="text-xs h-7 flex-1" placeholder="Image URL…" />
            <button type="button" onClick={() => onMediaPick?.((url) => updateItem(i, 'src', url))} className="shrink-0 rounded-lg bg-[hsl(var(--primary))] px-2 text-xs text-[hsl(var(--primary-foreground))] h-7">Pick</button>
            <button type="button" onClick={() => removeItem(i)} className="text-[hsl(var(--destructive))] p-1 rounded hover:opacity-70"><Trash2 className="size-3" /></button>
          </div>
          <Input value={item.alt || ''} onChange={(e) => updateItem(i, 'alt', e.target.value)} className="text-xs h-7" placeholder="Alt text" />
          {item.src && <img src={item.src} alt="" className="h-12 w-full rounded object-cover" />}
        </div>
      ))}
    </div>
  );
}

/* ─── Stats Items Editor ──────────────────────── */
function StatsItemsEditor({ items, onChange }) {
  function updateItem(index, key, value) {
    onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }
  function addItem() { onChange([...items, { value: '0', label: 'Label' }]); }
  function removeItem(index) { onChange(items.filter((_, i) => i !== index)); }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className={labelCls}>Stats Items</label>
        <button type="button" onClick={addItem} className="rounded-lg bg-[hsl(var(--primary))] p-1 text-[hsl(var(--primary-foreground))]"><Plus className="size-3" /></button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-1.5 items-center">
          <Input value={item.value || ''} onChange={(e) => updateItem(i, 'value', e.target.value)} className="text-xs h-7 w-16 text-center font-bold" placeholder="99%" />
          <Input value={item.label || ''} onChange={(e) => updateItem(i, 'label', e.target.value)} className="text-xs h-7 flex-1" placeholder="Label" />
          <button type="button" onClick={() => removeItem(i)} className="text-[hsl(var(--destructive))] p-1 rounded hover:opacity-70"><Trash2 className="size-3" /></button>
        </div>
      ))}
    </div>
  );
}

/* ─── Accordion Items Editor ──────────────────── */
function AccordionItemsEditor({ items, onChange }) {
  function updateItem(index, key, value) {
    onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }
  function addItem() { onChange([...items, { question: 'New Question?', answer: 'Answer goes here.' }]); }
  function removeItem(index) { onChange(items.filter((_, i) => i !== index)); }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={labelCls}>Items</label>
        <button type="button" onClick={addItem} className="rounded-lg bg-[hsl(var(--primary))] p-1 text-[hsl(var(--primary-foreground))]"><Plus className="size-3" /></button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl bg-[hsl(var(--muted))] p-2 space-y-1.5">
          <div className="flex gap-1.5">
            <Input value={item.question || ''} onChange={(e) => updateItem(i, 'question', e.target.value)} className="text-xs h-7 flex-1" placeholder="Question" />
            <button type="button" onClick={() => removeItem(i)} className="text-[hsl(var(--destructive))] p-1 rounded hover:opacity-70"><Trash2 className="size-3" /></button>
          </div>
          <textarea value={item.answer || ''} onChange={(e) => updateItem(i, 'answer', e.target.value)} rows={2} className="block w-full rounded-xl bg-[hsl(var(--background))] px-3 py-2 text-xs ring-1 ring-[hsl(var(--border))] resize-y" placeholder="Answer" />
        </div>
      ))}
    </div>
  );
}

/* ─── Tabs Items Editor ───────────────────────── */
function TabsItemsEditor({ items, onChange }) {
  function updateItem(index, key, value) {
    onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }
  function addItem() { onChange([...items, { label: 'New Tab', content: 'Tab content here.' }]); }
  function removeItem(index) { onChange(items.filter((_, i) => i !== index)); }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={labelCls}>Tabs</label>
        <button type="button" onClick={addItem} className="rounded-lg bg-[hsl(var(--primary))] p-1 text-[hsl(var(--primary-foreground))]"><Plus className="size-3" /></button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl bg-[hsl(var(--muted))] p-2 space-y-1.5">
          <div className="flex gap-1.5">
            <Input value={item.label || ''} onChange={(e) => updateItem(i, 'label', e.target.value)} className="text-xs h-7 flex-1" placeholder="Tab Label" />
            <button type="button" onClick={() => removeItem(i)} className="text-[hsl(var(--destructive))] p-1 rounded hover:opacity-70"><Trash2 className="size-3" /></button>
          </div>
          <textarea value={item.content || ''} onChange={(e) => updateItem(i, 'content', e.target.value)} rows={2} className="block w-full rounded-xl bg-[hsl(var(--background))] px-3 py-2 text-xs ring-1 ring-[hsl(var(--border))] resize-y" placeholder="Content" />
        </div>
      ))}
    </div>
  );
}

/* ─── Main PropsPanel ─────────────────────────── */
const BREAKPOINTS = [
  { id: 'desktop', icon: Monitor },
  { id: 'md', icon: Tablet },
  { id: 'sm', icon: Smartphone },
];

export default function PropsPanel({ block, onChange, onMediaPick, postTypes = [], categories = [], taxonomies = [] }) {
  const [bp, setBp] = useState('desktop');

  if (!block) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-xs text-[hsl(var(--muted-foreground))]">
        Select a block on the canvas to edit its properties.
      </div>
    );
  }

  const desktop = block.props || {};
  const bpOverrides = bp !== 'desktop'
    ? (block.responsive?.[bp] != null && typeof block.responsive[bp] === 'object' ? block.responsive[bp] : {})
    : {};
  const p = bp === 'desktop' ? desktop : { ...desktop, ...bpOverrides };

  const postTypeOptions = [{ v: '', l: 'All Post Types' }, ...postTypes.map(pt => ({ v: String(pt.id), l: pt.name }))];
  const categoryOptions = [{ v: '', l: 'All Categories' }, ...categories.map(c => ({ v: String(c.id), l: c.name }))];
  const taxonomyOptions = [{ v: '', l: 'All Taxonomies' }, ...taxonomies.map(t => ({ v: String(t.id), l: t.name }))];

  function set(key, value) {
    if (bp === 'desktop') {
      onChange({ ...block, props: { ...desktop, [key]: value } });
    } else {
      const resp = block.responsive || {};
      const cur = resp[bp] != null && typeof resp[bp] === 'object' ? resp[bp] : {};
      onChange({ ...block, responsive: { ...resp, [bp]: { ...cur, [key]: value } } });
    }
  }

  function hasOverride(key) {
    return bp !== 'desktop' && key in bpOverrides;
  }

  function bpHasData(id) {
    const val = block.responsive?.[id];
    return typeof val === 'object' && Object.keys(val || {}).length > 0;
  }

  function renderFields() {
    switch (block.type) {
      case 'heading':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Content" />
              <TextField label="Text" value={p.text} onChange={(v) => set('text', v)} />
              <Select label="Level" value={p.level} onChange={(v) => set('level', v)} options={P.headingLevel} />
            </>}
            <SectionDivider label="Style" />
            <Select label="Font Size" value={p.size} onChange={(v) => set('size', v)} options={P.fontSize} overridden={hasOverride('size')} />
            <Select label="Font Weight" value={p.weight} onChange={(v) => set('weight', v)} options={P.fontWeight} overridden={hasOverride('weight')} />
            <Select label="Align" value={p.align} onChange={(v) => set('align', v)} options={P.textAlign} overridden={hasOverride('align')} />
            <Select label="Color" value={p.color} onChange={(v) => set('color', v)} options={P.color} allowCustom overridden={hasOverride('color')} />
          </>
        );

      case 'paragraph':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Content" />
              <TextField label="Text" value={p.text} onChange={(v) => set('text', v)} multiline />
            </>}
            <SectionDivider label="Style" />
            <Select label="Font Size" value={p.size} onChange={(v) => set('size', v)} options={P.fontSize} overridden={hasOverride('size')} />
            <Select label="Align" value={p.align} onChange={(v) => set('align', v)} options={P.textAlign} overridden={hasOverride('align')} />
            <Select label="Color" value={p.color} onChange={(v) => set('color', v)} options={P.color} allowCustom overridden={hasOverride('color')} />
            <Select label="Line Height" value={p.lineHeight} onChange={(v) => set('lineHeight', v)} options={P.lineHeight} overridden={hasOverride('lineHeight')} />
          </>
        );

      case 'richtext':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Content" />
              <div className="space-y-1">
                <label className={labelCls}>Rich Text Editor</label>
                <Suspense fallback={<div className="h-48 rounded-xl bg-[hsl(var(--muted))] animate-pulse" />}>
                  <TinyMCEEditor value={p.html || ''} onChange={(v) => set('html', v)} height={280} />
                </Suspense>
              </div>
            </>}
          </>
        );

      case 'image':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Content" />
              <ImageField label="Image" value={p.src} onBrowse={() => onMediaPick?.((url) => set('src', url))} />
              <TextField label="Alt Text" value={p.alt} onChange={(v) => set('alt', v)} placeholder="Image description" />
            </>}
            <SectionDivider label="Style" />
            <Select label="Width" value={p.width} onChange={(v) => set('width', v)} options={P.width} allowCustom overridden={hasOverride('width')} />
            <Select label="Height" value={p.height} onChange={(v) => set('height', v)} options={P.height} allowCustom overridden={hasOverride('height')} />
            <Select label="Fit" value={p.objectFit} onChange={(v) => set('objectFit', v)} options={P.objectFit} overridden={hasOverride('objectFit')} />
            <Select label="Rounded" value={p.rounded} onChange={(v) => set('rounded', v)} options={P.rounded} overridden={hasOverride('rounded')} />
          </>
        );

      case 'button':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Content" />
              <TextField label="Button Text" value={p.text} onChange={(v) => set('text', v)} />
              <TextField label="Link URL" value={p.href} onChange={(v) => set('href', v)} placeholder="https://…" />
            </>}
            <SectionDivider label="Style" />
            <Select label="Variant" value={p.variant} onChange={(v) => set('variant', v)} options={P.buttonVariant} allowCustom overridden={hasOverride('variant')} />
            <Select label="Padding" value={p.padding} onChange={(v) => set('padding', v)} options={P.padding} overridden={hasOverride('padding')} />
            <Select label="Rounded" value={p.rounded} onChange={(v) => set('rounded', v)} options={P.rounded} overridden={hasOverride('rounded')} />
            <Select label="Font Weight" value={p.weight} onChange={(v) => set('weight', v)} options={P.fontWeight} overridden={hasOverride('weight')} />
            <Select label="Align" value={p.align} onChange={(v) => set('align', v)} options={P.textAlign} overridden={hasOverride('align')} />
          </>
        );

      case 'list':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Content" />
              <ListItemsEditor items={p.items || []} onChange={(v) => set('items', v)} />
              <label className="flex items-center gap-2 mt-2 text-xs">
                <input type="checkbox" checked={!!p.ordered} onChange={(e) => set('ordered', e.target.checked)} className="size-3.5 rounded" />
                Ordered (numbered)
              </label>
            </>}
            <SectionDivider label="Style" />
            <Select label="Font Size" value={p.size} onChange={(v) => set('size', v)} options={P.fontSize} overridden={hasOverride('size')} />
            <Select label="Color" value={p.color} onChange={(v) => set('color', v)} options={P.color} allowCustom overridden={hasOverride('color')} />
            <Select label="Spacing" value={p.spacing} onChange={(v) => set('spacing', v)} options={P.spacing} overridden={hasOverride('spacing')} />
          </>
        );

      case 'spacer':
        return (
          <>
            <SectionDivider label="Style" />
            <Select label="Height" value={p.height} onChange={(v) => set('height', v)} options={P.height} overridden={hasOverride('height')} />
          </>
        );

      case 'divider':
        return (
          <>
            <SectionDivider label="Style" />
            <TextField label="Border Color" value={p.color} onChange={(v) => set('color', v)} placeholder="border-[hsl(var(--border))]" />
            <TextField label="Margin" value={p.margin} onChange={(v) => set('margin', v)} placeholder="my-6" />
          </>
        );

      case 'section':
        return (
          <>
            <SectionDivider label="Style" />
            <Select label="Padding Y" value={p.paddingY} onChange={(v) => set('paddingY', v)} options={P.paddingY} overridden={hasOverride('paddingY')} />
            <TextField label="Padding X" value={p.paddingX} onChange={(v) => set('paddingX', v)} placeholder="px-4" />
            <Select label="Max Width" value={p.maxWidth} onChange={(v) => set('maxWidth', v)} options={P.maxWidth} />
          </>
        );

      case 'grid':
        return (
          <>
            <SectionDivider label="Style" />
            <Select label="Columns" value={p.cols} onChange={(v) => set('cols', v)} options={P.gridCols} overridden={hasOverride('cols')} />
            <Select label="Gap" value={p.gap} onChange={(v) => set('gap', v)} options={P.gap} overridden={hasOverride('gap')} />
          </>
        );

      case 'hero':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Content" />
              <TextField label="Title" value={p.title} onChange={(v) => set('title', v)} />
              <TextField label="Subtitle" value={p.subtitle} onChange={(v) => set('subtitle', v)} multiline />
              <TextField label="Button Text" value={p.btnText} onChange={(v) => set('btnText', v)} placeholder="Leave empty to hide" />
              <TextField label="Button URL" value={p.btnHref} onChange={(v) => set('btnHref', v)} />
            </>}
            <SectionDivider label="Style" />
            <Select label="Text Color" value={p.textColor} onChange={(v) => set('textColor', v)} options={P.color} allowCustom overridden={hasOverride('textColor')} />
            <Select label="Padding Y" value={p.paddingY} onChange={(v) => set('paddingY', v)} options={P.paddingY} overridden={hasOverride('paddingY')} />
            <Select label="Align" value={p.align} onChange={(v) => set('align', v)} options={P.textAlign} overridden={hasOverride('align')} />
          </>
        );

      case 'card':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Content" />
              <TextField label="Title" value={p.title} onChange={(v) => set('title', v)} />
              <TextField label="Body Text" value={p.body} onChange={(v) => set('body', v)} multiline />
            </>}
            <SectionDivider label="Style" />
            <Select label="Padding" value={p.padding} onChange={(v) => set('padding', v)} options={P.padding} overridden={hasOverride('padding')} />
            <Select label="Rounded" value={p.rounded} onChange={(v) => set('rounded', v)} options={P.rounded} overridden={hasOverride('rounded')} />
            <Select label="Shadow" value={p.shadow} onChange={(v) => set('shadow', v)} options={P.shadow} overridden={hasOverride('shadow')} />
            <Select label="Border" value={p.border} onChange={(v) => set('border', v)} options={P.border} allowCustom overridden={hasOverride('border')} />
          </>
        );

      case 'featureGrid':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Content" />
              <FeatureGridItemsEditor items={p.items || []} onChange={(v) => set('items', v)} />
            </>}
            <SectionDivider label="Grid Style" />
            <Select label="Columns" value={p.cols} onChange={(v) => set('cols', v)} options={[
              { v: 'grid-cols-1', l: '1 Column' }, { v: 'grid-cols-2', l: '2 Columns' },
              { v: 'grid-cols-3', l: '3 Columns' }, { v: 'grid-cols-4', l: '4 Columns' },
            ]} overridden={hasOverride('cols')} />
            <Select label="Gap" value={p.gap} onChange={(v) => set('gap', v)} options={P.gap} overridden={hasOverride('gap')} />
            <TextField label="Grid Padding" value={p.padding} onChange={(v) => set('padding', v)} placeholder="px-4" />
            <SectionDivider label="Card Style" />
            <Select label="Card BG" value={p.cardBg} onChange={(v) => set('cardBg', v)} options={P.bgColorPreset} allowCustom />
            <Select label="Card Rounded" value={p.cardRounded} onChange={(v) => set('cardRounded', v)} options={P.rounded} />
            <Select label="Card Padding" value={p.cardPadding} onChange={(v) => set('cardPadding', v)} options={P.padding} />
            <Select label="Card Border" value={p.cardBorder} onChange={(v) => set('cardBorder', v)} options={P.border} allowCustom />
            <SectionDivider label="Icon Style" />
            <Select label="Icon Size" value={p.iconSize} onChange={(v) => set('iconSize', v)} options={[
              { v: 'text-base', l: 'Small' }, { v: 'text-xl', l: 'Medium' },
              { v: 'text-2xl', l: 'Large' }, { v: 'text-3xl', l: 'XL' },
              { v: 'text-4xl', l: '2XL' },
            ]} />
            <Select label="Icon Background" value={p.iconBg} onChange={(v) => set('iconBg', v)} options={[
              { v: '', l: 'None' }, { v: 'bg-primary/10', l: '● Primary (light)' },
              { v: 'bg-primary', l: '● Primary (solid)' }, { v: 'bg-muted', l: '● Muted' },
              { v: 'bg-card', l: '● Card' }, { v: 'bg-foreground/10', l: '● Foreground (light)' },
            ]} allowCustom />
            <Select label="Icon Rounded" value={p.iconRounded} onChange={(v) => set('iconRounded', v)} options={P.rounded} />
            <Select label="Icon Padding" value={p.iconPadding} onChange={(v) => set('iconPadding', v)} options={P.padding} />
            <Select label="Icon Color" value={p.iconColor} onChange={(v) => set('iconColor', v)} options={[
              { v: '', l: 'Default' }, { v: 'text-primary', l: '● Primary' },
              { v: 'text-primary-foreground', l: '● Primary FG' },
              { v: 'text-foreground', l: '● Foreground' }, { v: 'text-white', l: '○ White' },
            ]} allowCustom />
          </>
        );

      case 'html':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Content" />
              <TextField label="HTML Code" value={p.code} onChange={(v) => set('code', v)} multiline />
              <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">
                Paste any HTML with Tailwind CSS classes.
              </div>
            </>}
          </>
        );

      case 'postLoop':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Data Source" />
              <div className="rounded-xl bg-[hsl(var(--muted))]/60 p-2 text-[10px] text-[hsl(var(--muted-foreground))] leading-relaxed">
                🔄 Content is fetched from the database when the page is saved. Re-save to refresh.
              </div>
              <Select label="Post Type" value={p.postTypeId || ''} onChange={(v) => set('postTypeId', v)} options={postTypeOptions} />
              <Select label="Category" value={p.categoryId || ''} onChange={(v) => set('categoryId', v)} options={categoryOptions} />
              <TextField label="Count" value={String(p.count ?? 6)} onChange={(v) => set('count', Number(v) || 6)} placeholder="6" />
              <Select label="Order By" value={p.orderBy || 'latest'} onChange={(v) => set('orderBy', v)} options={P.orderBy} />
              <Select label="Pagination" value={p.paginationType || 'pagination'} onChange={(v) => set('paginationType', v)} options={[
                { v: 'none', l: 'None' },
                { v: 'pagination', l: 'Pagination' },
                { v: 'loadmore', l: 'Load More' },
                { v: 'infinity', l: 'Infinite Scroll' },
              ]} />
            </>}
            <SectionDivider label="Layout" />
            <Select label="Columns" value={p.cols} onChange={(v) => set('cols', v)} options={P.loopCols} overridden={hasOverride('cols')} />
            <Select label="Gap" value={p.gap} onChange={(v) => set('gap', v)} options={P.gap} overridden={hasOverride('gap')} />
            <SectionDivider label="Show Fields" />
            {bp === 'desktop' && <>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input type="checkbox" checked={!!p.showImage} onChange={(e) => set('showImage', e.target.checked)} className="accent-[hsl(var(--primary))]" />
                Show Featured Image
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input type="checkbox" checked={!!p.showCategory} onChange={(e) => set('showCategory', e.target.checked)} className="accent-[hsl(var(--primary))]" />
                Show Category
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input type="checkbox" checked={!!p.showDate} onChange={(e) => set('showDate', e.target.checked)} className="accent-[hsl(var(--primary))]" />
                Show Date
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input type="checkbox" checked={!!p.showExcerpt} onChange={(e) => set('showExcerpt', e.target.checked)} className="accent-[hsl(var(--primary))]" />
                Show Excerpt
              </label>
            </>}
            <SectionDivider label="Card Style" />
            <Select label="Image Height" value={p.imageHeight} onChange={(v) => set('imageHeight', v)} options={P.height} overridden={hasOverride('imageHeight')} />
            <Select label="Card BG" value={p.cardBg} onChange={(v) => set('cardBg', v)} options={P.bgColorPreset} allowCustom />
            <Select label="Card Rounded" value={p.cardRounded} onChange={(v) => set('cardRounded', v)} options={P.rounded} />
            <Select label="Card Border" value={p.cardBorder} onChange={(v) => set('cardBorder', v)} options={P.border} allowCustom />
            <Select label="Card Padding" value={p.cardPadding} onChange={(v) => set('cardPadding', v)} options={P.padding} />
          </>
        );

      case 'categoryLoop':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Data Source" />
              <div className="rounded-xl bg-[hsl(var(--muted))]/60 p-2 text-[10px] text-[hsl(var(--muted-foreground))] leading-relaxed">
                🔄 Content is fetched from the database when the page is saved. Re-save to refresh.
              </div>
              <Select label="Taxonomy" value={p.taxonomyId || ''} onChange={(v) => set('taxonomyId', v)} options={taxonomyOptions} />
              <TextField label="Count" value={String(p.count ?? 8)} onChange={(v) => set('count', Number(v) || 8)} placeholder="8" />
              <label className="flex items-center gap-2 text-xs cursor-pointer mt-1">
                <input type="checkbox" checked={!!p.showCount} onChange={(e) => set('showCount', e.target.checked)} className="accent-[hsl(var(--primary))]" />
                Show Article Count
              </label>
            </>}
            <SectionDivider label="Layout" />
            <Select label="Columns" value={p.cols} onChange={(v) => set('cols', v)} options={P.loopCols} overridden={hasOverride('cols')} />
            <Select label="Gap" value={p.gap} onChange={(v) => set('gap', v)} options={P.gap} overridden={hasOverride('gap')} />
            <SectionDivider label="Card Style" />
            <Select label="Card BG" value={p.cardBg} onChange={(v) => set('cardBg', v)} options={P.bgColorPreset} allowCustom />
            <Select label="Card Rounded" value={p.cardRounded} onChange={(v) => set('cardRounded', v)} options={P.rounded} />
            <Select label="Card Border" value={p.cardBorder} onChange={(v) => set('cardBorder', v)} options={P.border} allowCustom />
            <Select label="Card Padding" value={p.cardPadding} onChange={(v) => set('cardPadding', v)} options={P.padding} />
          </>
        );

      case 'slider':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Source" />
              <Select label="Slide Source" value={p.source || 'manual'} onChange={(v) => set('source', v)} options={P.sliderSource} />
              {(p.source === 'posts') && <>
                <Select label="Post Type" value={p.postTypeId || ''} onChange={(v) => set('postTypeId', v)} options={postTypeOptions} />
                <TextField label="Count" value={String(p.count ?? 5)} onChange={(v) => set('count', Number(v) || 5)} placeholder="5" />
                <div className="rounded-xl bg-[hsl(var(--muted))]/60 p-2 text-[10px] text-[hsl(var(--muted-foreground))]">
                  🔄 Posts with featured images are used as slides. Re-save to refresh.
                </div>
              </>}
              {(!p.source || p.source === 'manual') && <>
                <SectionDivider label="Slides" />
                <SlideItemsEditor items={p.items || []} onChange={(v) => set('items', v)} onMediaPick={onMediaPick} />
              </>}
            </>}
            <SectionDivider label="Style" />
            <Select label="Height" value={p.height} onChange={(v) => set('height', v)} options={P.height} overridden={hasOverride('height')} />
            <Select label="Rounded" value={p.rounded} onChange={(v) => set('rounded', v)} options={P.rounded} overridden={hasOverride('rounded')} />
            <Select label="Object Fit" value={p.objectFit} onChange={(v) => set('objectFit', v)} options={P.objectFit} />
            <TextField label="Title Color" value={p.titleColor} onChange={(v) => set('titleColor', v)} placeholder="text-white" />
            {bp === 'desktop' && <>
              <SectionDivider label="Controls" />
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input type="checkbox" checked={!!p.showDots} onChange={(e) => set('showDots', e.target.checked)} className="accent-[hsl(var(--primary))]" />
                Show Dot Indicators
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input type="checkbox" checked={!!p.showArrows} onChange={(e) => set('showArrows', e.target.checked)} className="accent-[hsl(var(--primary))]" />
                Show Navigation Arrows
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input type="checkbox" checked={!!p.loop} onChange={(e) => set('loop', e.target.checked)} className="accent-[hsl(var(--primary))]" />
                Loop Slides
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input type="checkbox" checked={!!p.autoplay} onChange={(e) => set('autoplay', e.target.checked)} className="accent-[hsl(var(--primary))]" />
                Autoplay
              </label>
              {!!p.autoplay && (
                <TextField 
                  label="Autoplay Interval (ms)" 
                  value={String(p.autoplayInterval ?? 5000)} 
                  onChange={(v) => set('autoplayInterval', Number(v) || 5000)} 
                  placeholder="5000" 
                />
              )}
              <TextField 
                label="Transition Duration (ms)" 
                value={String(p.transitionDuration ?? 300)} 
                onChange={(v) => set('transitionDuration', Number(v) || 300)} 
                placeholder="300" 
              />
            </>}
          </>
        );

      case 'columns':
        return (
          <>
            <SectionDivider label="Style" />
            <Select label="Gap" value={p.gap} onChange={(v) => set('gap', v)} options={P.gap} overridden={hasOverride('gap')} />
            <Select label="Align Items" value={p.align} onChange={(v) => set('align', v)} options={P.alignItems} overridden={hasOverride('align')} />
            <Select label="Padding Y" value={p.paddingY} onChange={(v) => set('paddingY', v)} options={P.paddingY} overridden={hasOverride('paddingY')} />
            <TextField label="Padding X" value={p.paddingX} onChange={(v) => set('paddingX', v)} placeholder="px-4" />
          </>
        );

      case 'quote':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Content" />
              <TextField label="Quote Text" value={p.text} onChange={(v) => set('text', v)} multiline />
              <TextField label="Author" value={p.author} onChange={(v) => set('author', v)} placeholder="Author Name" />
              <TextField label="Role / Source" value={p.role} onChange={(v) => set('role', v)} placeholder="CEO, Company" />
            </>}
            <SectionDivider label="Style" />
            <Select label="Text Size" value={p.textSize} onChange={(v) => set('textSize', v)} options={P.fontSize} overridden={hasOverride('textSize')} />
            <Select label="Padding" value={p.padding} onChange={(v) => set('padding', v)} options={P.padding} overridden={hasOverride('padding')} />
            <Select label="Rounded" value={p.rounded} onChange={(v) => set('rounded', v)} options={P.rounded} overridden={hasOverride('rounded')} />
            <TextField label="Border Color" value={p.borderColor} onChange={(v) => set('borderColor', v)} placeholder="border-[hsl(var(--primary))]" />
            <TextField label="Background" value={p.bgColor} onChange={(v) => set('bgColor', v)} placeholder="bg-[hsl(var(--muted))]" />
          </>
        );

      case 'badge':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Content" />
              <TextField label="Text" value={p.text} onChange={(v) => set('text', v)} />
            </>}
            <SectionDivider label="Style" />
            <Select label="Variant" value={p.variant} onChange={(v) => set('variant', v)} options={P.buttonVariant} allowCustom overridden={hasOverride('variant')} />
            <Select label="Size" value={p.size} onChange={(v) => set('size', v)} options={P.fontSize} overridden={hasOverride('size')} />
            <Select label="Padding" value={p.padding} onChange={(v) => set('padding', v)} options={P.padding} allowCustom overridden={hasOverride('padding')} />
            <Select label="Rounded" value={p.rounded} onChange={(v) => set('rounded', v)} options={P.rounded} overridden={hasOverride('rounded')} />
            <Select label="Align" value={p.align} onChange={(v) => set('align', v)} options={P.textAlign} overridden={hasOverride('align')} />
          </>
        );

      case 'alert':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Content" />
              <Select label="Type" value={p.type || 'info'} onChange={(v) => set('type', v)} options={P.alertType} />
              <TextField label="Title (optional)" value={p.title} onChange={(v) => set('title', v)} placeholder="Alert title" />
              <TextField label="Message" value={p.message} onChange={(v) => set('message', v)} multiline />
              <TextField label="Custom Icon" value={p.icon} onChange={(v) => set('icon', v)} placeholder="Leave empty for default" />
            </>}
            <SectionDivider label="Style" />
            <Select label="Rounded" value={p.rounded} onChange={(v) => set('rounded', v)} options={P.rounded} overridden={hasOverride('rounded')} />
          </>
        );

      case 'video':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Content" />
              <TextField label="Video URL" value={p.url} onChange={(v) => set('url', v)} placeholder="YouTube / Vimeo / direct URL" />
              <TextField label="Caption" value={p.caption} onChange={(v) => set('caption', v)} placeholder="Optional caption" />
            </>}
            <SectionDivider label="Style" />
            <Select label="Aspect Ratio" value={p.aspectRatio} onChange={(v) => set('aspectRatio', v)} options={P.aspectRatio} overridden={hasOverride('aspectRatio')} />
            <Select label="Rounded" value={p.rounded} onChange={(v) => set('rounded', v)} options={P.rounded} overridden={hasOverride('rounded')} />
          </>
        );

      case 'gallery':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Images" />
              <GalleryItemsEditor items={p.images || []} onChange={(v) => set('images', v)} onMediaPick={onMediaPick} />
            </>}
            <SectionDivider label="Style" />
            <Select label="Columns" value={p.cols} onChange={(v) => set('cols', v)} options={[
              { v: 'grid-cols-2', l: '2 Cols' }, { v: 'grid-cols-3', l: '3 Cols' },
              { v: 'grid-cols-4', l: '4 Cols' }, { v: 'grid-cols-1', l: '1 Col' },
            ]} overridden={hasOverride('cols')} />
            <Select label="Gap" value={p.gap} onChange={(v) => set('gap', v)} options={P.gap} overridden={hasOverride('gap')} />
            <Select label="Image Height" value={p.height} onChange={(v) => set('height', v)} options={P.height} overridden={hasOverride('height')} />
            <Select label="Fit" value={p.objectFit} onChange={(v) => set('objectFit', v)} options={P.objectFit} overridden={hasOverride('objectFit')} />
            <Select label="Rounded" value={p.rounded} onChange={(v) => set('rounded', v)} options={P.rounded} overridden={hasOverride('rounded')} />
          </>
        );

      case 'stats':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Items" />
              <StatsItemsEditor items={p.items || []} onChange={(v) => set('items', v)} />
            </>}
            <SectionDivider label="Layout" />
            <Select label="Columns" value={p.cols} onChange={(v) => set('cols', v)} options={[
              { v: 'grid-cols-2', l: '2' }, { v: 'grid-cols-3', l: '3' },
              { v: 'grid-cols-4', l: '4' }, { v: 'grid-cols-1', l: '1' },
            ]} overridden={hasOverride('cols')} />
            <Select label="Gap" value={p.gap} onChange={(v) => set('gap', v)} options={P.gap} overridden={hasOverride('gap')} />
            <Select label="Align" value={p.align} onChange={(v) => set('align', v)} options={P.textAlign} overridden={hasOverride('align')} />
            <SectionDivider label="Value Style" />
            <Select label="Value Size" value={p.valueSize} onChange={(v) => set('valueSize', v)} options={P.fontSize} overridden={hasOverride('valueSize')} />
            <Select label="Value Weight" value={p.valueWeight} onChange={(v) => set('valueWeight', v)} options={P.fontWeight} overridden={hasOverride('valueWeight')} />
            <Select label="Value Color" value={p.valueColor} onChange={(v) => set('valueColor', v)} options={P.color} allowCustom overridden={hasOverride('valueColor')} />
            <Select label="Label Size" value={p.labelSize} onChange={(v) => set('labelSize', v)} options={P.fontSize} overridden={hasOverride('labelSize')} />
            <Select label="Label Color" value={p.labelColor} onChange={(v) => set('labelColor', v)} options={P.color} allowCustom overridden={hasOverride('labelColor')} />
            <SectionDivider label="Card Style" />
            <Select label="Card BG" value={p.cardBg} onChange={(v) => set('cardBg', v)} options={P.bgColorPreset} allowCustom />
            <Select label="Card Rounded" value={p.cardRounded} onChange={(v) => set('cardRounded', v)} options={P.rounded} />
            <Select label="Card Border" value={p.cardBorder} onChange={(v) => set('cardBorder', v)} options={P.border} allowCustom />
            <Select label="Padding" value={p.padding} onChange={(v) => set('padding', v)} options={P.padding} />
          </>
        );

      case 'testimonial':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Content" />
              <TextField label="Quote" value={p.quote} onChange={(v) => set('quote', v)} multiline />
              <TextField label="Name" value={p.name} onChange={(v) => set('name', v)} placeholder="John Doe" />
              <TextField label="Role" value={p.role} onChange={(v) => set('role', v)} placeholder="CEO, Company" />
              <ImageField label="Avatar" value={p.avatar} onBrowse={() => onMediaPick?.((url) => set('avatar', url))} />
            </>}
            <SectionDivider label="Style" />
            <Select label="Padding" value={p.padding} onChange={(v) => set('padding', v)} options={P.padding} overridden={hasOverride('padding')} />
            <Select label="Rounded" value={p.rounded} onChange={(v) => set('rounded', v)} options={P.rounded} overridden={hasOverride('rounded')} />
            <Select label="Border" value={p.border} onChange={(v) => set('border', v)} options={P.border} allowCustom overridden={hasOverride('border')} />
          </>
        );

      case 'accordion':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Items" />
              <AccordionItemsEditor items={p.items || []} onChange={(v) => set('items', v)} />
            </>}
            <SectionDivider label="Style" />
            <Select label="Rounded" value={p.rounded} onChange={(v) => set('rounded', v)} options={P.rounded} overridden={hasOverride('rounded')} />
            <TextField label="Item BG" value={p.bgColor} onChange={(v) => set('bgColor', v)} placeholder="bg-card" />
            <Select label="Border" value={p.border} onChange={(v) => set('border', v)} options={P.border} allowCustom />
          </>
        );

      case 'tabs':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Tabs" />
              <TabsItemsEditor items={p.items || []} onChange={(v) => set('items', v)} />
              <div className="space-y-1 mt-1">
                <label className={labelCls}>Default Active Tab</label>
                <select
                  value={String(p.activeTab || 0)}
                  onChange={(e) => set('activeTab', Number(e.target.value))}
                  className="block w-full rounded-xl bg-[hsl(var(--background))] px-3 py-2 text-xs ring-1 ring-[hsl(var(--border))]"
                >
                  {(p.items || []).map((tab, i) => (
                    <option key={i} value={String(i)}>{tab.label || `Tab ${i + 1}`}</option>
                  ))}
                </select>
              </div>
            </>}
            <SectionDivider label="Style" />
            <Select label="Rounded" value={p.rounded} onChange={(v) => set('rounded', v)} options={P.rounded} overridden={hasOverride('rounded')} />
            <TextField label="Tab Bar BG" value={p.tabBg} onChange={(v) => set('tabBg', v)} placeholder="bg-muted" />
            <TextField label="Active Tab BG" value={p.activeBg} onChange={(v) => set('activeBg', v)} placeholder="bg-background" />
            <TextField label="Content BG" value={p.contentBg} onChange={(v) => set('contentBg', v)} placeholder="bg-card" />
          </>
        );

      case 'cta':
        return (
          <>
            {bp === 'desktop' && <>
              <SectionDivider label="Content" />
              <TextField label="Title" value={p.title} onChange={(v) => set('title', v)} />
              <TextField label="Subtitle" value={p.subtitle} onChange={(v) => set('subtitle', v)} multiline />
              <SectionDivider label="Primary Button" />
              <TextField label="Button Text" value={p.btnText} onChange={(v) => set('btnText', v)} placeholder="Leave empty to hide" />
              <TextField label="Button URL" value={p.btnHref} onChange={(v) => set('btnHref', v)} placeholder="https://…" />
              <Select label="Button Style" value={p.btnVariant} onChange={(v) => set('btnVariant', v)} options={P.buttonVariant} allowCustom />
              <SectionDivider label="Secondary Button" />
              <TextField label="Button Text" value={p.secondBtnText} onChange={(v) => set('secondBtnText', v)} placeholder="Leave empty to hide" />
              <TextField label="Button URL" value={p.secondBtnHref} onChange={(v) => set('secondBtnHref', v)} placeholder="https://…" />
              <Select label="Button Style" value={p.secondBtnVariant} onChange={(v) => set('secondBtnVariant', v)} options={P.buttonVariant} allowCustom />
            </>}
            <SectionDivider label="Style" />
            <Select label="Padding Y" value={p.paddingY} onChange={(v) => set('paddingY', v)} options={P.paddingY} overridden={hasOverride('paddingY')} />
            <Select label="Align" value={p.align} onChange={(v) => set('align', v)} options={P.textAlign} overridden={hasOverride('align')} />
            <Select label="Rounded" value={p.rounded} onChange={(v) => set('rounded', v)} options={P.rounded} overridden={hasOverride('rounded')} />
          </>
        );

      default:
        return <div className="text-xs text-[hsl(var(--muted-foreground))] p-2">No properties for this block.</div>;
    }
  }

  const bpLabels = { desktop: 'Desktop', md: 'Tablet', sm: 'Mobile' };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Breakpoint switcher */}
      <div className="flex border-b border-[hsl(var(--border))] shrink-0 bg-[hsl(var(--background))]">
        {BREAKPOINTS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            title={bpLabels[id]}
            onClick={() => setBp(id)}
            className={
              'flex-1 relative flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition-colors ' +
              (bp === id
                ? 'text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))] -mb-px'
                : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]')
            }
          >
            <Icon className="size-3.5" />
            {bpLabels[id]}
            {id !== 'desktop' && bpHasData(id) && (
              <span className="absolute top-1 right-2 size-1.5 rounded-full bg-[hsl(var(--primary))]" />
            )}
          </button>
        ))}
      </div>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 pb-16 min-h-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--primary))]">{block.type}</span>
          {bp !== 'desktop' && (
            <span className="text-[10px] bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary))] px-1.5 py-0.5 rounded font-medium">
              {bp === 'md' ? '≤1024px' : '≤768px'}
            </span>
          )}
        </div>
        {bp !== 'desktop' && (
          <div className="text-[10px] leading-relaxed text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] rounded-lg px-2.5 py-2">
            Editing <strong>{bpLabels[bp]}</strong> overrides. Values default to Desktop — change any to override.{' '}
            <span className="text-[hsl(var(--primary))]">●</span> marks active overrides.
          </div>
        )}
        {renderFields()}
        <SectionDivider label="Background" />
        <BackgroundControls props={p} set={set} onMediaPick={onMediaPick} />
        <SectionDivider label="Advanced" />
        <TailwindClassInput
          label="Custom CSS Classes"
          value={p.customCss}
          onChange={(v) => set('customCss', v)}
          overridden={hasOverride('customCss')}
        />
      </div>
    </div>
  );
}
