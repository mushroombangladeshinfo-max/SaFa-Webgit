/* ============================================================
   src/sentry.js
   SaFa Naturals — Sentry Error Tracking
   ─────────────────────────────────────────────────────────
   Captures JS errors, unhandled promise rejections, and
   performance traces on all customer-facing pages.
   No-op if VITE_SENTRY_DSN is not set.
============================================================ */

import * as Sentry from '@sentry/browser';

const DSN = import.meta.env.VITE_SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    environment: import.meta.env.MODE, // 'production' or 'development'

    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText:   false,
        blockAllMedia: false,
      }),
    ],

    // Capture 100% of transactions in dev, 10% in production
    tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.1,

    // Record session replays only on errors
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 1.0,
  });
}

/* Set user context after login — call this from auth code */
export function setSentryUser(email) {
  if (DSN) Sentry.setUser({ email });
}

export function clearSentryUser() {
  if (DSN) Sentry.setUser(null);
}

/* Manually capture an error with extra context */
export function captureError(err, context = {}) {
  if (DSN) Sentry.captureException(err, { extra: context });
}
