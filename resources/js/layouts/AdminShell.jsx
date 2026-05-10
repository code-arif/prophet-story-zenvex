import React from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Menu, Moon, Shield, Sun, ChevronDown, ChevronRight } from 'lucide-react';

import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import FlashMessages from '../components/FlashMessages';

function isActivePath(current, href) {
  const cur = String(current || '');
  const target = String(href || '');
  if (!target) return false;

  if (target === '/admin') {
    return cur === '/admin' || cur.startsWith('/admin?');
  }

  return cur === target || cur.startsWith(target + '/') || cur.startsWith(target + '?');
}

function NavLink({ href, children, active, depth = 0 }) {
  const paddingLeft = depth > 0 ? `${1.5 + depth * 0.75}rem` : '1rem';
  
  return (
    <Link
      href={href}
      className={
        'block rounded-2xl px-4 py-3 text-base ring-1 ' +
        (active
          ? 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] ring-[hsl(var(--border))]'
          : 'text-[hsl(var(--foreground))] ring-transparent hover:bg-[hsl(var(--muted))]')
      }
      style={{ paddingLeft }}
    >
      {children}
    </Link>
  );
}

function NavGroup({ label, items, currentUrl, depth = 0 }) {
  const [isOpen, setIsOpen] = React.useState(() => {
    // Auto-open if any child is active (recursive check)
    const hasActiveChild = (children) => {
      return children.some((item) => {
        if (item.href && isActivePath(currentUrl, item.href)) return true;
        if (item.children) return hasActiveChild(item.children);
        return false;
      });
    };
    return hasActiveChild(items);
  });
  
  const paddingLeft = depth > 0 ? `${1 + depth * 0.75}rem` : '1rem';

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-base text-[hsl(var(--foreground))] ring-1 ring-transparent hover:bg-[hsl(var(--muted))]"
        style={{ paddingLeft }}
      >
        <span className="font-medium">{label}</span>
        {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
      </button>
      {isOpen && (
        <div className="mt-1 space-y-1">
          {items.map((item, idx) =>
            item.children ? (
              <NavGroup key={idx} label={item.label} items={item.children} currentUrl={currentUrl} depth={depth + 1} />
            ) : (
              <NavLink key={item.href} href={item.href} active={isActivePath(currentUrl, item.href)} depth={depth + 1}>
                {item.label}
              </NavLink>
            )
          )}
        </div>
      )}
    </div>
  );
}

function MenuItems({ menu, currentUrl }) {
  return menu.map((item, idx) =>
    item.children ? (
      <NavGroup key={idx} label={item.label} items={item.children} currentUrl={currentUrl} />
    ) : (
      <NavLink key={item.href} href={item.href} active={isActivePath(currentUrl, item.href)}>
        {item.label}
      </NavLink>
    )
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

  if (mode === 'light') {
    background = '0 0% 100%';
    foreground = '222.2 84% 4.9%';

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

    border = '214.3 31.8% 91.4%';
    input = border;
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

    border = formatHsl(h, 27.9, 16.9);
    input = border;
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

  // theme pack & custom controls moved to Theme settings page

  React.useEffect(() => {
    // keep DOM in sync when effective primary changes
  }, [effectivePrimaryHex]);

  React.useEffect(() => {
    // Keep DOM in sync with mode toggle immediately.
    applyThemeToDom({ mode: themeMode, primaryHex: effectivePrimaryHex });
  }, [themeMode, effectivePrimaryHex]);

  function persistTheme(next) {
    const pack = String(next.pack || 'custom');
    const mode = next.mode === 'light' ? 'light' : 'dark';
    const hex = normalizeHex(next.primaryHex || effectivePrimaryHex) || '#3b82f6';
    const primaryHex = pack === 'custom' ? hex : hex;

    // Apply instantly in the UI (no full reload needed).
    applyThemeToDom({ mode, primaryHex: primaryHex || hex });

    // Persist theme via dedicated theme endpoint
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

  return (
    <div className="min-h-dvh bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <header className="sticky top-0 z-10 bg-gradient-header text-[hsl(var(--primary-foreground))] shadow-elevated">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-4">
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 hover:bg-white/15">
                  <Menu className="size-5" />
                  <span className="sr-only">Open admin menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="space-y-2">
                  <div className="mb-3 rounded-2xl bg-[hsl(var(--card))] p-4 ring-1 ring-[hsl(var(--border))]">
                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                      <Shield className="size-4" />
                      Admin
                    </div>
                    <div className="mt-1 text-base font-semibold">{admin?.user?.name || admin?.user?.email}</div>
                  </div>

                  <MenuItems menu={menu} currentUrl={currentUrl} />

                  <div className="pt-2">
                    <Button variant="secondary" className="w-full" onClick={() => logoutForm.post('/admin/logout')}>
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-base font-semibold leading-tight">{title}</div>
            <div className="truncate text-xs text-white/75">{admin?.user?.email}</div>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = themeMode === 'dark' ? 'light' : 'dark';
              setThemeMode(next);
              persistTheme({ mode: next });
            }}
            className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 hover:bg-white/15"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {themeMode === 'light' ? <Moon className="size-5" /> : <Sun className="size-5" />}
          </button>

          {/* Theme settings moved to dedicated Theme page; removed header theme sidebar */}

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
          >
            <ArrowLeft className="size-4" />
            Site
          </Link>
        </div>
      </header>

      <main className={noPadding ? '' : 'mx-auto max-w-6xl px-5 py-6'}>
        <div className={noPadding ? 'w-full' : 'lg:flex lg:items-start lg:gap-6'}>
          <aside className={noPadding ? 'hidden' : 'hidden lg:block lg:w-64'}>
            <div className="sticky top-24 rounded-3xl bg-[hsl(var(--card))] p-4 ring-1 ring-[hsl(var(--border))]">
              <div className="mb-3 flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                <Shield className="size-4" />
                Admin
              </div>
              <div className="mb-4 text-sm font-semibold">{admin?.user?.name || admin?.user?.email}</div>

              <div className="space-y-1">
                <MenuItems menu={menu} currentUrl={currentUrl} />
              </div>

              <div className="mt-4">
                <Button variant="secondary" className="w-full" onClick={() => logoutForm.post('/admin/logout')}>
                  Logout
                </Button>
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <FlashMessages className="mb-4" />
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
