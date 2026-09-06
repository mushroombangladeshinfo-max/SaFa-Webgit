const d=8,f=6e4,c='{"status":"ask_more"|"ready_for_confirmation","profileCompleteness":0-100,"careerIntentConfidence":"low"|"medium"|"high","diagnostic":{"currentPositioning":string,"likelySeniority":string,"cvQualityScore":0-100,"realismAssessment":string,"strongestAssets":[string],"weaknesses":[{"issue":string,"severity":"high"|"medium"|"low","whyItMatters":string,"recommendedAction":string}],"contradictions":[string],"missingEvidence":[string],"targetAlignment":[{"role":string,"alignment":0-100,"rationale":string,"majorGap":string}]},"profileDraft":{"professionalHeadline":string,"primaryTargetRole":string,"secondaryTargetRoles":[string],"employmentTypes":[string],"targetLocations":[string],"workModePreferences":[string],"careerPriorities":[string],"constraints":[string],"education":[string],"experienceEvidence":[{"claim":string,"evidence":string,"status":"verified"|"inferred"|"unknown"}],"projects":[{"claim":string,"evidence":string,"status":"verified"|"inferred"|"unknown"}],"skills":[{"name":string,"evidence":string,"status":"verified"|"inferred"|"unknown","strength":"strong"|"moderate"|"limited"|"unknown"}],"languages":[{"language":string,"level":string,"practicalUse":string,"status":"verified"|"inferred"|"unknown"}],"verifiedFacts":[string],"inferredInsights":[string],"unknowns":[string]},"strategyDraft":{"recommendedPrimaryPath":string,"secondaryPath":string,"roleSearchAllocation":[string],"immediatePriorities":[string],"avoidForNow":[string]},"nextQuestion":null|{"id":string,"category":"career_objective"|"employment"|"geography"|"language"|"evidence"|"constraint"|"priority"|"other","question":string,"whyItMatters":string,"importance":1-5,"answerType":"free_text"|"single_choice"|"multi_choice"|"yes_no","options":[string]}}',s=`NON-NEGOTIABLE RULES:
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
11. Output ONLY a single JSON object matching exactly this shape (no markdown, no commentary): ${c}`;function l(){return`You are a critical career diagnostician, evidence auditor, and job-search strategist. The user has pasted a CV/background and may have supplied initial career intent. Your job is NOT to flatter them and NOT to rewrite anything yet — first determine what the text actually proves and what the user appears to want, then decide whether one clarification question is necessary before a reliable career profile can be confirmed.

${s}

QUESTION PRIORITY: importance 5 = answer can change target/eligibility/core positioning. importance 4 = materially changes CV/job strategy. importance 3 = useful but not blocking. Do not ask importance 1-2 questions during onboarding.`}function u(){return`You are continuing an adaptive career diagnostic. You receive the previous diagnostic result plus the user's verified answers so far — update the profile carefully, do not restart from scratch.

${s}

ADDITIONALLY: every explicit user answer becomes verified evidence. Resolve any contradiction the new answer settles. Do not repeat a question already answered. Prefer stopping over asking a low-value question — when the profile is decision-ready, set status="ready_for_confirmation". If the user couldn't answer something, preserve it as unknown rather than asking again.`}function g(){return`You are applying a user-provided correction to a career diagnostic that was ready for confirmation (or close to it). Treat the correction as verified evidence that overrides any conflicting earlier inference — do not preserve an inference that conflicts with an explicit correction.

${s}

ADDITIONALLY: usually return status="ready_for_confirmation" after applying the correction. Ask one new question only if the correction creates a genuinely material ambiguity that cannot safely remain unknown.`}function o(i){const e=Object.entries(i||{}).filter(([,n])=>n);return e.length?e.map(([n,t])=>`${n}: ${t}`).join(`
`):"(none supplied)"}function h({cvText:i,initialIntent:e}){return[{role:"system",content:l()},{role:"user",content:`INITIAL USER INTENT (may be incomplete):
${o(e)}

CV / BACKGROUND TEXT:
${i}

TASK:
Perform the first critical CV + career-intent diagnostic. Build a conservative profile draft and strategy draft. If one material ambiguity remains, ask the single highest-impact clarification question. Otherwise mark it ready for user confirmation.`}]}function p({initialIntent:i,previousResult:e,answers:n,questionLimitReached:t}){const a=n[n.length-1];return[{role:"system",content:u()},{role:"user",content:`INITIAL USER INTENT:
${o(i)}

PREVIOUS DIAGNOSTIC RESULT:
${JSON.stringify(e)}

VERIFIED ANSWERS SO FAR:
${JSON.stringify(n)}

LATEST ANSWER:
Question: ${a?.question}
Answer: ${a?.answer}

QUESTION LIMIT:
${n.length}/8 questions answered.${t?" The limit has been reached — do not ask another question; preserve remaining uncertainty and return ready_for_confirmation.":" Ask another question only if it is materially necessary."}

TASK:
Update the diagnostic, profile draft, and strategy draft using the verified answer, then either ask ONE new high-impact question or mark ready for confirmation.`}]}function m({initialIntent:i,previousResult:e,answers:n,correction:t}){return[{role:"system",content:g()},{role:"user",content:`INITIAL USER INTENT:
${o(i)}

PREVIOUS DIAGNOSTIC RESULT:
${JSON.stringify(e)}

ALL VERIFIED ANSWERS / CORRECTIONS SO FAR:
${JSON.stringify(n)}

LATEST USER CORRECTION:
${t}

TASK:
Apply this correction as verified evidence and update the diagnostic, profile draft, and strategy draft accordingly.`}]}function y(i,{forceReady:e=!1}={}){return(e||i.status==="ask_more"&&!i.nextQuestion)&&(i.status="ready_for_confirmation"),i.status==="ready_for_confirmation"&&(i.nextQuestion=null),i}function v(i){return String(i||"").replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,"[EMAIL REDACTED]").replace(/(?:\+?\d[\d\s()./-]{7,}\d)/g,"[PHONE REDACTED]").replace(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s]+/gi,"[LINKEDIN URL REDACTED]").trim()}const r={verified:"Verified",inferred:"Inferred",unknown:"Unknown"};function T(i){const e=i;if(!e)return null;const n=[];return e.professionalHeadline&&n.push(`Headline: ${e.professionalHeadline}`),e.primaryTargetRole&&n.push(`Primary target role: ${e.primaryTargetRole}`),e.secondaryTargetRoles?.length&&n.push(`Secondary target roles: ${e.secondaryTargetRoles.join(", ")}`),e.employmentTypes?.length&&n.push(`Employment types: ${e.employmentTypes.join(", ")}`),e.targetLocations?.length&&n.push(`Target locations: ${e.targetLocations.join(", ")}`),e.workModePreferences?.length&&n.push(`Work mode preferences: ${e.workModePreferences.join(", ")}`),e.careerPriorities?.length&&n.push(`Career priorities: ${e.careerPriorities.join(", ")}`),e.constraints?.length&&n.push(`Constraints: ${e.constraints.join(", ")}`),e.education?.length&&n.push(`Education: ${e.education.join("; ")}`),e.experienceEvidence?.length&&(n.push("Experience:"),e.experienceEvidence.forEach(t=>n.push(`- [${r[t.status]||t.status}] ${t.claim} — ${t.evidence}`))),e.projects?.length&&(n.push("Projects:"),e.projects.forEach(t=>n.push(`- [${r[t.status]||t.status}] ${t.claim} — ${t.evidence}`))),e.skills?.length&&(n.push("Skills:"),e.skills.forEach(t=>n.push(`- ${t.name} [${r[t.status]||t.status}, ${t.strength} evidence] ${t.evidence?"— "+t.evidence:""}`))),e.languages?.length&&(n.push("Languages:"),e.languages.forEach(t=>n.push(`- ${t.language}: ${t.level} [${r[t.status]||t.status}]${t.practicalUse?" — "+t.practicalUse:""}`))),e.verifiedFacts?.length&&n.push(`Other verified facts: ${e.verifiedFacts.join("; ")}`),e.inferredInsights?.length&&n.push(`AI-inferred positioning (not stated fact): ${e.inferredInsights.join("; ")}`),e.unknowns?.length&&n.push(`Known unknowns: ${e.unknowns.join("; ")}`),n.join(`
`)||null}export{f as M,d as a,h as b,p as c,m as d,y as e,v as m,T as s};
