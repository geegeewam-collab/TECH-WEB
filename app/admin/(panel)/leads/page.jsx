import Link from "next/link";
import { requireAdmin } from "../../../../lib/supabase";
import { STATUSES, sourceLabel } from "../../../../lib/leads.mjs";
export const dynamic = "force-dynamic";
export default async function Leads({ searchParams }) {
  const { db } = await requireAdmin();
  const sp = await searchParams, today = new Date().toISOString().slice(0, 10);
  let q = db.from("leads").select("id,name,business,email,status,created_at,follow_up_on,notify_status,utm_source,referrer").order("created_at", { ascending: false }).limit(100);
  if (STATUSES[sp?.status]) q = q.eq("status", sp.status);
  if (sp?.due) q = q.lte("follow_up_on", today).not("status", "in", "(won,lost,archived)");
  if (sp?.fail) q = q.eq("notify_status", "failed");
  const term = String(sp?.q || "").replace(/[^\p{L}\p{N} @._-]/gu, "").slice(0, 60);
  if (term) q = q.or(`name.ilike.%${term}%,email.ilike.%${term}%,business.ilike.%${term}%`);
  const { data, error } = await q;
  return (<><h1>Leads</h1>
    <form className="afil"><input name="q" defaultValue={term} placeholder="Search name, email or business" aria-label="Search" />
      <select name="status" defaultValue={sp?.status || ""} aria-label="Status"><option value="">All statuses</option>{Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select><button className="btn sm">Filter</button></form>
    {error ? <p className="err">Could not load leads.</p> : data.length === 0 ? <p className="mut">No leads match.</p> :
      <div className="scroll"><table className="at"><thead><tr><th>Name</th><th>Status</th><th>Source</th><th>Follow-up</th><th>Received</th></tr></thead><tbody>
        {data.map((l) => <tr key={l.id}><td><Link href={`/admin/leads/${l.id}`}>{l.name}</Link><small>{l.business || l.email}</small></td><td><span className="bd">{STATUSES[l.status]}</span>{l.notify_status === "failed" && <span className="bd bad">Alert failed</span>}</td><td>{sourceLabel(l)}</td><td>{l.follow_up_on || "-"}</td><td>{new Date(l.created_at).toLocaleDateString("en-KE")}</td></tr>)}</tbody></table></div>}</>);
}
