import { Head, Link, usePage } from '@inertiajs/react';
import React from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  ChevronRight,
  Clock,
  Flame,
  TrendingUp,
  CloudDownload,
} from 'lucide-react';
import AppShell from '../../layouts/AppShell';
import { useSavedArticles } from '../../lib/useSavedArticles';
import { usePremiumPopup } from '../../lib/PremiumPopupContext';
// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

function pad2(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return '00';
  return String(Math.max(0, n)).padStart(2, '0');
}

function getCountdownParts(target, now) {
  const t = target instanceof Date ? target.getTime() : NaN;
  const n = now instanceof Date ? now.getTime() : Date.now();
  if (!Number.isFinite(t)) return null;

  const diffMs = Math.max(0, t - n);
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return { days, hours, mins, secs, done: diffMs <= 0 };
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

function getCategoryColor(slug) {
  const s = String(slug || '').toLowerCase();
  if (s === 'politics' || s === 'রাজনীতি') return 'bg-red-600';
  if (s === 'economy' || s === 'অর্থনীতি') return 'bg-emerald-600';
  if (s === 'sports' || s === 'খেলাধুলা') return 'bg-sky-600';
  if (s === 'international' || s === 'আন্তর্জাতিক') return 'bg-violet-600';
  if (s === 'technology' || s === 'প্রযুক্তি') return 'bg-indigo-600';
  if (s === 'entertainment' || s === 'বিনোদন') return 'bg-pink-600';
  return 'bg-[hsl(var(--primary))]';
}

function MarqueeBar({ items }) {
  const list = Array.isArray(items) ? items : [];
  if (!list.length) return null;
  const headlines = [...list, ...list];
  const contentRef = React.useRef(null);
  const [duration, setDuration] = React.useState(30);
  const { guardClick } = usePremiumPopup();

  React.useEffect(() => {
    if (contentRef.current) {
      const width = contentRef.current.scrollWidth / 2; // Half because content is duplicated
      // 70 pixels per second for consistent speed
      const calculatedDuration = width / 70;
      setDuration(Math.max(calculatedDuration, 20)); // Minimum 20s
    }
  }, [headlines.length]);

  return (
    <div className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-2 overflow-hidden">
      <div className="marquee-container">
        <div 
          ref={contentRef}
          className="marquee-content"
          style={{ animationDuration: `${duration}s` }}
        >
          {headlines.map((a, idx) => (
            <Link 
              key={`${a.id}-${idx}`} 
              href={`/articles/${a.slug}`}
              onClick={guardClick}
              className="mx-8 text-sm font-medium hover:underline"
            >
              {a.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryTabs({ sections, selected }) {
  const cats = Array.isArray(sections) ? sections : [];
  return (
    <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] overflow-hidden">
      <div className="w-full overflow-x-auto lg:overflow-x-visible">
        <div className="flex gap-2 px-4 py-3 lg:px-0 lg:flex-wrap lg:justify-start">
          <Link
            href="/"
            className={`category-chip shrink-0 ${
              selected
                ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:opacity-90'
                : 'category-chip-active'
            }`}
          >
            All
          </Link>
          {cats.map((c) => (
            <Link
              key={c.id}
              href={`/category/${encodeURIComponent(c.slug)}`}
              className={`category-chip shrink-0 ${
                selected?.slug === c.slug
                  ? 'category-chip-active'
                  : 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:opacity-90'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function HotNewsCard({ article, featured, isSubscribed, onGuestClick }) {
  const { isSaved, toggleSaved } = useSavedArticles();
  const saved = isSaved(article?.slug);
  const categoryName = article?.category?.name || '';
  const categorySlug = article?.category?.slug || '';
  const imageUrl = article?.featured_image_url || null;

  function onSave(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(article?.slug, article);
  }

  function handleClick(e) {
    if (!isSubscribed) {
      e.preventDefault();
      e.stopPropagation();
      onGuestClick && onGuestClick(e);
    }
  }

  if (!article) return null;

  if (featured) {
    return (
      <Link href={`/articles/${article.slug}`} onClick={handleClick}>
        <article className="news-card relative overflow-hidden group cursor-pointer">
          <div className="relative h-52 md:h-72">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={article.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-[hsl(var(--muted))]" />
            )}
            <div className="absolute inset-0 bg-black/50 md:bg-black/40" />

            <button
              onClick={onSave}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
              aria-label="Save"
            >
              {saved ? (
                <BookmarkCheck size={18} className="text-[hsl(var(--accent))]" />
              ) : (
                <Bookmark size={18} className="text-white" />
              )}
            </button>

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <div className="mb-2 flex items-center gap-2">
                {article.is_breaking ? (
                  <span className="hot-badge flex items-center gap-1">
                    <TrendingUp size={12} />
                    HOT
                  </span>
                ) : null}
                {categoryName ? (
                  <span className={`category-chip ${getCategoryColor(categorySlug)} text-white`}>{categoryName}</span>
                ) : null}
              </div>

              <h3 className="mb-2 text-lg md:text-xl font-bold leading-tight text-white">{article.title}</h3>
              {article.excerpt ? (
                <p className="hidden md:block text-sm text-white/80 line-clamp-2 mb-3">{article.excerpt}</p>
              ) : null}

              <div className="flex items-center gap-3 text-xs text-white/80">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {getTimeAgo(article.published_at)}
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/articles/${article.slug}`} onClick={handleClick}>
      <article className="news-card flex gap-3 p-3 group cursor-pointer hover-scale relative">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-[hsl(var(--muted))]" />
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between pr-8">
          <div>
            <div className="mb-1 flex items-center gap-2">
              {article.is_breaking ? (
                <span className="hot-badge flex items-center gap-1 text-[10px]">
                  <TrendingUp size={10} />
                  HOT
                </span>
              ) : null}
              {categoryName ? (
                <span className={`category-chip ${getCategoryColor(categorySlug)} text-white text-[10px] px-2 py-0.5`}>{categoryName}</span>
              ) : null}
            </div>

            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[hsl(var(--card-foreground))]">{article.title}</h3>
          </div>

          <div className="flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {getTimeAgo(article.published_at)}
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
  );
}

function HotNewsSlider({ items, isSubscribed, onGuestClick }) {
  const list = Array.isArray(items) ? items : [];
  const [swiperInstance, setSwiperInstance] = React.useState(null);

  // Debug: Log the items received
  console.log('HotNewsSlider items:', list.length, list);

  if (!list.length) {
    console.log('HotNewsSlider: No items, returning null');
    return null;
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} bg-[hsl(var(--border))]"></span>`;
          }
        }}
        navigation={{
          prevEl: '.hot-news-prev',
          nextEl: '.hot-news-next',
        }}
        onSwiper={(swiper) => {
          console.log('Swiper initialized:', swiper);
          setSwiperInstance(swiper);
        }}
        onInit={() => console.log('Swiper init')}
        className="w-full"
      >
        {list.map((a) => (
          <SwiperSlide key={a.id} className="px-2">
            <HotNewsCard article={a} featured isSubscribed={isSubscribed} onGuestClick={onGuestClick} />
          </SwiperSlide>
        ))}
        
        {/* Navigation Arrows */}
        {list.length > 1 && (
          <>
            <button 
              className="hot-news-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
              aria-label="Previous"
            >
              ‹
            </button>
            <button 
              className="hot-news-next absolute right-4 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
              aria-label="Next"
            >
              ›
            </button>
          </>
        )}
      </Swiper>
    </div>
  );
}

function NewsSection({ title, articles, categorySlug, isSubscribed, onGuestClick }) {
  const list = Array.isArray(articles) ? articles : [];
  if (!list.length) return null;

  return (
    <section className="mb-6 animate-fade-in">
      <div className="mb-3 flex items-center justify-between px-4 lg:px-0">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-[hsl(var(--accent))]" />
          <h2 className="text-lg font-bold text-[hsl(var(--foreground))]">{title}</h2>
        </div>
        {categorySlug ? (
          <Link 
            href={`/category/${categorySlug}`} 
            className="hidden lg:flex items-center gap-1 text-sm text-[hsl(var(--foreground))] font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            View All <ChevronRight size={16} />
          </Link>
        ) : null}
      </div>

      <div className="space-y-3 px-4 lg:px-0 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 lg:space-y-0">
        {list.map((a) => (
          <HotNewsCard key={a.id} article={a} featured={false} isSubscribed={isSubscribed} onGuestClick={onGuestClick} />
        ))}
      </div>
    </section>
  );
}

function DesktopSidebar({ mostRead24h, sections, electionTitle, electionCountdown, isSubscribed, onGuestClick }) {
  const trending = Array.isArray(mostRead24h) ? mostRead24h.slice(0, 5) : [];
  const cats = Array.isArray(sections) ? sections : [];

  const handleArticleClick = React.useCallback((e) => {
    if (!isSubscribed) {
      e.preventDefault();
      e.stopPropagation();
      onGuestClick && onGuestClick(e);
    }
  }, [isSubscribed, onGuestClick]);

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6 px-3 lg:px-0 mt-4 lg:mt-2">
      <div className="news-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-[hsl(var(--accent))]" size={18} />
          <h3 className="font-bold text-[hsl(var(--foreground))]">Trending Now</h3>
        </div>

        <div className="space-y-3">
          {trending.map((a, index) => (
            <Link key={a.id} href={`/articles/${a.slug}`} className="flex gap-3 group cursor-pointer" onClick={handleArticleClick}>
              <span className="text-2xl font-bold text-[hsl(var(--muted-foreground))]/50 group-hover:text-[hsl(var(--accent))] transition-colors">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-[hsl(var(--foreground))] line-clamp-2 group-hover:text-[hsl(var(--primary))] transition-colors">
                  {a.title}
                </h4>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{getTimeAgo(a.published_at)}</p>
              </div>
            </Link>
          ))}

          {!trending.length ? (
            <div className="text-sm text-[hsl(var(--muted-foreground))]">No trending data yet.</div>
          ) : null}
        </div>
      </div>

      <div className="news-card p-4">
        <h3 className="font-bold text-[hsl(var(--foreground))] mb-4">Categories</h3>
        <div className="space-y-1">
          {cats.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${encodeURIComponent(cat.slug)}`}
              className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[hsl(var(--secondary))] transition-colors group"
            >
              <span className="text-sm font-medium text-[hsl(var(--foreground))]">{cat.name}</span>
              <ChevronRight size={16} className="text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--primary))] transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      <div className="news-card p-4">
        <div className="flex gap-2">
          <Link
            href="/saved"
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[hsl(var(--secondary))] hover:opacity-90 transition-colors text-sm font-medium text-[hsl(var(--foreground))]"
          >
            <Bookmark size={16} />
            Saved
          </Link>
          <Link
            href="/app"
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[hsl(var(--primary))] hover:opacity-90 transition-colors text-sm font-medium text-[hsl(var(--primary-foreground))]"
          >
            Download App
            <CloudDownload size={16} />
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default function FeedIndex({ brandName, latest, sections, selectedCategory, breaking, mostRead24h, sectionBlocks }) {
  const { settings } = usePage().props;
  const allLatest = Array.isArray(latest) ? latest : [];
  const hotNews = allLatest.filter((a) => a?.is_breaking).slice(0, 6);
  const latestNews = allLatest.slice(0, 5);

  const blocks = Array.isArray(sectionBlocks) ? sectionBlocks : [];

  const { isSubscribed, guardClick } = usePremiumPopup();
  const handleGuestClick = guardClick;

  const electionTitle = settings?.election?.countdownTitle || 'Count Down';
  const electionAtRaw = settings?.election?.countdownAt || '';

  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const electionTarget = React.useMemo(() => {
    const v = String(electionAtRaw || '').trim();
    if (!v) return null;
    // Stored as datetime-local (YYYY-MM-DDTHH:mm). Parse as local time.
    const d = new Date(v);
    return Number.isFinite(d.getTime()) ? d : null;
  }, [electionAtRaw]);

  const electionCountdown = React.useMemo(() => getCountdownParts(electionTarget, now), [electionTarget, now]);

  return (
    <AppShell title={brandName}>
      <Head title="News" />

      <MarqueeBar items={breaking} />

      <div className="lg:flex lg:gap-6 lg:px-0">
        <main className="flex-1 px-0 overflow-x-hidden">
          {selectedCategory?.name ? (
            <section className="px-4 lg:px-0 pt-4">
              <div className="news-card p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">Category</div>
                <div className="mt-1 text-lg font-bold text-[hsl(var(--foreground))]">{selectedCategory.name}</div>
                <div className="mt-2">
                  <Link href="/" className="text-sm font-medium text-[hsl(var(--foreground))] hover:underline">
                    ← Back to All News
                  </Link>
                </div>
              </div>
            </section>
          ) : null}

          <section className="py-4">
            <div className="mb-3 flex items-center gap-2 px-4 lg:px-0">
              <Flame className="text-[hsl(var(--foreground))]" size={20} />
              <h2 className="text-lg font-bold text-[hsl(var(--foreground))]">Hot News</h2>
              <Link href="/articles" className="ml-auto text-sm text-[hsl(var(--foreground))] font-medium cursor-pointer hover:underline hidden lg:block">
                View All →
              </Link>
            </div>

            <div className="px-4">
              <HotNewsSlider items={hotNews.length ? hotNews : allLatest.slice(0, 5)} isSubscribed={isSubscribed} onGuestClick={handleGuestClick} />
            </div>

            <div className="hidden lg:grid lg:grid-cols-2 gap-4">
              {(hotNews.length ? hotNews : allLatest).slice(0, 2).map((a) => (
                <HotNewsCard key={a.id} article={a} featured isSubscribed={isSubscribed} onGuestClick={handleGuestClick} />
              ))}
            </div>
          </section>

          <section className="hidden lg:block mb-6">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="text-[hsl(var(--primary))]" size={20} />
              <h2 className="text-lg font-bold text-[hsl(var(--foreground))]">Latest Updates</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {latestNews.slice(0, 4).map((a) => (
                <HotNewsCard key={a.id} article={a} isSubscribed={isSubscribed} onGuestClick={handleGuestClick} />
              ))}
            </div>
          </section>

          <CategoryTabs sections={sections} selected={selectedCategory} />

          <div className="pt-4">
            {selectedCategory ? (
              <NewsSection title={selectedCategory?.name || ''} articles={allLatest} categorySlug={selectedCategory?.slug} isSubscribed={isSubscribed} onGuestClick={handleGuestClick} />
            ) : (
              blocks.map((b) => (
                <section key={b?.category?.id}>
                  <NewsSection title={b?.category?.name || ''} articles={(b?.articles || []).slice(0, 3)} categorySlug={b?.category?.slug} isSubscribed={isSubscribed} onGuestClick={handleGuestClick} />
                </section>
              ))
            )}
          </div>
        </main>

        <DesktopSidebar
          mostRead24h={mostRead24h}
          sections={sections}
          electionTitle={electionTitle}
          electionCountdown={electionCountdown}
          isSubscribed={isSubscribed}
          onGuestClick={handleGuestClick}
        />
      </div>
    </AppShell>
  );
}
