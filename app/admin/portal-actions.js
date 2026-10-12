"use server";
import { redirect } from "next/navigation";
import { requireAdmin, isAdmin } from "../../lib/supabase";
const UUID = /^[0-9a-f-]{36}$/;
const audit = (db, a, act, id, d = {}) => db.from("audit_log").insert({ actor: a, action: act, entity: "client", entity_id: id, detail: d });
export async function createPortalLogin(fd) {
  const { user, db } = await requireAdmin();
  const cid = String(fd.get("client_id")), email = String(fd.get("email") || "").trim().toLowerCase(), pw = String(fd.get("password") || "");
  const back = `/admin/clients/${cid}`; if (!UUID.test(cid)) return;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || pw.length < 10 || isAdmin({ email })) redirect(`${back}?e=invalid`);
  const { data, error } = await db.auth.admin.createUser({ email, password: pw, email_confirm: true });
  if (error) redirect(`${back}?e=${/already|registered/i.test(error.message) ? "exists" : "auth"}`);
  const ins = await db.from("client_users").insert({ user_id: data.user.id, client_id: cid, email });
  if (ins.error) { await db.auth.admin.deleteUser(data.user.id); redirect(`${back}?e=auth`); }
  await audit(db, user.email, "portal.create", cid, { email }); redirect(`${back}?saved=1`);
}
export async function resetPortalPassword(fd) {
  const { user, db } = await requireAdmin(); const uid = String(fd.get("user_id")), cid = String(fd.get("client_id")), pw = String(fd.get("password") || "");
  if (!UUID.test(uid) || !UUID.test(cid) || pw.length < 10) redirect(`/admin/clients/${cid}?e=invalid`);
  const { data: m } = await db.from("client_users").select("user_id").eq("user_id", uid).eq("client_id", cid).maybeSingle(); if (!m) redirect(`/admin/clients/${cid}?e=auth`);
  const { error } = await db.auth.admin.updateUserById(uid, { password: pw }); if (error) redirect(`/admin/clients/${cid}?e=auth`);
  await audit(db, user.email, "portal.reset", cid); redirect(`/admin/clients/${cid}?saved=1`);
}
export async function removePortalAccess(fd) {
  const { user, db } = await requireAdmin(); const uid = String(fd.get("user_id")), cid = String(fd.get("client_id"));
  if (!UUID.test(uid) || !UUID.test(cid)) return;
  const { data } = await db.from("client_users").delete().eq("user_id", uid).eq("client_id", cid).select("user_id");
  if (data?.length) { await db.auth.admin.deleteUser(uid); await audit(db, user.email, "portal.remove", cid); }
  redirect(`/admin/clients/${cid}?saved=1`);
}
export async function setPortalVisible(fd) {
  const { user, db } = await requireAdmin(); const id = String(fd.get("id")); if (!UUID.test(id)) return;
  await db.from("statements").update({ portal_visible: fd.get("on") === "1" }).eq("id", id);
  await db.from("audit_log").insert({ actor: user.email, action: "statement.portal", entity: "statement", entity_id: id, detail: { on: fd.get("on") === "1" } });
  redirect(`/admin/statements/${id}`);
}
