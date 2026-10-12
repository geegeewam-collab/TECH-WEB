import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
export async function middleware(req) {
  const p = req.nextUrl.pathname, portal = p.startsWith("/portal");
  if (p === "/admin/login" || p === "/portal/login") return NextResponse.next();
  const U = process.env.NEXT_PUBLIC_SUPABASE_URL, A = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const login = () => NextResponse.redirect(new URL(portal ? "/portal/login" : "/admin/login", req.url));
  if (!U || !A) return login();
  let res = NextResponse.next({ request: req });
  const sb = createServerClient(U, A, { cookies: { getAll: () => req.cookies.getAll(), setAll(l) {
    l.forEach(({ name, value }) => req.cookies.set(name, value)); res = NextResponse.next({ request: req }); l.forEach(({ name, value, options }) => res.cookies.set(name, value, options)); } } });
  const { data: { user } } = await sb.auth.getUser(); // first gate only; pages re-check on the server
  if (!user) return login();
  if (!portal) { const ok = (process.env.ADMIN_EMAILS || "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean).includes((user.email || "").toLowerCase()); if (!ok) return login(); }
  return res;
}
export const config = { matcher: ["/admin/:path*", "/portal/:path*"] };
