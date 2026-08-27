import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ConfirmProvider } from './components/ConfirmDialog';
import LearnerShell from './layouts/LearnerShell';
import { setLanguage } from './lib/i18n';
import { setSpeechSettings } from './lib/speech';

function detectTab(name) {
  if (name.startsWith('Home/')) return 'home';
  if (name.startsWith('Work/')) return 'work';
  if (name.startsWith('Money/')) return 'money';
  if (name.startsWith('Learn/')) return 'learn';
  if (name.startsWith('Assistant/')) return 'assistant';
  return 'home';
}

const EASY_RISE_PAGES = [
  'Home/',
  'Work/',
  'Money/',
  'Learn/',
  'Assistant/',
  'Settings/',
  'Onboarding/',
];

function needsShell(name) {
  return EASY_RISE_PAGES.some((prefix) => name.startsWith(prefix));
}

createInertiaApp({
  resolve: (name) => {
    let pagePath = name;
    if (!pagePath.startsWith('./pages/')) {
      pagePath = `./pages/${pagePath}`;
    }
    if (!pagePath.endsWith('.jsx')) {
      pagePath = `${pagePath}.jsx`;
    }

    return resolvePageComponent(pagePath, import.meta.glob('./pages/**/*.jsx')).then(
      (page) => {
        if (needsShell(name)) {
          const Original = page.default;
          const Wrapped = (props) => (
            <LearnerShell
              activeTab={props.activeTab || detectTab(name)}
              hideNav={name.startsWith('Onboarding/')}
            >
              <Original {...props} />
            </LearnerShell>
          );
          return { ...page, default: Wrapped };
        }
        return page;
      }
    );
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
  if (Number.isInteger(n) && n >= 1 && n <= 3) {
    document.documentElement.dataset.textSize = String(n);
  } else {
    document.documentElement.dataset.textSize = '2';
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
