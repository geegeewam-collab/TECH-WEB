import Link from "next/link";
import { notFound } from "next/navigation";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "../../../../../lib/supabase";
import { ISTATE, allocatedPaid, invoiceState } from "../../../../../lib/billing.mjs";
import { fmt, toMinor, lineTotal, sum, dec } from "../../../../../lib/money.mjs";
import { sendDocEmail } from "../../../email-actions";
import { issueInvoice, voidInvoice, recordPayment, reversePayment } from "../../../billing-actions";
export const dynamic = "force-dynamic";
const Mail = ({ kind, id }) => <form action={sendDocEmail} style={{ display: "inline" }}><input type="hidden" name="kind" value={kind} /><input type="hidden" name="id" value={id} /><button className="btn sm q">Email to client</button></form>;
const MAILMSG = { ok: "Email accepted by the email provider.", fail: "The email could not be sent. See Email activity for the reason.", missing: "This client has no email address, or the document is not ready to send.", recent: "That was just sent. Wait a couple of minutes before sending again." };
const MSG = { invalid: "Check the amount, date and reference (M-Pesa and bank payments need a reference).", over: "That is more than the amount outstanding.", dup: "A payment with that reference is already recorded.", notpayable: "Only issued invoices can receive payments.", issue: "Could not issue or void. The invoice may have changed.", haspay: "Reverse the payments before voiding.", why: "Give a reason for the reversal.", save: "Could not save. Try again." };
export default async function Invoice({ params, searchParams }) {
  const { db } = await requireAdmin(); const { id } = await params, sp = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { data: v } = await db.from("invoices").select("*, clients(name), invoice_items(*), payment_allocations(id,amount,payments(id,paid_on,method,reference,reversed_at))").eq("id", id).maybeSingle(); if (!v) notFound();
  const items = [...v.invoice_items].sort((a, b) => a.position - b.position), total = sum(items.map((r) => lineTotal(toMinor(String(r.quantity)), toMinor(String(r.unit_price)))));
  const paid = allocatedPaid(v.payment_allocations), out = total - paid, state = invoiceState(v, total, paid, new Date().toISOString().slice(0, 10)), c = v.currency, idem = randomUUID();
  return (<><p><Link href="/admin/invoices">← Invoices</Link></p><h1>{v.number || "Draft invoice"}</h1>
    <p className="mut">{v.clients.name} · <span className={`bd${state === "overdue" ? " bad" : ""}`}>{ISTATE[state]}</span>{v.due_date && ` · Due ${v.due_date}`}</p>
    {sp?.mail && <p className={sp.mail === "ok" ? "ok" : "err"}>{MAILMSG[sp.mail]}</p>}{sp?.saved && <p className="ok">Saved.</p>}{sp?.e && <p className="err">{MSG[sp.e] || MSG.save}</p>}
    <div className="card" style={{ margin: "20px 0" }}><table className="at"><tbody>{items.map((r) => <tr key={r.id}><td>{r.description}</td><td>{r.quantity} × {fmt(toMinor(String(r.unit_price)), c)}</td></tr>)}</tbody></table>
      <p style={{ marginTop: 14 }}><strong>Total {fmt(total, c)}</strong> · Paid {fmt(paid, c)} · <strong>Outstanding {fmt(out, c)}</strong></p></div>
    <p className="actrow"><a className="btn sm q" href={`/admin/invoices/${v.id}/pdf`} target="_blank" rel="noopener noreferrer">PDF</a>
      {v.status === "issued" && <Mail kind="invoice" id={v.id} />}{v.status === "draft" && <form action={issueInvoice}><input type="hidden" name="id" value={v.id} /><button className="btn sm am">Issue invoice</button></form>}
      {v.status !== "void" && <form action={voidInvoice}><input type="hidden" name="id" value={v.id} /><button className="btn sm q">Void</button></form>}</p>
    {v.status === "issued" && out > 0n && <form action={recordPayment} className="form"><h2>Record a payment</h2><input type="hidden" name="id" value={v.id} /><input type="hidden" name="idem" value={idem} />
      <label>Amount ({c})<input name="amount" inputMode="decimal" required defaultValue={dec(out)} /></label>
      <label>Method<select name="method" defaultValue="mpesa"><option value="mpesa">M-Pesa</option><option value="bank">Bank transfer</option><option value="cash">Cash</option><option value="card">Card</option><option value="other">Other</option></select></label>
      <label>Reference (M-Pesa code or bank reference)<input name="reference" maxLength={80} /></label>
      <label>Date paid<input type="date" name="paid_on" required defaultValue={new Date().toISOString().slice(0, 10)} /></label><label>Note<input name="note" maxLength={300} /></label>
      <p className="mut">Entered by hand. Nothing here talks to M-Pesa or your bank.</p><button className="btn">Record payment</button></form>}
    {v.payment_allocations.length > 0 && <><h2>Payments</h2><div className="scroll"><table className="at"><tbody>{v.payment_allocations.map((a) => <tr key={a.id}><td>{a.payments.paid_on}<small>{a.payments.method}{a.payments.reference && ` · ${a.payments.reference}`}</small></td><td>{fmt(toMinor(String(a.amount)), c)}</td>
      <td>{a.payments.reversed_at ? <span className="bd bad">Reversed</span> : <><a className="btn sm q" href={`/admin/payments/${a.payments.id}/receipt`} target="_blank" rel="noopener noreferrer">Receipt</a><form action={reversePayment} className="actrow"><input type="hidden" name="id" value={v.id} /><input type="hidden" name="pid" value={a.payments.id} /><input name="why" placeholder="Reason" aria-label="Reason" maxLength={200} /><button className="btn sm q">Reverse</button></form></>}</td></tr>)}</tbody></table></div></>}</>);
}
