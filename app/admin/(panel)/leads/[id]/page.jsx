import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../../lib/supabase";
import { STATUSES, sourceLabel } from "../../../../../lib/leads.mjs";
import { updateLead } from "../../../actions";
export const dynamic = "force-dynamic";
export default async function Lead({ params, searchParams }) {
  const { db } = await requireAdmin();
  const { id } = await params, sp = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { data: l } = await db.from("leads").select("*").eq("id", id).maybeSingle();
  if (!l) notFound();
  const src = [l.utm_source, l.utm_medium, l.utm_campaign, l.utm_content].filter(Boolean).join(" / ") || sourceLabel(l);
  return (<><p><Link href="/admin/leads">← Leads</Link></p><h1>{l.name}</h1>
    <p className="mut">{l.business && `${l.business} · `}<a href={`mailto:${l.email}`}>{l.email}</a>{l.phone && <> · <a href={`tel:${l.phone}`}>{l.phone}</a></>}</p>
    <div className="card" style={{ margin: "20px 0" }}><p style={{ whiteSpace: "pre-wrap" }}>{l.message}</p></div>
    <p className="mut">Received {new Date(l.created_at).toLocaleString("en-KE")} · Source: {src}{l.landing_page && ` · Landed on ${l.landing_page}`}{l.referrer && ` · From ${l.referrer}`}</p>
    <p className="mut">Email alert: {l.notify_status}{l.notify_error && ` (${l.notify_error})`}</p>
    {sp?.saved && <p className="ok">Saved.</p>}{sp?.e && <p className="err">Could not save. Try again.</p>}
    <form action={updateLead} className="form"><input type="hidden" name="id" value={l.id} />
      <label>Status<select name="status" defaultValue={l.status}>{Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <label>Follow-up date<input type="date" name="follow_up_on" defaultValue={l.follow_up_on || ""} /></label>
      <label className="chk"><input type="checkbox" name="contacted" /> I contacted them just now{l.last_contacted_at && <span> (last: {new Date(l.last_contacted_at).toLocaleDateString("en-KE")})</span>}</label>
      <label>Private notes<textarea name="notes" rows={6} maxLength={5000} defaultValue={l.notes || ""} /></label><button className="btn">Save changes</button></form></>);
}
