/**
 * BlocksView — public-facing block renderer.
 *
 * Renders an array of SBuilder blocks:
 *   - Container blocks (section, grid, columns) → rendered as React with recursive children
 *   - postLoop / categoryLoop → fetched live from /api/loop-preview
 *   - slider → rendered with React Swiper component
 *   - All other blocks → rendered via renderBlock (HTML string) using dangerouslySetInnerHTML
 *
 * This ensures loop blocks nested inside containers also show live data.
 */
import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { renderBlock } from '../lib/sbuilder/renderer';
import SliderBlock from './SliderBlock';

const LOOP_TYPES      = new Set(['postLoop', 'categoryLoop']);
const CONTAINER_TYPES = new Set(['section', 'grid', 'columns']);

/* ─── DOMPurify config ───────────────── */
const PURIFY_CONFIG = {
  USE_PROFILES: { html: true },
  ADD_ATTR: ['style', 'target', 'loading', 'allowfullscreen', 'frameborder'],
  ADD_TAGS: ['iframe'],
};

/* ─── In-memory cache ───────────────── */
const loopCache = {};

/* ─── hasLoop helper ───────────────── */
function hasLoopDescendant(block) {
  if (LOOP_TYPES.has(block.type)) return true;
  return (block.children || []).some(hasLoopDescendant);
}

/* ─── Block component ───────────────── */
function Block({ block }) {
  console.log('Block type:', block.type, block);
  
  // Slider block → React Swiper component
  if (block.type === 'slider') {
    console.log('Rendering SliderBlock');
    return <SliderBlock block={block} />;
  }

  // Loop blocks → live AJAX
  if (LOOP_TYPES.has(block.type)) {
    return <LoopBlock block={block} />;
  }

  // Container blocks that contain any loop descendants → render as React
  if (CONTAINER_TYPES.has(block.type) && (block.children || []).some(hasLoopDescendant)) {
    return <ContainerBlock block={block} />;
  }

  // Everything else → render via JS HTML renderer
  const html = renderBlock(block);
  if (!html) return null;
  return (
    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html, PURIFY_CONFIG) }} />
  );
}

/* ─── Container block ───────────────── */
function ContainerBlock({ block }) {
  const p = block.props || {};
  const children = block.children || [];

  const desktopCols = p.cols || 'grid-cols-1';
  const mdCols      = block.responsive?.md?.cols;
  const smCols      = block.responsive?.sm?.cols;
  const colsClass   = smCols
    ? [smCols, mdCols && `md:${mdCols}`, `lg:${desktopCols}`].filter(Boolean).join(' ')
    : mdCols
      ? [`${mdCols}`, `lg:${desktopCols}`].join(' ')
      : desktopCols;

  const desktopGap = p.gap || 'gap-4';
  const mdGap      = block.responsive?.md?.gap;
  const smGap      = block.responsive?.sm?.gap;
  const gapClass   = smGap
    ? [smGap, mdGap && `md:${mdGap}`, `lg:${desktopGap}`].filter(Boolean).join(' ')
    : mdGap
      ? [`${mdGap}`, `lg:${desktopGap}`].join(' ')
      : desktopGap;

  const bgAttrs = buildBgAttrs(p);
  const sectionClass = `relative w-full ${p.rounded || 'rounded-xl'} ${bgAttrs.cls} ${p.padding || 'py-8'} ${p.margin || ''}`.trim();
  const sectionStyle = bgAttrs.style || {};

  return (
    <section className={sectionClass} style={sectionStyle}>
      {p.sectionTitle && <h2 className="text-2xl font-bold mb-6 px-4 lg:px-0">{p.sectionTitle}</h2>}
      <div className={`${block.type === 'grid' ? 'grid' : 'flex flex-col'} ${colsClass} ${gapClass}`}>
        {children.map((child, i) => (
          <div key={child.id || i} className="min-w-0">
            <Block block={child} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Loop block ───────────────── */
function LoopBlock({ block }) {
  const p      = block.props || {};
  const isPost = block.type === 'postLoop';

  // Backward-compat: paginationType falls back from legacy showPagination boolean
  const paginationType = p.paginationType
    || (p.showPagination === false ? 'none' : 'pagination');

  // Responsive grid columns + gap — mobile-first (sm = base, md:, lg: for desktop)
  const desktopCols = p.cols || 'grid-cols-2';
  const mdCols      = block.responsive?.md?.cols;
  const smCols      = block.responsive?.sm?.cols;
  const colsClass   = smCols
    ? [smCols, mdCols && `md:${mdCols}`, `lg:${desktopCols}`].filter(Boolean).join(' ')
    : mdCols
      ? [`${mdCols}`, `lg:${desktopCols}`].join(' ')
      : desktopCols;

  const desktopGap = p.gap || (isPost ? 'gap-4' : 'gap-3');
  const mdGap      = block.responsive?.md?.gap;
  const smGap      = block.responsive?.sm?.gap;
  const gapClass   = smGap
    ? [smGap, mdGap && `md:${mdGap}`, `lg:${desktopGap}`].filter(Boolean).join(' ')
    : mdGap
      ? [`${mdGap}`, `lg:${desktopGap}`].join(' ')
      : desktopGap;

  const cardBg      = p.cardBg      || 'bg-card';
  const cardRounded = p.cardRounded || 'rounded-xl';
  const cardBorder  = p.cardBorder  || 'border border-border';
  const cardPadding = p.cardPadding || 'p-4';

  function buildUrl(page = 1) {
    const q = new URLSearchParams({ type: block.type });
    if (isPost) {
      if (p.postTypeId) q.set('postTypeId', p.postTypeId);
      if (p.categoryId) q.set('categoryId', p.categoryId);
      q.set('orderBy', p.orderBy || 'latest');
    } else {
      if (p.taxonomyId) q.set('taxonomyId', p.taxonomyId);
    }
    q.set('count', String(Math.min(Number(p.count) || (isPost ? 6 : 8), 24)));
    q.set('page', String(page));
    return `/api/loop-preview?${q.toString()}`;
  }

  const baseUrl = buildUrl(1);
  const [pageItems,   setPageItems]   = useState(() => loopCache[baseUrl]?.items || null);
  const [meta,         setMeta]        = useState(() => loopCache[baseUrl]?.meta  || null);
  const [loading,      setLoading]     = useState(!loopCache[baseUrl]);
  const [page,         setPage]        = useState(1);
  const [accItems,     setAccItems]    = useState(() => loopCache[baseUrl]?.items || []);
  const [moreLoading, setMoreLoading] = useState(false);
  const timerRef    = useRef(null);
  const sentinelRef = useRef(null);
  const prevBaseRef = useRef(baseUrl);

  useEffect(() => {
    if (prevBaseRef.current !== baseUrl) {
      prevBaseRef.current = baseUrl;
      setPage(1);
      setAccItems([]);
      setPageItems(null);
      setMeta(null);
      setLoading(true);
      return;
    }

    const url = buildUrl(page);
    if (loopCache[url]) {
      const c = loopCache[url];
      setPageItems(c.items);
      setMeta(c.meta);
      if (paginationType !== 'pagination') {
        setAccItems(prev => page === 1 ? c.items : [...prev, ...c.items]);
      }
      setLoading(false);
      setMoreLoading(false);
      return;
    }

    if (page === 1) setLoading(true);
    else setMoreLoading(true);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' } })
        .then(r => r.ok ? r.json() : Promise.reject(r.status))
        .then(data => {
          const result = {
            items: data.items || [],
            meta: { total: data.total, pages: data.pages, currentPage: data.currentPage ?? page },
          };
          loopCache[url] = result;
          setPageItems(result.items);
          setMeta(result.meta);
          if (paginationType !== 'pagination') {
            setAccItems(prev => page === 1 ? result.items : [...prev, ...result.items]);
          }
          setLoading(false);
          setMoreLoading(false);
        })
        .catch(() => { setPageItems([]); setLoading(false); setMoreLoading(false); });
    }, 0);
    return () => clearTimeout(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl, page]);

  useEffect(() => {
    if (paginationType !== 'infinity' || !sentinelRef.current) return;
    const el = sentinelRef.current;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && meta && page < meta.pages && !moreLoading && !loading) {
        setPage(pg => pg + 1);
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [paginationType, meta, page, moreLoading, loading]);

  const count        = Math.min(Number(p.count) || (isPost ? 6 : 8), 24);
  const displayItems = paginationType === 'pagination' ? (pageItems || []) : accItems;
  const hasMore      = !!(meta && page < meta.pages);

  if (loading) {
    return (
      <div className={`grid ${colsClass} ${gapClass}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`${cardBg} ${cardRounded} ${cardBorder} ${cardPadding} animate-pulse overflow-hidden`}>
            {isPost && p.showImage !== false && (
              <div className={`${p.imageHeight || 'h-40'} bg-[hsl(var(--muted))] rounded-lg mb-3`} />
            )}
            <div className="h-2.5 bg-[hsl(var(--muted))] rounded w-4/5 mt-1 mb-1.5" />
            <div className="h-2 bg-[hsl(var(--muted))] rounded w-3/5" />
          </div>
        ))}
      </div>
    );
  }

  function renderCard(item, i) {
    if (isPost) {
      return (
        <a key={item.id ?? i} href={item.href}
          className={`${cardBg} ${cardRounded} ${cardBorder} ${cardPadding} block hover:opacity-90 transition overflow-hidden`}>
          {p.showImage !== false && (
            item.image
              ? <img src={item.image} alt={item.title}
                  className={`${p.imageHeight || 'h-40'} w-full object-cover rounded-lg mb-3`} loading="lazy" />
              : <div className={`${p.imageHeight || 'h-40'} bg-[hsl(var(--muted))] rounded-lg mb-3`} />
          )}
          {(p.showCategory !== false || p.showDate !== false) && (
            <div className="flex items-center gap-2 mb-1.5">
              {p.showCategory !== false && item.category && (
                <span className="text-xs text-[hsl(var(--primary))] font-medium">{item.category}</span>
              )}
              {p.showDate !== false && item.date && (
                <span className="text-xs text-[hsl(var(--muted-foreground))]">{item.date}</span>
              )}
            </div>
          )}
          {p.showTitle !== false && item.title && (
            <h3 className={`font-semibold text-[hsl(var(--foreground))] ${p.titleLines === 2 ? 'line-clamp-2' : 'line-clamp-1'}`}>{item.title}</h3>
          )}
          {p.showExcerpt !== false && item.excerpt && (
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 line-clamp-2">{item.excerpt}</p>
          )}
        </a>
      );
    }

    // Category loop card
    return (
      <a key={item.id ?? i} href={item.href}
        className={`${cardBg} ${cardRounded} ${cardBorder} ${cardPadding} block hover:opacity-90 transition`}>
        {item.title && (
          <h3 className="font-semibold text-[hsl(var(--foreground))] line-clamp-1">{item.title}</h3>
        )}
        {item.count !== undefined && (
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{item.count} articles</p>
        )}
      </a>
    );
  }

  return (
    <div>
      <div className={`grid ${colsClass} ${gapClass}`}>
        {(displayItems || []).map((item, i) => renderCard(item, i))}
      </div>

      {paginationType === 'pagination' && meta && meta.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: meta.pages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--muted))]'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {paginationType === 'infinity' && hasMore && (
        <div ref={sentinelRef} className="py-4 text-center text-sm text-[hsl(var(--muted-foreground))]">
          {moreLoading ? 'Loading more...' : 'Scroll for more'}
        </div>
      )}
    </div>
  );
}

/* ─── Background helpers ───────────────── */
function buildBgAttrs(p) {
  const bgType = p.bgType ?? (p.background || p.bg ? 'legacy' : 'none');

  if (bgType === 'none') {
    return { cls: '', style: '' };
  }
  if (bgType === 'legacy') {
    return { cls: p.background || p.bg || '', style: '' };
  }
  if (bgType === 'color') {
    const c = p.bgColor || '';
    if (!c) return { cls: '', style: '' };
    if (c[0] === '#' || c.startsWith('rgb')) {
      return { cls: '', style: { backgroundColor: c } };
    }
    return { cls: c, style: '' };
  }
  if (bgType === 'gradient') {
    const dirMap = {
      'to-r': 'to right', 'to-l': 'to left',
      'to-t': 'to top',   'to-b': 'to bottom',
      'to-br': 'to bottom right', 'to-bl': 'to bottom left',
      'to-tr': 'to top right',    'to-tl': 'to top left',
    };
    const dir  = dirMap[p.bgGradientDir ?? 'to-br'] ?? 'to bottom right';
    const from = p.bgGradientFrom ?? '#3b82f6';
    const to   = p.bgGradientTo   ?? '#8b5cf6';
    return { cls: '', style: { background: `linear-gradient(${dir},${from},${to})` } };
  }
  if (bgType === 'image' && p.bgImage) {
    const style = { backgroundImage: `url('${p.bgImage}')`, backgroundSize: p.bgSize ?? 'cover', backgroundPosition: p.bgPosition ?? 'center', backgroundRepeat: 'no-repeat' };
    if (p.bgOverlayColor?.startsWith('#') && p.bgOverlayColor.length >= 7) {
      const r = parseInt(p.bgOverlayColor.slice(1, 3), 16);
      const g = parseInt(p.bgOverlayColor.slice(3, 5), 16);
      const b = parseInt(p.bgOverlayColor.slice(5, 7), 16);
      const a = parseInt(p.bgOverlayOpacity ?? '50', 10) / 100;
      style.backgroundImage = `linear-gradient(rgba(${r},${g},${b},${a}),rgba(${r},${g},${b},${a})),url('${p.bgImage}')`;
    }
    return { cls: '', style };
  }
  return { cls: '', style: '' };
}

/* ─── Public export ───────────────── */
export default function BlocksView({ blocks }) {
  if (!blocks?.length) return null;
  return <>{blocks.map(block => <Block key={block.id} block={block} />)}</>;
}
