/* ============================================================
   src/admin-auth.js
   SaFa Naturals — Shared Admin Auth
   ─────────────────────────────────────────────────────────
   Single source of truth for admin email list.
   Imported by admin.html and farm-log.html so adding a new
   admin only requires editing this one file.

   NOTE: This is a UI routing gate only — it prevents
   non-admins from seeing admin views. The actual security
   lives in Supabase RLS policies which are enforced
   server-side regardless of what happens here.
============================================================ */

export const ADMIN_EMAILS = [
  'mushroombangladesh.info@gmail.com',
  'quazishaab@gmail.com',
];

/**
 * Returns the active session if the current user is an admin,
 * or null otherwise. Handles the Supabase call and the email check.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns {Promise<import('@supabase/supabase-js').Session|null>}
 */
export async function requireAdmin(supabase) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !ADMIN_EMAILS.includes(session.user.email)) return null;
  return session;
}
