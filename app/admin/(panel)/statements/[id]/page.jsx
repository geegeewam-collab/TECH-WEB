import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { requireAdmin } from "../../../../../lib/supabase";
import { fmt } from "../../../../../lib/money.mjs";
import { waNumber } from "../../../../../lib/proposals.mjs";
import { sendDocEmail } from "../../../email-actions";
import { setPortalVisible } from "../../../portal-actions";
import { RESP } from "../../../../../lib/billing.mjs";
export const dynamic = "force-dynamic";
const Mail = ({ kind, id }) => <form action={sendDocEmail} style={{ display: "inline" }}><input type="hidden" name="kind" value={kind} /><input type="hidden" name="id" value={id} /><button className="btn sm q">Email to client</button></form>;
const MAILMSG = { ok: "Email accepted by the email provider.", fail: "The email could not be sent. See Email activity for the reason.", missing: "This client has no email address, or the document is not ready to send.", recent: "That was just sent. Wait a couple of minutes before sending again." };
export default async function Statement({ params, searchParams }) {
  const { db } = await requireAdmin(); const { id } = await params, sp = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { data: s } = await db.from("statements").select("*, clients(name,email,phone,contact_name)").eq("id", id).maybeSingle(); if (!s) notFound();
  const n = s.snapshot, m = (x) => fmt(BigInt(x), n.currency), h = await headers(), link = `${h.get("x-forwarded-proto") || "https"}://${h.get("host")}/s/${s.token}`;
  const msg = `Hi ${s.clients.contact_name || s.clients.name}, here is your statement of account (${s.period_from} to ${s.period_to}): ${link}`;
  return (<><p><Link href="/admin/statements">← Statements</Link></p><h1>{s.number}</h1><p className="mut">{s.clients.name} · {s.period_from} to {s.period_to}</p>
    <div className="card" style={{ margin: "20px 0" }}><p className="mut">Opening balance {m(n.opening)}</p><div className="scroll"><table className="at"><thead><tr><th>Date</th><th>Details</th><th>Charge</th><th>Paid</th><th>Balance</th></tr></thead><tbody>
      {n.entries.map((e, i) => <tr key={i}><td>{e.date}</td><td>{e.ref} {e.desc}</td><td>{BigInt(e.debit) ? m(e.debit) : ""}</td><td>{BigInt(e.credit) ? m(e.credit) : ""}</td><td>{m(e.balance)}</td></tr>)}</tbody></table></div>
      <p style={{ marginTop: 14 }}><strong>Closing balance {m(n.closing)}</strong>{BigInt(n.overdue) > 0n && ` · of which overdue ${m(n.overdue)}`}</p></div>
    {sp?.mail && <p className={sp.mail === "ok" ? "ok" : "err"}>{MAILMSG[sp.mail]}</p>}{s.response && <p className={s.response === "disputed" ? "err" : "ok"}>{RESP[s.response]}: {s.responded_by} on {s.responded_at?.slice(0, 10)}{s.response_note && ` - "${s.response_note}"`}</p>}
    <form action={setPortalVisible} className="actrow"><input type="hidden" name="id" value={s.id} /><input type="hidden" name="on" value={s.portal_visible ? "0" : "1"} /><button className="btn sm q">{s.portal_visible ? "Hide from client portal" : "Publish to client portal"}</button>{s.portal_visible && <span className="bd">Visible in portal</span>}</form>
    <div className="card"><h2>Share with the client (after you have checked the figures)</h2><p className="mut" style={{ wordBreak: "break-all" }}>{link}</p>
      <p className="actrow"><a className="btn sm" href={`https://wa.me/${waNumber(s.clients.phone)}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer">Send on WhatsApp</a>
        {s.clients.email && <a className="btn sm q" href={`mailto:${s.clients.email}?subject=${encodeURIComponent("Statement of account " + s.number)}&body=${encodeURIComponent(msg)}`}>Open in email</a>}
        <Mail kind="statement" id={s.id} /><a className="btn sm q" href={`/s/${s.token}/pdf`} target="_blank" rel="noopener noreferrer">PDF</a></p>
      <p className="mut">The client's confirmation or query is recorded here. It never changes your accounts.</p></div></>);
}
