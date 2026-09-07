import { supabase } from './supabase.js';
import { ADMIN_EMAILS } from './admin-auth.js';

/** Checks auth state, updates nav avatar pill, and shows admin link for master accounts. */
async function checkUserStatus() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const firstName  = user.user_metadata?.first_name || user.email.split('@')[0];
    const accountLink = document.getElementById('nav-account-link');
    const isAdmin = ADMIN_EMAILS.includes(user.email);

    // For an admin, the pill they naturally click should go straight to
    // the backend — the separate #nav-admin-link shortcut below still
    // exists too, but relying on an admin to notice a second small icon
    // instead of the one they already click is exactly the confusion that
    // prompted this (an admin landing on the customer account page).
    if (accountLink) {
      accountLink.outerHTML = `
        <a href="${isAdmin ? 'home.html' : 'account.html'}" class="nav-user-pill">
          <div class="nav-avatar">${firstName[0].toUpperCase()}</div>
          <span class="nav-user-name">${firstName}</span>
        </a>`;
    }

    /* Show admin shortcut only for master admin emails */
    if (isAdmin) {
      const adminLink = document.getElementById('nav-admin-link');
      if (adminLink) adminLink.style.display = 'flex';
    }
  } catch (err) {
    console.error('[SaFa] Auth check failed:', err);
  }
}

supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_IN')  checkUserStatus();
  if (event === 'SIGNED_OUT') location.reload();
});

document.addEventListener('DOMContentLoaded', checkUserStatus);
