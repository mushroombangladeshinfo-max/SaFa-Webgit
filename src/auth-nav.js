import { supabase } from './supabase.js';

const ADMIN_EMAILS = [
  'mushroombangladesh.info@gmail.com',
  'quazishaab@gmail.com',
];

/** Checks auth state, updates nav avatar pill, and shows admin link for master accounts. */
async function checkUserStatus() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const firstName  = user.user_metadata?.first_name || user.email.split('@')[0];
    const accountLink = document.getElementById('nav-account-link');

    if (accountLink) {
      accountLink.outerHTML = `
        <a href="account.html" class="nav-user-pill">
          <div class="nav-avatar">${firstName[0].toUpperCase()}</div>
          <span class="nav-user-name">${firstName}</span>
        </a>`;
    }

    /* Show admin shortcut only for master admin emails */
    if (ADMIN_EMAILS.includes(user.email)) {
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
