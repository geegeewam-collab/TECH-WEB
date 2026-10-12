"use server";
import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { requireAdmin } from "../../lib/supabase";
import { toMinor, lineTotal, sum } from "../../lib/money.mjs";
import { buildStatement } from "../../lib/statement.mjs";
const UUID = /^[0-9a-f-]{36}$/, DATE = /^\d{4}-\d{2}-\d{2}$/;
export async function generateStatement(fd) {
  const { user, db } = await requireAdmin();
  const cid = String(fd.get("client_id")), from = String(fd.get("from")), to = String(fd.get("to"));
  if (!UUID.test(cid) || !DATE.test(from) || !DATE.test(to) || to < from) redirect("/admin/statements?e=invalid");
  const { data: client } = await db.from("clients").select("id,name,email").eq("id", cid).maybeSingle(); if (!client) redirect("/admin/statements?e=invalid");
  const { data, error } = await db.from("invoices").select("number,issue_date,due_date,currency,invoice_items(quantity,unit_price),payment_allocations(amount,payments(id,paid_on,method,reference,receipt_no,reversed_at))").eq("client_id", cid).eq("status", "issued");
  if (error) redirect("/admin/statements?e=save");
  const invoices = data.map((i) => ({ number: i.number, issue_date: i.issue_date, due_date: i.due_date, total: sum(i.invoice_items.map((r) => lineTotal(toMinor(String(r.quantity)), toMinor(String(r.unit_price))))),
    allocs: i.payment_allocations.map((a) => ({ paymentId: a.payments.id, paid_on: a.payments.paid_on, amount: toMinor(String(a.amount)), receipt_no: a.payments.receipt_no, method: a.payments.method, reference: a.payments.reference, reversed: !!a.payments.reversed_at })) }));
  const snapshot = { ...buildStatement({ invoices, from, to }), client: { name: client.name, email: client.email } };
  const ins = await db.from("statements").insert({ client_id: cid, period_from: from, period_to: to, snapshot, token: randomBytes(24).toString("base64url"), created_by: user.email }).select("id").single();
  if (ins.error) redirect("/admin/statements?e=save");
  await db.from("audit_log").insert({ actor: user.email, action: "statement.generate", entity: "statement", entity_id: ins.data.id, detail: { from, to } });
  redirect(`/admin/statements/${ins.data.id}`);
}
