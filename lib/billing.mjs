import { toMinor, sum } from "./money.mjs";
export const ISTATE = { draft: "Draft", issued: "Issued", partial: "Partially paid", overdue: "Overdue", paid: "Paid", void: "Void" };
export const allocatedPaid = (allocs = []) => sum(allocs.filter((a) => !a.payments?.reversed_at).map((a) => toMinor(String(a.amount))));
// Paid beats overdue; overdue beats partial. Drafts and voids never count as receivables.
export function invoiceState(inv, total, paid, today) {
  if (inv.status === "draft" || inv.status === "void") return inv.status;
  if (total - paid <= 0n) return "paid";
  if (inv.due_date && inv.due_date < today) return "overdue";
  return paid > 0n ? "partial" : "issued";
}
export const pctOf = (totalMinor, pct) => (totalMinor * BigInt(pct) + 50n) / 100n;
export const receivable = (rows) => sum(rows.filter((r) => r.state !== "draft" && r.state !== "void" && r.out > 0n).map((r) => r.out));
export const PST = { planned: "Planned", in_progress: "In progress", awaiting_client: "Awaiting client", on_hold: "On hold", completed: "Completed", cancelled: "Cancelled" };
export const RESP = { confirmed: "Client confirmed", disputed: "Client has a query" };
