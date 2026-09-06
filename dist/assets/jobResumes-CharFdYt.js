import"./modulepreload-polyfill-B5Qt9EMX.js";import{createClient as P}from"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";import{r as x}from"./admin-auth-4ZiUUGs_.js";import{m as D}from"./admin-nav-DWS8XQYO.js";import{l as _,c as L}from"./ai-client-Ym7whptS.js";import{e as a}from"./html-utils-B4ngS3jJ.js";import{i as G,s as Y}from"./realtime-D7K--cdb.js";import{e as S,r as J}from"./job-profile-CtSRDUuh.js";import{m as B}from"./career-diagnostic-BcLyxxc0.js";const v="[string]",j=`{"documentTitle":string,"targetRole":string,"headline":string,"professionalSummary":string,"experience":[{"employer":string,"title":string,"location":string,"dates":string,"bullets":[{"text":string,"evidenceBasis":string,"evidenceStatus":"supported"|"partially_supported"}]}],"projects":[{"name":string,"context":string,"dates":string,"bullets":[{"text":string,"evidenceBasis":string,"evidenceStatus":"supported"|"partially_supported"}]}],"education":[{"qualification":string,"institution":string,"location":string,"dates":string,"details":${v}}],"skillGroups":[{"category":string,"skills":${v},"evidenceNote":string}],"languages":[{"language":string,"level":string}],"certifications":${v},"evidenceWarnings":${v},"excludedClaims":${v},"positioningNotes":${v}}`,q='{"keyword":string,"importance":"mandatory"|"preferred"|"contextual","status":"covered"|"supported_but_missing"|"unsupported"|"unclear","evidence":string}',U=`{"resume":${j},"atsAnalysis":{"overallMatch":0-100,"mandatoryCoverage":0-100,"keywordCoverage":0-100,"keywordAudit":[${q}],"hardGaps":${v},"truthfulOptimisations":${v},"unsupportedKeywordsNeverAdd":${v}},"tailoringSummary":${v},"applicationRecommendation":"APPLY STRONGLY"|"APPLY"|"APPLY SELECTIVELY"|"REVIEW"|"SKIP","recommendationReason":string}`,H=`NON-NEGOTIABLE RULES:
1. Never invent employers, job titles, dates, locations, degrees, tools, certifications, achievements, metrics, language levels, responsibilities, or results.
2. Do not upgrade seniority — a candidate cannot become "senior," "lead," or "manager" unless the evidence actually supports it.
3. Preserve factual dates/employers/titles as given. If something is unclear, omit or describe conservatively rather than guessing.
4. Rephrase truthful evidence for clarity and relevance. Do not manufacture impact or invent quantified results not present in the source.
5. Every experience/project bullet MUST carry evidenceBasis (what specifically supports it) and evidenceStatus ("supported" if directly evidenced, "partially_supported" if the wording is conservative but part of the emphasis isn't directly demonstrated).
6. Put unsupported or tempting claims into excludedClaims instead of writing them into the CV.
7. Contact details are out of scope — never invent a phone number, email, or address; the user adds their own contact header separately.
8. Use a clean ATS-friendly structure — no tables, columns, first-person pronouns, or generic soft-skill filler.
9. Prefer 3-5 high-value bullets for recent/relevant roles, fewer for older/less relevant ones. Keep it to a normal 1-2 page resume's worth of content.
10. Output ONLY a single JSON object matching exactly this shape (no markdown, no commentary): ${j}`;function F({masterCvText:e,structuredProfile:n,strategyJson:t,targetRole:s,emphasis:o}){return[{role:"system",content:`You are an evidence-constrained CV strategist and resume editor. Create a strong BASE CV for the requested target role using ONLY information supported by the confirmed career profile and CV/background text below.

${H}`},{role:"user",content:`CONFIRMED CAREER PROFILE:
${JSON.stringify(n||{})}

CONFIRMED CAREER STRATEGY:
${JSON.stringify(t||{})}

CV / BACKGROUND TEXT:
${e||"(none saved)"}

REQUESTED TARGET ROLE:
${s}

OPTIONAL USER EMPHASIS:
${o||"None"}

TASK:
Create a truthful ATS-friendly base CV for this target role. Critically preserve what the evidence supports and exclude claims the evidence does not support.`}]}const K=`NON-NEGOTIABLE RULES:
1. Candidate evidence comes only from the confirmed profile, CV/background text, and the source base CV below — job requirements come only from the vacancy.
2. You may reorder, shorten, select, and rephrase supported evidence — you may NOT create new facts.
3. NEVER insert a JD keyword merely because ATS may value it when there is no candidate evidence for it.
4. Classify every important keyword as covered / supported_but_missing / unsupported / unclear. unsupported keywords MUST be listed in unsupportedKeywordsNeverAdd and NOT inserted into the CV.
5. Do not alter employers, titles, dates, degree names, language levels, tools, or metrics beyond source evidence. Do not manufacture leadership, ownership, scale, savings, revenue, or team size.
6. Treat preferred/nice-to-have requirements differently from mandatory ones — mandatoryCoverage should reflect only the mandatory set.
7. If the vacancy is materially unrealistic for this candidate, keep the CV truthful and lower applicationRecommendation rather than exaggerating.
8. Every bullet retains evidenceBasis/evidenceStatus. Contact details stay out of scope, never invented.
9. Output ONLY a single JSON object matching exactly this shape (no markdown, no commentary): ${U}`;function z({masterCvText:e,structuredProfile:n,strategyJson:t,baseResumeContent:s,company:o,jobTitle:l,jobDescription:i}){return[{role:"system",content:`You are an evidence-constrained ATS CV tailoring specialist. Tailor the supplied BASE CV to the supplied vacancy without adding unsupported claims.

${K}`},{role:"user",content:`CONFIRMED CAREER PROFILE:
${JSON.stringify(n||{})}

CONFIRMED CAREER STRATEGY:
${JSON.stringify(t||{})}

CV / BACKGROUND TEXT:
${e||"(none saved)"}

SOURCE BASE CV:
${JSON.stringify(s)}

VACANCY COMPANY:
${o||"Not supplied"}

VACANCY TITLE:
${l||"Not supplied"}

VACANCY:
${i}

TASK:
Tailor this CV for the vacancy. Perform the ATS keyword audit and explicitly identify JD keywords that must NOT be added because the candidate lacks evidence.`}]}function c(e){return Array.isArray(e)?e:[]}function y(e){return e&&typeof e=="object"&&!Array.isArray(e)?e:{}}function $(e,n,t,s){const o=Number(e);return Number.isFinite(o)?Math.min(s,Math.max(t,o)):n}function k(e){return e=y(e),e.experience=c(e.experience).map(n=>(n=y(n),n.bullets=c(n.bullets).map(y),n)),e.projects=c(e.projects).map(n=>(n=y(n),n.bullets=c(n.bullets).map(y),n)),e.education=c(e.education).map(n=>(n=y(n),n.details=c(n.details),n)),e.skillGroups=c(e.skillGroups).map(n=>(n=y(n),n.skills=c(n.skills),n)),e.languages=c(e.languages).map(y),e.certifications=c(e.certifications),e.evidenceWarnings=c(e.evidenceWarnings),e.excludedClaims=c(e.excludedClaims),e.positioningNotes=c(e.positioningNotes),e}function W(e){return e=y(e),e.resume=k(e.resume),e.atsAnalysis=y(e.atsAnalysis),e.atsAnalysis.overallMatch=$(e.atsAnalysis.overallMatch,0,0,100),e.atsAnalysis.mandatoryCoverage=$(e.atsAnalysis.mandatoryCoverage,0,0,100),e.atsAnalysis.keywordCoverage=$(e.atsAnalysis.keywordCoverage,0,0,100),e.atsAnalysis.keywordAudit=c(e.atsAnalysis.keywordAudit).map(y),e.atsAnalysis.hardGaps=c(e.atsAnalysis.hardGaps),e.atsAnalysis.truthfulOptimisations=c(e.atsAnalysis.truthfulOptimisations),e.atsAnalysis.unsupportedKeywordsNeverAdd=c(e.atsAnalysis.unsupportedKeywordsNeverAdd),e.tailoringSummary=c(e.tailoringSummary),["APPLY STRONGLY","APPLY","APPLY SELECTIVELY","REVIEW","SKIP"].includes(e.applicationRecommendation)||(e.applicationRecommendation="REVIEW"),e}function T(e){return c(e).map(n=>`- ${n.text||""}`).join(`
`)}function X(e){e=e||{};const n=[];return e.headline&&n.push(e.headline),e.professionalSummary&&n.push(`
SUMMARY
`+e.professionalSummary),e.experience?.length&&(n.push(`
EXPERIENCE`),e.experience.forEach(t=>{n.push(`
${t.title||""} | ${t.employer||""}${t.location?" | "+t.location:""}${t.dates?" | "+t.dates:""}`),n.push(T(t.bullets))})),e.projects?.length&&(n.push(`
PROJECTS`),e.projects.forEach(t=>{n.push(`
${t.name||""}${t.context?" | "+t.context:""}${t.dates?" | "+t.dates:""}`),n.push(T(t.bullets))})),e.education?.length&&(n.push(`
EDUCATION`),e.education.forEach(t=>{n.push(`
${t.qualification||""} | ${t.institution||""}${t.location?" | "+t.location:""}${t.dates?" | "+t.dates:""}`),t.details?.length&&n.push(t.details.map(s=>`- ${s}`).join(`
`))})),e.skillGroups?.length&&(n.push(`
SKILLS`),e.skillGroups.forEach(t=>n.push(`${t.category||""}: ${(t.skills||[]).join(", ")}`))),e.languages?.length&&n.push(`
LANGUAGES
`+e.languages.map(t=>`${t.language||""} — ${t.level||""}`).join(`
`)),e.certifications?.length&&n.push(`
CERTIFICATIONS
`+e.certifications.map(t=>`- ${t}`).join(`
`)),n.filter(Boolean).join(`
`).trim()+`
`}function Z(e){e=e||{};const n=(e.experience||[]).map(i=>`
    <div class="cv-item"><div class="cv-item-head"><div><strong>${a(i.title)}</strong><span>${a(i.employer)}</span></div><small>${a(i.dates)}</small></div>
    ${i.location?`<div class="cv-subtle">${a(i.location)}</div>`:""}
    <ul>${(i.bullets||[]).map(r=>`<li>${a(r.text)}</li>`).join("")}</ul></div>`).join(""),t=(e.projects||[]).map(i=>`
    <div class="cv-item"><div class="cv-item-head"><div><strong>${a(i.name)}</strong><span>${a(i.context)}</span></div><small>${a(i.dates)}</small></div>
    <ul>${(i.bullets||[]).map(r=>`<li>${a(r.text)}</li>`).join("")}</ul></div>`).join(""),s=(e.education||[]).map(i=>`
    <div class="cv-item"><div class="cv-item-head"><div><strong>${a(i.qualification)}</strong><span>${a(i.institution)}</span></div><small>${a(i.dates)}</small></div>
    ${i.location?`<div class="cv-subtle">${a(i.location)}</div>`:""}
    ${(i.details||[]).length?`<ul>${i.details.map(r=>`<li>${a(r)}</li>`).join("")}</ul>`:""}</div>`).join(""),o=(e.skillGroups||[]).map(i=>`<p><b>${a(i.category)}:</b> ${(i.skills||[]).map(r=>a(r)).join(", ")}</p>`).join(""),l=(e.languages||[]).map(i=>`${a(i.language)} — ${a(i.level)}`).join(" · ");return`
    <h1 class="cv-doc-headline">${a(e.headline||e.targetRole||"CV")}</h1>
    ${e.professionalSummary?`<h2 class="cv-doc-section">Summary</h2><p>${a(e.professionalSummary)}</p>`:""}
    ${n?`<h2 class="cv-doc-section">Experience</h2>${n}`:""}
    ${t?`<h2 class="cv-doc-section">Projects</h2>${t}`:""}
    ${s?`<h2 class="cv-doc-section">Education</h2>${s}`:""}
    ${o?`<h2 class="cv-doc-section">Skills</h2>${o}`:""}
    ${l?`<h2 class="cv-doc-section">Languages</h2><p>${l}</p>`:""}
    ${(e.certifications||[]).length?`<h2 class="cv-doc-section">Certifications</h2><ul>${e.certifications.map(i=>`<li>${a(i)}</li>`).join("")}</ul>`:""}
  `}document.documentElement.classList.add("auth-checking");const m=P("https://uiwmerejtrdrykqpumdu.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0"),N=await x(m);N||(window.location.href="orders.html");document.documentElement.classList.remove("auth-checking");D({page:"job-resumes",supabase:m,email:N.user.email});function d(e,n="ok"){const t=document.createElement("div");t.className=`toast ${n}`,t.textContent=e,document.getElementById("toast-wrap").appendChild(t),setTimeout(()=>t.remove(),3500)}let f=null,p=null,h=[],C=[];async function E(){const{data:e,error:n}=await m.from("job_profiles").select("*").eq("id",f).maybeSingle();if(n){d(n.message,"err");return}p=e||{};const t=document.getElementById("gate-notice");p.status!=="confirmed"?(t.style.display="",t.innerHTML='Complete and confirm your <a href="job-settings.html" style="color:var(--al);">Career Profile diagnostic</a> first — CV Studio needs a confirmed profile to generate from.'):t.style.display="none";const{data:s,error:o}=await m.from("job_resume_versions").select("*, job_opportunities(company,job_title)").eq("profile_id",f).order("created_at",{ascending:!1});if(o){d(o.message,"err");return}h=s||[];const{data:l}=await m.from("job_opportunities").select("id,company,job_title").eq("profile_id",f).eq("closed",!1).order("company");C=l||[],Q()}function Q(){const e=h.filter(t=>t.kind==="base"),n=h.filter(t=>t.kind==="tailored");document.getElementById("base-tbody").innerHTML=e.length?e.map(t=>{const s=t.profile_version!==p.profile_version;return`<tr>
          <td><strong>${a(t.name)}</strong></td>
          <td style="color:var(--cl);font-size:13px;">${a(t.target_role)||"—"}</td>
          <td style="color:var(--cl);font-size:13px;">${new Date(t.created_at).toLocaleDateString()}</td>
          <td><span class="pill ${s?"pill-stale":"pill-current"}">${s?"Profile changed since":"Current"}</span></td>
          <td>
            <div style="display:flex;gap:6px;">
              <button class="btn sm" data-view="${t.id}">View</button>
              <button class="btn sm" data-tailor="${t.id}">Tailor</button>
              <button class="btn sm" data-delete="${t.id}">Del</button>
            </div>
          </td>
        </tr>`}).join(""):'<tr><td colspan="5"><div class="empty-state">No base CVs yet — generate one from your confirmed Career Profile above.</div></td></tr>',document.getElementById("tailored-tbody").innerHTML=n.length?n.map(t=>{const s=e.find(l=>l.id===t.parent_version_id),o=t.ats||{};return`<tr>
          <td><strong>${a(t.name)}</strong></td>
          <td style="color:var(--cl);font-size:13px;">${a(s?.name)||"—"}</td>
          <td style="font-family:'DM Mono',monospace;">${o.overallMatch??"—"}${o.overallMatch!=null?"%":""}</td>
          <td class="rec-pill">${a(t.content?._recommendation||"")}</td>
          <td style="color:var(--cl);font-size:13px;">${new Date(t.created_at).toLocaleDateString()}</td>
          <td>
            <div style="display:flex;gap:6px;">
              <button class="btn sm" data-view="${t.id}">View</button>
              <button class="btn sm" data-delete="${t.id}">Del</button>
            </div>
          </td>
        </tr>`}).join(""):'<tr><td colspan="6"><div class="empty-state">No tailored CVs yet — tailor a base CV for a specific job.</div></td></tr>',document.querySelectorAll("[data-view]").forEach(t=>t.addEventListener("click",()=>ee(t.dataset.view))),document.querySelectorAll("[data-tailor]").forEach(t=>t.addEventListener("click",()=>M(t.dataset.tailor))),document.querySelectorAll("[data-delete]").forEach(t=>t.addEventListener("click",()=>te(t.dataset.delete)))}function R(){return p.status!=="confirmed"?(d("Complete and confirm your Career Profile diagnostic first","err"),!1):!0}document.getElementById("generate-base-btn").addEventListener("click",()=>{R()&&(document.getElementById("gm-target-role").value=p.structured_profile?.primaryTargetRole||"",document.getElementById("gm-emphasis").value="",document.getElementById("generate-modal").classList.add("open"))});document.getElementById("generate-modal-cancel").addEventListener("click",()=>document.getElementById("generate-modal").classList.remove("open"));document.getElementById("generate-modal").addEventListener("click",e=>{e.target===e.currentTarget&&e.currentTarget.classList.remove("open")});document.getElementById("generate-modal-save").addEventListener("click",async()=>{const e=document.getElementById("gm-target-role").value.trim();if(!e){d("Enter a target role first","err");return}const n=document.getElementById("gm-emphasis").value.trim(),t=document.getElementById("generate-modal-save");t.textContent="Generating...",t.disabled=!0;try{const s=await _(m);if(s.provider==="openai"&&!s.key){d("Configure a Groq key on the Home page first","err");return}const o=F({masterCvText:B(p.master_cv_text||""),structuredProfile:p.structured_profile,strategyJson:p.strategy_json,targetRole:e,emphasis:n}),l=await L(s,o,{json:!0}),i=k(JSON.parse(l)),{error:r}=await m.from("job_resume_versions").insert([{profile_id:f,kind:"base",name:`${e} Base CV`,target_role:e,profile_version:p.profile_version,content:i}]);if(r){d(r.message,"err");return}d("Base CV generated"),document.getElementById("generate-modal").classList.remove("open"),E()}catch(s){d("Generation failed: "+s.message,"err")}finally{t.textContent="Generate",t.disabled=!1}});let O=null;function I(e){document.getElementById("tailor-source-opp").classList.toggle("active",e==="opp"),document.getElementById("tailor-source-paste").classList.toggle("active",e==="paste"),document.getElementById("tailor-opp-fields").style.display=e==="opp"?"":"none",document.getElementById("tailor-paste-fields").style.display=e==="paste"?"":"none"}document.getElementById("tailor-source-opp").addEventListener("click",()=>I("opp"));document.getElementById("tailor-source-paste").addEventListener("click",()=>I("paste"));function M(e){R()&&(O=e,I("opp"),document.getElementById("tm-opportunity").innerHTML=C.map(n=>`<option value="${n.id}">${a(n.company)} — ${a(n.job_title)}</option>`).join("")||'<option value="">No open opportunities saved</option>',document.getElementById("tm-company").value="",document.getElementById("tm-title").value="",document.getElementById("tm-jd").value="",document.getElementById("tailor-modal").classList.add("open"))}document.getElementById("tailor-modal-cancel").addEventListener("click",()=>document.getElementById("tailor-modal").classList.remove("open"));document.getElementById("tailor-modal").addEventListener("click",e=>{e.target===e.currentTarget&&e.currentTarget.classList.remove("open")});document.getElementById("tailor-modal-save").addEventListener("click",async()=>{const e=h.find(r=>r.id===O);if(!e){d("Base CV not found","err");return}const n=document.getElementById("tailor-source-opp").classList.contains("active");let t="",s="",o="",l=null;if(n){if(l=document.getElementById("tm-opportunity").value,!C.find(g=>g.id===l)){d("Pick an opportunity first","err");return}const{data:u}=await m.from("job_opportunities").select("company,job_title,job_description").eq("id",l).maybeSingle();if(!u?.job_description){d("That opportunity has no job description saved","err");return}t=u.company,s=u.job_title,o=u.job_description}else if(t=document.getElementById("tm-company").value.trim(),s=document.getElementById("tm-title").value.trim(),o=document.getElementById("tm-jd").value.trim(),o.length<80){d("Paste a fuller job description first","err");return}const i=document.getElementById("tailor-modal-save");i.textContent="Tailoring...",i.disabled=!0;try{const r=await _(m);if(r.provider==="openai"&&!r.key){d("Configure a Groq key on the Home page first","err");return}const u=z({masterCvText:B(p.master_cv_text||""),structuredProfile:p.structured_profile,strategyJson:p.strategy_json,baseResumeContent:e.content,company:t,jobTitle:s,jobDescription:o}),g=await L(r,u,{json:!0}),b=W(JSON.parse(g)),V={...b.resume,_recommendation:b.applicationRecommendation,_recommendationReason:b.recommendationReason,_tailoringSummary:b.tailoringSummary},{error:A}=await m.from("job_resume_versions").insert([{profile_id:f,kind:"tailored",parent_version_id:e.id,opportunity_id:l,name:`${t||"Job"} — ${s||e.target_role}`,target_role:e.target_role,profile_version:p.profile_version,content:V,ats:b.atsAnalysis}]);if(A){d(A.message,"err");return}d("CV tailored"),document.getElementById("tailor-modal").classList.remove("open"),E()}catch(r){d("Tailoring failed: "+r.message,"err")}finally{i.textContent="Tailor CV",i.disabled=!1}});let w=null;function ee(e){const n=h.find(r=>r.id===e);if(!n)return;w=n,document.getElementById("view-modal-title").textContent=n.name,document.getElementById("view-doc").innerHTML=Z(n.content);const t=document.getElementById("view-ats-box");if(n.kind==="tailored"&&n.ats){const r=u=>u&&u.length?u.map(g=>`<div class="kw-item"><span class="kw-tag ${a(g.status)}">${a(g.status)}</span><strong>${a(g.keyword)}</strong> <span style="color:var(--cl);">(${a(g.importance)})</span>${g.evidence?" — "+a(g.evidence):""}</div>`).join(""):'<div style="color:var(--cl);font-size:12.5px;">None.</div>';t.innerHTML=`
          <div class="ats-stat-row">
            <div class="ats-stat">Overall Match <strong>${n.ats.overallMatch}%</strong></div>
            <div class="ats-stat">Mandatory Coverage <strong>${n.ats.mandatoryCoverage}%</strong></div>
            <div class="ats-stat">Recommendation <strong>${a(n.content._recommendation)||"—"}</strong></div>
          </div>
          ${n.content._recommendationReason?`<p style="font-size:12.5px;color:var(--cl);margin-bottom:12px;">${a(n.content._recommendationReason)}</p>`:""}
          <div style="max-height:200px;overflow-y:auto;margin-bottom:14px;">${r(n.ats.keywordAudit)}</div>
        `}else t.innerHTML="";const s=document.getElementById("view-notes"),o=n.content||{},l=(r,u)=>u&&u.length?`<h4>${r}</h4><ul>${u.map(g=>`<li>${a(g)}</li>`).join("")}</ul>`:"",i=[l("Excluded Claims (not enough evidence to include)",o.excludedClaims),l("Evidence Warnings",o.evidenceWarnings),l("Positioning Notes",o.positioningNotes)].filter(Boolean).join("");s.innerHTML=i?`<div class="cv-notes">${i}</div>`:"",document.getElementById("view-tailor-btn").style.display=n.kind==="base"?"":"none",document.getElementById("view-modal").classList.add("open")}document.getElementById("view-modal-close").addEventListener("click",()=>document.getElementById("view-modal").classList.remove("open"));document.getElementById("view-modal").addEventListener("click",e=>{e.target===e.currentTarget&&e.currentTarget.classList.remove("open")});document.getElementById("view-tailor-btn").addEventListener("click",()=>{document.getElementById("view-modal").classList.remove("open"),M(w.id)});document.getElementById("view-copy-btn").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(X(w.content)),d("Copied as plain text")}catch{d("Copy failed — your browser may be blocking clipboard access","err")}});document.getElementById("view-print-btn").addEventListener("click",()=>{document.getElementById("print-area").innerHTML=document.getElementById("view-doc").innerHTML,window.print()});async function te(e){const n=h.find(l=>l.id===e),t=h.filter(l=>l.parent_version_id===e),s=t.length?`Delete "${n?.name}"? ${t.length} tailored version(s) based on it will be kept but lose their "based on" link.`:`Delete "${n?.name}"?`;if(!confirm(s))return;const{error:o}=await m.from("job_resume_versions").delete().eq("id",e);if(o){d(o.message,"err");return}d("Deleted"),E()}f=await S(m);J(m,document.getElementById("profile-bar"),async()=>{f=await S(m),E()});E();G();Y(m,"job-resumes-live",["job_resume_versions"],E,{indicatorId:"rt-indicator"});
