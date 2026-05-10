import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  Search, Plus, Trash2, ExternalLink, FileText, Layout,
  ChevronDown, ChevronUp, Filter, LayoutGrid, Rows3,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

/* ─── Visibility badge ──────────────────────────────────────── */
function VisibilityBadge({ value }) {
  const map = {
    public:  { label: 'Public',  cls: 'bg-emerald-950/40 text-emerald-300 ring-emerald-900/50' },
    draft:   { label: 'Draft',   cls: 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] ring-[hsl(var(--border))]' },
    private: { label: 'Private', cls: 'bg-yellow-950/40 text-yellow-300 ring-yellow-900/50' },
    premium: { label: 'Premium', cls: 'bg-purple-950/40 text-purple-300 ring-purple-900/50' },
  };
  const { label, cls } = map[value] || map.draft;
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs ring-1 ${cls}`}>{label}</span>
  );
}

/* ─── Type badge ─────────────────────────────────────────────── */
function TypeBadge({ type, useBuilder }) {
  if (type === 'article') {
    return (
      <span className="flex items-center gap-1 rounded-full bg-blue-950/40 px-2 py-0.5 text-xs text-blue-300 ring-1 ring-blue-900/50">
        <FileText className="size-3" /> Article
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded-full bg-orange-950/40 px-2 py-0.5 text-xs text-orange-300 ring-1 ring-orange-900/50">
      <Layout className="size-3" /> {useBuilder ? 'Builder Page' : 'Page'}
    </span>
  );
}

/* ─── Stat card ──────────────────────────────────────────────── */
function StatCard({ label, value, sub, color = 'text-[hsl(var(--foreground))]' }) {
  return (
    <div className="rounded-2xl bg-[hsl(var(--card))] p-4 ring-1 ring-[hsl(var(--border))]">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm font-medium text-[hsl(var(--foreground))]">{label}</div>
      {sub && <div className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">{sub}</div>}
    </div>
  );
}

/* ─── Pagination widget ──────────────────────────────────────── */
function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.last_page <= 1) return null;
  const { current_page, last_page, from, to, total } = pagination;

  const pages = [];
  const delta = 2;
  const left  = Math.max(1, current_page - delta);
  const right = Math.min(last_page, current_page + delta);
  for (let i = left; i <= right; i++) pages.push(i);

  const btnBase = 'flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm transition-colors disabled:opacity-40';
  const btnActive = 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold';
  const btnIdle   = 'hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]';

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs text-[hsl(var(--muted-foreground))]">
        {total === 0 ? '0 items' : `${from}–${to} of ${total}`}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(1)}
          disabled={current_page === 1}
          className={`${btnBase} ${btnIdle}`}
          title="First page"
        >
          <ChevronsLeft className="size-4" />
        </button>
        <button
          onClick={() => onPage(current_page - 1)}
          disabled={current_page === 1}
          className={`${btnBase} ${btnIdle}`}
          title="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>

        {left > 1 && (
          <>
            <button onClick={() => onPage(1)} className={`${btnBase} ${btnIdle}`}>1</button>
            {left > 2 && <span className="px-1 text-[hsl(var(--muted-foreground))]">…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`${btnBase} ${p === current_page ? btnActive : btnIdle}`}
          >
            {p}
          </button>
        ))}

        {right < last_page && (
          <>
            {right < last_page - 1 && <span className="px-1 text-[hsl(var(--muted-foreground))]">…</span>}
            <button onClick={() => onPage(last_page)} className={`${btnBase} ${btnIdle}`}>{last_page}</button>
          </>
        )}

        <button
          onClick={() => onPage(current_page + 1)}
          disabled={current_page === last_page}
          className={`${btnBase} ${btnIdle}`}
          title="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
        <button
          onClick={() => onPage(last_page)}
          disabled={current_page === last_page}
          className={`${btnBase} ${btnIdle}`}
          title="Last page"
        >
          <ChevronsRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function AdminContentManagerIndex({ items, pagination, stats, postTypes, categories, filters }) {
  const [search, setSearch]           = useState(filters?.search || '');
  const [contentType, setContentType] = useState(filters?.content_type || 'all');
  const [postTypeId, setPostTypeId]   = useState(filters?.post_type_id || '');
  const [categoryId, setCategoryId]   = useState(filters?.category_id || '');
  const [visibility, setVisibility]   = useState(filters?.visibility || '');
  const [sortDir, setSortDir]         = useState(filters?.sort_dir || 'desc');
  const [perPage, setPerPage]         = useState(filters?.per_page || 20);
  const [view, setView]               = useState('table'); // table | grid
  const [deletingId, setDeletingId]   = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => applyFilters({ search }), 350);
    return () => clearTimeout(timer);
  }, [search]);

  function applyFilters(overrides = {}) {
    router.get(
      '/admin/content-manager',
      { search, content_type: contentType, post_type_id: postTypeId, category_id: categoryId, visibility, sort_dir: sortDir, per_page: perPage, page: 1, ...overrides },
      { preserveState: true, preserveScroll: true },
    );
  }

  function handleTypeChange(val) {
    setContentType(val);
    applyFilters({ content_type: val });
  }

  function handlePostTypeChange(val) {
    setPostTypeId(val);
    applyFilters({ post_type_id: val });
  }

  function handleCategoryChange(val) {
    setCategoryId(val);
    applyFilters({ category_id: val });
  }

  function handleVisibilityChange(val) {
    setVisibility(val);
    applyFilters({ visibility: val });
  }

  function toggleSort() {
    const next = sortDir === 'desc' ? 'asc' : 'desc';
    setSortDir(next);
    applyFilters({ sort_dir: next });
  }

  function handlePageChange(newPage) {
    router.get(
      '/admin/content-manager',
      { search, content_type: contentType, post_type_id: postTypeId, category_id: categoryId, visibility, sort_dir: sortDir, per_page: perPage, page: newPage },
      { preserveState: true, preserveScroll: false },
    );
  }

  function handlePerPageChange(val) {
    const n = Number(val);
    setPerPage(n);
    applyFilters({ per_page: n, page: 1 });
  }

  function handleDelete(item) {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    setDeletingId(item.id + item.content_type);
    router.delete(`/admin/content-manager/${item.content_type}/${item.id}`, {
      onFinish: () => setDeletingId(null),
    });
  }

  const selectCls = 'rounded-xl bg-[hsl(var(--background))] px-3 py-2 text-sm ring-1 ring-[hsl(var(--border))] focus:outline-none focus:ring-[hsl(var(--primary))]';

  return (
    <AdminShell title="Content Manager">
      <Head title="Content Manager" />

      {/* ── Stats row ── */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label="Total Articles"
          value={stats.total_articles}
          sub={`${stats.published_articles} published`}
          color="text-blue-400"
        />
        <StatCard
          label="Draft Articles"
          value={stats.draft_articles}
          color="text-yellow-400"
        />
        <StatCard
          label="Total Pages"
          value={stats.total_pages}
          sub={`${stats.published_pages} published`}
          color="text-orange-400"
        />
        {(stats.by_post_type || []).slice(0, 2).map((pt) => (
          <StatCard key={pt.name} label={pt.name} value={pt.count} sub="articles" />
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative min-w-52 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or slug…"
            className="pl-9 text-sm"
          />
        </div>

        {/* Content type */}
        <select value={contentType} onChange={(e) => handleTypeChange(e.target.value)} className={selectCls}>
          <option value="all">All types</option>
          <option value="articles">Articles only</option>
          <option value="pages">Pages only</option>
        </select>

        {/* Post type */}
        {contentType !== 'pages' && (
          <select value={postTypeId} onChange={(e) => handlePostTypeChange(e.target.value)} className={selectCls}>
            <option value="">All post types</option>
            {(postTypes || []).map((pt) => (
              <option key={pt.id} value={pt.id}>{pt.name}</option>
            ))}
          </select>
        )}

        {/* Category */}
        {contentType !== 'pages' && (
          <select value={categoryId} onChange={(e) => handleCategoryChange(e.target.value)} className={selectCls}>
            <option value="">All categories</option>
            {(categories || []).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}

        {/* Visibility */}
        <select value={visibility} onChange={(e) => handleVisibilityChange(e.target.value)} className={selectCls}>
          <option value="">All visibility</option>
          <option value="public">Public</option>
          <option value="draft">Draft</option>
          <option value="private">Private</option>
          <option value="premium">Premium</option>
        </select>

        {/* Sort */}
        <button
          onClick={toggleSort}
          className="flex items-center gap-1.5 rounded-xl bg-[hsl(var(--background))] px-3 py-2 text-sm ring-1 ring-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors"
          title={`Sort ${sortDir === 'desc' ? 'oldest first' : 'newest first'}`}
        >
          {sortDir === 'desc' ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
          Updated
        </button>

        {/* View toggle */}
        <div className="flex rounded-xl ring-1 ring-[hsl(var(--border))] overflow-hidden">
          <button
            onClick={() => setView('table')}
            className={`px-2.5 py-2 transition-colors ${view === 'table' ? 'bg-[hsl(var(--muted))]' : 'hover:bg-[hsl(var(--muted))]/50'}`}
            title="Table view"
          >
            <Rows3 className="size-4" />
          </button>
          <button
            onClick={() => setView('grid')}
            className={`px-2.5 py-2 transition-colors ${view === 'grid' ? 'bg-[hsl(var(--muted))]' : 'hover:bg-[hsl(var(--muted))]/50'}`}
            title="Grid view"
          >
            <LayoutGrid className="size-4" />
          </button>
        </div>

        {/* Quick create */}
        <Button asChild>
          <Link href="/admin/articles/create">
            <Plus className="mr-1.5 size-4" />
            New Article
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/admin/pages/create">
            <Plus className="mr-1.5 size-4" />
            New Page
          </Link>
        </Button>
      </div>

      {/* ── Count + per-page ── */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm text-[hsl(var(--muted-foreground))]">
          {pagination?.total ?? items?.length ?? 0} item{(pagination?.total ?? items?.length) !== 1 ? 's' : ''} found
        </span>
        <select
          value={perPage}
          onChange={(e) => handlePerPageChange(e.target.value)}
          className={selectCls}
          title="Items per page"
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>{n} per page</option>
          ))}
        </select>
      </div>

      {/* ── Table view ── */}
      {view === 'table' && (
        <div className="overflow-hidden rounded-3xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))]">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))]">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))]">Category / Post Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))]">Updated</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[hsl(var(--muted-foreground))]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border))]">
                {(items || []).map((item) => {
                  const key = item.content_type + item.id;
                  return (
                    <tr key={key} className="transition-colors hover:bg-[hsl(var(--muted))]/20">
                      <td className="px-4 py-3 max-w-xs">
                        <div className="font-medium leading-snug truncate" title={item.title}>{item.title}</div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))] truncate">/{item.content_type === 'article' ? 'articles' : 'p'}/{item.slug}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <TypeBadge type={item.content_type} useBuilder={item.use_builder} />
                      </td>
                      <td className="px-4 py-3 text-sm text-[hsl(var(--muted-foreground))]">
                        {item.category?.name && (
                          <div className="truncate max-w-32">{item.category.name}</div>
                        )}
                        {item.post_type?.name && (
                          <div className="text-xs truncate max-w-32 opacity-70">{item.post_type.name}</div>
                        )}
                        {!item.category && !item.post_type && <span className="opacity-40">—</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <VisibilityBadge value={item.visibility} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-[hsl(var(--muted-foreground))]">
                        {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="secondary" size="sm" asChild>
                            <Link href={item.edit_url}>Edit</Link>
                          </Button>
                          <a
                            href={item.view_url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                            title="View"
                          >
                            <ExternalLink className="size-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item.id + item.content_type}
                            className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] hover:text-red-400 hover:bg-red-950/30 transition-colors disabled:opacity-40"
                            title="Delete"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {(!items || items.length === 0) && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-sm text-[hsl(var(--muted-foreground))]">
                      No content found. Adjust your filters or create something new.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Grid view ── */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(items || []).map((item) => {
            const key = item.content_type + item.id;
            return (
              <div
                key={key}
                className="flex flex-col gap-3 rounded-2xl bg-[hsl(var(--card))] p-4 ring-1 ring-[hsl(var(--border))] hover:ring-[hsl(var(--primary))]/50 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <TypeBadge type={item.content_type} useBuilder={item.use_builder} />
                  <VisibilityBadge value={item.visibility} />
                </div>

                <div>
                  <div className="font-semibold leading-snug line-clamp-2">{item.title}</div>
                  <div className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))] truncate">
                    /{item.content_type === 'article' ? 'articles' : 'p'}/{item.slug}
                  </div>
                </div>

                {(item.category || item.post_type) && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.category && (
                      <span className="rounded-full bg-[hsl(var(--muted))] px-2 py-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                        {item.category.name}
                      </span>
                    )}
                    {item.post_type && (
                      <span className="rounded-full bg-[hsl(var(--muted))] px-2 py-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                        {item.post_type.name}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between gap-2 border-t border-[hsl(var(--border))] pt-3">
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '—'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button variant="secondary" size="sm" asChild>
                      <Link href={item.edit_url}>Edit</Link>
                    </Button>
                    <a
                      href={item.view_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item.id + item.content_type}
                      className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] hover:text-red-400 hover:bg-red-950/30 transition-colors disabled:opacity-40"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {(!items || items.length === 0) && (
            <div className="col-span-full rounded-2xl bg-[hsl(var(--card))] p-10 text-center text-sm text-[hsl(var(--muted-foreground))] ring-1 ring-[hsl(var(--border))]">
              No content found. Adjust your filters or create something new.
            </div>
          )}
        </div>
      )}

      {/* ── Pagination ── */}
      <Pagination pagination={pagination} onPage={handlePageChange} />
    </AdminShell>
  );
}
