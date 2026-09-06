import"./modulepreload-polyfill-B5Qt9EMX.js";import{createClient as G}from"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";import{r as Y}from"./admin-auth-4ZiUUGs_.js";import{m as U}from"./admin-nav-KbGg4lyJ.js";import{l as S,c as B}from"./ai-client-Ym7whptS.js";import{e as a}from"./html-utils-B4ngS3jJ.js";import{i as q,s as J}from"./realtime-D7K--cdb.js";import{e as j,r as H}from"./job-profile-CtSRDUuh.js";import{m as k}from"./career-diagnostic-BcLyxxc0.js";const v="[string]",N=`{"documentTitle":string,"targetRole":string,"headline":string,"professionalSummary":string,"experience":[{"employer":string,"title":string,"location":string,"dates":string,"bullets":[{"text":string,"evidenceBasis":string,"evidenceStatus":"supported"|"partially_supported"}]}],"projects":[{"name":string,"context":string,"dates":string,"bullets":[{"text":string,"evidenceBasis":string,"evidenceStatus":"supported"|"partially_supported"}]}],"education":[{"qualification":string,"institution":string,"location":string,"dates":string,"details":${v}}],"skillGroups":[{"category":string,"skills":${v},"evidenceNote":string}],"languages":[{"language":string,"level":string}],"certifications":${v},"evidenceWarnings":${v},"excludedClaims":${v},"positioningNotes":${v}}`,F='{"keyword":string,"importance":"mandatory"|"preferred"|"contextual","status":"covered"|"supported_but_missing"|"unsupported"|"unclear","evidence":string}',z=`{"resume":${N},"atsAnalysis":{"overallMatch":0-100,"mandatoryCoverage":0-100,"keywordCoverage":0-100,"keywordAudit":[${F}],"hardGaps":${v},"truthfulOptimisations":${v},"unsupportedKeywordsNeverAdd":${v}},"tailoringSummary":${v},"applicationRecommendation":"APPLY STRONGLY"|"APPLY"|"APPLY SELECTIVELY"|"REVIEW"|"SKIP","recommendationReason":string}`,K=`NON-NEGOTIABLE RULES:
1. Never invent employers, job titles, dates, locations, degrees, tools, certifications, achievements, metrics, language levels, responsibilities, or results.
2. Do not upgrade seniority — a candidate cannot become "senior," "lead," or "manager" unless the evidence actually supports it.
3. Preserve factual dates/employers/titles as given. If something is unclear, omit or describe conservatively rather than guessing.
4. Rephrase truthful evidence for clarity and relevance. Do not manufacture impact or invent quantified results not present in the source.
5. Every experience/project bullet MUST carry evidenceBasis (what specifically supports it) and evidenceStatus ("supported" if directly evidenced, "partially_supported" if the wording is conservative but part of the emphasis isn't directly demonstrated).
6. Put unsupported or tempting claims into excludedClaims instead of writing them into the CV.
7. Contact details are out of scope — never invent a phone number, email, or address; the user adds their own contact header separately.
8. Use a clean ATS-friendly structure — no tables, columns, first-person pronouns, or generic soft-skill filler.
9. Prefer 3-5 high-value bullets for recent/relevant roles, fewer for older/less relevant ones. Keep it to a normal 1-2 page resume's worth of content.
10. Output ONLY a single JSON object matching exactly this shape (no markdown, no commentary): ${N}`;function W({masterCvText:e,structuredProfile:n,strategyJson:t,targetRole:o,emphasis:s}){return[{role:"system",content:`You are an evidence-constrained CV strategist and resume editor. Create a strong BASE CV for the requested target role using ONLY information supported by the confirmed career profile and CV/background text below.

${K}`},{role:"user",content:`CONFIRMED CAREER PROFILE:
${JSON.stringify(n||{})}

CONFIRMED CAREER STRATEGY:
${JSON.stringify(t||{})}

CV / BACKGROUND TEXT:
${e||"(none saved)"}

REQUESTED TARGET ROLE:
${o}

OPTIONAL USER EMPHASIS:
${s||"None"}

TASK:
Create a truthful ATS-friendly base CV for this target role. Critically preserve what the evidence supports and exclude claims the evidence does not support.`}]}const X=`NON-NEGOTIABLE RULES:
1. Candidate evidence comes only from the confirmed profile, CV/background text, and the source base CV below — job requirements come only from the vacancy.
2. You may reorder, shorten, select, and rephrase supported evidence — you may NOT create new facts.
3. NEVER insert a JD keyword merely because ATS may value it when there is no candidate evidence for it.
4. Classify every important keyword as covered / supported_but_missing / unsupported / unclear. unsupported keywords MUST be listed in unsupportedKeywordsNeverAdd and NOT inserted into the CV.
5. Do not alter employers, titles, dates, degree names, language levels, tools, or metrics beyond source evidence. Do not manufacture leadership, ownership, scale, savings, revenue, or team size.
6. Treat preferred/nice-to-have requirements differently from mandatory ones — mandatoryCoverage should reflect only the mandatory set.
7. If the vacancy is materially unrealistic for this candidate, keep the CV truthful and lower applicationRecommendation rather than exaggerating.
8. Every bullet retains evidenceBasis/evidenceStatus. Contact details stay out of scope, never invented.
9. Output ONLY a single JSON object matching exactly this shape (no markdown, no commentary): ${z}`;function Z({masterCvText:e,structuredProfile:n,strategyJson:t,baseResumeContent:o,company:s,jobTitle:r,jobDescription:i}){return[{role:"system",content:`You are an evidence-constrained ATS CV tailoring specialist. Tailor the supplied BASE CV to the supplied vacancy without adding unsupported claims.

${X}`},{role:"user",content:`CONFIRMED CAREER PROFILE:
${JSON.stringify(n||{})}

CONFIRMED CAREER STRATEGY:
${JSON.stringify(t||{})}

CV / BACKGROUND TEXT:
${e||"(none saved)"}

SOURCE BASE CV:
${JSON.stringify(o)}

VACANCY COMPANY:
${s||"Not supplied"}

VACANCY TITLE:
${r||"Not supplied"}

VACANCY:
${i}

TASK:
Tailor this CV for the vacancy. Perform the ATS keyword audit and explicitly identify JD keywords that must NOT be added because the candidate lacks evidence.`}]}function c(e){return Array.isArray(e)?e:[]}function y(e){return e&&typeof e=="object"&&!Array.isArray(e)?e:{}}function $(e,n,t,o){const s=Number(e);return Number.isFinite(s)?Math.min(o,Math.max(t,s)):n}function R(e){return e=y(e),e.experience=c(e.experience).map(n=>(n=y(n),n.bullets=c(n.bullets).map(y),n)),e.projects=c(e.projects).map(n=>(n=y(n),n.bullets=c(n.bullets).map(y),n)),e.education=c(e.education).map(n=>(n=y(n),n.details=c(n.details),n)),e.skillGroups=c(e.skillGroups).map(n=>(n=y(n),n.skills=c(n.skills),n)),e.languages=c(e.languages).map(y),e.certifications=c(e.certifications),e.evidenceWarnings=c(e.evidenceWarnings),e.excludedClaims=c(e.excludedClaims),e.positioningNotes=c(e.positioningNotes),e}function Q(e){return e=y(e),e.resume=R(e.resume),e.atsAnalysis=y(e.atsAnalysis),e.atsAnalysis.overallMatch=$(e.atsAnalysis.overallMatch,0,0,100),e.atsAnalysis.mandatoryCoverage=$(e.atsAnalysis.mandatoryCoverage,0,0,100),e.atsAnalysis.keywordCoverage=$(e.atsAnalysis.keywordCoverage,0,0,100),e.atsAnalysis.keywordAudit=c(e.atsAnalysis.keywordAudit).map(y),e.atsAnalysis.hardGaps=c(e.atsAnalysis.hardGaps),e.atsAnalysis.truthfulOptimisations=c(e.atsAnalysis.truthfulOptimisations),e.atsAnalysis.unsupportedKeywordsNeverAdd=c(e.atsAnalysis.unsupportedKeywordsNeverAdd),e.tailoringSummary=c(e.tailoringSummary),["APPLY STRONGLY","APPLY","APPLY SELECTIVELY","REVIEW","SKIP"].includes(e.applicationRecommendation)||(e.applicationRecommendation="REVIEW"),e}function T(e){return c(e).map(n=>`- ${n.text||""}`).join(`
`)}function ee(e){e=e||{};const n=[];return e.headline&&n.push(e.headline),e.professionalSummary&&n.push(`
SUMMARY
`+e.professionalSummary),e.experience?.length&&(n.push(`
EXPERIENCE`),e.experience.forEach(t=>{n.push(`
${t.title||""} | ${t.employer||""}${t.location?" | "+t.location:""}${t.dates?" | "+t.dates:""}`),n.push(T(t.bullets))})),e.projects?.length&&(n.push(`
PROJECTS`),e.projects.forEach(t=>{n.push(`
${t.name||""}${t.context?" | "+t.context:""}${t.dates?" | "+t.dates:""}`),n.push(T(t.bullets))})),e.education?.length&&(n.push(`
EDUCATION`),e.education.forEach(t=>{n.push(`
${t.qualification||""} | ${t.institution||""}${t.location?" | "+t.location:""}${t.dates?" | "+t.dates:""}`),t.details?.length&&n.push(t.details.map(o=>`- ${o}`).join(`
`))})),e.skillGroups?.length&&(n.push(`
SKILLS`),e.skillGroups.forEach(t=>n.push(`${t.category||""}: ${(t.skills||[]).join(", ")}`))),e.languages?.length&&n.push(`
LANGUAGES
`+e.languages.map(t=>`${t.language||""} — ${t.level||""}`).join(`
`)),e.certifications?.length&&n.push(`
CERTIFICATIONS
`+e.certifications.map(t=>`- ${t}`).join(`
`)),n.filter(Boolean).join(`
`).trim()+`
`}function te(e){e=e||{};const n=(e.experience||[]).map(i=>`
    <div class="cv-item"><div class="cv-item-head"><div><strong>${a(i.title)}</strong><span>${a(i.employer)}</span></div><small>${a(i.dates)}</small></div>
    ${i.location?`<div class="cv-subtle">${a(i.location)}</div>`:""}
    <ul>${(i.bullets||[]).map(l=>`<li>${a(l.text)}</li>`).join("")}</ul></div>`).join(""),t=(e.projects||[]).map(i=>`
    <div class="cv-item"><div class="cv-item-head"><div><strong>${a(i.name)}</strong><span>${a(i.context)}</span></div><small>${a(i.dates)}</small></div>
    <ul>${(i.bullets||[]).map(l=>`<li>${a(l.text)}</li>`).join("")}</ul></div>`).join(""),o=(e.education||[]).map(i=>`
    <div class="cv-item"><div class="cv-item-head"><div><strong>${a(i.qualification)}</strong><span>${a(i.institution)}</span></div><small>${a(i.dates)}</small></div>
    ${i.location?`<div class="cv-subtle">${a(i.location)}</div>`:""}
    ${(i.details||[]).length?`<ul>${i.details.map(l=>`<li>${a(l)}</li>`).join("")}</ul>`:""}</div>`).join(""),s=(e.skillGroups||[]).map(i=>`<p><b>${a(i.category)}:</b> ${(i.skills||[]).map(l=>a(l)).join(", ")}</p>`).join(""),r=(e.languages||[]).map(i=>`${a(i.language)} — ${a(i.level)}`).join(" · ");return`
    <h1 class="cv-doc-headline">${a(e.headline||e.targetRole||"CV")}</h1>
    ${e.professionalSummary?`<h2 class="cv-doc-section">Summary</h2><p>${a(e.professionalSummary)}</p>`:""}
    ${n?`<h2 class="cv-doc-section">Experience</h2>${n}`:""}
    ${t?`<h2 class="cv-doc-section">Projects</h2>${t}`:""}
    ${o?`<h2 class="cv-doc-section">Education</h2>${o}`:""}
    ${s?`<h2 class="cv-doc-section">Skills</h2>${s}`:""}
    ${r?`<h2 class="cv-doc-section">Languages</h2><p>${r}</p>`:""}
    ${(e.certifications||[]).length?`<h2 class="cv-doc-section">Certifications</h2><ul>${e.certifications.map(i=>`<li>${a(i)}</li>`).join("")}</ul>`:""}
  `}document.documentElement.classList.add("auth-checking");const m=G("https://uiwmerejtrdrykqpumdu.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0"),O=await Y(m);O||(window.location.href="orders.html");document.documentElement.classList.remove("auth-checking");U({page:"job-resumes",supabase:m,email:O.user.email});function d(e,n="ok"){const t=document.createElement("div");t.className=`toast ${n}`,t.textContent=e,document.getElementById("toast-wrap").appendChild(t),setTimeout(()=>t.remove(),3500)}let h=null,p=null,f=[],C=[];async function E(){const{data:e,error:n}=await m.from("job_profiles").select("*").eq("id",h).maybeSingle();if(n){d(n.message,"err");return}p=e||{};const t=document.getElementById("gate-notice");p.status!=="confirmed"?(t.style.display="",t.innerHTML='Complete and confirm your <a href="job-settings.html" style="color:var(--al);">Career Profile diagnostic</a> first — CV Studio needs a confirmed profile to generate from.'):t.style.display="none";const{data:o,error:s}=await m.from("job_resume_versions").select("*, job_opportunities(company,job_title)").eq("profile_id",h).order("created_at",{ascending:!1});if(s){d(s.message,"err");return}f=o||[];const{data:r}=await m.from("job_opportunities").select("id,company,job_title").eq("profile_id",h).eq("closed",!1).order("company");C=r||[],ie(),ne()}let L=!1;function ne(){if(L)return;const e=new URLSearchParams(location.search).get("id");if(!e)return;f.find(t=>t.id===e)&&(L=!0,x(e))}function ie(){const e=f.filter(t=>t.kind==="base"),n=f.filter(t=>t.kind==="tailored");document.getElementById("base-tbody").innerHTML=e.length?e.map(t=>{const o=t.profile_version!==p.profile_version;return`<tr>
          <td><strong>${a(t.name)}</strong></td>
          <td style="color:var(--cl);font-size:13px;">${a(t.target_role)||"—"}</td>
          <td style="color:var(--cl);font-size:13px;">${new Date(t.created_at).toLocaleDateString()}</td>
          <td><span class="pill ${o?"pill-stale":"pill-current"}">${o?"Profile changed since":"Current"}</span></td>
          <td>
            <div style="display:flex;gap:6px;">
              <button class="btn sm" data-view="${t.id}">View</button>
              <button class="btn sm" data-tailor="${t.id}">Tailor</button>
              <button class="btn sm" data-delete="${t.id}">Del</button>
            </div>
          </td>
        </tr>`}).join(""):'<tr><td colspan="5"><div class="empty-state">No base CVs yet — generate one from your confirmed Career Profile above.</div></td></tr>',document.getElementById("tailored-tbody").innerHTML=n.length?n.map(t=>{const o=e.find(r=>r.id===t.parent_version_id),s=t.ats||{};return`<tr>
          <td><strong>${a(t.name)}</strong></td>
          <td style="font-size:13px;">${t.opportunity_id?`<a href="job-opportunity.html?id=${t.opportunity_id}" style="color:var(--al);">${a(t.job_opportunities?.company)||"View"}</a>`:'<span style="color:var(--cl);">—</span>'}</td>
          <td style="color:var(--cl);font-size:13px;">${a(o?.name)||"—"}</td>
          <td style="font-family:'DM Mono',monospace;">${s.overallMatch??"—"}${s.overallMatch!=null?"%":""}</td>
          <td class="rec-pill">${a(t.content?._recommendation||"")}</td>
          <td style="color:var(--cl);font-size:13px;">${new Date(t.created_at).toLocaleDateString()}</td>
          <td>
            <div style="display:flex;gap:6px;">
              <button class="btn sm" data-view="${t.id}">View</button>
              <button class="btn sm" data-delete="${t.id}">Del</button>
            </div>
          </td>
        </tr>`}).join(""):'<tr><td colspan="7"><div class="empty-state">No tailored CVs yet — tailor a base CV for a specific job.</div></td></tr>',document.querySelectorAll("[data-view]").forEach(t=>t.addEventListener("click",()=>x(t.dataset.view))),document.querySelectorAll("[data-tailor]").forEach(t=>t.addEventListener("click",()=>P(t.dataset.tailor))),document.querySelectorAll("[data-delete]").forEach(t=>t.addEventListener("click",()=>ae(t.dataset.delete)))}function M(){return p.status!=="confirmed"?(d("Complete and confirm your Career Profile diagnostic first","err"),!1):!0}document.getElementById("generate-base-btn").addEventListener("click",()=>{M()&&(document.getElementById("gm-target-role").value=p.structured_profile?.primaryTargetRole||"",document.getElementById("gm-emphasis").value="",document.getElementById("generate-modal").classList.add("open"))});document.getElementById("generate-modal-cancel").addEventListener("click",()=>document.getElementById("generate-modal").classList.remove("open"));document.getElementById("generate-modal").addEventListener("click",e=>{e.target===e.currentTarget&&e.currentTarget.classList.remove("open")});document.getElementById("generate-modal-save").addEventListener("click",async()=>{const e=document.getElementById("gm-target-role").value.trim();if(!e){d("Enter a target role first","err");return}const n=document.getElementById("gm-emphasis").value.trim(),t=document.getElementById("generate-modal-save");t.textContent="Generating...",t.disabled=!0;try{const o=await S(m);if(o.provider==="openai"&&!o.key){d("Configure a Groq key on the Home page first","err");return}const s=W({masterCvText:k(p.master_cv_text||""),structuredProfile:p.structured_profile,strategyJson:p.strategy_json,targetRole:e,emphasis:n}),r=await B(o,s,{json:!0}),i=R(JSON.parse(r)),{error:l}=await m.from("job_resume_versions").insert([{profile_id:h,kind:"base",name:`${e} Base CV`,target_role:e,profile_version:p.profile_version,content:i}]);if(l){d(l.message,"err");return}d("Base CV generated"),document.getElementById("generate-modal").classList.remove("open"),E()}catch(o){d("Generation failed: "+o.message,"err")}finally{t.textContent="Generate",t.disabled=!1}});let V=null;function I(e){document.getElementById("tailor-source-opp").classList.toggle("active",e==="opp"),document.getElementById("tailor-source-paste").classList.toggle("active",e==="paste"),document.getElementById("tailor-opp-fields").style.display=e==="opp"?"":"none",document.getElementById("tailor-paste-fields").style.display=e==="paste"?"":"none"}document.getElementById("tailor-source-opp").addEventListener("click",()=>I("opp"));document.getElementById("tailor-source-paste").addEventListener("click",()=>I("paste"));function P(e){M()&&(V=e,I("opp"),document.getElementById("tm-opportunity").innerHTML=C.map(n=>`<option value="${n.id}">${a(n.company)} — ${a(n.job_title)}</option>`).join("")||'<option value="">No open opportunities saved</option>',document.getElementById("tm-company").value="",document.getElementById("tm-title").value="",document.getElementById("tm-jd").value="",document.getElementById("tailor-modal").classList.add("open"))}document.getElementById("tailor-modal-cancel").addEventListener("click",()=>document.getElementById("tailor-modal").classList.remove("open"));document.getElementById("tailor-modal").addEventListener("click",e=>{e.target===e.currentTarget&&e.currentTarget.classList.remove("open")});document.getElementById("tailor-modal-save").addEventListener("click",async()=>{const e=f.find(l=>l.id===V);if(!e){d("Base CV not found","err");return}const n=document.getElementById("tailor-source-opp").classList.contains("active");let t="",o="",s="",r=null;if(n){if(r=document.getElementById("tm-opportunity").value,!C.find(g=>g.id===r)){d("Pick an opportunity first","err");return}const{data:u}=await m.from("job_opportunities").select("company,job_title,job_description").eq("id",r).maybeSingle();if(!u?.job_description){d("That opportunity has no job description saved","err");return}t=u.company,o=u.job_title,s=u.job_description}else if(t=document.getElementById("tm-company").value.trim(),o=document.getElementById("tm-title").value.trim(),s=document.getElementById("tm-jd").value.trim(),s.length<80){d("Paste a fuller job description first","err");return}const i=document.getElementById("tailor-modal-save");i.textContent="Tailoring...",i.disabled=!0;try{const l=await S(m);if(l.provider==="openai"&&!l.key){d("Configure a Groq key on the Home page first","err");return}const u=Z({masterCvText:k(p.master_cv_text||""),structuredProfile:p.structured_profile,strategyJson:p.strategy_json,baseResumeContent:e.content,company:t,jobTitle:o,jobDescription:s}),g=await B(l,u,{json:!0}),b=Q(JSON.parse(g)),D={...b.resume,_recommendation:b.applicationRecommendation,_recommendationReason:b.recommendationReason,_tailoringSummary:b.tailoringSummary},_=`${t||"Job"} — ${o||e.target_role}`,{error:A}=await m.from("job_resume_versions").insert([{profile_id:h,kind:"tailored",parent_version_id:e.id,opportunity_id:r,name:_,target_role:e.target_role,profile_version:p.profile_version,content:D,ats:b.atsAnalysis}]);if(A){d(A.message,"err");return}r&&await m.from("job_opportunities").update({cv_version:_}).eq("id",r),d("CV tailored"),document.getElementById("tailor-modal").classList.remove("open"),E()}catch(l){d("Tailoring failed: "+l.message,"err")}finally{i.textContent="Tailor CV",i.disabled=!1}});let w=null;function x(e){const n=f.find(l=>l.id===e);if(!n)return;w=n,document.getElementById("view-modal-title").textContent=n.name,document.getElementById("view-doc").innerHTML=te(n.content);const t=document.getElementById("view-ats-box");if(n.kind==="tailored"&&n.ats){const l=u=>u&&u.length?u.map(g=>`<div class="kw-item"><span class="kw-tag ${a(g.status)}">${a(g.status)}</span><strong>${a(g.keyword)}</strong> <span style="color:var(--cl);">(${a(g.importance)})</span>${g.evidence?" — "+a(g.evidence):""}</div>`).join(""):'<div style="color:var(--cl);font-size:12.5px;">None.</div>';t.innerHTML=`
          <div class="ats-stat-row">
            <div class="ats-stat">Overall Match <strong>${n.ats.overallMatch}%</strong></div>
            <div class="ats-stat">Mandatory Coverage <strong>${n.ats.mandatoryCoverage}%</strong></div>
            <div class="ats-stat">Recommendation <strong>${a(n.content._recommendation)||"—"}</strong></div>
          </div>
          ${n.content._recommendationReason?`<p style="font-size:12.5px;color:var(--cl);margin-bottom:12px;">${a(n.content._recommendationReason)}</p>`:""}
          <div style="max-height:200px;overflow-y:auto;margin-bottom:14px;">${l(n.ats.keywordAudit)}</div>
        `}else t.innerHTML="";const o=document.getElementById("view-notes"),s=n.content||{},r=(l,u)=>u&&u.length?`<h4>${l}</h4><ul>${u.map(g=>`<li>${a(g)}</li>`).join("")}</ul>`:"",i=[r("Excluded Claims (not enough evidence to include)",s.excludedClaims),r("Evidence Warnings",s.evidenceWarnings),r("Positioning Notes",s.positioningNotes)].filter(Boolean).join("");o.innerHTML=i?`<div class="cv-notes">${i}</div>`:"",document.getElementById("view-tailor-btn").style.display=n.kind==="base"?"":"none",document.getElementById("view-modal").classList.add("open")}document.getElementById("view-modal-close").addEventListener("click",()=>document.getElementById("view-modal").classList.remove("open"));document.getElementById("view-modal").addEventListener("click",e=>{e.target===e.currentTarget&&e.currentTarget.classList.remove("open")});document.getElementById("view-tailor-btn").addEventListener("click",()=>{document.getElementById("view-modal").classList.remove("open"),P(w.id)});document.getElementById("view-copy-btn").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(ee(w.content)),d("Copied as plain text")}catch{d("Copy failed — your browser may be blocking clipboard access","err")}});document.getElementById("view-print-btn").addEventListener("click",()=>{document.getElementById("print-area").innerHTML=document.getElementById("view-doc").innerHTML,window.print()});async function ae(e){const n=f.find(r=>r.id===e),t=f.filter(r=>r.parent_version_id===e),o=t.length?`Delete "${n?.name}"? ${t.length} tailored version(s) based on it will be kept but lose their "based on" link.`:`Delete "${n?.name}"?`;if(!confirm(o))return;const{error:s}=await m.from("job_resume_versions").delete().eq("id",e);if(s){d(s.message,"err");return}d("Deleted"),E()}h=await j(m);H(m,document.getElementById("profile-bar"),async()=>{h=await j(m),E()});E();q();J(m,"job-resumes-live",["job_resume_versions"],E,{indicatorId:"rt-indicator"});
