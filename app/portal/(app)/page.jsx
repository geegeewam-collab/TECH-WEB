import Link from "next/link";
import { requireClient } from "../../../lib/supabase";
import { invoiceBook } from "../../../lib/ledger";
import { ISTATE, receivable } from "../../../lib/billing.mjs";
import { PSTATUS, effectiveStatus } from "../../../lib/proposals.mjs";
import { PST } from "../../../lib/billing.mjs";
import { fmt } from "../../../lib/money.mjs";
import { scoped, portalProposals, visibleUpdates } from "../../../lib/portal.mjs";
export const dynamic = "force-dynamic";
export default async function Dashboard() {
  const { db, cid, client } = await requireClient();
  const [book, props, projs, sts] = await Promise.all([
    invoiceBook(db, (q) => q.eq("client_id", cid).eq("status", "issued")),
    scoped(db, "proposals", "id,number,title,status,token,valid_until", cid).in("status", ["sent", "accepted", "declined"]).order("created_at", { ascending: false }),
    scoped(db, "projects", "id,ref,title,status,project_updates(body,created_at,visible_to_client)", cid).order("created_at", { ascending: false }),
    scoped(db, "statements", "id,number,token,period_from,period_to", cid).eq("portal_visible", true).order("created_at", { ascending: false })]);
  if (book.error || props.error || projs.error || sts.error) return <p className="err">Something went wrong loading your account. Please try again.</p>;
  const rows = book.rows, overdue = rows.filter((r) => r.state === "overdue").length;
  return (<><h1>Welcome{client?.contact_name ? `, ${client.contact_name}` : ""}</h1>
    <div className="ak"><div className="card"><b>{fmt(receivable(rows))}</b>Outstanding</div><div className="card"><b>{overdue}</b>Overdue invoices</div></div>
    <h2>Proposals</h2>{portalProposals(props.data).length === 0 ? <p className="mut">No proposals yet.</p> : <div className="scroll"><table className="at"><tbody>{props.data.map((p) => <tr key={p.id}><td>{p.title}<small>{p.number}</small></td><td><span className="bd">{PSTATUS[effectiveStatus(p)]}</span></td><td><Link href={`/p/${p.token}`}>Open</Link></td></tr>)}</tbody></table></div>}
    <h2>Projects</h2>{projs.data.length === 0 ? <p className="mut">No projects yet.</p> : projs.data.map((p) => <div className="card" key={p.id} style={{ marginBottom: 14 }}><strong>{p.title}</strong> <span className="bd">{PST[p.status]}</span>
      {visibleUpdates(p.project_updates).sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5).map((u, i) => <p key={i} style={{ marginTop: 10 }}><small className="mut">{new Date(u.created_at).toLocaleDateString("en-KE")}</small><br />{u.body}</p>)}</div>)}
    <h2>Invoices</h2>{rows.length === 0 ? <p className="mut">No invoices yet.</p> : <div className="scroll"><table className="at"><thead><tr><th>Invoice</th><th>Status</th><th>Total</th><th>Outstanding</th><th>Due</th></tr></thead><tbody>{rows.map((i) => <tr key={i.id}><td><Link href={`/portal/invoices/${i.id}`}>{i.number}</Link></td><td><span className={`bd${i.state === "overdue" ? " bad" : ""}`}>{ISTATE[i.state]}</span></td><td>{fmt(i.total, i.currency)}</td><td>{fmt(i.out, i.currency)}</td><td>{i.due_date || "-"}</td></tr>)}</tbody></table></div>}
    <h2>Statements</h2>{sts.data.length === 0 ? <p className="mut">No statements yet.</p> : sts.data.map((s) => <p key={s.id}><Link href={`/s/${s.token}`}>{s.number}: {s.period_from} to {s.period_to}</Link></p>)}</>);
}
