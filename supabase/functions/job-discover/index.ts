// Supabase Edge Function — Job Discovery proxy (Bundesagentur für Arbeit)
//
// Called from job-discover.html. The BA "Jobsuche" API sends no CORS
// headers at all (verified with a real preflight request — no
// Access-Control-Allow-Origin), so a browser blocks it outright no
// matter how the frontend code is written. This function does the fetch
// server-side (no CORS restriction between two servers) and hands the
// browser back plain JSON.
//
// IMPORTANT: this is NOT an official, documented Bundesagentur für Arbeit
// API. It's a reverse-engineered integration maintained by a community
// project (github.com/bundesAPI/jobsuche-api), using an API key that was
// informally discovered and shared publicly — not one issued to us
// specifically. It works today with real, live data, but there's no
// support channel and no guarantee it keeps working; if it starts
// failing, that's the first thing to check, not a bug in this file.
//
// Verifies the caller is a logged-in admin before proxying anything.
//
// CORS: this function IS called cross-origin (the app is served from
// Cloudflare Pages, this from *.supabase.co), so — unlike a same-request
// gateway assumption — Supabase does NOT auto-answer the browser's OPTIONS
// preflight for us; it forwards it straight into this function like any
// other request. The first version of this file only accepted POST and
// returned a bare 405 with no CORS headers for anything else, which
// silently failed the preflight and broke every real browser call (curl
// doesn't enforce CORS, which is why that bug wasn't caught before
// deploy). Every response below — including errors — carries CORS_HEADERS.

import { createClient } from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL      = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const BA_API_KEY   = 'jobboerse-jobsuche';
const BA_BASE      = 'https://rest.arbeitsagentur.de/jobboerse/jobsuche-service';
const SEARCH_URL   = `${BA_BASE}/pc/v6/jobs`;
const DETAIL_URL   = (encodedRefnr: string) => `${BA_BASE}/pc/v4/jobdetails/${encodedRefnr}`;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function text(body: string, status = 200) {
  return new Response(body, { status, headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' } });
}
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
}

interface SearchBody {
  mode: 'search';
  was?: string;
  wo?: string;
  umkreis?: number;
  angebotsart?: number;   // 1=Arbeit, 2=Selbstaendigkeit, 4=Ausbildung, 34=Praktikum/Trainee
  arbeitszeit?: string;   // vz/tz/snw/ho/mj, semicolon-separated
  veroeffentlichtseit?: number; // days since posted, 0-100
  page?: number;
  size?: number;
}
interface DetailBody {
  mode: 'detail';
  refnr: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });
  if (req.method !== 'POST') return text('Method not allowed', 405);

  const authHeader = req.headers.get('Authorization') || '';
  const callerClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: userErr } = await callerClient.auth.getUser();
  if (userErr || !user) return text('Unauthorized', 401);
  const { data: isAdmin, error: adminErr } = await callerClient.rpc('is_admin');
  if (adminErr || !isAdmin) return text('Forbidden — admin only', 403);

  let body: SearchBody | DetailBody;
  try {
    body = await req.json();
  } catch {
    return text('Invalid JSON', 400);
  }

  try {
    if (body.mode === 'detail') {
      if (!body.refnr) return text('Missing refnr', 400);
      const encoded = btoa(body.refnr);
      const r = await fetch(DETAIL_URL(encoded), { headers: { 'X-API-Key': BA_API_KEY } });
      if (!r.ok) return json({ error: `BA API replied ${r.status}` }, 502);
      const detail = await r.json();
      return json({
        title: detail.stellenangebotsTitel ?? null,
        company: detail.firma ?? null,
        description: detail.stellenangebotsBeschreibung ?? null,
        location: detail.stellenlokationen?.[0]?.adresse?.ort ?? null,
        external_url: detail.externeUrl ?? null,
      });
    }

    if (body.mode === 'search') {
      const params = new URLSearchParams();
      if (body.was) params.set('was', body.was);
      if (body.wo) params.set('wo', body.wo);
      if (body.umkreis) params.set('umkreis', String(body.umkreis));
      if (body.angebotsart) params.set('angebotsart', String(body.angebotsart));
      if (body.arbeitszeit) params.set('arbeitszeit', body.arbeitszeit);
      if (body.veroeffentlichtseit != null) params.set('veroeffentlichtseit', String(body.veroeffentlichtseit));
      params.set('page', String(body.page || 1));
      params.set('size', String(body.size || 25));

      const r = await fetch(`${SEARCH_URL}?${params.toString()}`, { headers: { 'X-API-Key': BA_API_KEY } });
      if (!r.ok) return json({ error: `BA API replied ${r.status}` }, 502);
      const data = await r.json();
      const results = (data.ergebnisliste || []).map((j: Record<string, unknown>) => ({
        refnr: j.referenznummer,
        title: j.stellenangebotsTitel,
        company: j.firma,
        location: (j.stellenlokationen as Array<{ adresse?: { ort?: string; plz?: string } }> | undefined)?.[0]?.adresse?.ort ?? null,
        plz: (j.stellenlokationen as Array<{ adresse?: { ort?: string; plz?: string } }> | undefined)?.[0]?.adresse?.plz ?? null,
        published: j.datumErsteVeroeffentlichung ?? null,
        home_office: !!j.homeofficemoeglich,
        full_time: !!j.arbeitszeitVollzeit,
        distance_km: j.entfernung ?? null,
      }));
      // maxErgebnisse is the real total match count across all pages —
      // without it the frontend has no way to know whether 25 results
      // means "that's everything" or "there are 400 more."
      return json({ results, page: body.page || 1, total: Number(data.maxErgebnisse) || results.length });
    }

    return text('Missing or invalid mode', 400);
  } catch (e) {
    console.error('[job-discover]', e);
    return json({ error: 'Job search failed — the BA API may be unavailable right now' }, 502);
  }
});
