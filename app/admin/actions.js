"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authClient, requireAdmin, isAdmin } from "../../lib/supabase";
import { STATUSES } from "../../lib/leads.mjs";
export async function login(_, fd) {
  const sb = await authClient();
  const { data, error } = await sb.auth.signInWithPassword({ email: String(fd.get("email") || "").trim(), password: String(fd.get("password") || "") });
  if (error || !isAdmin(data.user)) { if (!error) await sb.auth.signOut(); return { error: "Sign-in failed. Check your email and password." }; }
  redirect("/admin");
}
export async function logout() { await (await authClient()).auth.signOut(); redirect("/admin/login"); }
export async function updateLead(fd) {
  const { user, db } = await requireAdmin();
  const id = String(fd.get("id")), status = String(fd.get("status")), fu = String(fd.get("follow_up_on") || "");
  if (!/^[0-9a-f-]{36}$/.test(id) || !STATUSES[status]) return;
  const patch = { status, follow_up_on: /^\d{4}-\d{2}-\d{2}$/.test(fu) ? fu : null, notes: String(fd.get("notes") || "").slice(0, 5000) };
  if (fd.get("contacted")) patch.last_contacted_at = new Date().toISOString();
  const { error } = await db.from("leads").update(patch).eq("id", id);
  if (error) { console.error("lead update failed", error.code); redirect(`/admin/leads/${id}?e=1`); }
  await db.from("audit_log").insert({ actor: user.email, action: "lead.update", entity: "lead", entity_id: id, detail: { status } });
  revalidatePath("/admin", "layout");
  redirect(`/admin/leads/${id}?saved=1`);
}
