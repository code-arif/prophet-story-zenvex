import React from 'react';
import { Head, useForm } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';
import SettingsNav from '../../../components/admin/SettingsNav';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

function cleanType(v) {
  const t = String(v || 'custom');
  return t === 'page' || t === 'article' ? t : 'custom';
}

function LookupPicker({ type, valueId, onPick }) {
  const [q, setQ] = React.useState('');
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();

    async function run() {
      const query = q.trim();
      if (!query) {
        setItems([]);
        return;
      }

      setLoading(true);
      try {
        const endpoint = type === 'page' ? '/api/admin/lookup/pages' : '/api/admin/lookup/articles';
        const res = await fetch(`${endpoint}?q=${encodeURIComponent(query)}`, {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        const data = await res.json();
        setItems(Array.isArray(data?.items) ? data.items : []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    const t = setTimeout(run, 250);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [q, type]);

  return (
    <div className="space-y-2">
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={type === 'page' ? 'Search page…' : 'Search post…'} />
      {loading ? <div className="text-xs text-[hsl(var(--muted-foreground))]">Searching…</div> : null}

      {items.length ? (
        <div className="max-h-56 overflow-auto rounded-2xl bg-[hsl(var(--background))] ring-1 ring-[hsl(var(--border))]">
          {items.map((it) => {
            const active = String(valueId || '') === String(it.id);
            return (
              <button
                type="button"
                key={it.id}
                onClick={() => onPick(it)}
                className={
                  'block w-full px-4 py-3 text-left text-sm hover:bg-[hsl(var(--muted))] ' +
                  (active ? 'bg-[hsl(var(--muted))] font-semibold' : '')
                }
              >
                <div className="line-clamp-1">{it.title}</div>
                <div className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">{it.href}</div>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function AdminSettingsUserMenu({ navMenu }) {
  const form = useForm({
    items: Array.isArray(navMenu?.items) ? navMenu.items : [],
  });

  function setItem(idx, patch) {
    const copy = [...form.data.items];
    copy[idx] = { ...copy[idx], ...patch };
    form.setData('items', copy);
  }

  function addItem() {
    form.setData('items', [...form.data.items, { type: 'custom', label: '', href: '' }]);
  }

  function removeItem(idx) {
    form.setData('items', form.data.items.filter((_, i) => i !== idx));
  }

  function move(idx, dir) {
    const to = idx + dir;
    if (to < 0 || to >= form.data.items.length) return;
    const copy = [...form.data.items];
    const tmp = copy[idx];
    copy[idx] = copy[to];
    copy[to] = tmp;
    form.setData('items', copy);
  }

  function submit(e) {
    e.preventDefault();
    form.post('/admin/settings/menu');
  }

  return (
    <AdminShell title="Settings">
      <Head title="User menu" />

      <div className="grid gap-4">

        <div>
          <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
            <div className="text-lg font-semibold">User navigation menu</div>
            <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Build the left drawer menu shown to users (News feed/Profile/etc).
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="space-y-3">
                {form.data.items.map((it, idx) => {
                  const type = cleanType(it?.type);

                  return (
                    <div key={idx} className="rounded-3xl bg-[hsl(var(--background))] p-4 ring-1 ring-[hsl(var(--border))]">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm font-semibold">Item #{idx + 1}</div>
                        <div className="flex items-center gap-2">
                          <Button type="button" variant="secondary" onClick={() => move(idx, -1)}>↑</Button>
                          <Button type="button" variant="secondary" onClick={() => move(idx, 1)}>↓</Button>
                          <Button type="button" variant="destructive" onClick={() => removeItem(idx)}>Remove</Button>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <label className="mb-2 block text-xs text-[hsl(var(--muted-foreground))]">Type</label>
                          <select
                            value={type}
                            onChange={(e) => {
                              const nextType = cleanType(e.target.value);
                              setItem(idx, nextType === 'custom'
                                ? { type: nextType, page_id: null, article_id: null, href: it?.href || '' }
                                : { type: nextType, href: '', page_id: null, article_id: null }
                              );
                            }}
                            className="block w-full rounded-2xl bg-[hsl(var(--card))] px-4 py-3 text-sm ring-1 ring-[hsl(var(--border))]"
                          >
                            <option value="custom">Custom link</option>
                            <option value="page">Page</option>
                            <option value="article">Post</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="mb-2 block text-xs text-[hsl(var(--muted-foreground))]">Label</label>
                          <Input value={String(it?.label || '')} onChange={(e) => setItem(idx, { label: e.target.value })} />
                        </div>
                      </div>

                      {type === 'custom' ? (
                        <div className="mt-3">
                          <label className="mb-2 block text-xs text-[hsl(var(--muted-foreground))]">URL</label>
                          <Input value={String(it?.href || '')} onChange={(e) => setItem(idx, { href: e.target.value })} placeholder="/about or https://example.com" />
                        </div>
                      ) : null}

                      {type === 'page' ? (
                        <div className="mt-3">
                          <label className="mb-2 block text-xs text-[hsl(var(--muted-foreground))]">Select page</label>
                          <LookupPicker
                            type="page"
                            valueId={it?.page_id}
                            onPick={(p) => {
                              setItem(idx, {
                                type: 'page',
                                page_id: p.id,
                                article_id: null,
                                href: '',
                                preview_href: p.href,
                                preview_title: p.title,
                                preview_status: p.is_published ? 'published' : 'draft',
                                label: String(it?.label || '').trim() ? it.label : p.title,
                              });
                            }}
                          />
                          {it?.preview_href ? (
                            <div className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">Preview: {it.preview_href}</div>
                          ) : null}
                        </div>
                      ) : null}

                      {type === 'article' ? (
                        <div className="mt-3">
                          <label className="mb-2 block text-xs text-[hsl(var(--muted-foreground))]">Select post</label>
                          <LookupPicker
                            type="article"
                            valueId={it?.article_id}
                            onPick={(a) => {
                              setItem(idx, {
                                type: 'article',
                                article_id: a.id,
                                page_id: null,
                                href: '',
                                preview_href: a.href,
                                preview_title: a.title,
                                preview_status: a.is_published ? 'published' : 'draft',
                                label: String(it?.label || '').trim() ? it.label : a.title,
                              });
                            }}
                          />
                          {it?.preview_href ? (
                            <div className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">Preview: {it.preview_href}</div>
                          ) : null}
                        </div>
                      ) : null}

                      {form.errors[`items.${idx}.label`] ? (
                        <div className="mt-2 text-xs text-[hsl(var(--destructive))]">{form.errors[`items.${idx}.label`]}</div>
                      ) : null}
                    </div>
                  );
                })}

                {!form.data.items.length ? (
                  <div className="rounded-3xl bg-[hsl(var(--background))] p-5 text-sm text-[hsl(var(--muted-foreground))] ring-1 ring-[hsl(var(--border))]">
                    No menu items yet.
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="secondary" onClick={addItem}>Add item</Button>
                <Button disabled={form.processing}>
                  {form.processing ? 'Saving…' : 'Save user menu'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
