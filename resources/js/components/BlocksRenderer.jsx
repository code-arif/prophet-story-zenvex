import React from 'react';
import DOMPurify from 'dompurify';
import { renderBlocks as renderSBuilderBlocks } from '../lib/sbuilder/renderer';

/* ─── Detect block format ─────────────────────── */
// S Builder blocks have an `id` string and a `props` object.
// Legacy blocks have direct fields like `text`, `level`, `html`.
function isSBuilderBlock(block) {
  return (
    block &&
    typeof block === 'object' &&
    typeof block.id === 'string' &&
    typeof block.props === 'object' &&
    block.props !== null
  );
}

const PURIFY_OPTS = {
  USE_PROFILES: { html: true },
  ADD_ATTR: ['style', 'target'],
};

/* ─── Legacy block renderer ──────────────────── */
function renderLegacyBlock(block, idx) {
  if (!block || typeof block !== 'object') return null;

  const type = String(block.type || '');

  if (type === 'heading') {
    const level = Number(block.level || 2);
    const text = String(block.text || '');
    const Tag = level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4';
    const cls =
      level === 1
        ? 'text-2xl font-semibold leading-snug'
        : level === 2
          ? 'text-xl font-semibold leading-snug'
          : level === 3
            ? 'text-lg font-semibold leading-snug'
            : 'text-base font-semibold';
    return (
      <Tag key={idx} className={cls}>
        {text}
      </Tag>
    );
  }

  if (type === 'paragraph') {
    const html = typeof block.html === 'string' ? block.html.trim() : '';
    if (html) {
      const safe = DOMPurify.sanitize(html, PURIFY_OPTS);
      return (
        <div
          key={idx}
          className="rich-content text-[15px] leading-7 text-[hsl(var(--foreground))]"
          dangerouslySetInnerHTML={{ __html: safe }}
        />
      );
    }

    const text = String(block.text || '');
    return (
      <p key={idx} className="whitespace-pre-wrap text-[15px] leading-7 text-[hsl(var(--foreground))]">
        {text}
      </p>
    );
  }

  if (type === 'quote') {
    const text = String(block.text || '');
    const cite = String(block.cite || '');
    return (
      <figure key={idx} className="rounded-2xl bg-[hsl(var(--muted))] p-4 ring-1 ring-[hsl(var(--border))]">
        <blockquote className="whitespace-pre-wrap text-[15px] leading-7">{text}</blockquote>
        {cite ? <figcaption className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">— {cite}</figcaption> : null}
      </figure>
    );
  }

  if (type === 'divider') {
    return <hr key={idx} className="border-[hsl(var(--border))]" />;
  }

  if (type === 'image') {
    const url = String(block.url || '');
    const alt = String(block.alt || '');
    const caption = String(block.caption || '');

    if (!url) return null;

    return (
      <figure key={idx} className="overflow-hidden rounded-2xl ring-1 ring-[hsl(var(--border))]">
        <img src={url} alt={alt || 'Image'} className="h-auto w-full object-cover" loading="lazy" />
        {caption ? (
          <figcaption className="border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-xs text-[hsl(var(--muted-foreground))]">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (type === 'list') {
    const style = String(block.style || 'bullet');
    const items = Array.isArray(block.items) ? block.items : [];
    const Tag = style === 'number' ? 'ol' : 'ul';
    const cls = style === 'number' ? 'list-decimal' : 'list-disc';

    return (
      <Tag key={idx} className={`${cls} space-y-1 pl-5 text-[15px] leading-7`}>
        {items.map((it, i) => (
          <li key={i} className="whitespace-pre-wrap">
            {String(it || '')}
          </li>
        ))}
      </Tag>
    );
  }

  return null;
}

/* ─── Main component ─────────────────────────── */
export default function BlocksRenderer({ blocks }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  // S Builder format → convert to HTML and render
  if (isSBuilderBlock(blocks[0])) {
    const html = DOMPurify.sanitize(renderSBuilderBlocks(blocks), PURIFY_OPTS);
    return (
      <div
        className="sbuilder-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Legacy block format
  return <div className="space-y-4">{blocks.map(renderLegacyBlock)}</div>;
}

