// Central speechSynthesis wrapper for the "Learn English" learner UI.
//
// The subscriber's saved preferences (Settings → voice / reading speed) are
// pushed into this module by app.jsx on every navigation, so any component
// can just call speak(text) and get the right voice + rate automatically.
//
//   voice:        'default' | 'bn' | 'en'  — which TTS voice to pick
//   readingSpeed: 0.75 | 1.0 | 1.25 | 1.5 | 2.0 (speechSynthesis rate)

import { toBnDigits } from './format';

let currentVoice = 'default';
let currentRate = 1.0;

/** Push the saved voice + reading-speed preferences into the module. */
export function setSpeechSettings(voice, readingSpeed) {
  currentVoice = voice === 'bn' || voice === 'en' ? voice : 'default';
  const n = Number(readingSpeed);
  currentRate = Number.isFinite(n) && n >= 0.5 && n <= 2 ? n : 1.0;
}

/** Current effective settings (used to seed per-screen controls). */
export function getSpeechSettings() {
  return { voice: currentVoice, rate: currentRate };
}

// ── Voice selection ──────────────────────────────────────────────────

let voicesCache = null;

/** Warm the voice list once; re-reads when the engine fires voiceschanged. */
function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  voicesCache = window.speechSynthesis.getVoices() || [];
  if (!voicesCache.length) {
    // Some engines populate voices asynchronously after the first request.
    window.speechSynthesis.addEventListener?.('voiceschanged', () => {
      voicesCache = window.speechSynthesis.getVoices() || [];
    }, { once: true });
  }
}

loadVoices();

/**
 * Pick a SpeechSynthesisVoice for a saved preference code, or null to let
 * the browser choose ('default').
 *   'bn' → first Bangla voice; 'en' → US-English voice, preferring a
 *          natural female one (Google US English, Samantha, Zira, …).
 */
function pickVoice(preference) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = voicesCache || window.speechSynthesis.getVoices() || [];
  if (!voices.length) return null;

  const lang = (v) => (v.lang || '').toLowerCase();
  const name = (v) => (v.name || '').toLowerCase();

  if (preference === 'bn') {
    return voices.find((v) => lang(v).startsWith('bn')) || null;
  }

  if (preference === 'en') {
    const english = voices.filter((v) => lang(v).startsWith('en'));
    if (!english.length) return null;
    return (
      english.find((v) => lang(v).startsWith('en-us')) ||
      english.find((v) => /google us english|samantha|zira|female|woman/i.test(name(v))) ||
      english[0]
    );
  }

  return null; // 'default'
}

// ── Speaking ─────────────────────────────────────────────────────────

/**
 * Speak `text` with the current saved settings. `override` can force rate
 * and/or voice for a specific control (e.g. the pronunciation "slow" button
 * forces 0.75x but still uses the saved voice).
 */
export function speak(text, override = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;
  window.speechSynthesis.cancel();

  const rate = override.rate !== undefined ? override.rate : currentRate;
  const voice = override.voice !== undefined ? override.voice : currentVoice;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = Math.min(10, Math.max(0.1, Number(rate) || 1));

  const v = pickVoice(voice);
  if (v) {
    utterance.voice = v;
    utterance.lang = v.lang || 'en-US';
  } else {
    utterance.lang = 'en-US';
  }

  window.speechSynthesis.speak(utterance);
}

// ── Shared speed helpers (also used by Settings + Listening) ─────────

/** Playback-rate options (must match the backend validation in:0.75…2.0). */
export const SPEED_OPTIONS = ['0.75', '1.0', '1.25', '1.5', '2.0'];

/** Normalize any numeric form ('1', '1.00', 1) to the canonical '1.0' style. */
export function normalizeSpeed(s) {
  const n = Number(s);
  if (!Number.isFinite(n)) return '1.0';
  return String(n.toFixed(2)).replace(/\.?0+$/, '') + (n % 1 === 0 ? '.0' : '');
}

/** Render a rate like 1x / 1.25x (Bengali digits in the bn UI language). */
export function formatSpeed(s) {
  return `${toBnDigits(normalizeSpeed(s))}x`;
}
