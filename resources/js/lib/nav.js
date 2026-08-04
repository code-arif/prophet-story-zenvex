import { Home, BookOpen, MessageCircle, Mic, User } from 'lucide-react';

/**
 * Shared 5-tab navigation config (Stitch design) consumed by both the mobile
 * bottom nav and the desktop left sidebar. `ai: true` marks the centre / AI
 * tab so it keeps its violet identity in either chrome.
 */
export const NAV_TABS = [
  { key: 'home', label: 'হোম', href: '/home', Icon: Home },
  { key: 'learn', label: 'শিখুন', href: '/learn', Icon: BookOpen },
  { key: 'ai', label: 'AI সঙ্গী', href: '/ai', Icon: MessageCircle, ai: true },
  { key: 'practice', label: 'অনুশীলন', href: '/practice', Icon: Mic },
  { key: 'profile', label: 'প্রোফাইল', href: '/profile', Icon: User },
];
