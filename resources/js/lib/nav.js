import { Home, BookOpen, Brain, Blocks, Settings } from 'lucide-react';

/**
 * Shared 5-tab navigation config — Prophet Stories (নবীদের গল্প).
 * Consumed by both the mobile bottom nav and the desktop left sidebar.
 *
 * Palette roles:
 *  - `accent: true` marks the centre / Quiz tab so it keeps its elevated
 *    Sunset Amber identity in either chrome (replaces the old violet AI tab).
 *  - `kid: true` marks the Kid Mode tab — Palm Green in kid mode, and it
 *    doubles as the shortcut to the kid section.
 */
export const NAV_TABS = [
  { key: 'home', label: 'হোম', href: '/', Icon: Home },
  { key: 'stories', label: 'গল্প', href: '/stories', Icon: BookOpen },
  { key: 'quiz', label: 'কুইজ', href: '/quiz', Icon: Brain, accent: true },
  { key: 'kid', label: 'কিড মোড', href: '/kid', Icon: Blocks, kid: true },
  { key: 'settings', label: 'সেটিংস', href: '/settings', Icon: Settings },
];