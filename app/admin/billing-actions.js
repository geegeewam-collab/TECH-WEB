"use server";
import { redirect } from "next/navigation";
import { requireAdmin } from "../../lib/supabase";
import { brand } from "../../lib/settings";
import { toMinor, lineTotal, dec, sum } from "../../lib/money.mjs";
import { pctOf, allocatedPaid } from "../../lib/billing.mjs";
import { parseItems } from "../../lib/proposals.mjs";
const UUID = /^[0-9a-f-]{36}$/, DATE = /^\d{4}-\d{2}-\d{2}$/;
const aud = (db, a, act, entity, id, d = {}) => db.from("audit_log").insert({ actor: a, action: act, entity, entity_id: id, detail: d });
const totalOf = (rows) => sum(rows.map((r) => lineTotal(toMinor(String(r.quantity)), toMinor(String(r.unit_price)))));
export async function createProject(fd) {
  const { user, db } = await requireAdmin(); const id = String(fd.get("id")); if (!UUID.test(id)) return;
  const { data: p } = await db.from("proposals").select("id,title,client_id,status").eq("id", id).maybeSingle();
  if (!p || p.status !== "accepted") redirect(`/admin/proposals/${id}?e=locked`);
  const { data, error } = await db.from("projects").insert({ client_id: p.client_id, proposal_id: p.id, title: p.title }).select("id").single();
  if (error) { const { data: ex } = await db.from("projects").select("id").eq("proposal_id", id).maybeSingle(); redirect(ex ? `/admin/projects/${ex.id}` : `/admin/proposals/${id}?e=save`); }
  await aud(db, user.email, "project.create", "project", data.id, { proposal: id });
  redirect(`/admin/projects/${data.id}`);
}
export async function updateProject(fd) {
  const { user, db } = await requireAdmin(); const id = String(fd.get("id")), st = String(fd.get("status"));
  if (!UUID.test(id) || !["planned", "in_progress", "awaiting_client", "on_hold", "completed", "cancelled"].includes(st)) return;
  const { error } = await db.from("projects").update({ status: st, notes: String(fd.get("notes") || "").slice(0, 5000) }).eq("id", id);
  if (error) redirect(`/admin/projects/${id}?e=1`);
  await aud(db, user.email, "project.update", "project", id, { status: st }); redirect(`/admin/projects/${id}?saved=1`);
}
export async function addUpdate(fd) {
  const { user, db } = await requireAdmin(); const id = String(fd.get("id")), body = String(fd.get("body") || "").trim().slice(0, 2000);
  if (!UUID.test(id) || !body) redirect(`/admin/projects/${id}?e=1`);
  const { error } = await db.from("project_updates").insert({ project_id: id, body, visible_to_client: !!fd.get("visible") });
  if (error) redirect(`/admin/projects/${id}?e=1`);
  await aud(db, user.email, "project.note", "project", id); redirect(`/admin/projects/${id}?saved=1`);
}
export async function createInvoice(fd) {
  const { user, db } = await requireAdmin(); const id = String(fd.get("id")), pct = parseInt(String(fd.get("pct") || "100"), 10); if (!UUID.test(id)) return;
  const back = `/admin/proposals/${id}`; if (!(pct >= 1 && pct <= 100)) redirect(`${back}?e=invalid`);
  const { data: p } = await db.from("proposals").select("id,number,title,status,client_id,currency,proposal_items(quantity,unit_price,description,position)").eq("id", id).maybeSingle();
  if (!p || p.status !== "accepted") redirect(`${back}?e=locked`);
  const rows = [...p.proposal_items].sort((a, b) => a.position - b.position), total = totalOf(rows);
  const items = pct === 100 ? rows.map((r) => ({ description: r.description, quantity: dec(toMinor(String(r.quantity))), unit_price: dec(toMinor(String(r.unit_price))) })) : [{ description: `${pct}% of ${p.number}: ${p.title}`, quantity: "1.00", unit_price: dec(pctOf(total, pct)) }];
  const { data: ex } = await db.from("invoices").select("invoice_items(quantity,unit_price)").eq("proposal_id", id).neq("status", "void");
  const billed = sum((ex || []).map((i) => totalOf(i.invoice_items))), now = totalOf(items);
  if (billed + now > total) redirect(`${back}?e=overbill`);
  const { data: proj } = await db.from("projects").select("id").eq("proposal_id", id).maybeSingle();
  const bs = await brand(), days = bs.termsDays, due = new Date(Date.now() + days * 864e5).toISOString().slice(0, 10);
  const { data: inv, error } = await db.from("invoices").insert({ client_id: p.client_id, proposal_id: id, project_id: proj?.id || null, currency: p.currency, due_date: due, payment_instructions: bs.paymentInstructions || null }).select("id").single();
  if (error) redirect(`${back}?e=save`);
  const ins = await db.from("invoice_items").insert(items.map((it, i) => ({ invoice_id: inv.id, position: i, ...it })));
  if (ins.error) { await db.from("invoices").delete().eq("id", inv.id); redirect(`${back}?e=save`); }
  await aud(db, user.email, "invoice.create", "invoice", inv.id, { proposal: id, pct }); redirect(`/admin/invoices/${inv.id}`);
}
export async function issueInvoice(fd) {
  const { user, db } = await requireAdmin(); const id = String(fd.get("id")); if (!UUID.test(id)) return;
  const { data, error } = await db.rpc("issue_invoice", { iid: id });
  if (error) redirect(`/admin/invoices/${id}?e=issue`);
  await aud(db, user.email, "invoice.issue", "invoice", id, { number: data }); redirect(`/admin/invoices/${id}?saved=1`);
}
export async function voidInvoice(fd) {
  const { user, db } = await requireAdmin(); const id = String(fd.get("id")); if (!UUID.test(id)) return;
  const { data: al } = await db.from("payment_allocations").select("amount,payments(reversed_at)").eq("invoice_id", id);
  if (allocatedPaid(al || []) > 0n) redirect(`/admin/invoices/${id}?e=haspay`);
  const { data } = await db.from("invoices").update({ status: "void" }).eq("id", id).in("status", ["draft", "issued"]).select("id");
  if (!data?.length) redirect(`/admin/invoices/${id}?e=issue`);
  await aud(db, user.email, "invoice.void", "invoice", id); redirect(`/admin/invoices/${id}?saved=1`);
}
export async function recordPayment(fd) {
  const { user, db } = await requireAdmin(); const id = String(fd.get("id")); if (!UUID.test(id)) return; const back = `/admin/invoices/${id}`;
  const amt = toMinor(fd.get("amount")), method = String(fd.get("method")), paid = String(fd.get("paid_on") || ""), ref = String(fd.get("reference") || "").trim().slice(0, 80) || null, idem = String(fd.get("idem") || "").slice(0, 60) || null;
  if (amt === null || amt <= 0n || !["bank", "mpesa", "cash", "card", "other"].includes(method) || !DATE.test(paid) || (["mpesa", "bank"].includes(method) && !ref)) redirect(`${back}?e=invalid`);
  const { data: inv } = await db.from("invoices").select("client_id,currency").eq("id", id).maybeSingle(); if (!inv) return;
  const { data, error } = await db.rpc("record_payment", { p_client: inv.client_id, p_amount: dec(amt), p_currency: inv.currency, p_paid_on: paid, p_method: method, p_ref: ref, p_note: String(fd.get("note") || "").slice(0, 300) || null, p_by: user.email, p_idem: idem, p_alloc: [{ invoice_id: id, amount: dec(amt) }] });
  if (error) { const m = error.message || ""; redirect(`${back}?${error.code === "23505" && m.includes("idem") ? "saved=1" : `e=${error.code === "23505" ? "dup" : m.includes("over-allocation") ? "over" : m.includes("not payable") ? "notpayable" : "save"}`}`); }
  await aud(db, user.email, "payment.record", "payment", data, { invoice: id, amount: dec(amt) }); redirect(`${back}?saved=1`);
}
export async function reversePayment(fd) {
  const { user, db } = await requireAdmin(); const pid = String(fd.get("pid")), id = String(fd.get("id")), why = String(fd.get("why") || "").trim().slice(0, 200);
  if (!UUID.test(pid) || !UUID.test(id)) return; if (!why) redirect(`/admin/invoices/${id}?e=why`);
  const { data } = await db.from("payments").update({ reversed_at: new Date().toISOString(), reversed_by: user.email, reverse_reason: why }).eq("id", pid).is("reversed_at", null).select("id");
  if (data?.length) await aud(db, user.email, "payment.reverse", "payment", pid, { why }); redirect(`/admin/invoices/${id}?saved=1`);
}
export async function createManualInvoice(fd) {
  const { user, db } = await requireAdmin(); const cid = String(fd.get("client_id")), due = String(fd.get("due_date") || "");
  const { items, errors } = parseItems(fd);
  if (!UUID.test(cid) || !items.length || errors.length) redirect("/admin/invoices/new?e=1");
  const bs = await brand(), d = DATE.test(due) ? due : new Date(Date.now() + bs.termsDays * 864e5).toISOString().slice(0, 10);
  const { data: inv, error } = await db.from("invoices").insert({ client_id: cid, due_date: d, notes: String(fd.get("notes") || "").slice(0, 1000) || null, payment_instructions: bs.paymentInstructions || null }).select("id").single();
  if (error) redirect("/admin/invoices/new?e=1");
  const ins = await db.from("invoice_items").insert(items.map((it, i) => ({ invoice_id: inv.id, position: i, description: it.description, quantity: it.quantity, unit_price: it.unit_price })));
  if (ins.error) { await db.from("invoices").delete().eq("id", inv.id); redirect("/admin/invoices/new?e=1"); }
  await aud(db, user.email, "invoice.create", "invoice", inv.id, { manual: true }); redirect(`/admin/invoices/${inv.id}`);
}
