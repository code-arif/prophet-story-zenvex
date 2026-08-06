// Tiny JSON API helper for the learner app.
// Used by the chat, writing-feedback, quiz, mistake-doctor and phrasebook
// flows where a full Inertia round-trip would be heavier than needed.

/**
 * POST JSON to a web route and parse the JSON response.
 * Requires `window.csrfToken` (set in app.jsx from the shared _token prop).
 */
export async function postJson(url, data = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-CSRF-TOKEN': window.csrfToken || '',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      detail = body.message || body.errors ? JSON.stringify(body.errors) : detail;
    } catch {
      // keep default detail
    }
    throw new Error(detail);
  }

  return res.json();
}
