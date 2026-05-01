import{s}from"./main-EM0ZYaKl.js";async function c(){var a;try{const{data:{user:t}}=await s.auth.getUser();if(!t)return;const e=((a=t.user_metadata)==null?void 0:a.first_name)||t.email.split("@")[0],n=document.getElementById("nav-account-link");n&&(n.outerHTML=`
        <a href="account.html" class="nav-user-pill">
          <div class="nav-avatar">${e[0].toUpperCase()}</div>
          <span class="nav-user-name">${e}</span>
        </a>`)}catch(t){console.error("[SaFa] Auth check failed:",t)}}s.auth.onAuthStateChange(a=>{a==="SIGNED_IN"&&c(),a==="SIGNED_OUT"&&location.reload()});document.addEventListener("DOMContentLoaded",c);
