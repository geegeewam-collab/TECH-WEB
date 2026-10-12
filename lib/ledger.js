import { toMinor, lineTotal, sum } from "./money.mjs";
import { allocatedPaid, invoiceState } from "./billing.mjs";
// Every figure is derived from stored lines and allocations. Nothing is cached or typed in.
export async function invoiceBook(db, extra) {
  let q = db.from("invoices").select("id,number,status,issue_date,due_date,currency,created_at,clients(name),invoice_items(quantity,unit_price),payment_allocations(amount,payments(reversed_at))").order("created_at", { ascending: false }).limit(200);
  if (extra) q = extra(q);
  const { data, error } = await q; if (error) return { error };
  const today = new Date().toISOString().slice(0, 10);
  return { rows: data.map((i) => { const total = sum(i.invoice_items.map((r) => lineTotal(toMinor(String(r.quantity)), toMinor(String(r.unit_price))))), paid = allocatedPaid(i.payment_allocations); return { ...i, total, paid, out: total - paid, state: invoiceState(i, total, paid, today) }; }) };
}
