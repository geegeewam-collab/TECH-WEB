"use server";
import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { requireAdmin } from "../../lib/supabase";
import { parseItems, buildSnapshot } from "../../lib/proposals.mjs";
import { toMinor, lineTotal, dec } from "../../lib/money.mjs";
const UUID = /^[0-9a-f-]{36}$/, f = (fd, k, n) => String(fd.get(k) || "").trim().slice(0, n);
const audit = (db, actor, action, id, detail = {}) => db.from("audit_log").insert({ actor, action, entity: "proposal", entity_id: id, detail });
export async function createClient(fd) {
  const { user, db } = await requireAdmin();
  const name = f(fd, "name", 160), email = f(fd, "email", 160).toLowerCase(), lead = f(fd, "lead_id", 40);
  if (!name) redirect("/admin/clients?e=name");
  const { data, error } = await db.from("clients").insert({ name, contact_name: f(fd, "contact_name", 120) || null, email: email || null, phone: f(fd, "phone", 40) || null, address: f(fd, "address", 300) || null, lead_id: UUID.test(lead) ? lead : null }).select("id").single();
  if (error) redirect(`/admin/clients?e=${error.code === "23505" ? "dup" : "save"}`);
  await db.from("audit_log").insert({ actor: user.email, action: "client.create", entity: "client", entity_id: data.id });
  redirect(`/admin/proposals/new?client=${data.id}`);
}
export async function saveProposal(fd) {
  const { user, db } = await requireAdmin();
  const id = f(fd, "id", 40), vu = f(fd, "valid_until", 10), back = id ? `/admin/proposals/${id}` : "/admin/proposals/new";
  const base = { client_id: f(fd, "client_id", 40), title: f(fd, "title", 200), summary: f(fd, "summary", 3000) || null, scope: f(fd, "scope", 6000) || null, deliverables: f(fd, "deliverables", 4000) || null, exclusions: f(fd, "exclusions", 3000) || null, payment_terms: f(fd, "payment_terms", 2000) || null, terms: f(fd, "terms", 6000) || null, valid_until: /^\d{4}-\d{2}-\d{2}$/.test(vu) ? vu : null, updated_at: new Date().toISOString() };
  const { items, errors } = parseItems(fd);
  if (!UUID.test(base.client_id) || !base.title || errors.length) redirect(`${back}?e=invalid`);
  let pid = id;
  if (id) {
    const { data, error } = await db.from("proposals").update(base).eq("id", id).eq("status", "draft").select("id");
    if (error || !data?.length) redirect(`${back}?e=locked`);
  } else {
    const lead = f(fd, "lead_id", 40);
    const { data, error } = await db.from("proposals").insert({ ...base, lead_id: UUID.test(lead) ? lead : null }).select("id").single();
    if (error) redirect(`${back}?e=save`);
    pid = data.id;
  }
  const r = await db.rpc("replace_items", { pid, items });
  if (r.error) { console.error("replace_items failed", r.error.code); redirect(`/admin/proposals/${pid}?e=save`); }
  await audit(db, user.email, id ? "proposal.update" : "proposal.create", pid);
  redirect(`/admin/proposals/${pid}?saved=1`);
}
export async function sendProposal(fd) {
  const { user, db } = await requireAdmin();
  const id = f(fd, "id", 40); if (!UUID.test(id)) return;
  const { data: p } = await db.from("proposals").select("*, clients(*), proposal_items(*)").eq("id", id).maybeSingle();
  if (!p || p.status !== "draft") redirect(`/admin/proposals/${id}?e=locked`);
  const rows = [...p.proposal_items].sort((a, b) => a.position - b.position);
  if (!rows.length) redirect(`/admin/proposals/${id}?e=noitems`);
  const parsed = rows.map((r) => { const q = toMinor(String(r.quantity)), pr = toMinor(String(r.unit_price)); return { description: r.description, quantity: dec(q), unit_price: dec(pr), total: dec(lineTotal(q, pr)) }; });
  const version = p.version + 1, token = p.token || randomBytes(24).toString("base64url");
  const snap = await db.from("proposal_versions").insert({ proposal_id: id, version, snapshot: buildSnapshot({ ...p, version }, p.clients, parsed) });
  if (snap.error) redirect(`/admin/proposals/${id}?e=save`);
  const up = await db.from("proposals").update({ status: "sent", version, token, sent_at: new Date().toISOString() }).eq("id", id).eq("status", "draft").eq("version", p.version).select("id");
  if (up.error || !up.data?.length) { await db.from("proposal_versions").delete().eq("proposal_id", id).eq("version", version); redirect(`/admin/proposals/${id}?e=locked`); }
  await audit(db, user.email, "proposal.send", id, { version });
  redirect(`/admin/proposals/${id}?sent=1`);
}
export async function changeStatus(fd) {
  const { user, db } = await requireAdmin();
  const id = f(fd, "id", 40), act = f(fd, "act", 20); if (!UUID.test(id)) return;
  const now = new Date().toISOString();
  const plans = { withdraw: [["draft", "sent"], { status: "withdrawn" }], revise: [["sent", "declined", "withdrawn"], { status: "draft" }],
    accept: [["sent"], { status: "accepted", decided_at: now, decided_method: "manual", decided_by: `Recorded by ${user.email}` }],
    decline: [["sent"], { status: "declined", decided_at: now, decided_method: "manual", decided_by: `Recorded by ${user.email}` }] };
  const plan = plans[act]; if (!plan) return;
  let q = db.from("proposals").update(plan[1]).eq("id", id).in("status", plan[0]);
  if (act === "accept" || act === "decline") q = q.select("id,version"); else q = q.select("id");
  const { data } = await q;
  if (!data?.length) redirect(`/admin/proposals/${id}?e=locked`);
  if (data[0].version && (act === "accept" || act === "decline")) await db.from("proposals").update({ decided_version: data[0].version }).eq("id", id);
  await audit(db, user.email, `proposal.${act}`, id, { method: "manual" });
  redirect(`/admin/proposals/${id}?saved=1`);
}
