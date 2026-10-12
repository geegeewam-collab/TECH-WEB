import Link from "next/link";
import { notFound } from "next/navigation";
import { requireClient } from "../../../../../lib/supabase";
import { ISTATE, allocatedPaid, invoiceState } from "../../../../../lib/billing.mjs";
import { fmt, toMinor, lineTotal, sum } from "../../../../../lib/money.mjs";
export const dynamic = "force-dynamic";
export default async function PortalInvoice({ params }) {
  const { db, cid } = await requireClient(); const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { data: v } = await db.from("invoices").select("*, invoice_items(*), payment_allocations(id,amount,payments(id,paid_on,method,reference,reversed_at))").eq("id", id).eq("client_id", cid).eq("status", "issued").maybeSingle();
  if (!v) notFound();
  const items = [...v.invoice_items].sort((a, b) => a.position - b.position), total = sum(items.map((r) => lineTotal(toMinor(String(r.quantity)), toMinor(String(r.unit_price)))));
  const paid = allocatedPaid(v.payment_allocations), out = total - paid, c = v.currency, state = invoiceState(v, total, paid, new Date().toISOString().slice(0, 10));
  return (<><p><Link href="/portal">← Back</Link></p><h1>{v.number}</h1><p className="mut"><span className={`bd${state === "overdue" ? " bad" : ""}`}>{ISTATE[state]}</span>{v.due_date && ` · Due ${v.due_date}`}</p>
    <div className="card" style={{ margin: "20px 0" }}><table className="at"><tbody>{items.map((r) => <tr key={r.id}><td>{r.description}</td><td>{r.quantity} × {fmt(toMinor(String(r.unit_price)), c)}</td></tr>)}</tbody></table>
      <p style={{ marginTop: 14 }}><strong>Total {fmt(total, c)}</strong> · Paid {fmt(paid, c)} · <strong>Outstanding {fmt(out, c)}</strong></p></div>
    <p><a className="ln" href={`/portal/invoices/${v.id}/pdf`} target="_blank" rel="noopener noreferrer">Download PDF</a></p>
    {v.payment_instructions && out > 0n && <div className="card"><h2>How to pay</h2><p style={{ whiteSpace: "pre-wrap" }}>{v.payment_instructions}</p></div>}
    {v.payment_allocations.some((a) => !a.payments.reversed_at) && <><h2>Payments received</h2><div className="scroll"><table className="at"><tbody>{v.payment_allocations.filter((a) => !a.payments.reversed_at).map((a) => <tr key={a.id}><td>{a.payments.paid_on}<small>{a.payments.method}</small></td><td>{fmt(toMinor(String(a.amount)), c)}</td><td><a href={`/portal/receipts/${a.payments.id}`} target="_blank" rel="noopener noreferrer">Receipt</a></td></tr>)}</tbody></table></div></>}</>);
}
