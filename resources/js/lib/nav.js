import { Home, BookOpen, Brain, Blocks, Settings } from 'lucide-react';

/**
 * Shared navigation tab config — Prophet Stories (নবীদের গল্প).
 * Consumed by both the mobile BottomNav and the desktop TopBar inline nav.
 *
 * Palette roles:
 *  - `accent: true` marks the Quiz tab — elevated Sunset Amber identity.
 *  - `kid: true`   marks the Kid Mode tab — Palm Green in kid mode.
 *
 * NOTE: The 'home' tab points to /library (the app home for logged-in users).
 * The root URL (/) is the public landing page and is not part of the app nav.
 */
export const NAV_TABS = [
  { key: 'home',     label: 'হোম',      href: '/library',   Icon: Home },
  { key: 'stories',  label: 'গল্প',     href: '/library',   Icon: BookOpen },
  { key: 'quiz',     label: 'কুইজ',     href: '/quiz',      Icon: Brain, accent: true },
  { key: 'kid',      label: 'কিড মোড',  href: '/kid',       Icon: Blocks, kid: true },
  { key: 'settings', label: 'সেটিংস',   href: '/settings',  Icon: Settings },
];