import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import DOMPurify from 'dompurify';
import AppShell from '../../layouts/AdminShell';
import BlocksRenderer from '../../components/BlocksRenderer';
import { Clock, TrendingUp, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useSavedArticles } from '../../lib/useSavedArticles';
import { Button } from '../../components/ui/button';
import { usePremiumPopup } from '../../lib/PremiumPopupContext';

function FullArticleCard({ a, onVisible }) {
  const cardRef = React.useRef(null);

  React.useEffect(() => {
    if (!cardRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            onVisible?.(a);
          }
        });
      },
      { threshold: [0.5] }
    );
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [a, onVisible]);

  return (
    <div ref={cardRef} className="mt-6">
      <div className="text-xs text-[hsl(var(--muted-foreground))]">{a.published_at ? new Date(a.published_at).toLocaleString() : ''}</div>
      <h2 className="mt-2 text-xl font-semibold leading-snug">{a.title}</h2>
      {a.excerpt ? <div className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">{a.excerpt}</div> : null}

      {a.featured_image_url ? (
        <div className="mt-5 overflow-hidden rounded-2xl ring-1 ring-[hsl(var(--border))]">
          <img src={a.featured_image_url} alt={a.title} className="h-auto w-full object-cover" />
        </div>
      ) : null}

      <div className="mt-5">
        {Array.isArray(a.body_blocks) && a.body_blocks.length ? (
          <BlocksRenderer blocks={a.body_blocks} />
        ) : (
          <div
            className="rich-content whitespace-pre-wrap text-[15px] leading-7 text-[hsl(var(--foreground))]"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(a.body || '', { USE_PROFILES: { html: true }, ADD_ATTR: ['style', 'target'] }) }}
          />
        )}
      </div>
    </div>
  );
}

function SuggestedSection({ articles, guardClick }) {
  return (
    <div className="mt-6 rounded-2xl bg-[hsl(var(--secondary)/0.5)] p-5">
      <h3 className="text-lg font-semibold mb-3">You May Also Like</h3>
      
      {/* Mobile: List view like search items */}
      <div className="lg:hidden space-y-3">
        {articles.map((item) => (
          <Link
            key={item.id}
            href={`/articles/${item.slug}`}
            onClick={guardClick}
            className="news-card flex gap-3 p-3 hover-scale bg-[hsl(var(--card))]"
          >
            {item.featured_image_url ? (
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[hsl(var(--muted))]">
                <img
                  src={item.featured_image_url}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
                  {item.type || 'Suggested'}
                </span>
              </div>
              <div className="line-clamp-2 text-sm font-semibold text-[hsl(var(--foreground))]">
                {item.title}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: Grid view (4 columns) */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-3">
        {articles.map((item) => (
          <Link
            key={item.id}
            href={`/articles/${item.slug}`}
            onClick={guardClick}
            className="news-card block p-3 hover-scale bg-[hsl(var(--card))]"
          >
            {item.featured_image_url ? (
              <div className="w-full h-24 overflow-hidden rounded-lg bg-[hsl(var(--muted))] mb-2">
                <img
                  src={item.featured_image_url}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : null}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
                {item.type || 'Suggested'}
              </span>
            </div>
            <div className="line-clamp-2 text-sm font-semibold text-[hsl(var(--foreground))]">
              {item.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

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


export default function ArticlesShow({ article, relatedArticles = [] }) {
  const page = usePage();
  const loadingMode = page?.props?.settings?.articleViewMode || 'infinite';
  
  const [items, setItems] = React.useState([]); // Will contain both articles and suggested sections
  const [loadingNext, setLoadingNext] = React.useState(false);
  const [noMore, setNoMore] = React.useState(false);
  const [loadedIds, setLoadedIds] = React.useState(new Set([article.id]));
  const [postCount, setPostCount] = React.useState(0); // Track loaded posts for insertion logic
  const [currentArticleSlug, setCurrentArticleSlug] = React.useState(article.slug);
  const [nextArticle, setNextArticle] = React.useState(null); // For next/prev mode
  const [prevArticle, setPrevArticle] = React.useState(null); // For next/prev mode
  const [suggestedArticles, setSuggestedArticles] = React.useState([]); // For single mode
  const bottomRef = React.useRef(null);

  const { isSaved, toggleSaved } = useSavedArticles();
  const saved = isSaved(article?.slug);
  const { guardClick } = usePremiumPopup();

  // Fetch suggested articles for single mode
  React.useEffect(() => {
    if (loadingMode === 'single') {
      fetch('/articles/suggested')
        .then((r) => r.json())
        .then((data) => {
          setSuggestedArticles(data.articles?.slice(0, 4) || []);
        })
        .catch(() => setSuggestedArticles([]));
    }
  }, [loadingMode, article.slug]);

  // Fetch next and previous article metadata for navigation mode
  React.useEffect(() => {
    if (loadingMode === 'navigation') {
      // Fetch next article
      fetch(`/articles/next/${article.slug}`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (data && !loadedIds.has(data.id)) {
            setNextArticle(data);
          } else {
            setNextArticle(null);
          }
        })
        .catch(() => setNextArticle(null));

      // Fetch previous article
      fetch(`/articles/previous/${article.slug}`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (data && !loadedIds.has(data.id)) {
            setPrevArticle(data);
          } else {
            setPrevArticle(null);
          }
        })
        .catch(() => setPrevArticle(null));
    }
  }, [article.slug, loadingMode, loadedIds]);

  function onSave(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(article);
  }

  // Load next article
  const loadNextArticle = React.useCallback(() => {
    if (loadingNext || noMore) return;
    
    setLoadingNext(true);
    
    // Get last article (skip suggested sections)
    const lastArticle = items.filter((item) => item.type === 'article').slice(-1)[0] || article;
    
    fetch(`/articles/next/${lastArticle.slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('No more');
        return r.json();
      })
      .then((data) => {
        // Prevent duplicates
        if (!loadedIds.has(data.id)) {
          const newPostCount = postCount + 1;
          
          // Add the article
          const newItem = { ...data, type: 'article' };
          
          // Every 2 posts, insert a suggested section
          if (newPostCount % 2 === 0) {
            // Fetch suggested articles
            fetch('/articles/suggested')
              .then((r) => r.json())
              .then((suggested) => {
                setItems((s) => [...s, newItem, { type: 'suggested', articles: suggested.articles, id: `suggested-${Date.now()}` }]);
              })
              .catch(() => {
                setItems((s) => [...s, newItem]);
              });
          } else {
            setItems((s) => [...s, newItem]);
          }
          
          setLoadedIds((s) => new Set([...s, data.id]));
          setPostCount(newPostCount);
        }
      })
      .catch(() => setNoMore(true))
      .finally(() => setLoadingNext(false));
  }, [article.slug, loadingNext, noMore, items, loadedIds, postCount]);

  // Update URL when article becomes visible
  const handleArticleVisible = React.useCallback((visibleArticle) => {
    if (visibleArticle.slug !== currentArticleSlug) {
      setCurrentArticleSlug(visibleArticle.slug);
      window.history.replaceState({}, '', `/articles/${visibleArticle.slug}`);
      document.title = visibleArticle.title || 'Article';
    }
  }, [currentArticleSlug]);

  React.useEffect(() => {
    if (!bottomRef.current || loadingMode !== 'infinite') return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loadingNext && !noMore) {
            loadNextArticle();
          }
        });
      },
      { rootMargin: '0px 0px 200px 0px' }
    );

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [loadingMode, loadingNext, noMore, loadNextArticle]);

  return (
    <AppShell title={article?.title || 'Article'}>
      <Head title={article?.title || 'Article'} />

      <div className="space-y-4 py-20 px-4 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
            ← Back to feed
          </Link>
        </div>

        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]" id="main-article">
          <div className="text-xs text-[hsl(var(--muted-foreground))]">
            {article?.published_at ? new Date(article.published_at).toLocaleString() : ''}
          </div>
          <h1 className="mt-2 text-2xl font-semibold leading-snug">{article?.title}</h1>
          {article?.excerpt ? <div className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">{article.excerpt}</div> : null}

          {article?.featured_image_url ? (
            <div className="mt-5 overflow-hidden rounded-2xl ring-1 ring-[hsl(var(--border))]">
              <img src={article.featured_image_url} alt={article?.title || 'Article image'} className="h-auto w-full object-cover" />
            </div>
          ) : null}

          <div className="mt-5">
            {Array.isArray(article?.body_blocks) && article.body_blocks.length ? (
              <BlocksRenderer blocks={article.body_blocks} />
            ) : (
              <div
                className="rich-content whitespace-pre-wrap text-[15px] leading-7 text-[hsl(var(--foreground))]"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article?.body || '', { USE_PROFILES: { html: true }, ADD_ATTR: ['style', 'target'] }) }}
              />
            )}
          </div>
        </div>

        {/* Related articles - Responsive: List on mobile, Grid on desktop */}
        {relatedArticles && relatedArticles.length > 0 ? (
          <div id="related" className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Related Articles</h3>
            {/* Mobile: List view like search items */}
            <div className="lg:hidden space-3">
              {relatedArticles.map((related) => (
                <Link key={related.id} href={`/articles/${related.slug}`} onClick={guardClick}>
                  <article className="news-card flex gap-3 p-3 mb-1 group cursor-pointer hover-scale relative">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                      {related.featured_image_url ? (
                        <img
                          src={related.featured_image_url}
                          alt={related.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full bg-[hsl(var(--muted))]" />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between pr-8">
                      <div>
                        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[hsl(var(--card-foreground))]">{related.title}</h3>
                        {related.excerpt ? (
                          <div className="mt-2 line-clamp-2 text-xs text-[hsl(var(--muted-foreground))]">
                            {related.excerpt}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {getTimeAgo(related.published_at)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={onSave}
                      className="absolute right-3 top-3 p-1.5 rounded-full hover:bg-[hsl(var(--secondary))] transition-colors"
                      aria-label="Save"
                    >
                      {saved ? (
                        <BookmarkCheck size={16} className="text-[hsl(var(--accent))]" />
                      ) : (
                        <Bookmark size={16} className="text-[hsl(var(--muted-foreground))]" />
                      )}
                    </button>
                  </article>
                </Link>
              ))}
            </div>

            {/* Desktop: Grid view (4 columns) */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-3">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/articles/${related.slug}`}
                  onClick={guardClick}
                  className="news-card block p-3 hover-scale"
                >
                  {related.featured_image_url ? (
                    <div className="w-full h-32 overflow-hidden rounded-lg bg-[hsl(var(--muted))] mb-3">
                      <img
                        src={related.featured_image_url}
                        alt={related.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                  <div className="line-clamp-2 text-sm font-semibold text-[hsl(var(--foreground))]">
                    {related.title}
                  </div>
                  {related.excerpt ? (
                    <div className="mt-2 line-clamp-2 text-xs text-[hsl(var(--muted-foreground))]">
                      {related.excerpt}
                    </div>
                  ) : null}
                  <div className="flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {getTimeAgo(related.published_at)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {/* Suggested articles for Single mode */}
        {loadingMode === 'single' && suggestedArticles.length > 0 && (
          <SuggestedSection articles={suggestedArticles} guardClick={guardClick} />
        )}

        {/* Dynamically loaded items (articles and suggested sections) */}
        {(loadingMode === 'infinite' || loadingMode === 'loadmore') && (
          <div id="appended-next">
            {items.map((item) => 
              item.type === 'article' ? (
                <FullArticleCard key={item.id} a={item} onVisible={handleArticleVisible} />
              ) : (
                <SuggestedSection key={item.id} articles={item.articles} guardClick={guardClick} />
              )
            )}
          </div>
        )}

        {/* Loading indicator for infinite scroll */}
        {loadingMode === 'infinite' && loadingNext && (
          <div className="text-center py-4 text-sm text-[hsl(var(--muted-foreground))]">
            Loading more...
          </div>
        )}

        {/* Load More Button */}
        {loadingMode === 'loadmore' && !noMore && (
          <div className="text-center py-6">
            <Button
              onClick={loadNextArticle}
              disabled={loadingNext}
              size="lg"
              className="gap-2"
            >
              {loadingNext ? (
                'Loading...'
              ) : (
                <>
                  <ChevronDown size={16} />
                  Load Next Article
                </>
              )}
            </Button>
          </div>
        )}

        {/* Next/Previous Navigation Buttons */}
        {loadingMode === 'navigation' && (
          <div className="flex items-center justify-between py-6 gap-4">
            {prevArticle ? (
              <Link href={`/articles/${prevArticle.slug}`} className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 w-full"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Previous Article</span>
                  <span className="sm:hidden">Previous</span>
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="lg"
                disabled
                className="gap-2 flex-1 sm:flex-none"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Previous Article</span>
                <span className="sm:hidden">Previous</span>
              </Button>
            )}
            
            {nextArticle ? (
              <Link href={`/articles/${nextArticle.slug}`} className="flex-1 sm:flex-none">
                <Button size="lg" className="gap-2 w-full">
                  <span className="hidden sm:inline">Next Article</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight size={16} />
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                disabled
                className="gap-2 flex-1 sm:flex-none"
              >
                <span className="hidden sm:inline">Next Article</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight size={16} />
              </Button>
            )}
          </div>
        )}

        {/* End of content message */}
        {noMore && (loadingMode === 'infinite' || loadingMode === 'loadmore') && (
          <div className="text-center py-6 text-sm text-[hsl(var(--muted-foreground))]">
            You've reached the end
          </div>
        )}

        <div ref={bottomRef} className="h-2" />
      </div>
    </AppShell>
  );
}

