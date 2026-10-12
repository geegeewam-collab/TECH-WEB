"use server";
import { redirect } from "next/navigation";
import { authClient, db } from "../../lib/supabase";
export async function portalLogin(_, fd) {
  const fail = { error: "Sign-in failed. Check your email and password, or ask us to reset your login." };
  const sb = await authClient();
  const { data, error } = await sb.auth.signInWithPassword({ email: String(fd.get("email") || "").trim(), password: String(fd.get("password") || "") });
  if (error) return fail;
  const d = db(), { data: m } = d ? await d.from("client_users").select("client_id").eq("user_id", data.user.id).maybeSingle() : {};
  if (!m) { await sb.auth.signOut(); return fail; }
  redirect("/portal");
}
export async function portalLogout() { await (await authClient()).auth.signOut(); redirect("/portal/login"); }
export async function changePassword(_, fd) {
  const sb = await authClient(), { data: { user } } = await sb.auth.getUser(), next = String(fd.get("next") || "");
  if (!user) return { error: "Please sign in again." };
  if (next.length < 10) return { error: "Use at least 10 characters." };
  const chk = await sb.auth.signInWithPassword({ email: user.email, password: String(fd.get("current") || "") });
  if (chk.error) return { error: "Your current password is not correct." };
  const { error } = await sb.auth.updateUser({ password: next });
  return error ? { error: "Could not change the password. Try again." } : { ok: true };
}
