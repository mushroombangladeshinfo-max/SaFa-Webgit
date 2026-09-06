import{e as p}from"./html-utils-B4ngS3jJ.js";const a="jobActiveProfileId";function l(){const e=localStorage.getItem(a);return e?+e:null}function n(e){localStorage.setItem(a,String(e))}async function c(e){const{data:r}=await e.from("job_profiles").select("id,profile_name").order("profile_name");return r||[]}async function g(e){const r=await c(e);if(!r.length)return null;const i=l();return i&&r.some(o=>o.id===i)?i:(n(r[0].id),r[0].id)}function u(){if(document.getElementById("profile-switcher-styles"))return;const e=document.createElement("style");e.id="profile-switcher-styles",e.textContent=`
    .profile-switcher-bar{display:flex;align-items:center;gap:8px;margin-bottom:16px;}
    .profile-switcher-bar select{background:#0d1f12;border:1px solid rgba(255,255,255,.07);border-radius:6px;color:#f5efe6;font-family:'DM Sans','Hind Siliguri',sans-serif;font-size:13px;padding:7px 10px;outline:none;}
    .profile-switcher-bar select:focus{border-color:rgba(196,154,60,.5);}
    .profile-switcher-bar button{font-family:'Syne','Hind Siliguri',sans-serif;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:7px 12px;border-radius:6px;border:1px solid rgba(255,255,255,.07);background:rgba(196,154,60,.1);color:#c49a3c;cursor:pointer;}
    .profile-switcher-bar button:hover{background:rgba(196,154,60,.18);}
  `,document.head.appendChild(e)}async function b(e,r,i){u(),r.className="profile-switcher-bar";const o=await c(e),f=l();r.innerHTML=`
    <select id="profile-switcher-select" aria-label="Active profile">
      ${o.map(t=>`<option value="${t.id}" ${t.id===f?"selected":""}>${p(t.profile_name)}</option>`).join("")}
    </select>
    <button type="button" id="profile-switcher-new">+ New Profile</button>
  `,r.querySelector("#profile-switcher-select").addEventListener("change",t=>{n(+t.target.value),i()}),r.querySelector("#profile-switcher-new").addEventListener("click",async()=>{const t=prompt(`Name for the new profile (e.g. "My Job Search", "Sunny's Search"):`);if(!t||!t.trim())return;const{data:d,error:s}=await e.from("job_profiles").insert([{profile_name:t.trim()}]).select().single();if(s){alert(s.message);return}n(d.id),window.location.href="job-settings.html"})}export{g as e,l as g,c as l,b as r,n as s};
