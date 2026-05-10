import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminShell from '../../../layouts/AdminShell';
import SettingsNav from '../../../components/admin/SettingsNav';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function AdminSettingsTheme() {
  const shared = usePage().props.settings || {};
  const packs = shared?.theme?.packs || {};
  const modeDefault = shared?.theme?.mode || 'dark';
  const packDefault = shared?.theme?.pack || 'custom';
  const primaryDefault = shared?.theme?.primaryHex || shared?.theme?.effectivePrimaryHex || '#3b82f6';

  const form = useForm({
    brandName: shared?.brandName || '',
    mode: modeDefault,
    pack: packDefault,
    primaryHex: primaryDefault,
  });

  // Helpers copied from AdminShell to render swatches
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
    let destructive;
    let destructiveFg;
    let border;

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

      destructive = '0 84.2% 60.2%';
      destructiveFg = '210 40% 98%';

      border = '214.3 31.8% 91.4%';
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

      destructive = '0 62.8% 30.6%';
      destructiveFg = foreground;

      border = formatHsl(h, 27.9, 16.9);
    }

    return {
      background,
      foreground,
      card,
      'card-foreground': cardFg,
      popover,
      'popover-foreground': popoverFg,
      primary,
      'primary-foreground': destructiveFg,
      secondary,
      'secondary-foreground': secondaryFg,
      muted,
      'muted-foreground': mutedFg,
      destructive,
      'destructive-foreground': destructiveFg,
      border,
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

    styleEl.textContent = [block(':root', varsBase), block(':root[data-mode="light"]', varsLight), block(':root[data-mode="dark"]', varsDark)].join('\n\n');
  }

  function submit(e) {
    e.preventDefault();
    form.post('/admin/settings/theme', { forceFormData: true });
  }

  function persistTheme(next) {
    const pack = String(next.pack || form.data.pack || 'custom');
    const mode = next.mode === 'light' ? 'light' : form.data.mode || 'dark';
    const hex = normalizeHex(next.primaryHex || form.data.primaryHex || primaryDefault) || '#3b82f6';

    // Apply instantly
    applyThemeToDom({ mode, primaryHex: hex });

    // Persist via form post
    form.setData('mode', mode);
    form.setData('pack', pack);
    form.setData('primaryHex', pack === 'custom' ? hex : undefined);
    form.post('/admin/settings/theme', { preserveScroll: true, preserveState: true, forceFormData: true });
  }

  return (
    <AdminShell title="Theme Settings">
      <Head title="Theme Settings" />

      <div className="grid gap-4">

        <div>
          <form onSubmit={submit} className="space-y-4">
            <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
              <div className="text-lg font-semibold">Theme</div>
              <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Configure site theme and colors</div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-[hsl(var(--card))] p-4 ring-1 ring-[hsl(var(--border))]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold">Mode</div>
                    <div className="flex items-center gap-2">
                      <Button type="button" size="sm" variant={form.data.mode === 'dark' ? 'secondary' : 'outline'} onClick={() => persistTheme({ mode: 'dark' })}>Dark</Button>
                      <Button type="button" size="sm" variant={form.data.mode === 'light' ? 'secondary' : 'outline'} onClick={() => persistTheme({ mode: 'light' })}>Light</Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[hsl(var(--card))] p-4 ring-1 ring-[hsl(var(--border))]">
                  <div className="text-sm font-semibold">Presets</div>
                  <div className="mt-3 space-y-2">
                    {[['custom', { label: 'Custom', primaryHex: primaryDefault }], ...Object.entries(packs || {})].map(([key, p]) => {
                      const primaryHex = key === 'custom' ? form.data.primaryHex : p?.primaryHex;
                      const light = themeCssVarsForMode({ mode: 'light', primaryHex });
                      const dark = themeCssVarsForMode({ mode: 'dark', primaryHex });
                      const swLight = [light.background, light.primary, light.secondary, light.muted, light.destructive];
                      const swDark = [dark.background, dark.primary, dark.secondary, dark.muted, dark.destructive];
                      const active = form.data.pack === key;

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            form.setData('pack', key);
                            const useHex = key === 'custom' ? form.data.primaryHex : p?.primaryHex;
                            persistTheme({ pack: key, primaryHex: useHex, mode: form.data.mode });
                          }}
                          className={
                            'w-full rounded-2xl p-3 text-left ring-1 transition ' +
                            (active ? 'bg-[hsl(var(--muted))] ring-[hsl(var(--border))]' : 'bg-[hsl(var(--background))] ring-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]')
                          }
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold">{p?.label || key}</div>
                              <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{normalizeHex(primaryHex) || primaryHex}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {swLight.map((hsl, idx) => (
                                  <span
                                    key={`l-${idx}`}
                                    className="size-3 rounded-full ring-1 ring-black/10"
                                    style={{ backgroundColor: `hsl(${hsl})` }}
                                    title="light"
                                  />
                                ))}
                              </div>
                              <div className="flex items-center gap-1">
                                {swDark.map((hsl, idx) => (
                                  <span
                                    key={`d-${idx}`}
                                    className="size-3 rounded-full ring-1 ring-white/10"
                                    style={{ backgroundColor: `hsl(${hsl})` }}
                                    title="dark"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {form.data.pack === 'custom' ? (
                    <div className="mt-4 rounded-2xl bg-[hsl(var(--background))] p-3 ring-1 ring-[hsl(var(--border))]">
                      <div className="text-sm font-semibold">Custom colors</div>
                      <div className="mt-3 flex items-center gap-3">
                        <input
                          type="color"
                          value={form.data.primaryHex}
                          onChange={(e) => {
                            const v = e.target.value;
                            form.setData('primaryHex', v);
                            persistTheme({ pack: 'custom', primaryHex: v, mode: form.data.mode });
                          }}
                          className="h-10 w-14 rounded-2xl bg-[hsl(var(--background))] ring-1 ring-[hsl(var(--border))]"
                        />
                        <Input
                          value={form.data.primaryHex}
                          onChange={(e) => form.setData('primaryHex', e.target.value)}
                          onBlur={(e) => {
                            const v = normalizeHex(e.target.value) || e.target.value;
                            form.setData('primaryHex', v);
                            persistTheme({ pack: 'custom', primaryHex: v, mode: form.data.mode });
                          }}
                          className="h-10 flex-1 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm text-[hsl(var(--foreground))] outline-none"
                        />
                      </div>
                      <div className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">Custom primary updates the whole UI palette.</div>
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={form.processing}>{form.processing ? 'Saving...' : 'Save Theme'}</Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
