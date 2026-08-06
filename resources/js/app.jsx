import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

createInertiaApp({
  resolve: (name) => {
    // Normalize various forms of page names coming from server
    // Examples we handle: 'Quran', 'Quran.jsx', 'MyLabbaik/Rituals', './pages/Quran.jsx'
    let pagePath = name;
    if (!pagePath.startsWith('./pages/')) {
      pagePath = `./pages/${pagePath}`;
    }
    if (!pagePath.endsWith('.jsx')) {
      pagePath = `${pagePath}.jsx`;
    }

    return resolvePageComponent(pagePath, import.meta.glob('./pages/**/*.jsx'));
  },
  setup({ el, App, props }) {
    // Expose the CSRF token for the learner app's fetch-based JSON helpers.
    const initialProps = props?.initialPage?.props || {};
    if (initialProps._token) {
      window.csrfToken = initialProps._token;
    }
    createRoot(el).render(<App {...props} />);
  },
});
