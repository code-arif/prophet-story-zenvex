import React from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Layers,
  File,
  FolderOpen,
  Type,
  Tags,
  Image,
  Images,
  Smartphone,
  Users,
  CreditCard,
  MessageSquare,
  Cpu,
  UserCog,
  BarChart3,
  Terminal,
  Settings,
  AppWindow,
  Palette,
  User,
  Mail,
  KeyRound,
  PhoneCall,
  Link2,
  Menu,
  Zap,
  Moon,
  Sun,
  Shield,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  LogOut,
  ExternalLink
} from 'lucide-react';

import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import FlashMessages from '../components/FlashMessages';

// Helper to determine active link
function isActivePath(current, href) {
  const cur = String(current || '').trim().toLowerCase();
  const target = String(href || '').trim().toLowerCase();
  if (!target) return false;

  // Extract path from absolute URL if current contains a domain
  let curPath = cur;
  try {
    if (cur.startsWith('http://') || cur.startsWith('https://')) {
      const urlObj = new URL(cur);
      curPath = urlObj.pathname;
    }
  } catch (e) {}

  // Remove queries, hashes, trailing slashes, and normalize
  const normalize = (p) => {
    let cleaned = p.split('?')[0].split('#')[0];
    if (cleaned.endsWith('/')) cleaned = cleaned.slice(0, -1);
    if (!cleaned.startsWith('/')) cleaned = '/' + cleaned;
    return cleaned;
  };

  const normCur = normalize(curPath);
  const normTgt = normalize(target);

  if (normTgt === '/admin') {
    return normCur === '/admin';
  }

  return normCur === normTgt || normCur.startsWith(normTgt + '/');
}

// Icon mapping helper based on label
const getIcon = (label) => {
  const norm = String(label || '').toLowerCase().trim();
  switch (norm) {
    case 'dashboard': return LayoutDashboard;
    case 'content': return FileText;
    case 'articles': return BookOpen;
    case 'categories': return Layers;
    case 'pages': return File;
    case 'content manager': return FolderOpen;
    case 'post types': return Type;
    case 'taxonomies': return Tags;
    case 'media': return Image;
    case 'media manager': return Images;
    case 'apk':
    case 'apk manager': return Smartphone;
    case 'subscribers': return Users;
    case 'subscriptions': return CreditCard;
    case 'bulk sms': return MessageSquare;
    case 'system': return Cpu;
    case 'users': return UserCog;
    case 'metrics': return BarChart3;
    case 'logs': return Terminal;
    case 'settings': return Settings;
    case 'general': return AppWindow;
    case 'theme': return Palette;
    case 'admin profile': return User;
    case 'smtp / sms': return Mail;
    case 'bdapps api': return KeyRound;
    case 'ussd menu': return PhoneCall;
    case 'footer links': return Link2;
    case 'user menu': return Menu;
    case 'optimize': return Zap;
    default: return null;
  }
};

function NavLink({ href, children, label, active, depth = 0, isCollapsed }) {
  const textContent = children || label;
  const Icon = getIcon(textContent);
  const paddingLeft = depth > 0 ? `${1 + depth * 0.5}rem` : '0.85rem';
  
  if (isCollapsed && depth === 0) {
    return (
      <Link
        href={href}
        className={
          'flex items-center justify-center rounded-xl p-2.5 transition-all duration-150 relative group ' +
          (active
            ? 'bg-blue-50/80 dark:bg-blue-950/20 text-primary font-semibold'
            : 'text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-foreground')
        }
      >
        {Icon ? (
          <Icon className={`size-5 shrink-0 ${active ? 'text-primary' : 'text-muted-foreground/70 group-hover:text-foreground'}`} />
        ) : (
          <span className={`size-2 rounded-full shrink-0 ${active ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
        )}
        
        {active && (
          <span className="absolute left-0 w-1 h-6 rounded-r bg-primary" />
        )}
        
        {/* Tooltip on hover */}
        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-popover text-popover-foreground text-xs font-semibold rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
          {textContent}
        </div>
      </Link>
    );
  }

  if (isCollapsed && depth > 0) return null;

  return (
    <Link
      href={href}
      className={
        'flex items-center gap-3 py-2.5 px-3.5 text-sm font-medium transition-all duration-150 relative group border-l-4 ' +
        (active
          ? 'bg-blue-50/85 dark:bg-blue-950/25 text-primary border-primary font-semibold'
          : 'text-muted-foreground hover:bg-slate-50/70 dark:hover:bg-slate-800/40 hover:text-foreground border-transparent')
      }
      style={depth > 0 ? { paddingLeft } : undefined}
    >
      {Icon ? (
        <Icon className={`size-4 shrink-0 transition-colors duration-150 ${active ? 'text-primary' : 'text-muted-foreground/70 group-hover:text-foreground'}`} />
      ) : (
        depth > 0 && <span className={`size-1.5 rounded-full shrink-0 ${active ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
      )}
      <span className="truncate">{textContent}</span>
    </Link>
  );
}

function NavGroup({ label, items, currentUrl, depth = 0, isCollapsed }) {
  const [isOpen, setIsOpen] = React.useState(() => {
    const hasActiveChild = (children) => {
      return children.some((item) => {
        if (item.href && isActivePath(currentUrl, item.href)) return true;
        if (item.children) return hasActiveChild(item.children);
        return false;
      });
    };
    return hasActiveChild(items);
  });
  
  const Icon = getIcon(label);
  const paddingLeft = depth > 0 ? `${1 + depth * 0.5}rem` : '0.85rem';

  const isGroupActive = React.useMemo(() => {
    const checkActive = (children) => {
      return children.some((item) => {
        if (item.href && isActivePath(currentUrl, item.href)) return true;
        if (item.children) return checkActive(item.children);
        return false;
      });
    };
    return checkActive(items);
  }, [items, currentUrl]);

  if (isCollapsed && depth === 0) {
    return (
      <div className="relative group flex justify-center">
        <button
          className={
            'flex items-center justify-center rounded-xl p-2.5 transition-all duration-150 w-full ' +
            (isGroupActive
              ? 'bg-blue-50/80 dark:bg-blue-950/20 text-primary'
              : 'text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-foreground')
          }
        >
          {Icon ? (
            <Icon className={`size-5 shrink-0 ${isGroupActive ? 'text-primary' : 'text-muted-foreground/70'}`} />
          ) : (
            <span className={`size-2 rounded-full shrink-0 ${isGroupActive ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
          )}
          
          {isGroupActive && (
            <span className="absolute left-0 w-1 h-6 rounded-r bg-primary" />
          )}
        </button>

        {/* Popover menu on hover containing submenu links */}
        <div className="absolute left-full ml-3 w-48 bg-card text-foreground rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50 p-2.5 space-y-1">
          <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b border-slate-100 dark:border-slate-800/60 mb-1.5 truncate">
            {label}
          </div>
          {items.map((item, idx) => {
            const active = item.href ? isActivePath(currentUrl, item.href) : false;
            return item.children ? (
              <div key={idx} className="px-2 py-1 text-xs text-muted-foreground font-medium truncate">
                {item.label}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={
                  'block px-2.5 py-1.5 text-xs rounded-lg transition-all duration-150 truncate ' +
                  (active
                    ? 'bg-blue-50/80 dark:bg-blue-950/20 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-foreground')
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  if (isCollapsed && depth > 0) return null;

  return (
    <div className="space-y-0.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={
          'flex w-full items-center justify-between py-2.5 px-3.5 text-sm font-medium transition-all duration-150 border-l-4 ' +
          (isGroupActive
            ? 'text-foreground font-semibold border-primary/30 bg-slate-50/40 dark:bg-slate-800/10'
            : 'text-muted-foreground hover:bg-slate-50/70 dark:hover:bg-slate-800/40 hover:text-foreground border-transparent')
        }
        style={depth > 0 ? { paddingLeft } : undefined}
      >
        <div className="flex items-center gap-3 min-w-0">
          {Icon && <Icon className={`size-4 shrink-0 transition-colors duration-150 ${isGroupActive ? 'text-primary' : 'text-muted-foreground/70'}`} />}
          <span className="truncate">{label}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="size-4 shrink-0 opacity-60" />
        ) : (
          <ChevronRight className="size-4 shrink-0 opacity-60" />
        )}
      </button>
      {isOpen && (
        <div className="mt-0.5 space-y-0.5 border-l border-slate-200/80 dark:border-slate-800/60 ml-5 pl-1.5 transition-all duration-200">
          {items.map((item, idx) =>
            item.children ? (
              <NavGroup key={idx} label={item.label} items={item.children} currentUrl={currentUrl} depth={depth + 1} isCollapsed={isCollapsed} />
            ) : (
              <NavLink key={item.href} href={item.href} active={isActivePath(currentUrl, item.href)} depth={depth + 1} isCollapsed={isCollapsed}>
                {item.label}
              </NavLink>
            )
          )}
        </div>
      )}
    </div>
  );
}

function normalizeHex(hex) {
  const raw = String(hex || '').trim();
  if (!raw) return '';
  const withHash = raw.startsWith('#') ? raw : `#${raw}`;
  const m = withHash.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!m) return '';
  if (m[1].length === 3) {
    const [r, g, b] = m[1].split('');
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return withHash.toLowerCase();
}

function hexToRgb(hex) {
  const h = normalizeHex(hex);
  if (!h) return [59, 130, 246];
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToHsl(r, g, b) {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const d = max - min;
  let h = 0;

  if (d !== 0) {
    if (max === rr) h = ((gg - bb) / d) % 6;
    else if (max === gg) h = (bb - rr) / d + 2;
    else h = (rr - gg) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  return [h, s * 100, l * 100];
}

function formatHsl(h, s, l) {
  const hh = Math.round(h * 10) / 10;
  const ss = Math.round(s * 10) / 10;
  const ll = Math.round(l * 10) / 10;
  return `${hh} ${ss}% ${ll}%`;
}

function themeCssVarsForMode({ mode, primaryHex }) {
  const [r, g, b] = hexToRgb(primaryHex);
  const [h] = rgbToHsl(r, g, b);
  const primary = formatHsl(...rgbToHsl(r, g, b));
  const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const primaryFg = luma > 0.6 ? '0 0% 0%' : '0 0% 100%';

  let background;
  let foreground;
  let card;
  let cardFg;
  let popover;
  let popoverFg;
  let secondary;
  let secondaryFg;
  let muted;
  let mutedFg;
  let accent;
  let accentFg;
  let destructive;
  let destructiveFg;
  let border;
  let input;
  let borderColor;

  if (mode === 'light') {
    // Beautiful soft slate-50 contrast background (#f8fafc)
    background = '210 40% 98%';
    foreground = '222.2 84% 4.9%';

    // Sidebar, topbar, cards in pristine solid white (#ffffff)
    card = '0 0% 100%';
    cardFg = foreground;

    popover = '0 0% 100%';
    popoverFg = foreground;

    secondary = '210 40% 96.1%';
    secondaryFg = foreground;

    muted = '210 40% 96.1%';
    mutedFg = '215.4 16.3% 46.9%';

    accent = '210 40% 96.1%';
    accentFg = foreground;

    destructive = '0 84.2% 60.2%';
    destructiveFg = '210 40% 98%';

    // Exact user requested border color (#e2e8f0)
    border = '214 32% 91.4%';
    input = border;
    borderColor = '#e2e8f0';
  } else {
    background = formatHsl(h, 84, 4.9);
    foreground = '210 40% 98%';

    card = formatHsl(h, 70, 6.2);
    cardFg = foreground;

    popover = card;
    popoverFg = foreground;

    secondary = formatHsl(h, 28, 16.9);
    secondaryFg = foreground;

    muted = formatHsl(h, 25, 16.9);
    mutedFg = formatHsl(h, 10.6, 64.9);

    accent = muted;
    accentFg = foreground;

    destructive = '0 62.8% 30.6%';
    destructiveFg = foreground;

    // Dark zinc border (#27272a) coordinates
    border = '240 5.9% 16.9%';
    input = border;
    borderColor = '#27272a';
  }

  return {
    background,
    foreground,
    card,
    'card-foreground': cardFg,
    popover,
    'popover-foreground': popoverFg,
    primary,
    'primary-foreground': primaryFg,
    secondary,
    'secondary-foreground': secondaryFg,
    muted,
    'muted-foreground': mutedFg,
    accent,
    'accent-foreground': accentFg,
    destructive,
    'destructive-foreground': destructiveFg,
    border,
    'border-color': borderColor,
    'color-border': borderColor,
    input,
    ring: primary,
  };
}

function applyThemeToDom({ mode, primaryHex }) {
  const m = mode === 'light' ? 'light' : 'dark';
  const hex = normalizeHex(primaryHex) || '#3b82f6';

  try {
    document.documentElement.setAttribute('data-mode', m);
    localStorage.setItem('ui.themeMode', m);
  } catch {}

  const varsLight = themeCssVarsForMode({ mode: 'light', primaryHex: hex });
  const varsDark = themeCssVarsForMode({ mode: 'dark', primaryHex: hex });
  const varsBase = themeCssVarsForMode({ mode: m, primaryHex: hex });

  const styleEl = document.getElementById('app-theme');
  if (!styleEl) return;

  function block(sel, vars) {
    const lines = Object.entries(vars).map(([k, v]) => `  --${k}: ${v};`).join('\n');
    return `${sel} {\n  color-scheme: ${sel.includes('light') ? 'light' : sel.includes('dark') ? 'dark' : m};\n${lines}\n}`;
  }

  styleEl.textContent = [
    block(':root', varsBase),
    block(':root[data-mode="light"]', varsLight),
    block(':root[data-mode="dark"]', varsDark),
  ].join('\n\n');
}

export default function AdminShell({ title, children, noPadding }) {
  const { admin, settings } = usePage().props;
  const page = usePage();
  const currentUrl = page?.url || '';
  const logoutForm = useForm({});

  const effectivePrimaryHex = String(settings?.theme?.effectivePrimaryHex || '#3b82f6');
  const brandName = String(settings?.brandName || 'Admin');

  const [themeMode, setThemeMode] = React.useState(() => {
    try {
      const stored = localStorage.getItem('ui.themeMode');
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {}
    const htmlMode = document?.documentElement?.getAttribute('data-mode');
    return htmlMode === 'light' || htmlMode === 'dark' ? htmlMode : 'dark';
  });

  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    try {
      return localStorage.getItem('admin.sidebarCollapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // Keep DOM in sync with mode toggle immediately.
    applyThemeToDom({ mode: themeMode, primaryHex: effectivePrimaryHex });
  }, [themeMode, effectivePrimaryHex]);

  function persistTheme(next) {
    const pack = String(next.pack || 'custom');
    const mode = next.mode === 'light' ? 'light' : 'dark';
    const hex = normalizeHex(next.primaryHex || effectivePrimaryHex) || '#3b82f6';
    const primaryHex = pack === 'custom' ? hex : hex;

    applyThemeToDom({ mode, primaryHex: primaryHex || hex });

    router.post(
      '/admin/settings/theme',
      {
        brandName,
        mode,
        pack,
        primaryHex: pack === 'custom' ? hex : undefined,
      },
      {
        preserveScroll: true,
        preserveState: true,
      }
    );
  }

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('admin.sidebarCollapsed', String(next));
      } catch {}
      return next;
    });
  };

  const menu =
    Array.isArray(admin?.menu) && admin.menu.length
      ? admin.menu
      : [
          { label: 'Dashboard', href: '/admin' },
          {
            label: 'Content',
            children: [
              { label: 'Articles', href: '/admin/articles' },
              { label: 'Categories', href: '/admin/categories' },
              { label: 'Pages', href: '/admin/pages' },
              { label: 'Content Manager', href: '/admin/content-manager' },
              { label: 'Post Types', href: '/admin/post-types' },
              { label: 'Taxonomies', href: '/admin/taxonomies' },
            ],
          },
          {
            label: 'Media',
            children: [
              { label: 'Media Manager', href: '/admin/media' },
              { label: 'APK Manager', href: '/admin/apk' },
            ],
          },
          {
            label: 'Subscribers',
            children: [
              { label: 'Subscribers', href: '/admin/subscribers' },
              { label: 'Subscriptions', href: '/admin/subscriptions' },
              { label: 'Bulk SMS', href: '/admin/sms/bulk' },
            ],
          },
          {
            label: 'System',
            children: [
              { label: 'Users', href: '/admin/users' },
              { label: 'Metrics', href: '/admin/metrics' },
              { label: 'Logs', href: '/admin/logs' },
            ],
          },
          {
            label: 'Settings',
            children: [
              { label: 'General', href: '/admin/settings/general' },
              { label: 'Theme', href: '/admin/settings/theme' },
              { label: 'Admin Profile', href: '/admin/settings/profile' },
              { label: 'SMTP / SMS', href: '/admin/settings/integrations' },
              { label: 'BDApps API', href: '/admin/settings/bdapps' },
              { label: 'USSD Menu', href: '/admin/settings/ussd-menu' },
              { label: 'Footer Links', href: '/admin/settings/footer' },
              { label: 'User Menu', href: '/admin/settings/menu' },
              { label: 'Optimize', href: '/admin/settings/optimize' },
            ],
          },
        ];

  // Group menu dynamically into premium categorized sections
  const groupedMenu = React.useMemo(() => {
    const mainSection = [];
    const publishingSection = [];
    const audienceSection = [];
    const adminSection = [];
    const customSection = [];

    menu.forEach((item) => {
      const label = String(item.label || '').toLowerCase();
      if (label === 'dashboard') {
        mainSection.push(item);
      } else if (label === 'content' || label === 'media') {
        publishingSection.push(item);
      } else if (label === 'subscribers') {
        audienceSection.push(item);
      } else if (label === 'system' || label === 'settings') {
        adminSection.push(item);
      } else {
        customSection.push(item);
      }
    });

    const list = [];
    if (mainSection.length) list.push({ title: 'Main', items: mainSection });
    if (publishingSection.length) list.push({ title: 'Store Management', items: publishingSection });
    if (audienceSection.length) list.push({ title: 'Audience & Subscriptions', items: audienceSection });
    if (adminSection.length) list.push({ title: 'Administration', items: adminSection });
    if (customSection.length) list.push({ title: 'Other Modules', items: customSection });

    return list;
  }, [menu]);

  return (
    <div className="flex h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] overflow-hidden">
      {/* Desktop Left Sidebar */}
      <aside
        className={
          'hidden lg:flex flex-col h-screen sticky top-0 bg-white dark:bg-card border-r border-slate-200 dark:border-zinc-800 flex-shrink-0 z-30 transition-all duration-300 ease-in-out ' +
          (isCollapsed ? 'w-20' : 'w-64 xl:w-72')
        }
      >
        {/* Sidebar Header / Logo */}
        <div
          className={
            'p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center transition-all duration-300 ' +
            (isCollapsed ? 'flex-col gap-3 justify-center' : 'justify-between')
          }
        >
          <Link href="/admin" className="flex items-center gap-3 px-1 py-0.5 min-w-0">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={brandName}
                className="h-9 w-9 rounded-xl object-cover bg-white p-0.5 shadow-sm ring-1 ring-black/5 shrink-0"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 shrink-0">
                <Shield className="size-5" />
              </div>
            )}
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 animate-fade-in">
                <span className="text-sm font-bold tracking-tight text-foreground truncate">{brandName}</span>
              </div>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="inline-flex size-8 items-center justify-center rounded-lg bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 border border-slate-200 dark:border-zinc-800 shrink-0"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>

        {/* Sidebar Menu Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {groupedMenu.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed ? (
                <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-none animate-fade-in">
                  {section.title}
                </div>
              ) : (
                <div className="w-full border-t border-slate-200 dark:border-zinc-800/40 my-3 first:mt-0" />
              )}

              <div className="space-y-0.5">
                {section.items.map((item, itemIdx) =>
                  item.children ? (
                    <NavGroup
                      key={itemIdx}
                      label={item.label}
                      items={item.children}
                      currentUrl={currentUrl}
                      isCollapsed={isCollapsed}
                    />
                  ) : (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      active={isActivePath(currentUrl, item.href)}
                      isCollapsed={isCollapsed}
                    >
                      {item.label}
                    </NavLink>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Right side page area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-40 h-16 flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 bg-white/90 dark:bg-card/90 backdrop-blur-md px-6 flex-shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            {/* Hamburger menu button on mobile */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="inline-flex size-10 items-center justify-center rounded-xl bg-muted/60 hover:bg-muted text-foreground transition-colors border border-slate-200 dark:border-zinc-800">
                    <Menu className="size-5" />
                    <span className="sr-only">Open menu</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 bg-white dark:bg-card border-r border-slate-200 dark:border-zinc-800 flex flex-col h-full">
                  {/* Inside Sheet is the exact same Sidebar! */}
                  <div className="p-6 border-b border-slate-200 dark:border-zinc-800">
                    <Link href="/admin" className="flex items-center gap-3 px-1 py-0.5">
                      {settings?.logoUrl ? (
                        <img
                          src={settings.logoUrl}
                          alt={brandName}
                          className="h-9 w-9 rounded-xl object-cover bg-white p-0.5 shadow-sm ring-1 ring-black/5"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-md">
                          <Shield className="size-5" />
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold tracking-tight text-foreground truncate">{brandName}</span>
                        <span className="text-[10px] font-bold text-primary tracking-widest leading-none mt-0.5 uppercase">
                          Console
                        </span>
                      </div>
                    </Link>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                    {groupedMenu.map((section, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-none">
                          {section.title}
                        </div>
                        <div className="space-y-0.5">
                          {section.items.map((item, itemIdx) =>
                            item.children ? (
                              <NavGroup
                                key={itemIdx}
                                label={item.label}
                                items={item.children}
                                currentUrl={currentUrl}
                                isCollapsed={false}
                              />
                            ) : (
                              <NavLink
                                key={item.href}
                                href={item.href}
                                active={isActivePath(currentUrl, item.href)}
                                isCollapsed={false}
                              >
                                {item.label}
                              </NavLink>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Quick Actions (Theme + Site Links + Profile Menu) */}
          <div className="flex items-center gap-3">
            {/* Outline Go to Site button matching DominoPress style */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-muted/40 text-foreground hover:bg-muted transition-all duration-150 shrink-0 px-4 py-2 text-xs font-semibold"
            >
              <ExternalLink className="size-3.5" />
              <span className="hidden sm:inline">Visit Site</span>
            </Link>

            {/* Dark Mode toggle */}
            <button
              type="button"
              onClick={() => {
                const next = themeMode === 'dark' ? 'light' : 'dark';
                setThemeMode(next);
                persistTheme({ mode: next });
              }}
              className="inline-flex size-9 items-center justify-center rounded-xl bg-muted/40 hover:bg-muted/80 text-foreground transition-all duration-150 border border-slate-200 dark:border-zinc-800 hover:scale-105 active:scale-95"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {themeMode === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </button>

            {/* Profile Dropdown matching DominoPress David */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-zinc-800 text-left shrink-0"
              >
                <div className="relative size-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shadow-sm shrink-0">
                  {admin?.user?.name ? (
                    admin.user.name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                  ) : (
                    <User className="size-4" />
                  )}
                  <span className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-500 ring-2 ring-card" />
                </div>
                <div className="hidden md:flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-foreground leading-tight truncate">
                    {admin?.user?.name || 'Administrator'}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate leading-none mt-0.5">
                    {admin?.user?.email}
                  </span>
                </div>
                <ChevronDown className={`size-3.5 text-muted-foreground transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-50" onClick={() => setProfileMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-card text-foreground rounded-xl shadow-xl border border-slate-200 dark:border-zinc-800 p-1.5 z-55 animate-fade-in">
                    <div className="px-3 py-2 text-xs text-muted-foreground border-b border-slate-200 dark:border-zinc-800/60 mb-1">
                      Signed in as <strong className="text-foreground block truncate">{admin?.user?.email}</strong>
                    </div>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        logoutForm.post('/admin/logout');
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-all duration-150 text-left"
                    >
                      <LogOut className="size-3.5" />
                      <span>Logout Session</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className={noPadding ? '' : 'px-4 py-6 md:px-8 md:py-8 max-w-7xl w-full mx-auto'}>
            <FlashMessages className="mb-6 animate-fade-in" />
            <div className="animate-fade-in">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
