/**
 * Ambient type declarations for the Deno runtime.
 *
 * Supabase Edge Functions run on Deno, but VS Code's built-in TypeScript
 * server assumes Node — so `Deno.serve` / `Deno.env` show as "Cannot find
 * name 'Deno'" errors in the editor. This file declares the small surface
 * we actually use, which silences those false errors and gives `req` its
 * proper Request type.
 *
 * Editor-only — has zero effect on deployment (`supabase functions deploy`
 * uses the real Deno runtime types).
 */
declare const Deno: {
  serve(handler: (req: Request) => Response | Promise<Response>): void;
  env: {
    get(name: string): string | undefined;
  };
};
