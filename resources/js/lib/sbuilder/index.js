/**
 * S Builder — Tailwind Visual Page Builder
 *
 * A visual page builder library for building pages with
 * Tailwind CSS blocks, similar to Elementor or Shuffle.dev.
 *
 * @example
 *   import { SBuilder, renderBlocks } from '../../lib/sbuilder';
 *
 *   <SBuilder blocks={blocks} onChange={setBlocks} onMediaPick={openPicker} />
 *   const html = renderBlocks(blocks);
 */
export { default as SBuilder } from './SBuilder';
export { renderBlocks } from './renderer';
export { BLOCK_DEFS, CATEGORIES, createBlock } from './blocks';
