/* src/cv-studio.js
   CV Studio — generates a base CV per target role from the CONFIRMED
   Career Profile, then tailors it for a specific job. Adapted from a
   reference implementation's resumeStudio*.js, scaled to this app's
   actual shape: one AI call via the existing BYO-key chatComplete()
   instead of a dedicated backend, no file upload (works off the pasted
   master_cv_text the Career Diagnostic already collects), persisted on a
   single job_resume_versions table rather than a resumes + versions pair.

   The one rule this module exists to enforce, same as the diagnostic
   engine: never let the AI invent what it can't support. Every bullet
   carries its own evidenceBasis + evidenceStatus, and anything tempting
   but unsupported goes into excludedClaims / unsupportedKeywordsNeverAdd
   instead of the document. */

import { escapeHtml } from './html-utils.js';

const stringArray = '[string]';

export const RESUME_DOCUMENT_SHAPE = `{"documentTitle":string,"targetRole":string,"headline":string,"professionalSummary":string,"experience":[{"employer":string,"title":string,"location":string,"dates":string,"bullets":[{"text":string,"evidenceBasis":string,"evidenceStatus":"supported"|"partially_supported"}]}],"projects":[{"name":string,"context":string,"dates":string,"bullets":[{"text":string,"evidenceBasis":string,"evidenceStatus":"supported"|"partially_supported"}]}],"education":[{"qualification":string,"institution":string,"location":string,"dates":string,"details":${stringArray}}],"skillGroups":[{"category":string,"skills":${stringArray},"evidenceNote":string}],"languages":[{"language":string,"level":string}],"certifications":${stringArray},"evidenceWarnings":${stringArray},"excludedClaims":${stringArray},"positioningNotes":${stringArray}}`;

const KEYWORD_ITEM_SHAPE = `{"keyword":string,"importance":"mandatory"|"preferred"|"contextual","status":"covered"|"supported_but_missing"|"unsupported"|"unclear","evidence":string}`;

export const TAILORED_RESULT_SHAPE = `{"resume":${RESUME_DOCUMENT_SHAPE},"atsAnalysis":{"overallMatch":0-100,"mandatoryCoverage":0-100,"keywordCoverage":0-100,"keywordAudit":[${KEYWORD_ITEM_SHAPE}],"hardGaps":${stringArray},"truthfulOptimisations":${stringArray},"unsupportedKeywordsNeverAdd":${stringArray}},"tailoringSummary":${stringArray},"applicationRecommendation":"APPLY STRONGLY"|"APPLY"|"APPLY SELECTIVELY"|"REVIEW"|"SKIP","recommendationReason":string}`;

const BASE_CV_RULES = `NON-NEGOTIABLE RULES:
1. Never invent employers, job titles, dates, locations, degrees, tools, certifications, achievements, metrics, language levels, responsibilities, or results.
2. Do not upgrade seniority — a candidate cannot become "senior," "lead," or "manager" unless the evidence actually supports it.
3. Preserve factual dates/employers/titles as given. If something is unclear, omit or describe conservatively rather than guessing.
4. Rephrase truthful evidence for clarity and relevance. Do not manufacture impact or invent quantified results not present in the source.
5. Every experience/project bullet MUST carry evidenceBasis (what specifically supports it) and evidenceStatus ("supported" if directly evidenced, "partially_supported" if the wording is conservative but part of the emphasis isn't directly demonstrated).
6. Put unsupported or tempting claims into excludedClaims instead of writing them into the CV.
7. Contact details are out of scope — never invent a phone number, email, or address; the user adds their own contact header separately.
8. Use a clean ATS-friendly structure — no tables, columns, first-person pronouns, or generic soft-skill filler.
9. Prefer 3-5 high-value bullets for recent/relevant roles, fewer for older/less relevant ones. Keep it to a normal 1-2 page resume's worth of content.
10. Output ONLY a single JSON object matching exactly this shape (no markdown, no commentary): ${RESUME_DOCUMENT_SHAPE}`;

export function buildBaseCvMessages({ masterCvText, structuredProfile, strategyJson, targetRole, emphasis }) {
  return [
    { role: 'system', content: `You are an evidence-constrained CV strategist and resume editor. Create a strong BASE CV for the requested target role using ONLY information supported by the confirmed career profile and CV/background text below.\n\n${BASE_CV_RULES}` },
    { role: 'user', content: `CONFIRMED CAREER PROFILE:\n${JSON.stringify(structuredProfile || {})}\n\nCONFIRMED CAREER STRATEGY:\n${JSON.stringify(strategyJson || {})}\n\nCV / BACKGROUND TEXT:\n${masterCvText || '(none saved)'}\n\nREQUESTED TARGET ROLE:\n${targetRole}\n\nOPTIONAL USER EMPHASIS:\n${emphasis || 'None'}\n\nTASK:\nCreate a truthful ATS-friendly base CV for this target role. Critically preserve what the evidence supports and exclude claims the evidence does not support.` },
  ];
}

const TAILOR_RULES = `NON-NEGOTIABLE RULES:
1. Candidate evidence comes only from the confirmed profile, CV/background text, and the source base CV below — job requirements come only from the vacancy.
2. You may reorder, shorten, select, and rephrase supported evidence — you may NOT create new facts.
3. NEVER insert a JD keyword merely because ATS may value it when there is no candidate evidence for it.
4. Classify every important keyword as covered / supported_but_missing / unsupported / unclear. unsupported keywords MUST be listed in unsupportedKeywordsNeverAdd and NOT inserted into the CV.
5. Do not alter employers, titles, dates, degree names, language levels, tools, or metrics beyond source evidence. Do not manufacture leadership, ownership, scale, savings, revenue, or team size.
6. Treat preferred/nice-to-have requirements differently from mandatory ones — mandatoryCoverage should reflect only the mandatory set.
7. If the vacancy is materially unrealistic for this candidate, keep the CV truthful and lower applicationRecommendation rather than exaggerating.
8. Every bullet retains evidenceBasis/evidenceStatus. Contact details stay out of scope, never invented.
9. Output ONLY a single JSON object matching exactly this shape (no markdown, no commentary): ${TAILORED_RESULT_SHAPE}`;

export function buildTailorMessages({ masterCvText, structuredProfile, strategyJson, baseResumeContent, company, jobTitle, jobDescription }) {
  return [
    { role: 'system', content: `You are an evidence-constrained ATS CV tailoring specialist. Tailor the supplied BASE CV to the supplied vacancy without adding unsupported claims.\n\n${TAILOR_RULES}` },
    { role: 'user', content: `CONFIRMED CAREER PROFILE:\n${JSON.stringify(structuredProfile || {})}\n\nCONFIRMED CAREER STRATEGY:\n${JSON.stringify(strategyJson || {})}\n\nCV / BACKGROUND TEXT:\n${masterCvText || '(none saved)'}\n\nSOURCE BASE CV:\n${JSON.stringify(baseResumeContent)}\n\nVACANCY COMPANY:\n${company || 'Not supplied'}\n\nVACANCY TITLE:\n${jobTitle || 'Not supplied'}\n\nVACANCY:\n${jobDescription}\n\nTASK:\nTailor this CV for the vacancy. Perform the ATS keyword audit and explicitly identify JD keywords that must NOT be added because the candidate lacks evidence.` },
  ];
}

function asArray(v) { return Array.isArray(v) ? v : []; }
function asObject(v) { return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {}; }
function asNumber(v, fallback, min, max) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

// Same reasoning as career-diagnostic.js's normaliseDiagnosticResult —
// chatComplete's json:true doesn't guarantee field types, so every array/
// object the render/save code depends on gets coerced to a safe shape.
export function normaliseResumeDocument(doc) {
  doc = asObject(doc);
  doc.experience = asArray(doc.experience).map(e => {
    e = asObject(e);
    e.bullets = asArray(e.bullets).map(asObject);
    return e;
  });
  doc.projects = asArray(doc.projects).map(p => {
    p = asObject(p);
    p.bullets = asArray(p.bullets).map(asObject);
    return p;
  });
  doc.education = asArray(doc.education).map(ed => {
    ed = asObject(ed);
    ed.details = asArray(ed.details);
    return ed;
  });
  doc.skillGroups = asArray(doc.skillGroups).map(g => {
    g = asObject(g);
    g.skills = asArray(g.skills);
    return g;
  });
  doc.languages = asArray(doc.languages).map(asObject);
  doc.certifications = asArray(doc.certifications);
  doc.evidenceWarnings = asArray(doc.evidenceWarnings);
  doc.excludedClaims = asArray(doc.excludedClaims);
  doc.positioningNotes = asArray(doc.positioningNotes);
  return doc;
}

export function normaliseTailoredResult(result) {
  result = asObject(result);
  result.resume = normaliseResumeDocument(result.resume);
  result.atsAnalysis = asObject(result.atsAnalysis);
  result.atsAnalysis.overallMatch = asNumber(result.atsAnalysis.overallMatch, 0, 0, 100);
  result.atsAnalysis.mandatoryCoverage = asNumber(result.atsAnalysis.mandatoryCoverage, 0, 0, 100);
  result.atsAnalysis.keywordCoverage = asNumber(result.atsAnalysis.keywordCoverage, 0, 0, 100);
  result.atsAnalysis.keywordAudit = asArray(result.atsAnalysis.keywordAudit).map(asObject);
  result.atsAnalysis.hardGaps = asArray(result.atsAnalysis.hardGaps);
  result.atsAnalysis.truthfulOptimisations = asArray(result.atsAnalysis.truthfulOptimisations);
  result.atsAnalysis.unsupportedKeywordsNeverAdd = asArray(result.atsAnalysis.unsupportedKeywordsNeverAdd);
  result.tailoringSummary = asArray(result.tailoringSummary);
  if (!['APPLY STRONGLY','APPLY','APPLY SELECTIVELY','REVIEW','SKIP'].includes(result.applicationRecommendation)) {
    result.applicationRecommendation = 'REVIEW';
  }
  return result;
}

function bulletsText(items) {
  return asArray(items).map(b => `- ${b.text || ''}`).join('\n');
}

export function resumeToPlainText(doc) {
  doc = doc || {};
  const out = [];
  if (doc.headline) out.push(doc.headline);
  if (doc.professionalSummary) out.push('\nSUMMARY\n' + doc.professionalSummary);
  if (doc.experience?.length) {
    out.push('\nEXPERIENCE');
    doc.experience.forEach(x => {
      out.push(`\n${x.title || ''} | ${x.employer || ''}${x.location ? ' | '+x.location : ''}${x.dates ? ' | '+x.dates : ''}`);
      out.push(bulletsText(x.bullets));
    });
  }
  if (doc.projects?.length) {
    out.push('\nPROJECTS');
    doc.projects.forEach(x => {
      out.push(`\n${x.name || ''}${x.context ? ' | '+x.context : ''}${x.dates ? ' | '+x.dates : ''}`);
      out.push(bulletsText(x.bullets));
    });
  }
  if (doc.education?.length) {
    out.push('\nEDUCATION');
    doc.education.forEach(x => {
      out.push(`\n${x.qualification || ''} | ${x.institution || ''}${x.location ? ' | '+x.location : ''}${x.dates ? ' | '+x.dates : ''}`);
      if (x.details?.length) out.push(x.details.map(d => `- ${d}`).join('\n'));
    });
  }
  if (doc.skillGroups?.length) {
    out.push('\nSKILLS');
    doc.skillGroups.forEach(g => out.push(`${g.category || ''}: ${(g.skills||[]).join(', ')}`));
  }
  if (doc.languages?.length) out.push('\nLANGUAGES\n' + doc.languages.map(l => `${l.language || ''} — ${l.level || ''}`).join('\n'));
  if (doc.certifications?.length) out.push('\nCERTIFICATIONS\n' + doc.certifications.map(c => `- ${c}`).join('\n'));
  return out.filter(Boolean).join('\n').trim() + '\n';
}

export function resumeToHtml(doc) {
  doc = doc || {};
  const exp = (doc.experience||[]).map(x => `
    <div class="cv-item"><div class="cv-item-head"><div><strong>${escapeHtml(x.title)}</strong><span>${escapeHtml(x.employer)}</span></div><small>${escapeHtml(x.dates)}</small></div>
    ${x.location ? `<div class="cv-subtle">${escapeHtml(x.location)}</div>` : ''}
    <ul>${(x.bullets||[]).map(b => `<li>${escapeHtml(b.text)}</li>`).join('')}</ul></div>`).join('');
  const projects = (doc.projects||[]).map(x => `
    <div class="cv-item"><div class="cv-item-head"><div><strong>${escapeHtml(x.name)}</strong><span>${escapeHtml(x.context)}</span></div><small>${escapeHtml(x.dates)}</small></div>
    <ul>${(x.bullets||[]).map(b => `<li>${escapeHtml(b.text)}</li>`).join('')}</ul></div>`).join('');
  const education = (doc.education||[]).map(x => `
    <div class="cv-item"><div class="cv-item-head"><div><strong>${escapeHtml(x.qualification)}</strong><span>${escapeHtml(x.institution)}</span></div><small>${escapeHtml(x.dates)}</small></div>
    ${x.location ? `<div class="cv-subtle">${escapeHtml(x.location)}</div>` : ''}
    ${(x.details||[]).length ? `<ul>${x.details.map(d=>`<li>${escapeHtml(d)}</li>`).join('')}</ul>` : ''}</div>`).join('');
  const skills = (doc.skillGroups||[]).map(g => `<p><b>${escapeHtml(g.category)}:</b> ${(g.skills||[]).map(s=>escapeHtml(s)).join(', ')}</p>`).join('');
  const languages = (doc.languages||[]).map(l => `${escapeHtml(l.language)} — ${escapeHtml(l.level)}`).join(' · ');
  return `
    <h1 class="cv-doc-headline">${escapeHtml(doc.headline || doc.targetRole || 'CV')}</h1>
    ${doc.professionalSummary ? `<h2 class="cv-doc-section">Summary</h2><p>${escapeHtml(doc.professionalSummary)}</p>` : ''}
    ${exp ? `<h2 class="cv-doc-section">Experience</h2>${exp}` : ''}
    ${projects ? `<h2 class="cv-doc-section">Projects</h2>${projects}` : ''}
    ${education ? `<h2 class="cv-doc-section">Education</h2>${education}` : ''}
    ${skills ? `<h2 class="cv-doc-section">Skills</h2>${skills}` : ''}
    ${languages ? `<h2 class="cv-doc-section">Languages</h2><p>${languages}</p>` : ''}
    ${(doc.certifications||[]).length ? `<h2 class="cv-doc-section">Certifications</h2><ul>${doc.certifications.map(c=>`<li>${escapeHtml(c)}</li>`).join('')}</ul>` : ''}
  `;
}
