import { supabase } from './supabase.js';

/** Checks auth state and swaps nav CTA for a user avatar pill if logged in. */
async function checkUserStatus() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const firstName = user.user_metadata?.first_name || user.email.split('@')[0];
    const accountLink = document.getElementById('nav-account-link');

    if (accountLink) {
      accountLink.outerHTML = `
        <a href="account.html" class="nav-user-pill">
          <div class="nav-avatar">${firstName[0].toUpperCase()}</div>
          <span class="nav-user-name">${firstName}</span>
        </a>`;
    }
  } catch (err) {
    console.error('[SaFa] Auth check failed:', err);
  }
}

/* React to login/logout events */
supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_IN')  checkUserStatus();
  if (event === 'SIGNED_OUT') location.reload();
});

document.addEventListener('DOMContentLoaded', checkUserStatus);