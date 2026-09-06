/* ============================================================
   src/html-utils.js
   Escape free text before interpolating it into innerHTML template
   strings — every job-* page builds its DOM this way, and none of them
   guarded against a company name, note, or pasted job description
   containing '<', '"', or '&' breaking the markup (or, in an attribute
   context like href="${url}", breaking out of the attribute entirely).
============================================================ */

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
