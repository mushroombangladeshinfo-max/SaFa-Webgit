import{s as i}from"./supabase-CJRHJsqP.js";import{A as o}from"./admin-auth-4ZiUUGs_.js";async function c(){try{const{data:{user:a}}=await i.auth.getUser();if(!a)return;const t=a.user_metadata?.first_name||a.email.split("@")[0],e=document.getElementById("nav-account-link"),n=o.includes(a.email);if(e&&(e.outerHTML=`
        <a href="${n?"home.html":"account.html"}" class="nav-user-pill">
          <div class="nav-avatar">${t[0].toUpperCase()}</div>
          <span class="nav-user-name">${t}</span>
        </a>`),n){const s=document.getElementById("nav-admin-link");s&&(s.style.display="flex")}}catch(a){console.error("[SaFa] Auth check failed:",a)}}i.auth.onAuthStateChange(a=>{a==="SIGNED_IN"&&c(),a==="SIGNED_OUT"&&location.reload()});document.addEventListener("DOMContentLoaded",c);
