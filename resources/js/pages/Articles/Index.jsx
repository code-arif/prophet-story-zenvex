import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AppShell from '../../layouts/AppShell';
import { Button } from '../../components/ui/button';
import { usePremiumPopup } from '../../lib/PremiumPopupContext';

export default function ArticlesIndex({ articles }) {
  const { guardClick } = usePremiumPopup();

  return (
    <AppShell title="Articles">
      <Head title="Articles" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {(articles?.data || []).map((a) => (
          <Link
            key={a.id}
            href={`/articles/${a.slug}`}
            onClick={guardClick}
            className="group block overflow-hidden rounded-2xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))] hover:shadow-lg transition-shadow"
          >
            {a.featured_image_url ? (
              <div className="h-44 w-full bg-[hsl(var(--muted))] overflow-hidden">
                <img src={a.featured_image_url} alt={a.title} className="h-full w-full object-cover transform group-hover:scale-105 transition-transform" loading="lazy" />
              </div>
            ) : null}

            <div className="p-4">
              <div className="text-xs text-[hsl(var(--muted-foreground))]">
                {a.published_at ? new Date(a.published_at).toLocaleString() : ''}
              </div>
              <div className="mt-1 text-lg font-semibold leading-snug line-clamp-2">{a.title}</div>
              {a.excerpt ? <div className="mt-2 text-sm text-[hsl(var(--muted-foreground))] line-clamp-3">{a.excerpt}</div> : null}
            </div>
          </Link>
        ))}
      </div>

      {(!articles?.data || articles.data.length === 0) && (
        <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
          No articles found.
        </div>
      )}

      {/* Pagination */}
      {articles?.links && articles.links.length > 3 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-[hsl(var(--muted-foreground))]">
            Showing {articles.from || 0} to {articles.to || 0} of {articles.total || 0} articles
          </div>
          <div className="flex items-center gap-2">
            {articles.links.map((link, index) => {
              if (link.label === '&laquo; Previous') {
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url)}
                  >
                    <ChevronLeft className="size-4" />
                    <span className="hidden sm:inline ml-1">Previous</span>
                  </Button>
                );
              }
              if (link.label === 'Next &raquo;') {
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url)}
                  >
                    <span className="hidden sm:inline mr-1">Next</span>
                    <ChevronRight className="size-4" />
                  </Button>
                );
              }
              // Show page numbers on larger screens only
              return (
                <Button
                  key={index}
                  variant={link.active ? 'default' : 'outline'}
                  size="sm"
                  disabled={!link.url}
                  onClick={() => link.url && router.get(link.url)}
                  className="hidden sm:inline-flex"
                >
                  {link.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </AppShell>
  );
}
