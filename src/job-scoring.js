/* ============================================================
   src/job-scoring.js
   Shared scoring logic for the Job Search Command Center — used by
   job-opportunities.html (list/Kanban), job-opportunity.html (detail/edit),
   and job-dashboard.html (Today's Priorities / KPIs), so the numbers are
   computed identically everywhere rather than drifting per page.
============================================================ */

import { localDateStr } from './date-utils.js';

export const FIT_DIMENSIONS = [
  { key: 'exp',             label: 'Experience Match',                weight: 20 },
  { key: 'skills',          label: 'Skills Match',                    weight: 20 },
  { key: 'role',            label: 'Role / Functional Match',         weight: 15 },
  { key: 'edu',             label: 'Education Match',                 weight: 10 },
  { key: 'lang',            label: 'Language Compatibility',          weight: 10 },
  { key: 'career_value',    label: 'Career Value',                    weight: 10 },
  { key: 'location',        label: 'Location / Work Model',           weight: 5  },
  { key: 'company_attract', label: 'Company Attractiveness',          weight: 5  },
  { key: 'networking',      label: 'Networking / Referral Potential', weight: 5  },
];

/** Effective rating for one dimension: manual overrides AI; either can be
 *  null/undefined if not yet rated. Returns null if neither is set.
 *  `ai` is the full AI Fit Analysis object (see job-opportunity.html) —
 *  its 9 dimension ratings live under `ai.ratings`, alongside the fuller
 *  narrative (recommendation, gaps, strategy, ...) that doesn't fit this
 *  scoring module's job. */
export function effectiveRating(manual, ai, key) {
  const m = manual?.[key];
  if (m !== null && m !== undefined) return m;
  const a = ai?.ratings?.[key];
  return (a !== null && a !== undefined) ? a : null;
}

/** Weighted 0-100 fit score. Only dimensions that have a rating (manual or
 *  AI) count, renormalized over the weight actually present — so a job
 *  rated on only 3 of 9 dimensions still gets a meaningful score instead of
 *  being artificially dragged toward zero by unrated dimensions. Returns
 *  null if nothing at all has been rated yet. */
export function computeFitScore(manual, ai) {
  let weightSum = 0, scoreSum = 0;
  for (const { key, weight } of FIT_DIMENSIONS) {
    const r = effectiveRating(manual, ai, key);
    if (r === null) continue;
    weightSum += weight;
    scoreSum += (r / 5) * weight;
  }
  if (weightSum === 0) return null;
  return Math.round((scoreSum / weightSum) * 100);
}

/** brief §21 classification thresholds. */
export function fitClassification(score) {
  if (score === null || score === undefined) return null;
  if (score >= 85) return 'A+ Exceptional';
  if (score >= 75) return 'A Strong';
  if (score >= 65) return 'B Worth Applying';
  if (score >= 55) return 'C Selective';
  return 'D Usually Skip';
}

/** brief §19: eligibility is separate from fit. Any 'no' among the 7 gate
 *  fields fails the whole job regardless of fit; any 'unclear' downgrades
 *  to REVIEW; all-'yes' (or unset, treated as not-yet-a-blocker) passes. */
export const ELIGIBILITY_FIELDS = [
  'elig_student_status', 'elig_working_hours', 'elig_location', 'elig_language',
  'elig_work_auth', 'elig_experience', 'elig_mandatory_tech',
];
export function eligibilityStatus(opp) {
  const vals = ELIGIBILITY_FIELDS.map(k => opp[k]).filter(Boolean);
  if (vals.some(v => v === 'no')) return 'FAIL';
  if (vals.some(v => v === 'unclear')) return 'REVIEW';
  return 'PASS';
}

/** brief §21: eligibility FAIL overrides the fit-based recommendation. */
export function recommendation(fitScore, eligStatus) {
  if (eligStatus === 'FAIL') return 'SKIP / REVIEW ELIGIBILITY';
  const cls = fitClassification(fitScore);
  if (!cls) return null;
  if (cls === 'A+ Exceptional') return 'APPLY STRONGLY';
  if (cls === 'A Strong')       return 'APPLY';
  if (cls === 'B Worth Applying') return 'APPLY SELECTIVELY';
  if (cls === 'C Selective')    return 'REVIEW';
  return 'SKIP';
}

/** brief §23: fit 55% + career_value dim 20% + interest 10% +
 *  networking dim 5% + deadline urgency 10%. Deadline urgency ramps from 0
 *  (30+ days out) to 100 (due today or overdue); an already-applied job's
 *  deadline no longer matters. Returns { score, label } or nulls if there's
 *  not enough data yet (no fit score at all). */
export function computePriority(opp) {
  const fitScore = computeFitScore(opp.fit_manual, opp.fit_ai);
  if (fitScore === null) return { score: null, label: null };

  const careerValue = effectiveRating(opp.fit_manual, opp.fit_ai, 'career_value');
  const networking  = effectiveRating(opp.fit_manual, opp.fit_ai, 'networking');
  const interest     = opp.interest;

  let deadlineUrgency = 0;
  if (opp.application_deadline && !opp.applied) {
    const days = Math.ceil((new Date(opp.application_deadline + 'T00:00:00') - new Date(localDateStr() + 'T00:00:00')) / 86400000);
    deadlineUrgency = days <= 0 ? 100 : Math.max(0, 100 - (days / 30) * 100);
  }

  const score =
    fitScore * 0.55 +
    (careerValue !== null ? (careerValue / 5) * 100 : fitScore) * 0.20 +
    (interest ? (interest / 5) * 100 : 50) * 0.10 +
    (networking !== null ? (networking / 5) * 100 : fitScore) * 0.05 +
    deadlineUrgency * 0.10;

  const rounded = Math.round(score);
  let label;
  if (rounded >= 80) label = 'P1 - Act Now';
  else if (rounded >= 60) label = 'P2 - High';
  else if (rounded >= 40) label = 'P3 - Normal';
  else if (rounded >= 20) label = 'P4 - Low';
  else label = 'Skip';

  return { score: rounded, label };
}

/** brief §32: overdue/due-soon/due-today/not-due for next_action_date. */
export function followUpStatus(nextActionDate) {
  if (!nextActionDate) return 'Not Due';
  const t = localDateStr();
  if (nextActionDate < t) return 'Overdue';
  if (nextActionDate === t) return 'Due Today';
  const days = Math.ceil((new Date(nextActionDate + 'T00:00:00') - new Date(t + 'T00:00:00')) / 86400000);
  return days <= 3 ? 'Due Soon' : 'Not Due';
}

export function jobRef(seq) {
  return 'JOB-' + String(seq).padStart(4, '0');
}

/** Bundles the five derived read-model columns on job_opportunities
 *  (fit_score, fit_classification, priority_score, priority_label,
 *  eligibility_status) into one payload, ready to spread into any update
 *  or insert. These are never the source of truth — every page still
 *  computes them fresh from fit_manual, fit_ai, interest, the elig_
 *  fields, application_deadline, and applied via the functions above —
 *  but persisting them means a future direct-SQL report or another tool
 *  doesn't need to reimplement this module's logic just to filter or sort
 *  by fit, priority, or eligibility.
 *  Call this with the FULL merged opportunity state (existing row plus
 *  the fields about to change), not just the changed fields, since
 *  priority depends on several of those inputs at once. */
export function computeDerivedFields(opp) {
  const fitScore = computeFitScore(opp.fit_manual, opp.fit_ai);
  const eligStatus = eligibilityStatus(opp);
  const priority = computePriority(opp);
  return {
    fit_score: fitScore,
    fit_classification: fitClassification(fitScore),
    eligibility_status: eligStatus,
    priority_score: priority.score,
    priority_label: priority.label,
  };
}

