import { sum } from "./money.mjs";
// Builds a statement from stored invoices and payment allocations. All amounts are BigInt minor units in, strings out.
// invoices: [{ number, issue_date, due_date, total, allocs: [{ paymentId, paid_on, amount, receipt_no, method, reference, reversed }] }]
export function buildStatement({ invoices, from, to, currency = "KES" }) {
  const ev = [], pay = new Map();
  for (const i of invoices) {
    ev.push({ date: i.issue_date, order: 0, kind: "invoice", ref: i.number, desc: "Invoice", debit: i.total, credit: 0n });
    for (const a of i.allocs) {
      if (a.reversed) continue;
      const p = pay.get(a.paymentId) || { date: a.paid_on, order: 1, kind: "payment", ref: a.receipt_no, desc: `Payment (${a.method}${a.reference ? ` ${a.reference}` : ""})`, debit: 0n, credit: 0n, applied: [] };
      p.credit += a.amount; p.applied.push(i.number); pay.set(a.paymentId, p);
    }
  }
  ev.push(...pay.values());
  ev.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.order - b.order));
  const opening = sum(ev.filter((e) => e.date < from).map((e) => e.debit - e.credit)), inP = ev.filter((e) => e.date >= from && e.date <= to);
  let bal = opening;
  const entries = inP.map((e) => { bal += e.debit - e.credit; return { date: e.date, kind: e.kind, ref: e.ref, desc: e.desc + (e.applied ? ` for ${e.applied.join(", ")}` : ""), debit: String(e.debit), credit: String(e.credit), balance: String(bal) }; });
  let overdue = 0n;
  for (const i of invoices) {
    if (i.issue_date > to) continue;
    const out = i.total - sum(i.allocs.filter((a) => !a.reversed && a.paid_on <= to).map((a) => a.amount));
    if (out > 0n && i.due_date && i.due_date < to) overdue += out;
  }
  return { from, to, currency, opening: String(opening), charges: String(sum(inP.map((e) => e.debit))), credits: String(sum(inP.map((e) => e.credit))), closing: String(bal), overdue: String(overdue), entries };
}
