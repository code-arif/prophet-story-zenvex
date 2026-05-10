import { Head, Link, router } from '@inertiajs/react';
import React from 'react';
import { Bookmark, BookmarkCheck, Clock, Search as SearchIcon } from 'lucide-react';
import AppShell from '../../layouts/AppShell';
import { useSavedArticles } from '../../lib/useSavedArticles';

function getTimeAgo(v) {
  if (!v) return '';
  const t = new Date(v).getTime();
  if (!Number.isFinite(t)) return '';
  const seconds = Math.floor((Date.now() - t) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function ResultRow({ article }) {
  const { isSaved, toggleSaved } = useSavedArticles();
  const saved = isSaved(article?.slug);
  const imageUrl = article?.featured_image_url || null;

  function onSave(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(article?.slug, article);
  }

  if (!article) return null;

  return (
    <Link href={`/articles/${article.slug}`} className="news-card flex gap-3 p-3 relative hover-scale">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[hsl(var(--muted))]">
        {imageUrl ? <img src={imageUrl} alt={article.title} className="h-full w-full object-cover" loading="lazy" /> : null}
      </div>

      <div className="min-w-0 flex-1 pr-10">
        <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {getTimeAgo(article.published_at)}
          </span>
          {article?.category?.name ? (
            <span className="category-chip bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]">
              {article.category.name}
            </span>
          ) : null}
        </div>

        <div className="mt-1 line-clamp-2 text-sm font-semibold text-[hsl(var(--foreground))]">{article.title}</div>
        {article.excerpt ? (
          <div className="mt-1 line-clamp-2 text-sm text-[hsl(var(--muted-foreground))]">{article.excerpt}</div>
        ) : null}
      </div>

      <button
        onClick={onSave}
        className="absolute right-3 top-3 p-1.5 rounded-full hover:bg-[hsl(var(--secondary))] transition-colors"
        aria-label="Save"
      >
        {saved ? <BookmarkCheck size={18} className="text-[hsl(var(--accent))]" /> : <Bookmark size={18} className="text-[hsl(var(--muted-foreground))]" />}
      </button>
    </Link>
  );
}

export default function SearchIndex({ brandName, q, results }) {
  const [query, setQuery] = React.useState(q || '');

  function submit(e) {
    e.preventDefault();
    router.get('/search', { q: query }, { preserveState: true, replace: true });
  }

  const list = Array.isArray(results) ? results : [];

  return (
    <AppShell title={brandName}>
      <Head title="Search" />

      <div className="lg:max-w-7xl lg:mx-auto lg:px-6">
        <div className="px-4 lg:px-0 py-4">
          <h1 className="text-lg font-bold text-[hsl(var(--foreground))]">Search</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Find breaking news, politics, sports and more.</p>

          <form onSubmit={submit} className="mt-3 relative">
            <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search news..."
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] text-[hsl(var(--foreground))]"
            />
          </form>
        </div>

        <div className="px-4 lg:px-0 pb-8 space-y-3">
          {q ? (
            <div className="text-xs text-[hsl(var(--muted-foreground))]">Results for: <span className="font-semibold text-[hsl(var(--foreground))]">{q}</span></div>
          ) : (
            <div className="text-xs text-[hsl(var(--muted-foreground))]">Type to search.</div>
          )}

          {q && !list.length ? (
            <div className="news-card p-6 text-center">
              <div className="text-sm font-semibold text-[hsl(var(--foreground))]">No results found</div>
              <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Try different keywords.</div>
            </div>
          ) : null}

          {list.map((a) => (
            <ResultRow key={a.id} article={a} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
