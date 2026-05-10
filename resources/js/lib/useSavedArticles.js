import React from 'react';

const STORAGE_KEY = 'savedArticles';

function normalizeItem(item) {
  if (!item || typeof item !== 'object') return null;
  const slug = typeof item.slug === 'string' ? item.slug : null;
  if (!slug) return null;

  return {
    slug,
    title: typeof item.title === 'string' ? item.title : '',
    featured_image_url: typeof item.featured_image_url === 'string' ? item.featured_image_url : null,
    category: item.category && typeof item.category === 'object'
      ? {
          name: typeof item.category.name === 'string' ? item.category.name : '',
          slug: typeof item.category.slug === 'string' ? item.category.slug : '',
        }
      : null,
    published_at: typeof item.published_at === 'string' ? item.published_at : null,
    saved_at: typeof item.saved_at === 'string' ? item.saved_at : new Date().toISOString(),
  };
}

function readSaved() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    // Back-compat: if old format was an array of slugs.
    if (parsed.every((x) => typeof x === 'string')) {
      return parsed.map((slug) => ({ slug, title: '', featured_image_url: null, category: null, published_at: null, saved_at: new Date().toISOString() }));
    }

    return parsed.map(normalizeItem).filter(Boolean);
  } catch {
    return [];
  }
}

function writeSaved(slugs) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // ignore
  }
}

export function useSavedArticles() {
  const [savedItems, setSavedItems] = React.useState(() => readSaved());

  React.useEffect(() => {
    function onStorage(e) {
      if (e.key === STORAGE_KEY) setSavedItems(readSaved());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const savedSlugs = React.useMemo(() => savedItems.map((x) => x.slug), [savedItems]);

  const isSaved = React.useCallback((slug) => {
    if (!slug) return false;
    return savedSlugs.includes(String(slug));
  }, [savedSlugs]);

  const toggleSaved = React.useCallback((slug, article = null) => {
    if (!slug) return;
    const s = String(slug);
    const normalizedArticle = normalizeItem({
      slug: s,
      title: article?.title,
      featured_image_url: article?.featured_image_url,
      category: article?.category,
      published_at: article?.published_at,
      saved_at: new Date().toISOString(),
    });

    setSavedItems((prev) => {
      console.log('toggleSaved called - prev:', prev);
      console.log('toggleSaved called - article:', article);
      console.log('toggleSaved called - normalizedArticle:', normalizedArticle);
      const exists = prev.some((x) => x.slug === s);
      const next = exists
        ? prev.filter((x) => x.slug !== s)
        : [normalizedArticle || { slug: s, title: '', featured_image_url: null, category: null, published_at: null, saved_at: new Date().toISOString() }, ...prev];
      console.log('toggleSaved - next array:', next);
      writeSaved(next);
      return next;
    });
  }, []);

  const clearSaved = React.useCallback(() => {
    setSavedItems(() => {
      writeSaved([]);
      return [];
    });
  }, []);

  return {
    savedItems,
    savedSlugs,
    isSaved,
    toggleSaved,
    clearSaved,
  };
}
