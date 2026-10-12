import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { requireAdmin } from "../../../../../lib/supabase";
import ProposalForm from "../../../../../components/ProposalForm";
import { PSTATUS, effectiveStatus, itemsTotalMinor, waNumber } from "../../../../../lib/proposals.mjs";
import { fmt } from "../../../../../lib/money.mjs";
import { saveProposal, sendProposal, changeStatus } from "../../../proposal-actions";
import { sendDocEmail } from "../../../email-actions";
import { createProject, createInvoice } from "../../../billing-actions";
export const dynamic = "force-dynamic";
const MSG = { overbill: "That would bill more than the proposal total.", invalid: "Check the client, title and pricing lines.", locked: "That proposal changed or is not editable. Reload.", save: "Could not save. Try again.", noitems: "Add at least one pricing line before sending." };
const Mail = ({ kind, id }) => <form action={sendDocEmail} style={{ display: "inline" }}><input type="hidden" name="kind" value={kind} /><input type="hidden" name="id" value={id} /><button className="btn sm q">Email to client</button></form>;
const MAILMSG = { ok: "Email accepted by the email provider.", fail: "The email could not be sent. See Email activity for the reason.", missing: "This client has no email address, or the document is not ready to send.", recent: "That was just sent. Wait a couple of minutes before sending again." };
const Act = ({ id, act, label, cls = "btn sm" }) => <form action={changeStatus} style={{ display: "inline" }}><input type="hidden" name="id" value={id} /><input type="hidden" name="act" value={act} /><button className={cls}>{label}</button></form>;
export default async function Proposal({ params, searchParams }) {
  const { db } = await requireAdmin();
  const { id } = await params, sp = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { data: p } = await db.from("proposals").select("*, clients(*), proposal_items(*)").eq("id", id).maybeSingle();
  if (!p) notFound();
  const rows = [...p.proposal_items].sort((a, b) => a.position - b.position), st = effectiveStatus(p);
  const h = await headers(), link = `${h.get("x-forwarded-proto") || "https"}://${h.get("host")}/p/${p.token}`;
  const msg = `Hi ${p.clients.contact_name || p.clients.name}, here is our proposal "${p.title}": ${link}`;
  const clients = [{ id: p.clients.id, name: p.clients.name }];
  return (<><p><Link href="/admin/proposals">← Proposals</Link></p><h1>{p.title}</h1>
    <p className="mut">{p.number} · {p.clients.name} · <span className="bd">{PSTATUS[st]}</span>{p.version > 0 && ` Version ${p.version}`}{p.viewed_at && ` · Viewed ${new Date(p.viewed_at).toLocaleDateString("en-KE")}`}{p.decided_at && ` · ${PSTATUS[p.status]} by ${p.decided_by} (${p.decided_method === "manual" ? "entered manually" : "client link"}, version ${p.decided_version})`}</p>
    {sp?.mail && <p className={sp.mail === "ok" ? "ok" : "err"}>{MAILMSG[sp.mail]}</p>}{sp?.saved && <p className="ok">Saved.</p>}{sp?.sent && <p className="ok">Sent. Share the link below with your client.</p>}{sp?.e && <p className="err">{MSG[sp.e] || MSG.save}</p>}
    {p.status === "draft" ? (<><ProposalForm p={p} rows={rows} clients={clients} action={saveProposal} />
      <form action={sendProposal} className="form"><input type="hidden" name="id" value={p.id} /><p className="mut">Sending freezes this version. Edits after that become a new version.</p><button className="btn am">Send proposal</button></form></>) : (
      <div className="card" style={{ margin: "20px 0" }}><table className="at"><tbody>{rows.map((r) => <tr key={r.id}><td>{r.description}</td><td>{r.quantity} × {fmt(BigInt(Math.round(r.unit_price * 100)), p.currency)}</td></tr>)}</tbody></table><p style={{ marginTop: 14 }}><strong>Total {fmt(itemsTotalMinor(rows), p.currency)}</strong></p></div>)}
    {p.token && p.status !== "draft" && <div className="card"><h2>Share with the client</h2><p className="mut" style={{ wordBreak: "break-all" }}>{link}</p>
      <p className="actrow"><a className="btn sm" href={`https://wa.me/${waNumber(p.clients.phone)}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer">Send on WhatsApp</a>
        {p.clients.email && <a className="btn sm q" href={`mailto:${p.clients.email}?subject=${encodeURIComponent(`Proposal: ${p.title}`)}&body=${encodeURIComponent(msg)}`}>Open in email</a>}
        {p.status === "sent" && <Mail kind="proposal" id={p.id} />}<a className="btn sm q" href={`/p/${p.token}`} target="_blank" rel="noopener noreferrer">View as client</a><a className="btn sm q" href={`/p/${p.token}/pdf`} target="_blank" rel="noopener noreferrer">PDF</a></p></div>}
    {p.status === "accepted" && <div className="card" style={{ margin: "20px 0" }}><h2>Next steps</h2>
      <form action={createProject}><input type="hidden" name="id" value={p.id} /><button className="btn sm">Create project</button></form>
      <form action={createInvoice} className="actrow"><input type="hidden" name="id" value={p.id} /><label>Invoice % of total <input name="pct" defaultValue="100" inputMode="numeric" style={{ width: 80 }} /></label><button className="btn sm">Create draft invoice</button></form></div>}
    <p className="actrow">{p.status === "sent" && <><Act id={p.id} act="accept" label="Record: accepted" /><Act id={p.id} act="decline" label="Record: declined" cls="btn sm q" /></>}
      {["draft", "sent"].includes(p.status) && <Act id={p.id} act="withdraw" label="Withdraw" cls="btn sm q" />}{["sent", "declined", "withdrawn"].includes(p.status) && <Act id={p.id} act="revise" label="Revise as new version" cls="btn sm q" />}</p></>);
}
