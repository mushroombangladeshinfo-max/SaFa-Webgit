/* src/application-materials.js
   Cover letter + application-question answer drafting — evidence-
   constrained like CV Studio (src/cv-studio.js), but simpler: neither
   needs versioning/lineage since each is already inherently tied to one
   opportunity, so both persist as plain jsonb on job_opportunities
   rather than a separate table. */

const COVER_LETTER_SHAPE = `{"content":string,"evidenceWarnings":[string],"excludedClaims":[string]}`;

const COVER_LETTER_RULES = `NON-NEGOTIABLE RULES:
1. Never invent employers, titles, dates, achievements, metrics, or credentials not present in the confirmed profile.
2. Address the specific role and company by name. Reference 2-3 concrete, truthful points of fit — do not just restate the CV.
3. Professional, confident, first-person tone. Roughly 250-400 words, 3-4 paragraphs.
4. Do not fabricate enthusiasm or claims about the company beyond what's in the vacancy text.
5. Put anything tempting but unsupported into excludedClaims instead of writing it in.
6. Contact details and formal salutation/sign-off are out of scope — the user adds their own header/footer.
7. Output ONLY a single JSON object matching exactly this shape (no markdown, no commentary): ${COVER_LETTER_SHAPE}`;

export function buildCoverLetterMessages({ structuredProfile, strategyJson, company, jobTitle, jobDescription }) {
  return [
    { role: 'system', content: `You are an evidence-constrained cover letter writer.\n\n${COVER_LETTER_RULES}` },
    { role: 'user', content: `CONFIRMED CAREER PROFILE:\n${JSON.stringify(structuredProfile || {})}\n\nCONFIRMED CAREER STRATEGY:\n${JSON.stringify(strategyJson || {})}\n\nCOMPANY:\n${company || 'Not supplied'}\n\nROLE:\n${jobTitle || 'Not supplied'}\n\nVACANCY:\n${jobDescription}\n\nTASK:\nDraft a truthful, specific cover letter for this role.` },
  ];
}

const ANSWER_SHAPE = `{"answer":string,"evidenceBasis":string,"evidenceStatus":"supported"|"partially_supported","confidenceNote":string}`;

const ANSWER_RULES = `NON-NEGOTIABLE RULES:
1. Never invent experience, achievements, metrics, or credentials not present in the confirmed profile.
2. evidenceBasis must name the specific stored experience/project/skill the answer actually draws on.
3. evidenceStatus is "partially_supported" if the wording is conservative but part of the answer isn't directly demonstrated by the profile.
4. confidenceNote should honestly flag if the profile has thin evidence for this question — do not paper over the gap with generic language.
5. First-person, ready to submit as-is, natural length for the question asked (do not pad).
6. Output ONLY a single JSON object matching exactly this shape (no markdown, no commentary): ${ANSWER_SHAPE}`;

export function buildAnswerMessages({ structuredProfile, strategyJson, company, jobTitle, jobDescription, question, otherAnswers }) {
  return [
    { role: 'system', content: `You are an evidence-constrained application-question answer writer.\n\n${ANSWER_RULES}` },
    { role: 'user', content: `CONFIRMED CAREER PROFILE:\n${JSON.stringify(structuredProfile || {})}\n\nCONFIRMED CAREER STRATEGY:\n${JSON.stringify(strategyJson || {})}\n\nCOMPANY:\n${company || 'Not supplied'}\n\nROLE:\n${jobTitle || 'Not supplied'}\n\nVACANCY:\n${jobDescription || '(not supplied)'}\n\nOTHER ANSWERS ALREADY DRAFTED FOR THIS APPLICATION (avoid repeating the same story/evidence):\n${JSON.stringify(otherAnswers || [])}\n\nQUESTION TO ANSWER:\n${question}\n\nTASK:\nDraft a truthful, specific answer to this question.` },
  ];
}

function asArray(v) { return Array.isArray(v) ? v : []; }
function asObject(v) { return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {}; }

export function normaliseCoverLetter(data) {
  data = asObject(data);
  data.content = typeof data.content === 'string' ? data.content : '';
  data.evidenceWarnings = asArray(data.evidenceWarnings);
  data.excludedClaims = asArray(data.excludedClaims);
  return data;
}

export function normaliseAnswer(data) {
  data = asObject(data);
  data.answer = typeof data.answer === 'string' ? data.answer : '';
  data.evidenceBasis = typeof data.evidenceBasis === 'string' ? data.evidenceBasis : '';
  data.evidenceStatus = ['supported','partially_supported'].includes(data.evidenceStatus) ? data.evidenceStatus : 'partially_supported';
  data.confidenceNote = typeof data.confidenceNote === 'string' ? data.confidenceNote : '';
  return data;
}
