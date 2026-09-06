/* src/career-diagnostic.js
   Career Diagnostic & Clarification Engine — a critical AI pass over a
   pasted CV/background that runs BEFORE AI Fit Analysis or Interview Prep
   trust a career profile. Adapted from a reference implementation
   (job-search-command-center v2's careerDiagnosticRoutes.js), scaled down:
   no separate auth/tenancy (is_admin() already covers that), one AI call
   per turn via the existing BYO-key chatComplete() instead of a dedicated
   backend, everything persisted on job_profiles rather than new tables.

   Core rule this whole module exists to enforce: never let an inference
   silently become a "fact" just because the model repeated it. Every claim
   in profileDraft carries its own status of verified / inferred / unknown,
   and the confirm step freezes whatever the user actually approved. */

export const MAX_DIAGNOSTIC_QUESTIONS = 8;

// A long paste going to a small/cheap model (this app's default is Groq's
// llama-3.1-8b-instant) risks silent truncation or an opaque provider
// error with no explanation — reject client-side with a clear message
// instead. Generous enough for a real multi-page CV, well short of
// anything that would meaningfully strain a small model's context window.
export const MAX_CV_TEXT_CHARS = 60_000;

// Prompt-embedded shape string, matching this codebase's existing pattern
// (see job-opportunities.html's AI Import) rather than a formal JSON-schema
// object — chatComplete's `json:true` only requests a JSON object back,
// it doesn't enforce a schema server-side the way OpenAI's structured
// outputs mode does, so the shape has to be spelled out in the prompt and
// the result still validated in code afterward (enforceDiagnosticConsistency).
export const DIAGNOSTIC_SHAPE = `{"status":"ask_more"|"ready_for_confirmation","profileCompleteness":0-100,"careerIntentConfidence":"low"|"medium"|"high","diagnostic":{"currentPositioning":string,"likelySeniority":string,"cvQualityScore":0-100,"realismAssessment":string,"strongestAssets":[string],"weaknesses":[{"issue":string,"severity":"high"|"medium"|"low","whyItMatters":string,"recommendedAction":string}],"contradictions":[string],"missingEvidence":[string],"targetAlignment":[{"role":string,"alignment":0-100,"rationale":string,"majorGap":string}]},"profileDraft":{"professionalHeadline":string,"primaryTargetRole":string,"secondaryTargetRoles":[string],"employmentTypes":[string],"targetLocations":[string],"workModePreferences":[string],"careerPriorities":[string],"constraints":[string],"education":[string],"experienceEvidence":[{"claim":string,"evidence":string,"status":"verified"|"inferred"|"unknown"}],"projects":[{"claim":string,"evidence":string,"status":"verified"|"inferred"|"unknown"}],"skills":[{"name":string,"evidence":string,"status":"verified"|"inferred"|"unknown","strength":"strong"|"moderate"|"limited"|"unknown"}],"languages":[{"language":string,"level":string,"practicalUse":string,"status":"verified"|"inferred"|"unknown"}],"verifiedFacts":[string],"inferredInsights":[string],"unknowns":[string]},"strategyDraft":{"recommendedPrimaryPath":string,"secondaryPath":string,"roleSearchAllocation":[string],"immediatePriorities":[string],"avoidForNow":[string]},"nextQuestion":null|{"id":string,"category":"career_objective"|"employment"|"geography"|"language"|"evidence"|"constraint"|"priority"|"other","question":string,"whyItMatters":string,"importance":1-5,"answerType":"free_text"|"single_choice"|"multi_choice"|"yes_no","options":[string]}}`;

const NON_NEGOTIABLE_RULES = `NON-NEGOTIABLE RULES:
1. Never invent experience, achievements, tools, dates, language levels, seniority, certifications, job titles, or quantified results.
2. A claim is "verified" only when directly supported by the pasted CV/background text or by explicit user intent supplied below. Your own interpretation is "inferred" — never upgrade an inference to verified just because you repeated it.
3. Treat a skill listed without concrete evidence as limited/unknown evidence, not strong evidence.
4. Critically identify weak positioning, unsupported claims, contradictions, unclear chronology, target-role mismatch, unrealistic seniority, and missing evidence. Do not flatter.
5. Do not treat employment gaps as inherently negative. Ask about them only when the missing context materially changes positioning or eligibility.
6. Ask AT MOST ONE question this turn.
7. Ask only a high-impact question that materially changes one of: target role, eligibility, job filtering, CV positioning, evidence strength, geographic feasibility, language compatibility, or strategic priority. Do not ask about anything already clear from the text given.
8. If enough information is available, set status="ready_for_confirmation" and nextQuestion=null.
9. A realistic profile may still contain unknowns — do not interrogate the user endlessly.
10. If the desired/target role is materially unrealistic today, say so plainly in realismAssessment and propose the closest defensible path rather than manufacturing false confidence.
11. Output ONLY a single JSON object matching exactly this shape (no markdown, no commentary): ${DIAGNOSTIC_SHAPE}`;

function initialDiagnosticInstructions() {
  return `You are a critical career diagnostician, evidence auditor, and job-search strategist. The user has pasted a CV/background and may have supplied initial career intent. Your job is NOT to flatter them and NOT to rewrite anything yet — first determine what the text actually proves and what the user appears to want, then decide whether one clarification question is necessary before a reliable career profile can be confirmed.

${NON_NEGOTIABLE_RULES}

QUESTION PRIORITY: importance 5 = answer can change target/eligibility/core positioning. importance 4 = materially changes CV/job strategy. importance 3 = useful but not blocking. Do not ask importance 1-2 questions during onboarding.`;
}

function continuationInstructions() {
  return `You are continuing an adaptive career diagnostic. You receive the previous diagnostic result plus the user's verified answers so far — update the profile carefully, do not restart from scratch.

${NON_NEGOTIABLE_RULES}

ADDITIONALLY: every explicit user answer becomes verified evidence. Resolve any contradiction the new answer settles. Do not repeat a question already answered. Prefer stopping over asking a low-value question — when the profile is decision-ready, set status="ready_for_confirmation". If the user couldn't answer something, preserve it as unknown rather than asking again.`;
}

function correctionInstructions() {
  return `You are applying a user-provided correction to a career diagnostic that was ready for confirmation (or close to it). Treat the correction as verified evidence that overrides any conflicting earlier inference — do not preserve an inference that conflicts with an explicit correction.

${NON_NEGOTIABLE_RULES}

ADDITIONALLY: usually return status="ready_for_confirmation" after applying the correction. Ask one new question only if the correction creates a genuinely material ambiguity that cannot safely remain unknown.`;
}

function intentText(initialIntent) {
  const entries = Object.entries(initialIntent || {}).filter(([, v]) => v);
  return entries.length ? entries.map(([k, v]) => `${k}: ${v}`).join('\n') : '(none supplied)';
}

export function buildInitialMessages({ cvText, initialIntent }) {
  return [
    { role: 'system', content: initialDiagnosticInstructions() },
    { role: 'user', content: `INITIAL USER INTENT (may be incomplete):\n${intentText(initialIntent)}\n\nCV / BACKGROUND TEXT:\n${cvText}\n\nTASK:\nPerform the first critical CV + career-intent diagnostic. Build a conservative profile draft and strategy draft. If one material ambiguity remains, ask the single highest-impact clarification question. Otherwise mark it ready for user confirmation.` },
  ];
}

export function buildContinuationMessages({ initialIntent, previousResult, answers, questionLimitReached }) {
  const latest = answers[answers.length - 1];
  return [
    { role: 'system', content: continuationInstructions() },
    { role: 'user', content: `INITIAL USER INTENT:\n${intentText(initialIntent)}\n\nPREVIOUS DIAGNOSTIC RESULT:\n${JSON.stringify(previousResult)}\n\nVERIFIED ANSWERS SO FAR:\n${JSON.stringify(answers)}\n\nLATEST ANSWER:\nQuestion: ${latest?.question}\nAnswer: ${latest?.answer}\n\nQUESTION LIMIT:\n${answers.length}/${MAX_DIAGNOSTIC_QUESTIONS} questions answered.${questionLimitReached ? ' The limit has been reached — do not ask another question; preserve remaining uncertainty and return ready_for_confirmation.' : ' Ask another question only if it is materially necessary.'}\n\nTASK:\nUpdate the diagnostic, profile draft, and strategy draft using the verified answer, then either ask ONE new high-impact question or mark ready for confirmation.` },
  ];
}

export function buildCorrectionMessages({ initialIntent, previousResult, answers, correction }) {
  return [
    { role: 'system', content: correctionInstructions() },
    { role: 'user', content: `INITIAL USER INTENT:\n${intentText(initialIntent)}\n\nPREVIOUS DIAGNOSTIC RESULT:\n${JSON.stringify(previousResult)}\n\nALL VERIFIED ANSWERS / CORRECTIONS SO FAR:\n${JSON.stringify(answers)}\n\nLATEST USER CORRECTION:\n${correction}\n\nTASK:\nApply this correction as verified evidence and update the diagnostic, profile draft, and strategy draft accordingly.` },
  ];
}

function asArray(v) { return Array.isArray(v) ? v : []; }
function asObject(v) { return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {}; }
function asNumber(v, fallback, min, max) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

// chatComplete's json:true only asks Groq for "a JSON object" — unlike a
// real structured-outputs API, nothing stops a small/cheap model from
// dropping a field or returning the wrong type for one (e.g. a string
// where an array was expected). Without this, something like
// `(d.weaknesses||[]).map(...)` still crashes on a truthy non-array
// value, since `||[]` only catches null/undefined/empty-string, not "the
// model returned a string instead of an array." Every field the render
// code iterates or reads a specific type from gets coerced to a safe
// shape here — this is NOT a claim that the *content* is correct, only
// that it won't crash or silently misrender.
export function normaliseDiagnosticResult(data) {
  data = asObject(data);

  data.diagnostic = asObject(data.diagnostic);
  data.diagnostic.strongestAssets = asArray(data.diagnostic.strongestAssets);
  data.diagnostic.weaknesses = asArray(data.diagnostic.weaknesses).map(asObject);
  data.diagnostic.contradictions = asArray(data.diagnostic.contradictions);
  data.diagnostic.missingEvidence = asArray(data.diagnostic.missingEvidence);
  data.diagnostic.targetAlignment = asArray(data.diagnostic.targetAlignment).map(asObject);

  data.profileDraft = asObject(data.profileDraft);
  ['secondaryTargetRoles','employmentTypes','targetLocations','workModePreferences',
   'careerPriorities','constraints','education','verifiedFacts','inferredInsights','unknowns']
    .forEach(k => { data.profileDraft[k] = asArray(data.profileDraft[k]); });
  ['experienceEvidence','projects','skills','languages']
    .forEach(k => { data.profileDraft[k] = asArray(data.profileDraft[k]).map(asObject); });

  data.strategyDraft = asObject(data.strategyDraft);
  ['roleSearchAllocation','immediatePriorities','avoidForNow']
    .forEach(k => { data.strategyDraft[k] = asArray(data.strategyDraft[k]); });

  data.profileCompleteness = asNumber(data.profileCompleteness, 0, 0, 100);
  if (!['low','medium','high'].includes(data.careerIntentConfidence)) data.careerIntentConfidence = 'low';

  if (data.nextQuestion && typeof data.nextQuestion === 'object' && !Array.isArray(data.nextQuestion)) {
    const q = data.nextQuestion;
    q.category = typeof q.category === 'string' ? q.category : 'other';
    q.question = typeof q.question === 'string' ? q.question : '';
    q.whyItMatters = typeof q.whyItMatters === 'string' ? q.whyItMatters : '';
    q.importance = asNumber(q.importance, 3, 1, 5);
    q.answerType = ['free_text','single_choice','multi_choice','yes_no'].includes(q.answerType) ? q.answerType : 'free_text';
    q.options = asArray(q.options);
  } else {
    data.nextQuestion = null;
  }

  if (!['ask_more','ready_for_confirmation'].includes(data.status)) {
    data.status = data.nextQuestion ? 'ask_more' : 'ready_for_confirmation';
  }

  return data;
}

// Never trust the model's own internal consistency — force the shape to
// make sense regardless of what it actually returned. This is the single
// most important safeguard in this module: without it, a model that says
// status="ask_more" but forgets nextQuestion (or vice versa) would leave
// the UI stuck with no way to progress.
export function enforceDiagnosticConsistency(data, { forceReady = false } = {}) {
  data = normaliseDiagnosticResult(data);
  if (forceReady) {
    data.status = 'ready_for_confirmation';
  } else if (data.status === 'ask_more' && !data.nextQuestion) {
    data.status = 'ready_for_confirmation';
  }
  if (data.status === 'ready_for_confirmation') data.nextQuestion = null;
  return data;
}

// Basic data-minimisation before CV text leaves the browser for a
// third-party model — email/phone/LinkedIn aren't relevant to job-fit
// reasoning, so there's no reason to send them.
export function minimiseCvPiiForAi(text) {
  return String(text || '')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[EMAIL REDACTED]')
    .replace(/(?:\+?\d[\d\s()./-]{7,}\d)/g, '[PHONE REDACTED]')
    .replace(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s]+/gi, '[LINKEDIN URL REDACTED]')
    .trim();
}

const STATUS_LABEL = { verified: 'Verified', inferred: 'Inferred', unknown: 'Unknown' };

/* Renders a confirmed structured_profile into the same kind of plain text
   the legacy flat career-profile fields used to produce, so every existing
   AI feature (Fit Analysis, Interview Prep) can keep building a prompt the
   same way — just fed sharper, evidence-tagged input instead of raw text. */
export function structuredProfileToText(structuredProfile) {
  const p = structuredProfile;
  if (!p) return null;
  const lines = [];
  if (p.professionalHeadline) lines.push(`Headline: ${p.professionalHeadline}`);
  if (p.primaryTargetRole) lines.push(`Primary target role: ${p.primaryTargetRole}`);
  if (p.secondaryTargetRoles?.length) lines.push(`Secondary target roles: ${p.secondaryTargetRoles.join(', ')}`);
  if (p.employmentTypes?.length) lines.push(`Employment types: ${p.employmentTypes.join(', ')}`);
  if (p.targetLocations?.length) lines.push(`Target locations: ${p.targetLocations.join(', ')}`);
  if (p.workModePreferences?.length) lines.push(`Work mode preferences: ${p.workModePreferences.join(', ')}`);
  if (p.careerPriorities?.length) lines.push(`Career priorities: ${p.careerPriorities.join(', ')}`);
  if (p.constraints?.length) lines.push(`Constraints: ${p.constraints.join(', ')}`);
  if (p.education?.length) lines.push(`Education: ${p.education.join('; ')}`);
  if (p.experienceEvidence?.length) {
    lines.push('Experience:');
    p.experienceEvidence.forEach(e => lines.push(`- [${STATUS_LABEL[e.status] || e.status}] ${e.claim} — ${e.evidence}`));
  }
  if (p.projects?.length) {
    lines.push('Projects:');
    p.projects.forEach(e => lines.push(`- [${STATUS_LABEL[e.status] || e.status}] ${e.claim} — ${e.evidence}`));
  }
  if (p.skills?.length) {
    lines.push('Skills:');
    p.skills.forEach(s => lines.push(`- ${s.name} [${STATUS_LABEL[s.status] || s.status}, ${s.strength} evidence] ${s.evidence ? '— ' + s.evidence : ''}`));
  }
  if (p.languages?.length) {
    lines.push('Languages:');
    p.languages.forEach(l => lines.push(`- ${l.language}: ${l.level} [${STATUS_LABEL[l.status] || l.status}]${l.practicalUse ? ' — ' + l.practicalUse : ''}`));
  }
  if (p.verifiedFacts?.length) lines.push(`Other verified facts: ${p.verifiedFacts.join('; ')}`);
  if (p.inferredInsights?.length) lines.push(`AI-inferred positioning (not stated fact): ${p.inferredInsights.join('; ')}`);
  if (p.unknowns?.length) lines.push(`Known unknowns: ${p.unknowns.join('; ')}`);
  return lines.join('\n') || null;
}
