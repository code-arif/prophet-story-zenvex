import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ConfirmProvider } from './components/ConfirmDialog';
import { setLanguage } from './lib/i18n';
import { setSpeechSettings } from './lib/speech';

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
    setLanguage(initialProps.appLanguage || 'bn');
    applyTextSize(initialProps.textSize);
    setSpeechSettings(initialProps.voice, initialProps.readingSpeed);
    createRoot(el).render(
      <ConfirmProvider>
        <App {...props} />
      </ConfirmProvider>
    );
  },
});

// Keep the module language (used by number/date formatters) in sync across
// Inertia navigations — e.g. after saving a new language in Settings.
const syncLanguage = (event) => {
  const lang = event?.detail?.page?.props?.appLanguage;
  if (lang) setLanguage(lang);
};
router.on('navigate', syncLanguage);
router.on('success', syncLanguage);

// Apply the learner text-size preference app-wide via <html data-text-size>
// (CSS zoom rules in resources/css/app.css).
const applyTextSize = (size) => {
  const n = Number(size);
  if (Number.isInteger(n) && n >= 0 && n <= 2) {
    document.documentElement.dataset.textSize = String(n);
  }
};
const syncTextSize = (event) => {
  const size = event?.detail?.page?.props?.textSize;
  if (size !== undefined) applyTextSize(size);
};
router.on('navigate', syncTextSize);
router.on('success', syncTextSize);

// Keep the saved TTS voice + reading speed in sync across navigations, so
// the practice screens (Pronunciation / Listening) honor the latest saved
// preferences without re-reading the page props themselves.
const syncSpeech = (event) => {
  const props = event?.detail?.page?.props || {};
  if (props.voice !== undefined || props.readingSpeed !== undefined) {
    setSpeechSettings(props.voice, props.readingSpeed);
  }
};
router.on('navigate', syncSpeech);
router.on('success', syncSpeech);
