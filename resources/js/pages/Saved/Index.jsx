import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { Bookmark, BookmarkX, Clock, Trash2 } from 'lucide-react';
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

function SavedRow({ item, onRemove }) {
  const imageUrl = item?.featured_image_url || null;

  return (
    <Link href={`/articles/${item.slug}`} className="news-card flex gap-3 p-3 relative hover-scale">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[hsl(var(--muted))]">
        {imageUrl ? <img src={imageUrl} alt={item.title || item.slug} className="h-full w-full object-cover" loading="lazy" /> : null}
      </div>

      <div className="min-w-0 flex-1 pr-10">
        <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
          {item?.published_at ? (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {getTimeAgo(item.published_at)}
            </span>
          ) : null}
          {item?.category?.name ? (
            <span className="category-chip bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]">
              {item.category.name}
            </span>
          ) : null}
        </div>

        <div className="mt-1 line-clamp-2 text-sm font-semibold text-[hsl(var(--foreground))]">
          {item.title || item.slug}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(item.slug);
        }}
        className="absolute right-3 top-3 p-1.5 rounded-full hover:bg-[hsl(var(--secondary))] transition-colors"
        aria-label="Remove"
      >
        <BookmarkX size={18} className="text-[hsl(var(--muted-foreground))]" />
      </button>
    </Link>
  );
}

export default function SavedIndex({ brandName }) {
  const { savedItems, toggleSaved, clearSaved } = useSavedArticles();
  
  React.useEffect(() => {
    console.log('SavedIndex - savedItems:', savedItems);
    console.log('SavedIndex - savedItems length:', savedItems.length);
  }, [savedItems]);

  return (
    <AppShell title={brandName}>
      <Head title="Saved" />

      <div className="lg:max-w-7xl lg:mx-auto lg:px-6">
        <div className="px-4 lg:px-0 py-4 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
              <Bookmark size={18} className="text-[hsl(var(--accent))]" />
              Saved
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Your saved articles (this device).</p>
          </div>

          {savedItems.length ? (
            <button
              onClick={() => clearSaved()}
              className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--secondary))] px-3 py-2 text-sm font-medium text-[hsl(var(--foreground))] hover:opacity-90"
            >
              <Trash2 size={16} />
              Clear
            </button>
          ) : null}
        </div>

        <div className="px-4 lg:px-0 pb-8 space-y-3">
          {!savedItems.length ? (
            <div className="news-card p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--secondary))]">
                <Bookmark size={20} className="text-[hsl(var(--muted-foreground))]" />
              </div>
              <div className="text-sm font-semibold text-[hsl(var(--foreground))]">No saved articles yet</div>
              <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Tap the bookmark icon to save stories.</div>
              <div className="mt-4">
                <Link
                  href="/"
                  className="inline-flex items-center rounded-xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-[hsl(var(--primary-foreground))] hover:opacity-90"
                >
                  Browse News
                </Link>
              </div>
            </div>
          ) : (
            savedItems.map((item) => (
              <SavedRow key={item.slug} item={item} onRemove={(slug) => toggleSaved(slug)} />
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
