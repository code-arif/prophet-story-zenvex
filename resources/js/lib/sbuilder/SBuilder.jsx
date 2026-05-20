/**
 * S Builder — Visual Page Builder with Nesting Support
 *
 * Container blocks (section, grid) accept children via drag-drop or click.
 * Supports palette drag-to-canvas, block reorder, and parent-child nesting.
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Monitor, Tablet, Smartphone,
  Plus, Trash2, ChevronUp, ChevronDown, GripVertical,
  Copy, Undo2,
} from 'lucide-react';

import { Input } from '../../components/ui/input';
import { CATEGORIES, BLOCK_DEFS, createBlock } from './blocks';
import PropsPanel from './PropsPanel';

/* ═══ Constants ══════════════════════════════════ */

const BREAKPOINTS = [
  { id: 'desktop', label: 'Desktop', icon: Monitor, canvas: 'w-full' },
  { id: 'tablet', label: 'Tablet', icon: Tablet, canvas: 'w-[768px]' },
  { id: 'mobile', label: 'Mobile', icon: Smartphone, canvas: 'w-[390px]' },
];

const CONTAINERS = new Set(['section', 'grid', 'columns']);
const genId = () => Math.random().toString(36).slice(2, 9);

/* ═══ Tree Helpers ═══════════════════════════════ */

/** Find block by id anywhere in tree */
function findBlock(tree, id) {
  for (const b of tree) {
    if (b.id === id) return b;
    if (b.children?.length) { const f = findBlock(b.children, id); if (f) return f; }
  }
  return null;
}

/** Find a block's context: its parent block, index among siblings */
function findCtx(tree, id, parent = null) {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) return { parent, index: i, siblings: tree };
    if (tree[i].children) {
      const f = findCtx(tree[i].children, id, tree[i]);
      if (f) return f;
    }
  }
  return null;
}

/** Remove block by id from tree (immutable) */
function removeBlock(tree, id) {
  const out = [];
  for (const b of tree) {
    if (b.id === id) continue;
    out.push(b.children ? { ...b, children: removeBlock(b.children, id) } : b);
  }
  return out;
}

/** Update a single block in tree (immutable) */
function updateInTree(tree, u) {
  return tree.map(b => {
    if (b.id === u.id) return u;
    return b.children ? { ...b, children: updateInTree(b.children, u) } : b;
  });
}

/** Insert block at position { containerId: string|null, index: number } */
function insertAt(tree, block, pos) {
  if (!pos.containerId) {
    const n = [...tree];
    n.splice(pos.index, 0, block);
    return n;
  }
  return tree.map(b => {
    if (b.id === pos.containerId) {
      const ch = [...(b.children || [])];
      ch.splice(pos.index, 0, block);
      return { ...b, children: ch };
    }
    return b.children ? { ...b, children: insertAt(b.children, block, pos) } : b;
  });
}

/** Check if targetId is inside block's subtree */
function isDescendant(block, targetId) {
  if (!block?.children) return false;
  for (const c of block.children) {
    if (c.id === targetId || isDescendant(c, targetId)) return true;
  }
  return false;
}

/** Deep clone with new IDs for all blocks */
function deepClone(block) {
  const c = { ...structuredClone(block), id: genId() };
  if (c.children) c.children = c.children.map(deepClone);
  return c;
}

/** Count all blocks including nested */
function countAll(tree) {
  let n = 0;
  for (const b of tree) { n++; if (b.children) n += countAll(b.children); }
  return n;
}

/** Resolve drop indicator into insertion position */
function resolveTarget(tree, ind) {
  if (!ind) return null;
  if (ind.position === 'inside') {
    const c = findBlock(tree, ind.blockId);
    return { containerId: ind.blockId, index: (c?.children || []).length };
  }
  const ctx = findCtx(tree, ind.blockId);
  if (!ctx) return null;
  return {
    containerId: ctx.parent?.id || null,
    index: ind.position === 'before' ? ctx.index : ctx.index + 1,
  };
}

/* ═══ Background Style Helper ════════════════════ */

const BG_DIR_MAP = {
  'to-r': 'to right', 'to-l': 'to left', 'to-t': 'to top', 'to-b': 'to bottom',
  'to-br': 'to bottom right', 'to-bl': 'to bottom left',
  'to-tr': 'to top right', 'to-tl': 'to top left',
};

function buildBgReactStyle(p) {
  const bgType = p.bgType || (p.background ? 'legacy' : 'none');
  if (bgType === 'none') return { cls: '', style: {} };
  if (bgType === 'legacy') return { cls: p.background || '', style: {} };

  if (bgType === 'color') {
    const c = p.bgColor || '';
    if (c.startsWith('#') || c.startsWith('rgb')) {
      return { cls: '', style: { backgroundColor: c } };
    }
    return { cls: c, style: {} };
  }

  if (bgType === 'gradient') {
    const dir = BG_DIR_MAP[p.bgGradientDir || 'to-br'] || 'to bottom right';
    return { cls: '', style: { background: `linear-gradient(${dir}, ${p.bgGradientFrom || '#3b82f6'}, ${p.bgGradientTo || '#8b5cf6'})` } };
  }

  if (bgType === 'image' && p.bgImage) {
    const style = {
      backgroundImage: `url('${p.bgImage}')`,
      backgroundPosition: p.bgPosition || 'center',
      backgroundSize: p.bgSize || 'cover',
      backgroundRepeat: 'no-repeat',
    };
    if (p.bgOverlayColor && p.bgOverlayColor.startsWith('#') && p.bgOverlayColor.length >= 7) {
      const r = parseInt(p.bgOverlayColor.slice(1, 3), 16);
      const g = parseInt(p.bgOverlayColor.slice(3, 5), 16);
      const b = parseInt(p.bgOverlayColor.slice(5, 7), 16);
      const a = parseInt(p.bgOverlayOpacity || '50', 10) / 100;
      const overlay = `rgba(${r},${g},${b},${a})`;
      style.backgroundImage = `linear-gradient(${overlay},${overlay}), url('${p.bgImage}')`;
    }
    return { cls: '', style };
  }

  return { cls: '', style: {} };
}

/* ═══ Responsive helpers ════════════════════════ */

/**
 * Merge responsive overrides into desktop props for canvas preview.
 * canvasBp: 'desktop' | 'tablet' | 'mobile'
 * → 'tablet' reads block.responsive.md, 'mobile' reads block.responsive.sm
 */
function getEffectiveProps(block, canvasBp) {
  const desktop = block.props || {};
  if (canvasBp === 'desktop') return desktop;
  const key = canvasBp === 'tablet' ? 'md' : 'sm';
  const override = block.responsive?.[key] != null && typeof block.responsive[key] === 'object' ? block.responsive[key] : {};
  return { ...desktop, ...override };
}

/* ═══ Loop Block Preview (AJAX) ══════════════════ */

/** Simple in-memory cache keyed by URL string */
const loopCache = {};

function LoopBlockPreview({ block, p, m, bgStyle }) {
  const isPost = block.type === 'postLoop';

  // Build query params
  const params = new URLSearchParams({ type: block.type });
  if (isPost) {
    if (p.postTypeId) params.set('postTypeId', p.postTypeId);
    if (p.categoryId) params.set('categoryId', p.categoryId);
    params.set('orderBy', p.orderBy || 'latest');
  } else {
    if (p.taxonomyId) params.set('taxonomyId', p.taxonomyId);
  }
  params.set('count', String(Math.min(Number(p.count) || (isPost ? 6 : 8), 24)));

  const url = `/api/admin/lookup/loop-preview?${params.toString()}`;

  const [items, setItems] = useState(() => loopCache[url] || null);
  const [loading, setLoading] = useState(!loopCache[url]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (loopCache[url]) {
      setItems(loopCache[url]);
      setLoading(false);
      return;
    }
    setLoading(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
        .then(r => r.ok ? r.json() : Promise.reject(r.status))
        .then(data => {
          loopCache[url] = data.items || [];
          setItems(loopCache[url]);
          setLoading(false);
        })
        .catch(() => {
          setItems([]);
          setLoading(false);
        });
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [url]);

  const skeleton = (isPost ? Math.min(Number(p.count) || 6, 12) : Math.min(Number(p.count) || 8, 24));

  if (loading || !items) {
    // Skeleton placeholders while loading
    if (isPost) {
      return (
        <div>
          <div className={m('grid', p.cols || 'grid-cols-2', p.gap || 'gap-4')} style={bgStyle}>
            {Array.from({ length: skeleton }).map((_, i) => (
              <div key={i} className={[p.cardBg || 'bg-card', p.cardRounded || 'rounded-xl', p.cardBorder || 'border border-border', p.cardPadding || 'p-4', 'overflow-hidden animate-pulse'].filter(Boolean).join(' ')}>
                {p.showImage !== false && <div className={[p.imageHeight || 'h-40', 'bg-[hsl(var(--muted))] rounded-lg mb-3'].join(' ')} />}
                <div className="h-2.5 bg-[hsl(var(--muted))] rounded w-4/5 mt-1.5 mb-1" />
                <div className="h-2 bg-[hsl(var(--muted))] rounded w-3/5" />
              </div>
            ))}
          </div>
          {(p.paginationType || 'pagination') === 'pagination' && (
            <div className="flex items-center justify-center gap-1 mt-4">
              <span className="inline-flex items-center justify-center h-7 px-2.5 rounded-lg text-xs bg-[hsl(var(--muted))] animate-pulse w-14" />
              {[1, 2, 3].map((n) => (
                <span key={n} className="inline-flex items-center justify-center size-7 rounded-lg bg-[hsl(var(--muted))] animate-pulse" />
              ))}
              <span className="inline-flex items-center justify-center h-7 px-2.5 rounded-lg text-xs bg-[hsl(var(--muted))] animate-pulse w-14" />
            </div>
          )}
          {p.paginationType === 'loadmore' && (
            <div className="flex justify-center mt-4">
              <span className="inline-flex items-center justify-center h-8 px-6 rounded-xl text-xs bg-[hsl(var(--muted))] animate-pulse w-24" />
            </div>
          )}
        </div>
      );
    }
    return (
      <div>
        <div className={m('grid', p.cols || 'grid-cols-2', p.gap || 'gap-3')} style={bgStyle}>
          {Array.from({ length: skeleton }).map((_, i) => (
            <div key={i} className={[p.cardBg || 'bg-card', p.cardRounded || 'rounded-xl', p.cardBorder || 'border border-border', p.cardPadding || 'p-4', 'animate-pulse'].filter(Boolean).join(' ')}>
              <div className="h-2.5 bg-[hsl(var(--muted))] rounded w-2/3 mb-1.5" />
              <div className="h-2 bg-[hsl(var(--muted))] rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isPost) {
    return (
      <div>
        <div className={m('grid', p.cols || 'grid-cols-2', p.gap || 'gap-4')} style={bgStyle}>
          {items.map((item, i) => (
            <div key={item.id ?? i} className={[p.cardBg || 'bg-card', p.cardRounded || 'rounded-xl', p.cardBorder || 'border border-border', p.cardPadding || 'p-4', 'overflow-hidden'].filter(Boolean).join(' ')}>
              {p.showImage !== false && (
                item.image
                  ? <img src={item.image} alt={item.title} className={[p.imageHeight || 'h-40', 'w-full object-cover rounded-lg mb-3'].join(' ')} />
                  : <div className={[p.imageHeight || 'h-40', 'bg-[hsl(var(--muted))] rounded-lg mb-3 flex items-center justify-center text-lg'].join(' ')}>🖼</div>
              )}
              {p.showCategory !== false && item.category && <span className="text-[10px] text-[hsl(var(--primary))] font-medium">{item.category}</span>}
              <div className="font-semibold text-sm leading-snug mt-1 line-clamp-2">{item.title}</div>
              {p.showExcerpt && item.excerpt && <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 line-clamp-2">{item.excerpt}</p>}
              {p.showDate !== false && item.date && <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">{item.date}</div>}
            </div>
          ))}
          {items.length === 0 && <div className="col-span-full text-xs text-center text-[hsl(var(--muted-foreground))] py-6">No posts found</div>}
        </div>
        {(p.paginationType || 'pagination') === 'pagination' && (
          <div className="flex items-center justify-center gap-1 mt-4">
            <span className="inline-flex items-center justify-center h-7 px-2.5 rounded-lg text-xs bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] cursor-default">‹ Prev</span>
            {[1, 2, 3].map((n) => (
              <span key={n} className={['inline-flex items-center justify-center size-7 rounded-lg text-xs font-medium', n === 1 ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'].join(' ')}>{n}</span>
            ))}
            <span className="inline-flex items-center justify-center h-7 px-2.5 rounded-lg text-xs bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] cursor-default">Next ›</span>
          </div>
        )}
        {p.paginationType === 'loadmore' && (
          <div className="flex justify-center mt-4">
            <span className="inline-flex items-center justify-center h-8 px-6 rounded-xl text-xs font-medium ring-1 ring-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]">Load More</span>
          </div>
        )}
        {p.paginationType === 'infinity' && (
          <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-[hsl(var(--muted-foreground))]">
            <span className="inline-block size-1.5 rounded-full bg-[hsl(var(--muted-foreground))] animate-pulse" />
            Infinite scroll
          </div>
        )}
      </div>
    );
  }

  // categoryLoop
  return (
    <div>
      <div className={m('grid', p.cols || 'grid-cols-2', p.gap || 'gap-3')} style={bgStyle}>
        {items.map((item, i) => (
          <div key={item.id ?? i} className={[p.cardBg || 'bg-card', p.cardRounded || 'rounded-xl', p.cardBorder || 'border border-border', p.cardPadding || 'p-4'].filter(Boolean).join(' ')}>
            <div className="font-medium text-sm">{item.name}</div>
            {p.showCount !== false && <div className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{item.count} posts</div>}
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full text-xs text-center text-[hsl(var(--muted-foreground))] py-6">No categories found</div>}
      </div>
      {(p.paginationType || 'pagination') === 'pagination' && (
        <div className="flex items-center justify-center gap-1 mt-4">
          <span className="inline-flex items-center justify-center h-7 px-2.5 rounded-lg text-xs bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] cursor-default">‹ Prev</span>
          {[1, 2, 3].map((n) => (
            <span key={n} className={['inline-flex items-center justify-center size-7 rounded-lg text-xs font-medium', n === 1 ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'].join(' ')}>{n}</span>
          ))}
          <span className="inline-flex items-center justify-center h-7 px-2.5 rounded-lg text-xs bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] cursor-default">Next ›</span>
        </div>
      )}
      {p.paginationType === 'loadmore' && (
        <div className="flex justify-center mt-4">
          <span className="inline-flex items-center justify-center h-8 px-6 rounded-xl text-xs font-medium ring-1 ring-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]">Load More</span>
        </div>
      )}
      {p.paginationType === 'infinity' && (
        <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-[hsl(var(--muted-foreground))]">
          <span className="inline-block size-1.5 rounded-full bg-[hsl(var(--muted-foreground))] animate-pulse" />
          Infinite scroll
        </div>
      )}
    </div>
  );
}

/* ═══ Block Preview (leaf content) ═══════════════ */

function BlockPreview({ block, canvasBp }) {
  const p = getEffectiveProps(block, canvasBp || 'desktop');
  const bg = buildBgReactStyle(p);
  const extraCls = [bg.cls, p.customCss].filter(Boolean).join(' ');
  const bgStyle = Object.keys(bg.style).length ? bg.style : undefined;

  function m(...parts) {
    return [...parts, extraCls].filter(Boolean).join(' ');
  }

  switch (block.type) {
    case 'heading': {
      const Tag = p.level || 'h2';
      return <Tag className={m(p.align, p.size, p.weight, p.color)} style={bgStyle}>{p.text || 'Heading'}</Tag>;
    }
    case 'paragraph':
      return <p className={m(p.align, p.size, p.color, p.lineHeight)} style={{ whiteSpace: 'pre-wrap', ...bg.style }}>{p.text || 'Paragraph text'}</p>;
    case 'richtext':
      return <div className={m()} style={bgStyle} dangerouslySetInnerHTML={{ __html: p.html || '<p class="text-muted-foreground text-sm italic">Rich text…</p>' }} />;
    case 'image':
      return p.src
        ? <img src={p.src} alt={p.alt || ''} className={m(p.width, p.height, p.objectFit, p.rounded)} style={bgStyle} />
        : <div className={m('bg-[hsl(var(--muted))] flex items-center justify-center text-xs text-[hsl(var(--muted-foreground))]', p.width, p.height, p.rounded)} style={bgStyle}>🖼 Image</div>;
    case 'button':
      return <div className={p.align || ''}><span className={m(p.variant, p.padding, p.rounded, p.weight, 'inline-block')} style={bgStyle}>{p.text || 'Button'}</span></div>;
    case 'list': {
      const Tag = p.ordered ? 'ol' : 'ul';
      return <Tag className={m(p.ordered ? 'list-decimal' : 'list-disc', 'pl-5', p.size, p.color, p.spacing)} style={bgStyle}>{(p.items || []).map((it, i) => <li key={i}>{it}</li>)}</Tag>;
    }
    case 'spacer':
      return <div className={m(p.height || 'h-8', 'bg-[hsl(var(--muted))]/30 border border-dashed border-[hsl(var(--border))] rounded flex items-center justify-center text-[10px] text-[hsl(var(--muted-foreground))]')} style={bgStyle}>Spacer</div>;
    case 'divider':
      return <hr className={m(p.color, p.margin, 'border-t')} style={bgStyle} />;
    case 'hero':
      return (
        <div className={m(p.paddingY, 'px-4', p.align)} style={bgStyle}>
          <div className="max-w-3xl mx-auto">
            <h1 className={['text-4xl font-bold mb-4', p.textColor].filter(Boolean).join(' ')}>{p.title || 'Hero'}</h1>
            <p className={['text-lg opacity-90', p.textColor].filter(Boolean).join(' ')}>{p.subtitle}</p>
            {p.btnText && <div className="mt-6"><span className="inline-block bg-white text-[hsl(var(--primary))] px-8 py-3 rounded-xl font-semibold">{p.btnText}</span></div>}
          </div>
        </div>
      );
    case 'card':
      return (
        <div className={m(p.padding, p.rounded, p.shadow, p.border)} style={bgStyle}>
          {p.title && <h3 className="font-semibold text-lg mb-2">{p.title}</h3>}
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{p.body}</p>
        </div>
      );
    case 'featureGrid':
      return (
        <div className={m('grid', p.cols, p.gap, p.padding)} style={bgStyle}>
          {(p.items || []).map((it, i) => (
            <div key={i} className={[p.cardBg, p.cardRounded, p.cardPadding, p.cardBorder, 'block'].filter(Boolean).join(' ')}>
              <div className={[
                'inline-flex items-center justify-center mb-3',
                p.iconBg || '',
                p.iconRounded || '',
                p.iconBg ? (p.iconPadding || 'p-2') : '',
                p.iconColor || '',
                p.iconSize || 'text-2xl',
              ].filter(Boolean).join(' ')}>{it.icon}</div>
              <h3 className="font-semibold text-sm">{it.title}</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{it.desc}</p>
            </div>
          ))}
        </div>
      );

    case 'quote':
      return (
        <figure className={m('border-l-4', p.borderColor || 'border-[hsl(var(--primary))]', p.bgColor || 'bg-[hsl(var(--muted))]', p.padding, p.rounded)} style={bgStyle}>
          <blockquote className={m(p.textSize, 'italic leading-relaxed mb-3')}>"{p.text}"</blockquote>
          {p.author && <figcaption className="text-sm font-semibold">{p.author}{p.role && <span className="font-normal text-[hsl(var(--muted-foreground))]"> — {p.role}</span>}</figcaption>}
        </figure>
      );

    case 'badge': {
      const wrapCls = p.align && p.align !== 'text-left' ? p.align : '';
      return (
        <div className={wrapCls || undefined}>
          <span className={m(p.variant, p.size, p.padding, p.rounded, 'inline-block font-medium')} style={bgStyle}>{p.text}</span>
        </div>
      );
    }

    case 'alert': {
      const ALERT_COLORS = {
        info:    'bg-blue-50 text-blue-800 border border-blue-200',
        success: 'bg-green-50 text-green-800 border border-green-200',
        warning: 'bg-amber-50 text-amber-800 border border-amber-200',
        error:   'bg-red-50 text-red-800 border border-red-200',
      };
      const ALERT_ICONS = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
      const alertCls = ALERT_COLORS[p.type || 'info'] || ALERT_COLORS.info;
      const icon = p.icon || ALERT_ICONS[p.type || 'info'] || 'ℹ️';
      return (
        <div className={m(alertCls, p.rounded, 'p-4 flex gap-3')}>
          <span className="text-lg shrink-0">{icon}</span>
          <div>
            {p.title && <strong className="block font-semibold mb-1 text-sm">{p.title}</strong>}
            <span className="text-sm">{p.message}</span>
          </div>
        </div>
      );
    }

    case 'video':
      return (
        <div className={m(p.aspectRatio, p.rounded, 'bg-[hsl(var(--muted))] flex items-center justify-center overflow-hidden')} style={bgStyle}>
          {p.url
            ? <div className="text-xs text-[hsl(var(--muted-foreground))]">🎬 {p.url}</div>
            : <div className="text-xs text-[hsl(var(--muted-foreground))]">🎬 Video — paste URL in props</div>
          }
        </div>
      );

    case 'gallery':
      return (
        <div className={m('grid', p.cols, p.gap)} style={bgStyle}>
          {(p.images || []).map((img, i) =>
            img.src
              ? <div key={i} className={m(p.height, 'overflow-hidden', p.rounded)}><img src={img.src} alt={img.alt || ''} className={m('w-full h-full', p.objectFit)} /></div>
              : <div key={i} className={m(p.height, p.rounded, 'bg-[hsl(var(--muted))] flex items-center justify-center text-xs text-[hsl(var(--muted-foreground))]')}>🖼</div>
          )}
        </div>
      );

    case 'stats':
      return (
        <div className={m('grid', p.cols, p.gap)} style={bgStyle}>
          {(p.items || []).map((item, i) => (
            <div key={i} className={[p.cardBg, p.cardRounded, p.cardBorder, p.padding, p.align].filter(Boolean).join(' ')}>
              <div className={[p.valueSize || 'text-3xl', p.valueWeight || 'font-bold', p.valueColor || 'text-primary'].filter(Boolean).join(' ')}>{item.value}</div>
              <div className={[p.labelSize || 'text-sm', p.labelColor || 'text-muted-foreground', 'mt-1'].filter(Boolean).join(' ')}>{item.label}</div>
            </div>
          ))}
        </div>
      );

    case 'testimonial':
      return (
        <figure className={m(p.padding, p.rounded, p.border)} style={bgStyle}>
          <blockquote className="italic leading-relaxed mb-4 text-sm">"{p.quote}"</blockquote>
          <figcaption className="flex items-center gap-3">
            {p.avatar
              ? <img src={p.avatar} alt={p.name || ''} className="size-10 rounded-full object-cover ring-2 ring-[hsl(var(--primary))]/30" />
              : <div className="size-10 rounded-full bg-[hsl(var(--primary))]/20 flex items-center justify-center text-base font-bold text-[hsl(var(--primary))]">{(p.name || '?').charAt(0).toUpperCase()}</div>
            }
            <div>
              <div className="font-semibold text-sm">{p.name}</div>
              <div className="text-xs text-[hsl(var(--muted-foreground))]">{p.role}</div>
            </div>
          </figcaption>
        </figure>
      );

    case 'accordion':
      return (
        <div className={m(p.rounded, 'overflow-hidden divide-y divide-[hsl(var(--border))] ring-1 ring-[hsl(var(--border))]')} style={bgStyle}>
          {(p.items || []).map((item, i) => (
            <div key={i} className={p.bgColor || 'bg-card'}>
              <div className="flex items-center justify-between px-4 py-3 font-medium text-sm">
                {item.question}
                <span className="text-[hsl(var(--muted-foreground))]">▾</span>
              </div>
              {i === 0 && <div className="px-4 pb-3 text-sm text-[hsl(var(--muted-foreground))]">{item.answer}</div>}
            </div>
          ))}
        </div>
      );

    case 'tabs': {
      const tabItems = p.items || [];
      const active = Math.max(0, Math.min(Number(p.activeTab) || 0, tabItems.length - 1));
      return (
        <div style={bgStyle}>
          <div className={m(p.tabBg || 'bg-muted', p.rounded || 'rounded-xl', 'flex flex-wrap gap-1 p-1 mb-1')}>
            {tabItems.map((tab, i) => (
              <span key={i} className={[(i === active ? (p.activeBg || 'bg-background') : 'opacity-50'), 'px-3 py-1.5 text-xs font-medium rounded-lg'].filter(Boolean).join(' ')}>{tab.label}</span>
            ))}
          </div>
          {tabItems[active] && (
            <div className={m(p.contentBg || 'bg-card', 'p-4 text-sm')}>{tabItems[active].content}</div>
          )}
        </div>
      );
    }

    case 'cta':
      return (
        <div className={m(p.paddingY, 'px-4', p.align, p.rounded)} style={bgStyle}>
          <h2 className="text-2xl font-bold mb-2">{p.title}</h2>
          <p className="opacity-80 mb-4 text-sm">{p.subtitle}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {p.btnText && <span className={m(p.btnVariant, 'inline-block px-5 py-2.5 rounded-xl font-semibold text-sm')}>{p.btnText}</span>}
            {p.secondBtnText && <span className={m(p.secondBtnVariant, 'inline-block px-5 py-2.5 rounded-xl font-semibold text-sm')}>{p.secondBtnText}</span>}
          </div>
        </div>
      );

    case 'html':
      return <div className={m()} style={bgStyle} dangerouslySetInnerHTML={{ __html: p.code || '' }} />;

    case 'postLoop':
      return <LoopBlockPreview block={block} p={p} m={m} bgStyle={bgStyle} />;

    case 'categoryLoop':
      return <LoopBlockPreview block={block} p={p} m={m} bgStyle={bgStyle} />;

    case 'slider': {
      const slides = p.items || [];
      if (!slides.length) {
        return <div className={m(p.height || 'h-64', p.rounded || 'rounded-xl', 'bg-[hsl(var(--muted))] flex items-center justify-center text-xs text-[hsl(var(--muted-foreground))]')} style={bgStyle}>No slides — add in props</div>;
      }
      const slide = slides[0];
      return (
        <div className={m('relative overflow-hidden', p.rounded || 'rounded-xl')} style={bgStyle}>
          <div
            className={[p.height || 'h-64', 'w-full relative bg-[hsl(var(--muted))]'].join(' ')}
            style={slide.image ? { backgroundImage: `url('${slide.image}')`, backgroundSize: p.objectFit === 'object-contain' ? 'contain' : 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : undefined}
          >
            {(slide.title || slide.desc) && (
              <div className="absolute inset-0 flex flex-col justify-end p-4" style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.6),transparent)' }}>
                <div className={[p.titleColor || 'text-white', 'font-bold text-base leading-snug'].join(' ')}>{slide.title}</div>
                {slide.desc && <div className="text-white/80 text-xs mt-0.5">{slide.desc}</div>}
              </div>
            )}
          </div>
          {p.showDots && (
            <div className="flex justify-center gap-1.5 mt-2">
              {slides.map((_, i) => (
                <span key={i} className="size-1.5 rounded-full inline-block" style={{ background: i === 0 ? 'hsl(var(--primary))' : 'hsl(var(--border))' }} />
              ))}
            </div>
          )}
        </div>
      );
    }

    default:
      return <div className="text-xs text-[hsl(var(--muted-foreground))]">[{block.type}]</div>;
  }
}

/* ═══ Block Item (recursive — handles containers + leaves) ═══ */

function BlockItem({ block, depth, canvasBp, selectedId, setSelectedId, dropIndicator, setDropIndicator, actions }) {
  const isContainer = CONTAINERS.has(block.type);
  const isSelected = block.id === selectedId;
  const children = block.children || [];
  const p = getEffectiveProps(block, canvasBp || 'desktop'); // effective for canvas preview
  const def = BLOCK_DEFS[block.type];

  /* Drag this block */
  function handleDragStart(e) {
    e.stopPropagation();
    e.dataTransfer.setData('sbuilder/move', block.id);
    e.dataTransfer.effectAllowed = 'move';
    requestAnimationFrame(() => { e.target.style.opacity = '0.4'; });
  }

  function handleDragEnd(e) {
    e.target.style.opacity = '1';
  }

  /* Drop target indicator */
  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const h = rect.height;
    let pos;
    if (isContainer) {
      const edge = Math.max(12, h * 0.1);
      if (y < edge) pos = 'before';
      else if (y > h - edge) pos = 'after';
      else pos = 'inside';
    } else {
      pos = y < h / 2 ? 'before' : 'after';
    }
    setDropIndicator({ blockId: block.id, position: pos });
  }

  /* Visual indicator */
  const ind = dropIndicator?.blockId === block.id ? dropIndicator.position : null;
  const indicatorStyle = {};
  if (ind === 'before') indicatorStyle.boxShadow = 'inset 0 3px 0 0 hsl(var(--primary))';
  else if (ind === 'after') indicatorStyle.boxShadow = 'inset 0 -3px 0 0 hsl(var(--primary))';
  else if (ind === 'inside') {
    indicatorStyle.outline = '2px dashed hsl(var(--primary))';
    indicatorStyle.outlineOffset = '-2px';
  }

  /* Container wrapper classes + background */
  const containerBg = isContainer ? buildBgReactStyle(p) : { cls: '', style: {} };
  const containerCustom = isContainer ? (p.customCss || '') : '';
  const containerCls = block.type === 'section'
    ? [containerBg.cls, p.paddingY, p.paddingX, containerCustom].filter(Boolean).join(' ')
    : block.type === 'grid'
      ? ['grid', `grid-cols-${p.cols || 2}`, p.gap, containerBg.cls, containerCustom].filter(Boolean).join(' ')
      : block.type === 'columns'
        ? ['flex flex-wrap', p.gap, p.align, p.paddingY, p.paddingX, containerBg.cls, containerCustom].filter(Boolean).join(' ')
        : '';
  const containerStyle = Object.keys(containerBg.style).length ? containerBg.style : undefined;
  const sectionInner = block.type === 'section' ? (p.maxWidth || '') : '';

  /* Render children inside container */
  function renderChildren() {
    if (children.length === 0) {
      return (
        <div className="min-h-[60px] border-2 border-dashed border-[hsl(var(--border))] rounded-lg flex items-center justify-center text-xs text-[hsl(var(--muted-foreground))] gap-1.5 col-span-full">
          <Plus className="size-3.5" /> Drop or click blocks here
        </div>
      );
    }
    return children.map(child => (
      <BlockItem
        key={child.id}
        block={child}
        depth={depth + 1}
        canvasBp={canvasBp}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        dropIndicator={dropIndicator}
        setDropIndicator={setDropIndicator}
        actions={actions}
      />
    ));
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onClick={(e) => { e.stopPropagation(); setSelectedId(block.id); }}
      className={[
        'relative group cursor-pointer transition-all',
        isSelected
          ? 'ring-2 ring-[hsl(var(--primary))] ring-inset'
          : 'hover:ring-1 hover:ring-[hsl(var(--primary))]/30 hover:ring-inset',
        isContainer && !isSelected ? 'border-l-2 border-[hsl(var(--primary))]/20' : '',
      ].filter(Boolean).join(' ')}
      style={indicatorStyle}
    >
      {/* Depth indicator */}
      {depth > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[hsl(var(--primary))]/20 z-10" />
      )}

      {/* Controls overlay */}
      <div className={[
        'absolute right-1 top-1 z-20 flex items-center gap-0.5 rounded-lg bg-[hsl(var(--card))] p-0.5 shadow ring-1 ring-[hsl(var(--border))] transition-opacity',
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
      ].join(' ')}>
        <button className="rounded p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] cursor-grab active:cursor-grabbing" title="Drag">
          <GripVertical className="size-3" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); actions.move(block.id, -1); }}
          className="rounded p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] disabled:opacity-20" title="Move up">
          <ChevronUp className="size-3" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); actions.move(block.id, 1); }}
          className="rounded p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] disabled:opacity-20" title="Move down">
          <ChevronDown className="size-3" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); actions.duplicate(block.id); }}
          className="rounded p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]" title="Duplicate">
          <Copy className="size-3" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); actions.remove(block.id); }}
          className="rounded p-1 text-[hsl(var(--destructive))] hover:opacity-70" title="Delete">
          <Trash2 className="size-3" />
        </button>
      </div>

      {/* Block type label */}
      {isSelected && (
        <div className="absolute left-1 top-1 z-20 rounded bg-[hsl(var(--primary))] px-1.5 py-0.5 text-[10px] font-medium text-[hsl(var(--primary-foreground))]">
          {def?.label || block.type}{isContainer ? ` (${children.length})` : ''}
        </div>
      )}

      {/* Content */}
      {isContainer ? (
        <div className="p-2">
          <div className={containerCls} style={containerStyle}>
            {sectionInner ? (
              <div className={sectionInner}>
                {renderChildren()}
              </div>
            ) : (
              renderChildren()
            )}
          </div>
        </div>
      ) : (
        <div className="p-2">
          <BlockPreview block={block} canvasBp={canvasBp} />
        </div>
      )}
    </div>
  );
}

/* ═══ S Builder Main Component ═══════════════════ */

export default function SBuilder({ blocks: initialBlocks, onChange, onMediaPick, postTypes = [], categories = [], taxonomies = [] }) {
  const [blocks, setBlocks] = useState(initialBlocks || []);
  const [selectedId, setSelectedId] = useState(null);
  const [breakpoint, setBreakpoint] = useState('desktop');
  const [paletteSearch, setPaletteSearch] = useState('');
  const [history, setHistory] = useState([]);
  const [dropIndicator, setDropIndicator] = useState(null);

  const selectedBlock = selectedId ? findBlock(blocks, selectedId) : null;
  const bp = BREAKPOINTS.find(b => b.id === breakpoint);

  /* ── State commits with undo ── */
  function commit(next) {
    setHistory(h => [...h.slice(-30), blocks]);
    setBlocks(next);
    onChange?.(next);
  }

  function undo() {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setBlocks(prev);
    onChange?.(prev);
  }

  /* ── Add block from palette click ── */
  function addBlock(type) {
    const block = createBlock(type);
    if (!block) return;

    // If a container is selected, add as its child
    const sel = selectedId ? findBlock(blocks, selectedId) : null;
    if (sel && CONTAINERS.has(sel.type)) {
      commit(insertAt(blocks, block, {
        containerId: sel.id,
        index: (sel.children || []).length,
      }));
    } else {
      commit([...blocks, block]);
    }
    setSelectedId(block.id);
  }

  /* ── Update block props (no undo for prop edits) ── */
  const updateBlock = useCallback((u) => {
    setBlocks(prev => {
      const next = updateInTree(prev, u);
      onChange?.(next);
      return next;
    });
  }, [onChange]);

  /* ── Actions passed to BlockItem ── */
  const actions = {
    remove(id) {
      commit(removeBlock(blocks, id));
      if (selectedId === id) setSelectedId(null);
    },

    duplicate(id) {
      const orig = findBlock(blocks, id);
      if (!orig) return;
      const clone = deepClone(orig);
      const ctx = findCtx(blocks, id);
      if (!ctx) return;
      commit(insertAt(blocks, clone, {
        containerId: ctx.parent?.id || null,
        index: ctx.index + 1,
      }));
      setSelectedId(clone.id);
    },

    move(id, dir) {
      const ctx = findCtx(blocks, id);
      if (!ctx) return;
      const t = ctx.index + dir;
      if (t < 0 || t >= ctx.siblings.length) return;
      if (ctx.parent) {
        const ch = [...ctx.parent.children];
        [ch[ctx.index], ch[t]] = [ch[t], ch[ctx.index]];
        commit(updateInTree(blocks, { ...ctx.parent, children: ch }));
      } else {
        const n = [...blocks];
        [n[ctx.index], n[t]] = [n[t], n[ctx.index]];
        commit(n);
      }
    },
  };

  /* ── Canvas drop handler ── */
  function handleDrop(e) {
    e.preventDefault();
    const newType = e.dataTransfer.getData('sbuilder/new');
    const moveId = e.dataTransfer.getData('sbuilder/move');

    if (newType) {
      const block = createBlock(newType);
      if (!block) { setDropIndicator(null); return; }
      if (dropIndicator) {
        const target = resolveTarget(blocks, dropIndicator);
        if (target) commit(insertAt(blocks, block, target));
      } else {
        // Dropped on empty canvas — append to root
        commit([...blocks, block]);
      }
      setSelectedId(block.id);
    } else if (moveId && dropIndicator) {
      const moving = findBlock(blocks, moveId);
      if (!moving) { setDropIndicator(null); return; }

      // Prevent dropping into self or own descendant
      const target = resolveTarget(blocks, dropIndicator);
      if (!target) { setDropIndicator(null); return; }
      if (target.containerId && (target.containerId === moveId || isDescendant(moving, target.containerId))) {
        setDropIndicator(null);
        return;
      }

      // Remove, then re-resolve target in modified tree
      const after = removeBlock(blocks, moveId);
      const adjusted = resolveTarget(after, dropIndicator);
      if (adjusted) commit(insertAt(after, moving, adjusted));
    }

    setDropIndicator(null);
  }

  /* ── Palette filter ── */
  const filteredCategories = CATEGORIES.map(cat => {
    const items = Object.entries(BLOCK_DEFS)
      .filter(([, d]) => d.category === cat.id)
      .filter(([, d]) => !paletteSearch || d.label.toLowerCase().includes(paletteSearch.toLowerCase()));
    return { ...cat, items };
  }).filter(c => c.items.length > 0);

  return (
    <div className="flex h-full overflow-hidden">

      {/* ── Left: Block Palette ── */}
      <div className="w-56 shrink-0 min-h-0 overflow-y-auto border-r border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="p-2.5">
          <Input
            value={paletteSearch}
            onChange={e => setPaletteSearch(e.target.value)}
            placeholder="Search blocks…"
            className="text-xs h-8"
          />
        </div>

        {/* Hint: adding to container */}
        {selectedBlock && CONTAINERS.has(selectedBlock.type) && (
          <div className="mx-2.5 mb-2 rounded-lg bg-[hsl(var(--primary))]/10 px-2.5 py-1.5 text-[10px] text-[hsl(var(--primary))]">
            Click adds to: <strong>{BLOCK_DEFS[selectedBlock.type]?.label}</strong>
          </div>
        )}

        {filteredCategories.map(cat => (
          <div key={cat.id} className="mb-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
              {cat.label}
            </div>
            <div className="px-2 space-y-0.5">
              {cat.items.map(([type, def]) => (
                <button
                  key={type}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('sbuilder/new', type);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  onClick={() => addBlock(type)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]"
                >
                  <def.icon className="size-3.5 shrink-0 text-[hsl(var(--muted-foreground))]" />
                  <span className="flex-1">{def.label}</span>
                  <Plus className="size-3 shrink-0 text-[hsl(var(--muted-foreground))]" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Center: Canvas ── */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">

        {/* Canvas toolbar */}
        <div className="flex items-center gap-2 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1.5">
          <div className="flex items-center gap-0.5 rounded-lg bg-[hsl(var(--muted))] p-0.5">
            {BREAKPOINTS.map(b => (
              <button
                key={b.id}
                onClick={() => setBreakpoint(b.id)}
                title={b.label}
                className={
                  'rounded-md p-1 transition-colors ' +
                  (breakpoint === b.id
                    ? 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-sm'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]')
                }
              >
                <b.icon className="size-3.5" />
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
            {countAll(blocks)} block{countAll(blocks) !== 1 ? 's' : ''}
          </span>
          <button
            onClick={undo}
            disabled={!history.length}
            className="rounded-md p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] disabled:opacity-30"
            title="Undo"
          >
            <Undo2 className="size-3.5" />
          </button>
        </div>

        {/* Canvas area */}
        <div
          className="flex-1 overflow-auto bg-[hsl(var(--muted))] p-4 lg:p-6"
          onClick={() => setSelectedId(null)}
          onDragOver={(e) => { e.preventDefault(); setDropIndicator(null); }}
          onDrop={handleDrop}
        >
          <div
            className={
              'mx-auto min-h-[400px] bg-[hsl(var(--background))] shadow-lg ring-1 ring-[hsl(var(--border))] transition-all ' +
              (bp?.canvas || 'w-full')
            }
          >
            {blocks.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-sm text-[hsl(var(--muted-foreground))]">
                <div className="text-center">
                  <Plus className="mx-auto mb-2 size-8 opacity-30" />
                  <div>Click or drag a block from the left</div>
                  <div className="text-xs mt-1 opacity-60">Section &amp; Grid can hold child blocks</div>
                </div>
              </div>
            ) : (
              blocks.map(block => (
                <BlockItem
                  key={block.id}
                  block={block}
                  depth={0}
                  canvasBp={breakpoint}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                  dropIndicator={dropIndicator}
                  setDropIndicator={setDropIndicator}
                  actions={actions}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Right: Properties Panel ── */}
      <div className="w-72 shrink-0 min-h-0 overflow-y-auto border-l border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
          Properties
        </div>
        <PropsPanel
          block={selectedBlock}
          onChange={updateBlock}
          onMediaPick={onMediaPick}
          postTypes={postTypes}
          categories={categories}
          taxonomies={taxonomies}
        />
      </div>
    </div>
  );
}
