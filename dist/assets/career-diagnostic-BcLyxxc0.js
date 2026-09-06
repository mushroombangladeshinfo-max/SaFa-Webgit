const m=8,y=6e4,u='{"status":"ask_more"|"ready_for_confirmation","profileCompleteness":0-100,"careerIntentConfidence":"low"|"medium"|"high","diagnostic":{"currentPositioning":string,"likelySeniority":string,"cvQualityScore":0-100,"realismAssessment":string,"strongestAssets":[string],"weaknesses":[{"issue":string,"severity":"high"|"medium"|"low","whyItMatters":string,"recommendedAction":string}],"contradictions":[string],"missingEvidence":[string],"targetAlignment":[{"role":string,"alignment":0-100,"rationale":string,"majorGap":string}]},"profileDraft":{"professionalHeadline":string,"primaryTargetRole":string,"secondaryTargetRoles":[string],"employmentTypes":[string],"targetLocations":[string],"workModePreferences":[string],"careerPriorities":[string],"constraints":[string],"education":[string],"experienceEvidence":[{"claim":string,"evidence":string,"status":"verified"|"inferred"|"unknown"}],"projects":[{"claim":string,"evidence":string,"status":"verified"|"inferred"|"unknown"}],"skills":[{"name":string,"evidence":string,"status":"verified"|"inferred"|"unknown","strength":"strong"|"moderate"|"limited"|"unknown"}],"languages":[{"language":string,"level":string,"practicalUse":string,"status":"verified"|"inferred"|"unknown"}],"verifiedFacts":[string],"inferredInsights":[string],"unknowns":[string]},"strategyDraft":{"recommendedPrimaryPath":string,"secondaryPath":string,"roleSearchAllocation":[string],"immediatePriorities":[string],"avoidForNow":[string]},"nextQuestion":null|{"id":string,"category":"career_objective"|"employment"|"geography"|"language"|"evidence"|"constraint"|"priority"|"other","question":string,"whyItMatters":string,"importance":1-5,"answerType":"free_text"|"single_choice"|"multi_choice"|"yes_no","options":[string]}}',c=`NON-NEGOTIABLE RULES:
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
11. Output ONLY a single JSON object matching exactly this shape (no markdown, no commentary): ${u}`;function f(){return`You are a critical career diagnostician, evidence auditor, and job-search strategist. The user has pasted a CV/background and may have supplied initial career intent. Your job is NOT to flatter them and NOT to rewrite anything yet — first determine what the text actually proves and what the user appears to want, then decide whether one clarification question is necessary before a reliable career profile can be confirmed.

${c}

QUESTION PRIORITY: importance 5 = answer can change target/eligibility/core positioning. importance 4 = materially changes CV/job strategy. importance 3 = useful but not blocking. Do not ask importance 1-2 questions during onboarding.`}function d(){return`You are continuing an adaptive career diagnostic. You receive the previous diagnostic result plus the user's verified answers so far — update the profile carefully, do not restart from scratch.

${c}

ADDITIONALLY: every explicit user answer becomes verified evidence. Resolve any contradiction the new answer settles. Do not repeat a question already answered. Prefer stopping over asking a low-value question — when the profile is decision-ready, set status="ready_for_confirmation". If the user couldn't answer something, preserve it as unknown rather than asking again.`}function p(){return`You are applying a user-provided correction to a career diagnostic that was ready for confirmation (or close to it). Treat the correction as verified evidence that overrides any conflicting earlier inference — do not preserve an inference that conflicts with an explicit correction.

${c}

ADDITIONALLY: usually return status="ready_for_confirmation" after applying the correction. Ask one new question only if the correction creates a genuinely material ambiguity that cannot safely remain unknown.`}function l(n){const e=Object.entries(n||{}).filter(([,t])=>t);return e.length?e.map(([t,i])=>`${t}: ${i}`).join(`
`):"(none supplied)"}function T({cvText:n,initialIntent:e}){return[{role:"system",content:f()},{role:"user",content:`INITIAL USER INTENT (may be incomplete):
${l(e)}

CV / BACKGROUND TEXT:
${n}

TASK:
Perform the first critical CV + career-intent diagnostic. Build a conservative profile draft and strategy draft. If one material ambiguity remains, ask the single highest-impact clarification question. Otherwise mark it ready for user confirmation.`}]}function v({initialIntent:n,previousResult:e,answers:t,questionLimitReached:i}){const o=t[t.length-1];return[{role:"system",content:d()},{role:"user",content:`INITIAL USER INTENT:
${l(n)}

PREVIOUS DIAGNOSTIC RESULT:
${JSON.stringify(e)}

VERIFIED ANSWERS SO FAR:
${JSON.stringify(t)}

LATEST ANSWER:
Question: ${o?.question}
Answer: ${o?.answer}

QUESTION LIMIT:
${t.length}/8 questions answered.${i?" The limit has been reached — do not ask another question; preserve remaining uncertainty and return ready_for_confirmation.":" Ask another question only if it is materially necessary."}

TASK:
Update the diagnostic, profile draft, and strategy draft using the verified answer, then either ask ONE new high-impact question or mark ready for confirmation.`}]}function A({initialIntent:n,previousResult:e,answers:t,correction:i}){return[{role:"system",content:p()},{role:"user",content:`INITIAL USER INTENT:
${l(n)}

PREVIOUS DIAGNOSTIC RESULT:
${JSON.stringify(e)}

ALL VERIFIED ANSWERS / CORRECTIONS SO FAR:
${JSON.stringify(t)}

LATEST USER CORRECTION:
${i}

TASK:
Apply this correction as verified evidence and update the diagnostic, profile draft, and strategy draft accordingly.`}]}function r(n){return Array.isArray(n)?n:[]}function s(n){return n&&typeof n=="object"&&!Array.isArray(n)?n:{}}function g(n,e,t,i){const o=Number(n);return Number.isFinite(o)?Math.min(i,Math.max(t,o)):e}function h(n){if(n=s(n),n.diagnostic=s(n.diagnostic),n.diagnostic.strongestAssets=r(n.diagnostic.strongestAssets),n.diagnostic.weaknesses=r(n.diagnostic.weaknesses).map(s),n.diagnostic.contradictions=r(n.diagnostic.contradictions),n.diagnostic.missingEvidence=r(n.diagnostic.missingEvidence),n.diagnostic.targetAlignment=r(n.diagnostic.targetAlignment).map(s),n.profileDraft=s(n.profileDraft),["secondaryTargetRoles","employmentTypes","targetLocations","workModePreferences","careerPriorities","constraints","education","verifiedFacts","inferredInsights","unknowns"].forEach(e=>{n.profileDraft[e]=r(n.profileDraft[e])}),["experienceEvidence","projects","skills","languages"].forEach(e=>{n.profileDraft[e]=r(n.profileDraft[e]).map(s)}),n.strategyDraft=s(n.strategyDraft),["roleSearchAllocation","immediatePriorities","avoidForNow"].forEach(e=>{n.strategyDraft[e]=r(n.strategyDraft[e])}),n.profileCompleteness=g(n.profileCompleteness,0,0,100),["low","medium","high"].includes(n.careerIntentConfidence)||(n.careerIntentConfidence="low"),n.nextQuestion&&typeof n.nextQuestion=="object"&&!Array.isArray(n.nextQuestion)){const e=n.nextQuestion;e.category=typeof e.category=="string"?e.category:"other",e.question=typeof e.question=="string"?e.question:"",e.whyItMatters=typeof e.whyItMatters=="string"?e.whyItMatters:"",e.importance=g(e.importance,3,1,5),e.answerType=["free_text","single_choice","multi_choice","yes_no"].includes(e.answerType)?e.answerType:"free_text",e.options=r(e.options)}else n.nextQuestion=null;return["ask_more","ready_for_confirmation"].includes(n.status)||(n.status=n.nextQuestion?"ask_more":"ready_for_confirmation"),n}function w(n,{forceReady:e=!1}={}){return n=h(n),(e||n.status==="ask_more"&&!n.nextQuestion)&&(n.status="ready_for_confirmation"),n.status==="ready_for_confirmation"&&(n.nextQuestion=null),n}function I(n){return String(n||"").replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,"[EMAIL REDACTED]").replace(/(?:\+?\d[\d\s()./-]{7,}\d)/g,"[PHONE REDACTED]").replace(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s]+/gi,"[LINKEDIN URL REDACTED]").trim()}const a={verified:"Verified",inferred:"Inferred",unknown:"Unknown"};function E(n){const e=n;if(!e)return null;const t=[];return e.professionalHeadline&&t.push(`Headline: ${e.professionalHeadline}`),e.primaryTargetRole&&t.push(`Primary target role: ${e.primaryTargetRole}`),e.secondaryTargetRoles?.length&&t.push(`Secondary target roles: ${e.secondaryTargetRoles.join(", ")}`),e.employmentTypes?.length&&t.push(`Employment types: ${e.employmentTypes.join(", ")}`),e.targetLocations?.length&&t.push(`Target locations: ${e.targetLocations.join(", ")}`),e.workModePreferences?.length&&t.push(`Work mode preferences: ${e.workModePreferences.join(", ")}`),e.careerPriorities?.length&&t.push(`Career priorities: ${e.careerPriorities.join(", ")}`),e.constraints?.length&&t.push(`Constraints: ${e.constraints.join(", ")}`),e.education?.length&&t.push(`Education: ${e.education.join("; ")}`),e.experienceEvidence?.length&&(t.push("Experience:"),e.experienceEvidence.forEach(i=>t.push(`- [${a[i.status]||i.status}] ${i.claim} — ${i.evidence}`))),e.projects?.length&&(t.push("Projects:"),e.projects.forEach(i=>t.push(`- [${a[i.status]||i.status}] ${i.claim} — ${i.evidence}`))),e.skills?.length&&(t.push("Skills:"),e.skills.forEach(i=>t.push(`- ${i.name} [${a[i.status]||i.status}, ${i.strength} evidence] ${i.evidence?"— "+i.evidence:""}`))),e.languages?.length&&(t.push("Languages:"),e.languages.forEach(i=>t.push(`- ${i.language}: ${i.level} [${a[i.status]||i.status}]${i.practicalUse?" — "+i.practicalUse:""}`))),e.verifiedFacts?.length&&t.push(`Other verified facts: ${e.verifiedFacts.join("; ")}`),e.inferredInsights?.length&&t.push(`AI-inferred positioning (not stated fact): ${e.inferredInsights.join("; ")}`),e.unknowns?.length&&t.push(`Known unknowns: ${e.unknowns.join("; ")}`),t.join(`
`)||null}export{y as M,m as a,T as b,v as c,A as d,w as e,I as m,E as s};
