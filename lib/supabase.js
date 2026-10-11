import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const U = process.env.NEXT_PUBLIC_SUPABASE_URL, A = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, S = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const isAdmin = (u) => !!u?.email && (process.env.ADMIN_EMAILS || "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean).includes(u.email.toLowerCase());
export const configured = () => !!(U && A && S);
export const db = () => (U && S ? createClient(U, S, { auth: { persistSession: false } }) : null);
export async function authClient() {
  const c = await cookies();
  return createServerClient(U, A, { cookies: { getAll: () => c.getAll(), setAll(l) { try { l.forEach(({ name, value, options }) => c.set(name, value, options)); } catch {} } } });
}
// Every admin page and action calls this. The middleware is only a first gate.
export async function requireAdmin() {
  if (!configured()) redirect("/admin/login?e=config");
  const { data: { user } } = await (await authClient()).auth.getUser();
  if (!isAdmin(user)) redirect("/admin/login");
  return { user, db: db() };
}
