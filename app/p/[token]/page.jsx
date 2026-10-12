import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { db } from "../../../lib/supabase";
import { fmt, toMinor } from "../../../lib/money.mjs";
import { effectiveStatus } from "../../../lib/proposals.mjs";
import { brand } from "../../../lib/settings";
import { decide } from "./actions";
export const dynamic = "force-dynamic";
export const metadata = { title: "Proposal", robots: { index: false, follow: false } };
const Sec = ({ h, t }) => (t ? <section className="ds"><h2>{h}</h2><p style={{ whiteSpace: "pre-wrap" }}>{t}</p></section> : null);
export default async function Public({ params, searchParams }) {
  const { token } = await params, sp = await searchParams;
  const sb = db();
  if (!sb || !/^[\w-]{20,64}$/.test(token)) notFound();
  const { data: p } = await sb.from("proposals").select("id,status,version,valid_until,viewed_at,decided_at,decided_by").eq("token", token).maybeSingle();
  if (!p) notFound();
  const { data: v } = await sb.from("proposal_versions").select("snapshot").eq("proposal_id", p.id).eq("version", p.version).maybeSingle();
  if (!v) notFound();
  const s = v.snapshot, st = effectiveStatus(p);
  if (!p.viewed_at && p.status === "sent" && !/bot|crawl|spider|preview|whatsapp|facebookexternalhit|slack|telegram/i.test((await headers()).get("user-agent") || ""))
    await sb.from("proposals").update({ viewed_at: new Date().toISOString() }).eq("id", p.id).is("viewed_at", null);
  const banner = { accepted: `Accepted by ${p.decided_by} on ${p.decided_at?.slice(0, 10)}.`, declined: "This proposal was declined.", withdrawn: "This proposal has been withdrawn.", expired: "This proposal has expired. Please contact us if you would like it renewed.", draft: "This proposal is being updated. Please check back soon." }[st];
  return (<div className="pub"><p className="mut">{(await brand()).name}</p><h1>{s.title}</h1><p className="mut">{s.number} · Version {s.version}{s.valid_until && ` · Valid until ${s.valid_until}`} · Prepared for {s.client.name}</p>
    {banner && <p className="note">{banner}</p>}
    {st !== "draft" && <><Sec h="Summary" t={s.summary} /><Sec h="Scope of work" t={s.scope} /><Sec h="Deliverables" t={s.deliverables} /><Sec h="Exclusions" t={s.exclusions} />
      <section className="ds"><h2>Pricing</h2><table className="at"><tbody>{s.items.map((i, k) => <tr key={k}><td>{i.description}</td><td>{i.quantity} × {fmt(toMinor(i.unit_price), s.currency)}</td><td>{fmt(toMinor(i.total), s.currency)}</td></tr>)}</tbody></table><p style={{ marginTop: 14 }}><strong>Total {fmt(toMinor(s.total), s.currency)}</strong></p></section>
      <Sec h="Payment terms" t={s.payment_terms} /><Sec h="Terms" t={s.terms} />
      <p><a className="ln" href={`/p/${token}/pdf`}>Download PDF</a></p></>}
    {st === "sent" && <form action={decide} className="form"><h2>Your response</h2><input type="hidden" name="token" value={token} /><input type="hidden" name="version" value={p.version} />
      {sp?.e && <p className="err">Enter your full name{" "}and tick the box to accept.</p>}
      <label>Your full name<input name="name" required maxLength={120} autoComplete="name" /></label>
      <label className="chk"><input type="checkbox" name="ack" /> I have read this proposal and its terms and accept it.</label>
      <p className="actrow"><button className="btn" name="decision" value="accepted">Accept proposal</button><button className="btn q" name="decision" value="declined" formNoValidate>Decline</button></p></form>}</div>);
}
