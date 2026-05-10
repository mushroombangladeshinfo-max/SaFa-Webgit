import{s}from"./supabase-CAmyaeuo.js";const c=["mushroombangladesh.info@gmail.com","quazishaab@gmail.com"];async function i(){try{const{data:{user:a}}=await s.auth.getUser();if(!a)return;const t=a.user_metadata?.first_name||a.email.split("@")[0],e=document.getElementById("nav-account-link");if(e&&(e.outerHTML=`
        <a href="account.html" class="nav-user-pill">
          <div class="nav-avatar">${t[0].toUpperCase()}</div>
          <span class="nav-user-name">${t}</span>
        </a>`),c.includes(a.email)){const n=document.getElementById("nav-admin-link");n&&(n.style.display="flex")}}catch(a){console.error("[SaFa] Auth check failed:",a)}}s.auth.onAuthStateChange(a=>{a==="SIGNED_IN"&&i(),a==="SIGNED_OUT"&&location.reload()});document.addEventListener("DOMContentLoaded",i);
