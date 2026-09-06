/* ============================================================
   src/job-constants.js
   Single source of truth for every controlled vocabulary in the Job
   Search Command Center. Before this module existed, the stage list,
   employment types, sources, contact types, interview types etc. were
   each re-typed as inline <option> HTML in 3-5 different pages — always
   textually identical today, but one edit to just one copy (e.g. adding
   a new source) would have silently drifted the rest. Centralizing here
   also fixed a real inconsistency: the career-track <select> showed
   descriptive labels ("A — BD/Commercial") on job-opportunities.html but
   bare letters ("A") on job-opportunity.html's edit modal.
============================================================ */

export const STAGES = [
  ['discovered','Discovered'],['evaluating','Evaluating'],['preparing','Preparing'],
  ['ready_to_apply','Ready to Apply'],['applied','Applied'],['recruiter_screen','Recruiter Screen'],
  ['hiring_manager','Hiring Manager'],['assessment','Assessment'],['further_interview','Further Interview'],
  ['final_interview','Final Interview'],['offer','Offer'],['negotiation','Negotiation'],['accepted','Accepted'],
];
export const STAGE_LABEL = Object.fromEntries(STAGES);
export const STAGE_ORDER = STAGES.map(s => s[0]);

export const CAREER_TRACKS = [
  ['A','A — BD/Commercial'],['B','B — Analytics'],['C','C — Operations/SC'],['X','X — Opportunistic'],
];

export const EMPLOYMENT_TYPES = ['Werkstudent','Internship','Part-Time','Full-Time','Graduate Programme','Temporary','Freelance','Other'];

export const SOURCES = ['LinkedIn','Company Website','Referral','Recruiter','University','Indeed','StepStone','Bundesagentur fur Arbeit','Networking','Professor / Advisor','Agency','Other'];

export const CONTACT_TYPES = ['Recruiter','Hiring Manager','Employee','Alumni','Professor','Career Services','Agency Recruiter','Startup Contact','Former Colleague','Former Manager','Personal Contact','Other'];

export const RELATIONSHIP_STAGES = ['Cold','Identified','Contacted','Responded','Conversation','Warm','Referral Requested','Referral Offered','Referral Submitted','Long-Term Relationship'];

export const INTERVIEW_TYPES = ['Recruiter Screen','Hiring Manager','Behavioural','Technical','Case Study','Presentation','Panel','Final Interview','HR','Informal Conversation','Other'];

export const GERMAN_REQUIREMENTS = ['None','Preferred','A1','A2','B1','B2','C1','Fluent','Native'];

export const KNOWN_REASONS = ['No Response','Automatic Rejection','Experience Mismatch','German Requirement','Technical Skill Gap','Seniority','Location','Work Authorization','Availability','Salary','Recruiter Screen','Interview','Assessment','Internal Candidate','Role Cancelled','Role Filled','Unknown'];

export const ACTIVITY_TYPES = ['Application','LinkedIn Message','Email','Phone Call','Recruiter Call','Networking Meeting','Interview','Follow-up','Thank-you','Assessment','Offer Discussion','Rejection Feedback','Other'];

export const YES_NO_UNCLEAR = ['Yes','No','Unclear'];

export const QUESTION_TAGS = ['Leadership','Conflict','Failure','Teamwork','Analytics','Sales','Commercial','Technical','Motivation','Company','Salary','Availability','German','Visa','Behavioural','Case','Other'];

export const PREPARATION_STATUSES = [['not_started','Not Started'],['in_progress','In Progress'],['ready','Ready']];

/** `<option>` list for a flat array of plain strings (value === label). */
export function optionsHtml(list, selected = '') {
  return list.map(v => `<option ${v === selected ? 'selected' : ''}>${v}</option>`).join('');
}
/** `<option>` list for [value,label] pairs. */
export function valueLabelOptionsHtml(pairs, selected = '') {
  return pairs.map(([v, l]) => `<option value="${v}" ${v === selected ? 'selected' : ''}>${l}</option>`).join('');
}
