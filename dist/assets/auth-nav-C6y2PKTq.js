import{s as i}from"./main-CAjW_Lhl.js";const o=["mushroombangladesh.info@gmail.com","quazishab@gmail.com"];async function c(){var t;try{const{data:{user:a}}=await i.auth.getUser();if(!a)return;const e=((t=a.user_metadata)==null?void 0:t.first_name)||a.email.split("@")[0],n=document.getElementById("nav-account-link");if(n&&(n.outerHTML=`
        <a href="account.html" class="nav-user-pill">
          <div class="nav-avatar">${e[0].toUpperCase()}</div>
          <span class="nav-user-name">${e}</span>
        </a>`),o.includes(a.email)){const s=document.getElementById("nav-admin-link");s&&(s.style.display="flex")}}catch(a){console.error("[SaFa] Auth check failed:",a)}}i.auth.onAuthStateChange(t=>{t==="SIGNED_IN"&&c(),t==="SIGNED_OUT"&&location.reload()});document.addEventListener("DOMContentLoaded",c);
