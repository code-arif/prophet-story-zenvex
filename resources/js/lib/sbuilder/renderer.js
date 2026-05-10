/**
 * S Builder — HTML Renderer
 * Converts builder blocks JSON to rendered HTML string (client-side).
 * Mirrors the PHP renderBuilderHtml() in AdminPageBuilderController.
 */

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function cls(...parts) {
  return parts.filter(Boolean).join(' ');
}

/**
 * Convert block.responsive overrides to Tailwind classes.
 * Tailwind is mobile-first:
 *   sm  → phone  → BASE (no prefix)
 *   md  → tablet → md:
 *   lg+ → desktop class comes from block.props prefixed with lg: (handled in renderBlock)
 */
function responsiveClasses(responsive) {
  if (!responsive) return '';
  const parts = [];
  for (const [bp, val] of Object.entries(responsive)) {
    if (!val) continue;
    if (typeof val === 'string') {
      if (val.trim()) parts.push(val.trim());
    } else if (val != null && typeof val === 'object') {
      // sm = phone → base (no Tailwind prefix), md = tablet → md:
      const prefix = bp === 'sm' ? '' : `${bp}:`;
      for (const clsVal of Object.values(val)) {
        if (!clsVal) continue;
        String(clsVal).trim().split(/\s+/).filter(Boolean).forEach((c) => {
          if (c.includes(':')) parts.push(c);           // already has a prefix
          else if (prefix) parts.push(`${prefix}${c}`); // md:xxx or lg:xxx
          else parts.push(c);                            // sm = base, no prefix
        });
      }
    }
  }
  return parts.join(' ');
}

/* ─── Background Helpers ──────────────────────── */

const GRADIENT_DIR_MAP = {
  'to-r': 'to right', 'to-l': 'to left', 'to-t': 'to top', 'to-b': 'to bottom',
  'to-br': 'to bottom right', 'to-bl': 'to bottom left',
  'to-tr': 'to top right', 'to-tl': 'to top left',
};

function hexToRgba(hex, alpha) {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return null;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function escCssUrl(str) {
  if (!str) return '';
  return String(str).replace(/['"\(\)\\]/g, '\\$&');
}

function buildBgAttrs(p) {
  const bgType = p.bgType || (p.background ? 'legacy' : 'none');
  if (bgType === 'none') return { cls: '', style: '' };
  if (bgType === 'legacy') return { cls: p.background || '', style: '' };

  if (bgType === 'color') {
    const c = p.bgColor || '';
    if (c.startsWith('#') || c.startsWith('rgb')) {
      return { cls: '', style: `background-color:${esc(c)}` };
    }
    return { cls: c, style: '' };
  }

  if (bgType === 'gradient') {
    const dir = GRADIENT_DIR_MAP[p.bgGradientDir || 'to-br'] || 'to bottom right';
    const from = p.bgGradientFrom || '#3b82f6';
    const to = p.bgGradientTo || '#8b5cf6';
    return { cls: '', style: `background:linear-gradient(${dir},${esc(from)},${esc(to)})` };
  }

  if (bgType === 'image' && p.bgImage) {
    const overlay = p.bgOverlayColor
      ? hexToRgba(p.bgOverlayColor, parseInt(p.bgOverlayOpacity || '50', 10) / 100)
      : null;
    const img = `url('${escCssUrl(p.bgImage)}')`;
    const bgImg = overlay ? `linear-gradient(${overlay},${overlay}),${img}` : img;
    return {
      cls: '',
      style: `background-image:${bgImg};background-position:${p.bgPosition || 'center'};background-size:${p.bgSize || 'cover'};background-repeat:no-repeat`,
    };
  }

  return { cls: '', style: '' };
}

function styleAttr(style) {
  return style ? ` style="${style}"` : '';
}

/* ─── Render ──────────────────────────────────── */

function _renderBlock(block) {
  const p = block.props || {};
  const resp = block.responsive || {};
  const rc = responsiveClasses(resp);
  const bg = buildBgAttrs(p);
  const cc = p.customCss || '';

  /**
   * Returns the desktop value for a prop, prefixed with `lg:` on each token
   * when that prop has a responsive override (sm or md). This ensures the
   * desktop value only takes effect at ≥1024px, leaving the base class (from
   * the sm/phone override via responsiveClasses) in control on smaller screens.
   */
  function rp(key) {
    const val = p[key];
    if (!val) return '';
    const hasSm = resp.sm != null && typeof resp.sm === 'object' && key in resp.sm;
    const hasMd = resp.md != null && typeof resp.md === 'object' && key in resp.md;
    if (!hasSm && !hasMd) return String(val);
    return String(val)
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((c) => (c.includes(':') ? c : `lg:${c}`))
      .join(' ');
  }

  switch (block.type) {
    case 'heading': {
      const tag = p.level || 'h2';
      return `<${tag} class="${cls(rp('size'), rp('weight'), rp('align'), rp('color'), bg.cls, cc, rc)}"${styleAttr(bg.style)}>${esc(p.text)}</${tag}>`;
    }

    case 'paragraph':
      return `<p class="${cls(rp('size'), rp('align'), rp('color'), rp('lineHeight'), bg.cls, cc, rc)}"${styleAttr(bg.style)}>${esc(p.text).replace(/\n/g, '<br>')}</p>`;

    case 'richtext':
      return `<div class="${cls(bg.cls, cc, rc)}"${styleAttr(bg.style)}>${p.html || ''}</div>`;

    case 'image':
      if (!p.src) return '';
      return `<img src="${esc(p.src)}" alt="${esc(p.alt)}" class="${cls(rp('width'), rp('height'), rp('objectFit'), rp('rounded'), bg.cls, cc, rc)}"${styleAttr(bg.style)} />`;

    case 'button': {
      const wrapStart = p.align ? `<div class="${rp('align')}">` : '';
      const wrapEnd = p.align ? '</div>' : '';
      return `${wrapStart}<a href="${esc(p.href || '#')}" class="${cls(rp('variant'), rp('padding'), rp('rounded'), rp('weight'), 'inline-block', bg.cls, cc, rc)}"${styleAttr(bg.style)}>${esc(p.text)}</a>${wrapEnd}`;
    }

    case 'list': {
      const items = (p.items || []).map((item) => `<li>${esc(item)}</li>`).join('\n');
      const tag = p.ordered ? 'ol' : 'ul';
      const listStyle = p.ordered ? 'list-decimal' : 'list-disc';
      return `<${tag} class="${cls(listStyle, 'pl-5', rp('size'), rp('color'), rp('spacing'), bg.cls, cc, rc)}"${styleAttr(bg.style)}>${items}</${tag}>`;
    }

    case 'spacer':
      return `<div class="${cls(rp('height'), bg.cls, cc, rc)}"${styleAttr(bg.style)}></div>`;

    case 'divider':
      return `<hr class="${cls(rp('color'), rp('margin'), 'border-t', bg.cls, cc, rc)}"${styleAttr(bg.style)} />`;

    case 'section':
      return `<section class="${cls(bg.cls, rp('paddingY'), rp('paddingX'), cc, rc)}"${styleAttr(bg.style)}><div class="${cls(p.maxWidth)}">${renderBlocks(block.children || [])}</div></section>`;

    case 'grid': {
      // cols is stored as a number string ('2'), not a full class name.
      // Build the responsive variants manually.
      const isObj = (v) => v != null && typeof v === 'object';
      const hasCols = (isObj(resp.sm) && 'cols' in resp.sm) || (isObj(resp.md) && 'cols' in resp.md);
      const colCls = hasCols ? `lg:grid-cols-${p.cols || 2}` : `grid-cols-${p.cols || 2}`;
      return `<div class="${cls('grid', colCls, rp('gap'), bg.cls, cc, rc)}"${styleAttr(bg.style)}>${renderBlocks(block.children || [])}</div>`;
    }

    case 'hero': {
      const btn = p.btnText
        ? `<div class="mt-6"><a href="${esc(p.btnHref || '#')}" class="inline-block bg-white text-[hsl(var(--primary))] px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition">${esc(p.btnText)}</a></div>`
        : '';
      return `<section class="${cls(bg.cls, rp('paddingY'), 'px-4', rp('align'), cc, rc)}"${styleAttr(bg.style)}><div class="max-w-3xl mx-auto"><h1 class="${cls('text-4xl font-bold mb-4', rp('textColor'))}">${esc(p.title)}</h1><p class="${cls('text-lg opacity-90', rp('textColor'))}">${esc(p.subtitle)}</p>${btn}</div></section>`;
    }

    case 'card': {
      const titleHtml = p.title
        ? `<h3 class="font-semibold text-lg mb-2">${esc(p.title)}</h3>`
        : '';
      return `<div class="${cls(bg.cls, rp('padding'), rp('rounded'), rp('shadow'), rp('border'), cc, rc)}"${styleAttr(bg.style)}>${titleHtml}<p class="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed">${esc(p.body).replace(/\n/g, '<br>')}</p></div>`;
    }

    case 'featureGrid': {
      const items = (p.items || [])
        .map((item) => {
          const tag = item.href ? `a href="${esc(item.href)}"` : 'div';
          const endTag = item.href ? 'a' : 'div';
          return `<${tag} class="${cls(p.cardBg, p.cardRounded, p.cardPadding, p.cardBorder, 'block')}"><div class="text-2xl mb-3">${item.icon || ''}</div><h3 class="font-semibold text-sm">${esc(item.title)}</h3><p class="text-xs text-muted-foreground mt-1">${esc(item.desc)}</p></${endTag}>`;
        })
        .join('\n');
      // featureGrid.cols stores full class names like 'grid-cols-3'
      return `<div class="${cls('grid', rp('cols'), rp('gap'), rp('padding'), bg.cls, cc, rc)}"${styleAttr(bg.style)}>${items}</div>`;
    }

    case 'columns':
      return `<div class="${cls('flex flex-wrap', rp('gap'), rp('align'), rp('paddingY'), rp('paddingX'), bg.cls, cc, rc)}"${styleAttr(bg.style)}>${renderBlocks(block.children || [])}</div>`;

    case 'quote': {
      const borderCls = p.borderColor || 'border-[hsl(var(--primary))]';
      const bgCls = p.bgColor || 'bg-[hsl(var(--muted))]';
      return `<figure class="${cls(bgCls, rp('padding'), rp('rounded'), 'border-l-4', borderCls, cc, rc)}"${styleAttr(bg.style)}><blockquote class="${cls(rp('textSize'), 'leading-relaxed italic mb-3')}">"${esc(p.text)}"</blockquote>${p.author ? `<figcaption class="text-sm font-semibold text-[hsl(var(--foreground))]">${esc(p.author)}${p.role ? `<span class="font-normal text-[hsl(var(--muted-foreground))]"> — ${esc(p.role)}</span>` : ''}</figcaption>` : ''}</figure>`;
    }

    case 'badge': {
      const wrapStart = p.align && p.align !== 'text-left' ? `<div class="${rp('align')}">` : '';
      const wrapEnd = p.align && p.align !== 'text-left' ? '</div>' : '';
      return `${wrapStart}<span class="${cls(rp('variant'), rp('size'), rp('padding'), rp('rounded'), 'inline-block font-medium', cc, rc)}">${esc(p.text)}</span>${wrapEnd}`;
    }

    case 'alert': {
      const ALERT_STYLES = {
        info:    { wrap: 'bg-blue-50 text-blue-800 border border-blue-200',    icon: 'ℹ️' },
        success: { wrap: 'bg-green-50 text-green-800 border border-green-200', icon: '✅' },
        warning: { wrap: 'bg-amber-50 text-amber-800 border border-amber-200', icon: '⚠️' },
        error:   { wrap: 'bg-red-50 text-red-800 border border-red-200',       icon: '❌' },
      };
      const style = ALERT_STYLES[p.type || 'info'] || ALERT_STYLES.info;
      const icon = p.icon || style.icon;
      const titleHtml = p.title ? `<strong class="block font-semibold mb-1">${esc(p.title)}</strong>` : '';
      return `<div class="${cls(style.wrap, rp('rounded'), 'p-4 flex gap-3', cc, rc)}"><span class="text-lg shrink-0">${icon}</span><div>${titleHtml}<span class="text-sm">${esc(p.message)}</span></div></div>`;
    }

    case 'video': {
      if (!p.url) return `<div class="${cls(rp('aspectRatio'), rp('rounded'), 'bg-[hsl(var(--muted))] flex items-center justify-center text-sm text-[hsl(var(--muted-foreground))]', cc, rc)}">🎬 Video placeholder</div>`;
      // Support YouTube, Vimeo, or direct <iframe src>
      const ytMatch = p.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      const vimeoMatch = p.url.match(/vimeo\.com\/(\d+)/);
      let embedSrc = p.url;
      if (ytMatch) embedSrc = `https://www.youtube.com/embed/${ytMatch[1]}`;
      else if (vimeoMatch) embedSrc = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      return `<figure class="${cls(cc, rc)}"${styleAttr(bg.style)}><div class="${cls(rp('aspectRatio'), rp('rounded'), 'overflow-hidden')}"><iframe src="${esc(embedSrc)}" class="w-full h-full" frameborder="0" allowfullscreen loading="lazy"></iframe></div>${p.caption ? `<figcaption class="mt-2 text-xs text-center text-[hsl(var(--muted-foreground))]">${esc(p.caption)}</figcaption>` : ''}</figure>`;
    }

    case 'gallery': {
      const imgs = (p.images || [])
        .filter((img) => img.src)
        .map((img) => `<div class="${cls(rp('height'), 'overflow-hidden', rp('rounded'))}"><img src="${esc(img.src)}" alt="${esc(img.alt || '')}" class="${cls('w-full h-full', rp('objectFit'))}" loading="lazy" /></div>`)
        .join('\n');
      if (!imgs) return `<div class="text-xs text-[hsl(var(--muted-foreground))] p-4">Add images to the gallery in the props panel.</div>`;
      return `<div class="${cls('grid', rp('cols'), rp('gap'), cc, rc)}"${styleAttr(bg.style)}>${imgs}</div>`;
    }

    case 'stats': {
      const items = (p.items || [])
        .map((item) => `<div class="${cls(p.cardBg, p.cardRounded, p.cardBorder, p.padding, p.align)}"><div class="${cls(p.valueSize || 'text-3xl', p.valueWeight || 'font-bold', p.valueColor || 'text-primary')}">${esc(item.value)}</div><div class="${cls(p.labelSize || 'text-sm', p.labelColor || 'text-muted-foreground', 'mt-1')}">${esc(item.label)}</div></div>`)
        .join('\n');
      return `<div class="${cls('grid', rp('cols'), rp('gap'), bg.cls, cc, rc)}"${styleAttr(bg.style)}>${items}</div>`;
    }

    case 'testimonial': {
      const avatar = p.avatar
        ? `<img src="${esc(p.avatar)}" alt="${esc(p.name || '')}" class="size-12 rounded-full object-cover ring-2 ring-[hsl(var(--primary))]/30" />`
        : `<div class="size-12 rounded-full bg-[hsl(var(--primary))]/20 flex items-center justify-center text-lg font-bold text-[hsl(var(--primary))]">${(p.name || '?').charAt(0).toUpperCase()}</div>`;
      return `<figure class="${cls(bg.cls, rp('padding'), rp('rounded'), rp('border'), cc, rc)}"${styleAttr(bg.style)}><blockquote class="text-[hsl(var(--foreground))] leading-relaxed mb-4 italic">"${esc(p.quote)}"</blockquote><figcaption class="flex items-center gap-3">${avatar}<div><div class="font-semibold text-sm">${esc(p.name || '')}</div><div class="text-xs text-[hsl(var(--muted-foreground))]">${esc(p.role || '')}</div></div></figcaption></figure>`;
    }

    case 'accordion': {
      const items = (p.items || [])
        .map((item, i) => {
          const isFirst = i === 0;
          return `<details class="${cls(p.bgColor || 'bg-card', rp('border'), 'group overflow-hidden')}" ${isFirst ? 'open' : ''}>
  <summary class="flex items-center justify-between gap-3 px-4 py-3 font-medium text-sm cursor-pointer list-none select-none hover:bg-[hsl(var(--muted))] transition-colors">
    ${esc(item.question)}
    <span class="shrink-0 transition-transform group-open:rotate-180 text-[hsl(var(--muted-foreground))]">▾</span>
  </summary>
  <div class="px-4 pb-4 text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">${esc(item.answer)}</div>
</details>`;
        })
        .join('\n');
      return `<div class="${cls(rp('rounded'), 'overflow-hidden divide-y divide-[hsl(var(--border))] ring-1 ring-[hsl(var(--border))]', cc, rc)}">${items}</div>`;
    }

    case 'tabs': {
      const tabItems = p.items || [];
      const active = Math.max(0, Math.min(Number(p.activeTab) || 0, tabItems.length - 1));
      const tabHeaders = tabItems
        .map((item, i) => `<button class="${cls(i === active ? (p.activeBg || 'bg-background') : 'hover:bg-[hsl(var(--background))]/50', 'px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap')}">${esc(item.label)}</button>`)
        .join('');
      const content = tabItems[active] ? `<div class="${cls(p.contentBg || 'bg-card', 'p-4 text-sm leading-relaxed text-[hsl(var(--foreground))]')}">${esc(tabItems[active].content)}</div>` : '';
      return `<div class="${cls(cc, rc)}"><div class="${cls(p.tabBg || 'bg-muted', p.rounded || 'rounded-xl', 'flex flex-wrap gap-1 p-1 mb-1')}">${tabHeaders}</div>${content}</div>`;
    }

    case 'cta': {
      const btn = p.btnText ? `<a href="${esc(p.btnHref || '#')}" class="${cls(p.btnVariant, 'inline-block px-6 py-3 rounded-xl font-semibold transition hover:opacity-90')}">${esc(p.btnText)}</a>` : '';
      const btn2 = p.secondBtnText ? `<a href="${esc(p.secondBtnHref || '#')}" class="${cls(p.secondBtnVariant, 'inline-block px-6 py-3 rounded-xl font-semibold transition hover:opacity-90')}">${esc(p.secondBtnText)}</a>` : '';
      const btns = (btn || btn2) ? `<div class="mt-6 flex flex-wrap gap-3 justify-center">${btn}${btn2}</div>` : '';
      return `<div class="${cls(bg.cls, rp('paddingY'), 'px-4', rp('align'), rp('rounded'), cc, rc)}"${styleAttr(bg.style)}><h2 class="text-3xl font-bold mb-3">${esc(p.title)}</h2><p class="text-lg opacity-80 max-w-xl mx-auto">${esc(p.subtitle)}</p>${btns}</div>`;
    }

    case 'html':
      return (cc || bg.cls || bg.style)
        ? `<div class="${cls(bg.cls, cc)}"${styleAttr(bg.style)}>${p.code || ''}</div>`
        : (p.code || '');

    case 'postLoop': {
      // JS renderer can't query DB — render a skeleton placeholder
      const count = Math.min(Number(p.count) || 6, 12);
      const skelCards = Array.from({ length: count }).map(() => {
        const imgSkel = p.showImage !== false ? `<div class="${cls(p.imageHeight || 'h-40', 'bg-[hsl(var(--border))] rounded-lg mb-3')}"></div>` : '';
        return `<div class="${cls(p.cardBg || 'bg-card', p.cardRounded || 'rounded-xl', p.cardBorder || 'border border-border', p.cardPadding || 'p-4', 'overflow-hidden')}">${imgSkel}<div class="h-3 bg-[hsl(var(--border))] rounded w-3/4 mb-2"></div><div class="h-2 bg-[hsl(var(--border))] rounded w-1/2"></div></div>`;
      }).join('\n');
      return `<div class="${cls('grid', rp('cols'), rp('gap'), cc, rc)}" data-sbuilder-dynamic="postLoop">${skelCards}</div>`;
    }

    case 'categoryLoop': {
      const count = Math.min(Number(p.count) || 8, 24);
      const skelCards = Array.from({ length: count }).map(() => {
        const countSkel = p.showCount !== false ? `<div class="h-2 bg-[hsl(var(--border))] rounded w-1/3 mt-1.5"></div>` : '';
        return `<div class="${cls(p.cardBg || 'bg-card', p.cardRounded || 'rounded-xl', p.cardBorder || 'border border-border', p.cardPadding || 'p-4')}"><div class="h-3 bg-[hsl(var(--border))] rounded w-2/3 mb-1"></div>${countSkel}</div>`;
      }).join('\n');
      return `<div class="${cls('grid', rp('cols'), rp('gap'), cc, rc)}" data-sbuilder-dynamic="categoryLoop">${skelCards}</div>`;
    }

    case 'slider': {
      const slides = p.items || [];
      if (!slides.length) {
        return `<div class="${cls(rp('height') || 'h-64', rp('rounded') || 'rounded-xl', 'bg-[hsl(var(--muted))] flex items-center justify-center text-sm text-[hsl(var(--muted-foreground))]', cc, rc)}">No slides — add in props panel</div>`;
      }
      const loop = p.loop !== false;
      const autoplay = p.autoplay === true;
      const interval = Number(p.autoplayInterval) || 5000;
      const duration = Number(p.transitionDuration) || 300;

      // Build Swiper slides
      const slidesHtml = slides.map((slide) => {
        const bgStyle = slide.image
          ? ' style="background-image:url(\'' + esc(slide.image) + '\');background-size:' + (p.objectFit === 'object-contain' ? 'contain' : 'cover') + ';background-position:center;background-repeat:no-repeat"'
          : '';
        const content = (slide.title || slide.desc)
          ? '<div class="absolute inset-0 flex flex-col justify-end p-6" style="background:linear-gradient(to top,rgba(0,0,0,0.6),transparent)"><h3 class="' + cls(p.titleColor || 'text-white', 'font-bold text-xl leading-snug') + '">' + esc(slide.title) + '</h3>' + (slide.desc ? '<p class="text-white/80 text-sm mt-1">' + esc(slide.desc) + '</p>' : '') + '</div>'
          : '';
        const el = slide.href ? 'a href="' + esc(slide.href) + '"' : 'div';
        const elEnd = slide.href ? 'a' : 'div';
        return '<' + el + ' class="swiper-slide relative overflow-hidden ' + cls(rp('height') || 'h-64', rp('rounded') || 'rounded-xl', 'bg-[hsl(var(--muted))]') + '"' + bgStyle + '>' + content + '</' + elEnd + '>';
      }).join('\n');

      const showDots = p.showDots !== false;
      const showArrows = p.showArrows !== false;
      const containerId = 'swiper-' + Date.now();

      return '<div id="' + containerId + '" class="' + cls('relative overflow-hidden', rp('rounded'), cc, rc) + '">' +
        '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />' +
        '<div class="swiper" data-loop="' + loop + '" data-autoplay="' + autoplay + '" data-interval="' + interval + '" data-duration="' + duration + '">' +
          '<div class="swiper-wrapper">' +
            slidesHtml +
          '</div>' +
          (showDots ? '<div class="swiper-pagination"></div>' : '') +
          (showArrows ? '<div class="swiper-button-prev !text-white"></div><div class="swiper-button-next !text-white"></div>' : '') +
        '</div>' +
        '<script>' +
          '(function(){' +
            'function initSwiper() {' +
              'var container = document.getElementById("' + containerId + '");' +
              'if(!container) { console.error("Swiper container not found"); return; }' +
              'var swiperEl = container.querySelector(".swiper");' +
              'if(!swiperEl) { console.error("Swiper element not found"); return; }' +
              'var config = {' +
                'loop: ' + loop + ',' +
                'speed: ' + duration + ',' +
                'slidesPerView: 1,' +
                'spaceBetween: 0' +
              '};' +
              'if(' + showDots + ') { config.pagination = { el: container.querySelector(".swiper-pagination"), clickable: true }; }' +
              'if(' + showArrows + ') { config.navigation = { nextEl: container.querySelector(".swiper-button-next"), prevEl: container.querySelector(".swiper-button-prev") }; }' +
              'if(' + autoplay + ') { config.autoplay = { delay: ' + interval + ', disableOnInteraction: false }; }' +
              'if(typeof Swiper !== "undefined") {' +
                'var swiper = new Swiper(swiperEl, config);' +
                'container.swiperInstance = swiper;' +
                'console.log("Builder Swiper initialized");' +
              '} else {' +
                'console.error("Swiper not loaded");' +
              '}' +
            '}' +
            'if(typeof Swiper !== "undefined") {' +
              'initSwiper();' +
            '} else {' +
              'var script = document.createElement("script");' +
              'script.src = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";' +
              'script.onload = initSwiper;' +
              'document.head.appendChild(script);' +
            '}' +
          '})();' +
        '</script>' +
      '</div>';
    }

    default:
      return '';
  }
}

/** Render a single block to an HTML string. */
export function renderBlock(block) {
  return _renderBlock(block);
}

/** Render an array of blocks to an HTML string. */
export function renderBlocks(blocks) {
  if (!blocks || !blocks.length) return '';
  return blocks.map(_renderBlock).join('\n');
}
