import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../../lib/supabase";
import { PST } from "../../../../../lib/billing.mjs";
import { updateProject, addUpdate } from "../../../billing-actions";
export const dynamic = "force-dynamic";
export default async function Project({ params, searchParams }) {
  const { db } = await requireAdmin(); const { id } = await params, sp = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { data: p } = await db.from("projects").select("*, clients(name), proposals(id,number)").eq("id", id).maybeSingle(); if (!p) notFound();
  const { data: ups } = await db.from("project_updates").select("*").eq("project_id", id).order("created_at", { ascending: false });
  const { data: invs } = await db.from("invoices").select("id,number,status").eq("project_id", id);
  return (<><p><Link href="/admin/projects">← Projects</Link></p><h1>{p.title}</h1>
    <p className="mut">{p.ref} · {p.clients?.name}{p.proposals && <> · from <Link href={`/admin/proposals/${p.proposals.id}`}>{p.proposals.number}</Link></>}</p>
    {sp?.saved && <p className="ok">Saved.</p>}{sp?.e && <p className="err">Could not save.</p>}
    <form action={updateProject} className="form"><input type="hidden" name="id" value={p.id} />
      <label>Status<select name="status" defaultValue={p.status}>{Object.entries(PST).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <label>Private notes (never shown to the client)<textarea name="notes" rows={4} defaultValue={p.notes || ""} /></label><button className="btn">Save</button></form>
    <h2>Updates</h2><form action={addUpdate} className="form"><input type="hidden" name="id" value={p.id} /><label>New update<textarea name="body" rows={3} required /></label>
      <label className="chk"><input type="checkbox" name="visible" defaultChecked /> Visible to the client (in their portal, when it is built)</label><button className="btn sm">Add update</button></form>
    {ups?.length ? <div className="scroll"><table className="at"><tbody>{ups.map((u) => <tr key={u.id}><td style={{ whiteSpace: "pre-wrap" }}>{u.body}</td><td><span className="bd">{u.visible_to_client ? "Client can see" : "Private"}</span><small>{new Date(u.created_at).toLocaleDateString("en-KE")}</small></td></tr>)}</tbody></table></div> : <p className="mut">No updates yet.</p>}
    {invs?.length > 0 && <><h2>Invoices</h2>{invs.map((i) => <p key={i.id}><Link href={`/admin/invoices/${i.id}`}>{i.number || "Draft invoice"}</Link></p>)}</>}</>);
}
