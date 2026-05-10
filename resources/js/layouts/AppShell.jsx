import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Bookmark, Home, Moon, Search, Sun, User, CloudDownload, Menu, X, Clock } from 'lucide-react';
import { Input } from '../components/ui/input';
import FlashMessages from '../components/FlashMessages';
import { PremiumPopupProvider } from '../lib/PremiumPopupContext';

function AppShellInner({ title, children }) {
  const page = usePage();
  const { auth, settings } = page.props;
  const currentUrl = String(page?.url || '');
  const footerLinks = settings?.footerLinks || [];
  const brandName = settings?.brandName || title || 'BD Election';
  const logoUrl = settings?.logoUrl || null;

  const [themeMode, setThemeMode] = React.useState(() => {
    try {
      const stored = localStorage.getItem('ui.themeMode');
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {}
    const htmlMode = document?.documentElement?.getAttribute('data-mode');
    return htmlMode === 'light' || htmlMode === 'dark' ? htmlMode : 'dark';
  });

  React.useEffect(() => {
    try {
      document.documentElement.setAttribute('data-mode', themeMode);
      localStorage.setItem('ui.themeMode', themeMode);
    } catch {}
  }, [themeMode]);

  const [searchValue, setSearchValue] = React.useState('');

  const [rightOpen, setRightOpen] = React.useState(false);

  React.useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setRightOpen(false);
    }
    if (rightOpen) {
      document.addEventListener('keydown', onKey);
      try { document.body.style.overflow = 'hidden'; } catch {}
    } else {
      try { document.body.style.overflow = ''; } catch {}
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      try { document.body.style.overflow = ''; } catch {}
    };
  }, [rightOpen]);

  function submitSearch() {
    const q = searchValue.trim();
    router.get('/search', q ? { q } : {}, { preserveScroll: true });
  }

  function isActive(path) {
    if (path === '/') return currentUrl === '/' || currentUrl.startsWith('/?') || currentUrl.startsWith('/category/');
    return currentUrl === path || currentUrl.startsWith(`${path}?`) || currentUrl.startsWith(`${path}/`);
  }

  return (
    <div className="min-h-dvh bg-[hsl(var(--background))] text-[hsl(var(--foreground))] overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-gradient-header text-[hsl(var(--primary-foreground))] shadow-elevated">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6 lg:max-w-7xl lg:mx-auto">
          <Link href="/" className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt={brandName} className="h-10 w-10 rounded-full bg-white p-0.5" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-white/15" />
            )}
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">{brandName}</span>
              <span className="text-xs opacity-80">Daily News</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--primary-foreground))]/60" size={18} />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    submitSearch();
                  }
                }}
                placeholder="Search ..."
                className="pl-10 h-10 rounded-full bg-white/10 border-white/20 text-[hsl(var(--primary-foreground))] placeholder:text-[hsl(var(--primary-foreground))]/60 focus:bg-white/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 lg:gap-2">
              <Link href="/app" className="rounded-lg p-2 transition-colors hover:bg-white/10" aria-label="Download App">
                <CloudDownload />
              </Link>
            <button
              type="button"
              onClick={() => setRightOpen(true)}
              className="rounded-full p-2 transition-colors hover:bg-white/10"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Right side panel overlay + panel */}
      <div
        aria-hidden={!rightOpen}
        className={`fixed inset-0 z-50 pointer-events-${rightOpen ? 'auto' : 'none'}`}
      >
        {/* overlay */}
        <div
          onClick={() => setRightOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${rightOpen ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* panel */}
        <aside
          role="dialog"
          aria-modal="true"
          className={`absolute top-0 right-0 h-full w-80 bg-[hsl(var(--card))] shadow-2xl transform transition-transform duration-300 ease-in-out ${rightOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
            <div className="text-lg font-semibold">Menu</div>
            <button type="button" onClick={() => setRightOpen(false)} className="rounded-full p-2 hover:bg-white/5">
              <X size={18} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <div className="text-sm font-semibold">Quick actions</div>
              <div className="mt-2 flex items-center gap-3">
                <Link href="/search" className="rounded-lg p-2 hover:bg-[hsl(var(--background))]" aria-label="Search">
                  <Search />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const m = document.documentElement.getAttribute('data-mode') === 'light' ? 'dark' : 'light';
                    document.documentElement.setAttribute('data-mode', m);
                    try { localStorage.setItem('ui.themeMode', m); } catch {}
                    setRightOpen(false);
                  }}
                  className="rounded-lg p-2 hover:bg-[hsl(var(--background))]"
                  aria-label="Toggle theme"
                >
                  <Sun />
                </button>
                <Link href="/prayer-times" className="rounded-lg p-2 hover:bg-[hsl(var(--background))]" aria-label="Prayer Times">
                  <Clock />
                </Link>

                <Link href="/profile" className="rounded-lg p-2 hover:bg-[hsl(var(--background))]" aria-label="Profile">
                  <User />
                </Link>
                <Link href="/app" className="rounded-lg p-2 hover:bg-[hsl(var(--background))]" aria-label="Download App">
                  <CloudDownload />
                </Link>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold">Pages</div>
              <div className="mt-2 flex flex-col gap-2">
                {(settings?.navMenu || []).map((it, idx) => (
                  <Link
                    key={idx}
                    href={it.href}
                    onClick={() => setRightOpen(false)}
                    className="rounded-md px-3 py-2 hover:bg-[hsl(var(--background))]"
                  >
                    {it.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <main className="lg:max-w-7xl lg:mx-auto pb-24 lg:pb-6 overflow-x-hidden">
        <div className="px-4 pt-4 lg:px-6">
          <FlashMessages />
        </div>
        {children}
      </main>

      {footerLinks.length ? (
        <footer className="lg:max-w-7xl lg:mx-auto px-4 lg:px-6 pb-24 lg:pb-8">
          <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[hsl(var(--muted-foreground))]">
            {footerLinks.map((l, idx) => (
              <Link key={idx} href={l.url} className="hover:text-[hsl(var(--foreground))]">
                {l.label}
              </Link>
            ))}
          </div>
        </footer>
      ) : null}

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-elevated lg:hidden">
        <div className="mx-auto flex max-w-lg justify-around">
          {[
            { icon: Home, label: 'Home', href: '/' },
            { icon: Search, label: 'Search', href: '/search' },
            { icon: Clock, label: 'Prayer Times', href: '/prayer-times' },
            { icon: Bookmark, label: 'Saved', href: '/saved' },
            { icon: User, label: 'Profile', href: '/profile' },
          ].map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`bottom-nav-item ${active ? 'bottom-nav-item-active' : 'text-[hsl(var(--muted-foreground))]'}`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span className="text-xs font-medium text-center">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function AppShell({ title, children }) {
  // Render HajjLayout so pages using AppShell adopt the MyLabbaik UI
  return (
    <PremiumPopupProvider>
      <AppShellInner title={title}>{children}</AppShellInner>
    </PremiumPopupProvider>
  );
}