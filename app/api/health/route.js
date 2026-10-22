import { db } from "../../../lib/supabase";
export const dynamic = "force-dynamic";
// Setup check for the owner. It reports what is configured, never the values themselves.
export async function GET() {
  const U = process.env.NEXT_PUBLIC_SUPABASE_URL, A = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const out = { supabase_url: "missing", anon_key: A ? "set" : "missing", service_key: process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : "missing", admin_emails: (process.env.ADMIN_EMAILS || "").split(",").filter((s) => s.trim()).length + " address(es)", site_url: process.env.NEXT_PUBLIC_SITE_URL ? "set" : "missing", database: "not checked", tables: {} };
  if (U) { try { const u = new URL(U); out.supabase_url = u.protocol === "https:" && u.hostname.endsWith(".supabase.co") && u.pathname === "/" ? "ok" : "looks wrong: use the Project URL, like https://abcd.supabase.co"; } catch { out.supabase_url = "not a valid URL"; } }
  if (out.supabase_url === "ok" && A) { try { const r = await fetch(`${U}/auth/v1/settings`, { headers: { apikey: A } }); out.anon_key = r.ok ? "set and accepted by Supabase" : `set but Supabase rejected it (HTTP ${r.status})`; } catch { out.anon_key = "set, but Supabase could not be reached"; } }
  const d = db();
  if (d) { for (const t of ["leads", "clients", "proposals", "invoices", "payments", "statements", "settings", "email_log", "client_users"]) { const { error } = await d.from(t).select("*", { head: true, count: "exact" }).limit(1); out.tables[t] = error ? `problem (${error.code || error.message})` : "ok"; }
    out.database = Object.values(out.tables).every((v) => v === "ok") ? "ok" : "some tables are missing or the service key is wrong: run supabase/setup.sql and check the service key"; }
  return Response.json(out, { headers: { "Cache-Control": "no-store" } });
}
