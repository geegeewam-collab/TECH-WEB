import Link from "next/link";
import { requireAdmin } from "../../../lib/supabase";
import { effectiveStatus } from "../../../lib/proposals.mjs";
import { invoiceBook } from "../../../lib/ledger";
import { receivable } from "../../../lib/billing.mjs";
import { fmt } from "../../../lib/money.mjs";
import { STATUSES } from "../../../lib/leads.mjs";
export const dynamic = "force-dynamic";
export default async function Overview() {
  const { db } = await requireAdmin();
  const today = new Date().toISOString().slice(0, 10);
  const [all, due, fail, recent, props] = await Promise.all([
    db.from("leads").select("status"),
    db.from("leads").select("id", { count: "exact", head: true }).lte("follow_up_on", today).not("status", "in", "(won,lost,archived)"),
    db.from("leads").select("id", { count: "exact", head: true }).eq("notify_status", "failed"),
    db.from("leads").select("id,name,business,status,created_at").order("created_at", { ascending: false }).limit(8),
    db.from("proposals").select("status,valid_until")]);
  if (all.error || recent.error) return <p className="err">Could not load leads. Check the database setup.</p>;
  const n = {}; all.data.forEach((l) => (n[l.status] = (n[l.status] || 0) + 1));
  const book = await invoiceBook(db), br = book.rows || [], overdue = br.filter((r) => r.state === "overdue").length;
  const pl = props.data || [], awaiting = pl.filter((x) => effectiveStatus(x) === "sent").length, won = pl.filter((x) => x.status === "accepted").length;
  const open = ["new", "contacted", "qualified", "proposal_in_preparation", "proposal_sent"].reduce((a, k) => a + (n[k] || 0), 0);
  return (<><h1>Overview</h1>
    <div className="ak"><Link href="/admin/leads?status=new"><b>{n.new || 0}</b>New leads</Link><Link href="/admin/leads"><b>{open}</b>Open leads</Link><Link href="/admin/leads?due=1"><b>{due.count || 0}</b>Follow-ups due</Link><Link href="/admin/leads?fail=1"><b>{fail.count || 0}</b>Email alerts failed</Link><Link href="/admin/proposals"><b>{awaiting}</b>Proposals awaiting reply</Link><Link href="/admin/proposals"><b>{won}</b>Proposals accepted</Link><Link href="/admin/invoices"><b>{fmt(receivable(br))}</b>Outstanding</Link><Link href="/admin/invoices"><b>{overdue}</b>Overdue invoices</Link></div>
    <h2>Recent leads</h2>
    {recent.data.length === 0 ? <p className="mut">No enquiries yet. Submissions from the contact form will appear here.</p> :
      <table className="at"><tbody>{recent.data.map((l) => <tr key={l.id}><td><Link href={`/admin/leads/${l.id}`}>{l.name}</Link>{l.business && <small> · {l.business}</small>}</td><td><span className="bd">{STATUSES[l.status]}</span></td><td>{new Date(l.created_at).toLocaleDateString("en-KE")}</td></tr>)}</tbody></table>}</>);
}
