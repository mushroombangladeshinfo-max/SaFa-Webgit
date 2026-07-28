/* src/ai-client.js
   Shared BYO-key AI client — used by insights.html's AI Analyst and
   home.html's assistant. Every call goes straight from the browser to
   the provider; no backend, no server-held key, no per-message cost. */

export const AI_DEFAULTS = {
  ollama: { url: 'http://localhost:11434', model: 'llama3.2' },
  openai: { url: 'https://api.groq.com/openai', model: 'llama-3.1-8b-instant' },
};

export function loadAiCfg() {
  return JSON.parse(localStorage.getItem('safaAiCfg') || 'null')
      || { provider: 'openai', ...AI_DEFAULTS.openai, key: '' };
}

export function saveAiCfg(cfg) {
  localStorage.setItem('safaAiCfg', JSON.stringify(cfg));
}

/* Sends `messages` ([{role,content}]) to whichever provider `cfg` names,
   returns the assistant's reply text, or throws with a raw Error whose
   .message is provider-specific (see formatAiError for a friendly version). */
export async function chatComplete(cfg, messages) {
  if (cfg.provider === 'ollama') {
    const r = await fetch(`${cfg.url}/api/chat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: cfg.model, messages, stream: false }),
    });
    if (!r.ok) throw new Error(`Ollama replied ${r.status}`);
    const text = (await r.json()).message?.content;
    if (!text) throw new Error('Empty response');
    return text;
  }

  const r = await fetch(`${cfg.url}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.key}` },
    body: JSON.stringify({ model: cfg.model, messages }),
  });
  if (!r.ok) {
    const hint = r.status === 401 ? 'Invalid API key — check it was pasted correctly and saved.'
               : r.status === 429 ? 'Rate limited by the provider — wait a moment and try again.'
               : r.status === 404 ? `Model "${cfg.model}" not found at this endpoint — check the model name.`
               : `API replied ${r.status}.`;
    throw new Error(hint);
  }
  const text = (await r.json()).choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response');
  return text;
}

/* Returns markdown (**bold** headline) — pass through renderAiText() to render. */
export function formatAiError(cfg, err) {
  return cfg.provider === 'ollama'
    ? `**Couldn't reach Ollama.**\nChecklist:\n· Is Ollama running? (\`ollama serve\`)\n· Model pulled? (\`ollama pull ${cfg.model}\`)\n· CORS open? Run once: \`launchctl setenv OLLAMA_ORIGINS "*"\` then restart Ollama.\n\nError: ${err.message}`
    : `**Couldn't get a response.**\n${err.message}`;
}

/* Escape HTML, then allow **bold** only — matches the AI Analyst's report
   rendering. Callers should keep white-space:pre-wrap on the container so
   newlines in the model's reply render without extra <br> handling here. */
export function renderAiText(text) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
