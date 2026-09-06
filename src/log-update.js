/* src/log-update.js
   "Log an Update" — natural-language tracker update, shared between
   job-copilot.html's modal and job-quick-log.html's standalone mobile
   page so the two never drift apart. AI proposes changes to an EXISTING
   opportunity/interview (never creates a new one — that's what AI Import
   is for); the caller renders a review the user must confirm before
   anything is written. */

import { localDateStr } from './date-utils.js';
import { computeDerivedFields } from './job-scoring.js';
import { STAGE_ORDER, ACTIVITY_TYPES, QUESTION_TAGS } from './job-constants.js';

export function buildInterpretMessages({ oppList, ivList, text }) {
  const shape = `{"matched_opportunity_id":"uuid|null","matched_interview_id":"uuid|null","summary":string,"opportunity_updates":{"stage":${JSON.stringify(STAGE_ORDER)}[number]|null,"applied":boolean|null,"applied_date":"YYYY-MM-DD"|null,"cv_version":string|null,"next_action":string|null,"next_action_date":"YYYY-MM-DD"|null},"interview_updates":{"status":"completed"|"cancelled"|null,"outcome":string|null,"post_interview_reflection":string|null},"new_interview_questions":[{"question":string,"tag":${JSON.stringify(QUESTION_TAGS)}[number]|null}],"activity_type":${JSON.stringify(ACTIVITY_TYPES)}[number],"activity_date":"YYYY-MM-DD","unclear_notes":"string|null"}`;
  return [
    { role: 'system', content: `You interpret a short free-text update from a job seeker about something that happened in their job search, and turn it into structured updates to their EXISTING tracker records. Return ONLY a single JSON object matching exactly this shape (no markdown, no commentary): ${shape}.

Rules: matched_opportunity_id and matched_interview_id must be one of the exact ids given below, or null — never invent an id, never guess if genuinely unsure which record is meant. Only fill in a field under opportunity_updates/interview_updates if the message actually implies that change; leave everything else null. For a vague or relative date ("next week", "soon"), leave the date field null and mention it in unclear_notes instead of guessing a specific date — today's date is given below. new_interview_questions should only contain questions the message says were actually asked. This flow only updates existing records — it never creates a new opportunity.` },
    { role: 'user', content: `TODAY: ${localDateStr()}\n\nACTIVE OPPORTUNITIES:\n${JSON.stringify(oppList)}\n\nOPEN INTERVIEWS:\n${JSON.stringify(ivList)}\n\nUSER'S UPDATE:\n${text}` },
  ];
}

// Defense in depth: never trust an id or enum value the model returns
// without checking it against what was actually offered — a CHECK
// constraint would catch a bad enum at save time anyway, but this gives
// a cleaner message instead of a raw Postgres error. Also resolves
// _effective_opportunity_id: an interview-only match still belongs to an
// opportunity, and the logged activity needs that id or it silently never
// shows up on that opportunity's Activity timeline.
export function validateAndPrepareParsedUpdate(parsed, { oppList, ivList }) {
  const validOppIds = new Set(oppList.map(o => o.id));
  const validIvIds = new Set(ivList.map(iv => iv.id));

  if (parsed.matched_opportunity_id && !validOppIds.has(parsed.matched_opportunity_id)) parsed.matched_opportunity_id = null;
  if (parsed.matched_interview_id && !validIvIds.has(parsed.matched_interview_id)) parsed.matched_interview_id = null;
  if (parsed.opportunity_updates?.stage && !STAGE_ORDER.includes(parsed.opportunity_updates.stage)) parsed.opportunity_updates.stage = null;
  if (parsed.activity_type && !ACTIVITY_TYPES.includes(parsed.activity_type)) parsed.activity_type = null;
  (parsed.new_interview_questions || []).forEach(q => { if (q.tag && !QUESTION_TAGS.includes(q.tag)) q.tag = null; });

  if (!parsed.matched_opportunity_id && !parsed.matched_interview_id) return parsed;

  const matchedIv = parsed.matched_interview_id ? ivList.find(i => i.id === parsed.matched_interview_id) : null;
  parsed._effective_opportunity_id = parsed.matched_opportunity_id || matchedIv?.opportunity_id || null;
  return parsed;
}

export async function applyLogUpdate(sb, parsed, profileId) {
  const p = parsed;
  if (p.matched_opportunity_id && p.opportunity_updates) {
    const payload = {};
    Object.entries(p.opportunity_updates).forEach(([k, v]) => { if (v !== null && v !== undefined) payload[k] = v; });
    if (Object.keys(payload).length) {
      // applied/applied_date affect priority's deadline-urgency component,
      // so recompute the derived fields against the full current row +
      // this diff — not just the diff in isolation.
      const { data: currentOpp } = await sb.from('job_opportunities').select('*').eq('id', p.matched_opportunity_id).maybeSingle();
      if (currentOpp) Object.assign(payload, computeDerivedFields({ ...currentOpp, ...payload }));
      const { error } = await sb.from('job_opportunities').update(payload).eq('id', p.matched_opportunity_id);
      if (error) throw error;
    }
  }
  if (p.matched_interview_id && p.interview_updates) {
    const payload = {};
    Object.entries(p.interview_updates).forEach(([k, v]) => { if (v !== null && v !== undefined) payload[k] = v; });
    if (Object.keys(payload).length) {
      const { error } = await sb.from('job_interviews').update(payload).eq('id', p.matched_interview_id);
      if (error) throw error;
    }
  }
  if (p.matched_interview_id && p.new_interview_questions?.length) {
    const rows = p.new_interview_questions.filter(q => q.question).map(q => ({ interview_id: p.matched_interview_id, question: q.question, tag: q.tag || null }));
    if (rows.length) {
      const { error } = await sb.from('job_interview_questions').insert(rows);
      if (error) throw error;
    }
  }
  const { error: actErr } = await sb.from('job_activities').insert([{
    profile_id: profileId,
    opportunity_id: p._effective_opportunity_id || null,
    activity_type: p.activity_type || 'Other',
    activity_date: p.activity_date || localDateStr(),
    summary: p.summary || null,
  }]);
  if (actErr) throw actErr;

  // Land on a link to what just changed instead of just closing —
  // "updated" isn't very actionable without a way to go see it.
  const link = p.matched_interview_id
    ? `job-interviews.html?id=${p.matched_interview_id}`
    : p._effective_opportunity_id ? `job-opportunity.html?id=${p._effective_opportunity_id}` : null;
  return { link, isInterview: !!p.matched_interview_id };
}
