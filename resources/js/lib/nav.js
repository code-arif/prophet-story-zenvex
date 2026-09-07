import { Home, BookOpen, Search, Blocks, Settings } from 'lucide-react';

/**
 * Shared navigation tab config — Prophet Stories (নবীদের গল্প).
 * Consumed by both the mobile BottomNav and the desktop TopBar inline nav.
 *
 * Palette roles:
 *  - `accent: true`  marks the Library tab — elevated primary identity,
 *    centre-position on mobile BottomNav.
 *  - `kid: true`     marks the Kid Mode tab — Palm Green in kid mode.
 *
 * Each tab has a DISTINCT destination so clicking any tab always navigates.
 *  হোম      → /library   (Prophet card grid — the app home)
 *  খোঁজ     → /search    (full-text search across Prophets & chapters)
 *  [গল্প]   → /library   (centre / accent tab — elevated)
 *  কিড মোড  → /kid       (kid-friendly reader hub)
 *  সেটিংস   → /settings  (account & preferences)
 */
export const NAV_TABS = [
  { key: 'home',     label: 'হোম',     href: '/library',  Icon: Home },
  { key: 'search',   label: 'খোঁজ',    href: '/search',   Icon: Search },
  { key: 'stories',  label: 'গল্প',    href: '/library',  Icon: BookOpen, accent: true },
  { key: 'kid',      label: 'কিড',     href: '/kid',      Icon: Blocks,   kid: true },
  { key: 'settings', label: 'সেটিংস',  href: '/settings', Icon: Settings },
];