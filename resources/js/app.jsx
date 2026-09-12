import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ConfirmProvider } from './components/ConfirmDialog';
import { KidModeProvider } from './components/KidModeProvider';
import LearnerShell from './layouts/LearnerShell';
import { setLanguage } from './lib/i18n';
import { setSpeechSettings } from './lib/speech';

function detectTab(name) {
  if (name.startsWith('Home/')) return 'home';
  if (name.startsWith('Library/') || name.startsWith('Reader/')) return 'stories';
  if (name.startsWith('Search/') || name === 'Search/Index' || name.includes('Search')) return 'search';
  if (name.startsWith('Quiz/')) return 'quiz';
  if (name.startsWith('Kid/') || name.startsWith('KidProfiles/')) return 'kid';
  if (name.startsWith('Pages/')) return 'stories';
  if (name.startsWith('Profile/')) return 'settings';
  return 'home';
}

// Global route fallback helper for Inertia/Ziggy
if (typeof window !== 'undefined' && typeof window.route === 'undefined') {
  window.route = function (name, params) {
    if (typeof window.Ziggy !== 'undefined' && window.Ziggy.routes && window.Ziggy.routes[name]) {
      let uri = window.Ziggy.routes[name].uri;
      if (params && typeof params === 'object') {
        Object.keys(params).forEach((key) => {
          uri = uri.replace(`{${key}}`, params[key]).replace(`{${key}?}`, params[key]);
        });
      } else if (params !== undefined && params !== null) {
        uri = uri.replace(/\{[^}]+\}/, params);
      }
      return '/' + uri.replace(/^\//, '');
    }
    const fallbacks = {
      'home': '/',
      'providers.index': '/providers',
      'providers.favorites': '/providers/favorites',
      'providers.show': '/providers/' + (typeof params === 'object' ? (params.id || params.provider || '') : (params || '')),
      'service-requests.history': '/service-requests/history',
      'service-requests.create': '/service-requests/create',
      'service-requests.show': '/service-requests/' + (typeof params === 'object' ? (params.id || params.request || '') : (params || '')),
      'provider.setup': '/provider/setup',
      'provider.dashboard': '/provider/dashboard',
      'provider.schedule.index': '/provider/schedule',
      'login': '/login',
    };
    if (fallbacks[name]) return fallbacks[name];
    let path = '/' + (name ? name.replace(/\./g, '/') : '');
    if (params && typeof params === 'object') {
      const q = new URLSearchParams(params).toString();
      if (q) path += '?' + q;
    }
    return path;
  };
}

// Subscriber (non-admin) pages get the LearnerShell chrome.
// Admin, auth, the public landing page, standalone legal/app pages and the
// legacy Articles pages (which still use AdminShell) opt out.
function needsShell(name) {
  if (name.startsWith('Admin/')) return false;
  if (name.startsWith('Auth/')) return false;
  if (name.startsWith('Articles/')) return false;
  if (name === 'Landing/Index') return false;
  if (name === 'Terms') return false;
  if (name === 'AppDownload') return false;
  return true;
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
          // Pages can opt out of the bottom nav (immersive views like the
          // reader) by exporting a static `hideNav` flag.
          const Wrapped = (props) => (
            <LearnerShell
              activeTab={props.activeTab || detectTab(name)}
              hideNav={Original.hideNav === true}
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
      <KidModeProvider>
        <ConfirmProvider>
          <App {...props} />
        </ConfirmProvider>
      </KidModeProvider>
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
