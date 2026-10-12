import Link from "next/link";
import { requireAdmin } from "../../../../lib/supabase";
import { PSTATUS, effectiveStatus, itemsTotalMinor } from "../../../../lib/proposals.mjs";
import { fmt } from "../../../../lib/money.mjs";
export const dynamic = "force-dynamic";
export default async function Proposals() {
  const { db } = await requireAdmin();
  const { data, error } = await db.from("proposals").select("id,number,title,status,valid_until,viewed_at,currency,clients(name),proposal_items(quantity,unit_price)").order("created_at", { ascending: false }).limit(100);
  return (<><h1>Proposals</h1><p><Link className="btn sm" href="/admin/proposals/new">New proposal</Link></p>
    {error ? <p className="err">Could not load proposals. Have you run supabase/002_proposals.sql?</p> : data.length === 0 ? <p className="mut">No proposals yet.</p> :
      <div className="scroll"><table className="at"><thead><tr><th>Proposal</th><th>Client</th><th>Status</th><th>Total</th></tr></thead><tbody>
        {data.map((p) => <tr key={p.id}><td><Link href={`/admin/proposals/${p.id}`}>{p.title}</Link><small>{p.number}</small></td><td>{p.clients?.name}</td>
          <td><span className="bd">{PSTATUS[effectiveStatus(p)]}</span>{p.viewed_at && p.status === "sent" && <span className="bd">Viewed</span>}</td><td>{fmt(itemsTotalMinor(p.proposal_items), p.currency)}</td></tr>)}</tbody></table></div>}</>);
}
