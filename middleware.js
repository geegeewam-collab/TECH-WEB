import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
export async function middleware(req) {
  const p = req.nextUrl.pathname;
  if (p === "/admin/login") return NextResponse.next();
  const U = process.env.NEXT_PUBLIC_SUPABASE_URL, A = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const login = () => NextResponse.redirect(new URL("/admin/login", req.url));
  if (!U || !A) return login();
  let res = NextResponse.next({ request: req });
  const sb = createServerClient(U, A, { cookies: { getAll: () => req.cookies.getAll(), setAll(l) {
    l.forEach(({ name, value }) => req.cookies.set(name, value)); res = NextResponse.next({ request: req }); l.forEach(({ name, value, options }) => res.cookies.set(name, value, options)); } } });
  const { data: { user } } = await sb.auth.getUser();
  const ok = (process.env.ADMIN_EMAILS || "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean).includes((user?.email || "").toLowerCase());
  return ok ? res : login();
}
export const config = { matcher: ["/admin/:path*"] };
