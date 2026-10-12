import Link from "next/link";
import { requireAdmin } from "../../../../lib/supabase";
import { invoiceBook } from "../../../../lib/ledger";
import { ISTATE, receivable } from "../../../../lib/billing.mjs";
import { fmt } from "../../../../lib/money.mjs";
export const dynamic = "force-dynamic";
export default async function Invoices() {
  const { db } = await requireAdmin();
  const { rows, error } = await invoiceBook(db);
  return (<><h1>Invoices</h1><p className="mut">Create one from an accepted proposal, or <Link href="/admin/invoices/new">start a new invoice</Link>.</p>
    {error ? <p className="err">Could not load invoices. Have you run supabase/003_billing.sql?</p> : rows.length === 0 ? <p className="mut">No invoices yet.</p> : <>
      <p><strong>Outstanding: {fmt(receivable(rows))}</strong></p>
      <div className="scroll"><table className="at"><thead><tr><th>Invoice</th><th>Client</th><th>Status</th><th>Total</th><th>Outstanding</th><th>Due</th></tr></thead><tbody>
        {rows.map((i) => <tr key={i.id}><td><Link href={`/admin/invoices/${i.id}`}>{i.number || "Draft"}</Link></td><td>{i.clients?.name}</td><td><span className={`bd${i.state === "overdue" ? " bad" : ""}`}>{ISTATE[i.state]}</span></td><td>{fmt(i.total, i.currency)}</td><td>{i.state === "draft" || i.state === "void" ? "-" : fmt(i.out, i.currency)}</td><td>{i.due_date || "-"}</td></tr>)}</tbody></table></div></>}</>);
}
