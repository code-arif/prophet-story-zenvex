import { Home, BookOpen, Sparkles, Briefcase, Wallet } from 'lucide-react';

/**
 * Shared 5-tab navigation config — easy rise (ইজি রাইজ).
 * Consumed by both the mobile bottom nav and the desktop left sidebar.
 * `ai: true` marks the centre / assistant tab so it keeps its elevated
 * violet identity in either chrome.
 */
export const NAV_TABS = [
  { key: 'home', label: 'আজ', href: '/home', Icon: Home },
  { key: 'learn', label: 'শেখা', href: '/learn', Icon: BookOpen },
  { key: 'ai', label: 'সহায়ক', href: '/assistant', Icon: Sparkles, ai: true },
  { key: 'work', label: 'কাজ', href: '/work', Icon: Briefcase },
  { key: 'money', label: 'টাকা', href: '/money', Icon: Wallet },
];
