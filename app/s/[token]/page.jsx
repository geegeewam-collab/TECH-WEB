import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { db } from "../../../lib/supabase";
import { fmt } from "../../../lib/money.mjs";
import { brand } from "../../../lib/settings";
import { respond } from "./actions";
export const dynamic = "force-dynamic";
export const metadata = { title: "Statement of account", robots: { index: false, follow: false } };
export default async function PublicStatement({ params, searchParams }) {
  const { token } = await params, sp = await searchParams, sb = db();
  if (!sb || !/^[\w-]{20,64}$/.test(token)) notFound();
  const { data: s } = await sb.from("statements").select("id,number,snapshot,viewed_at,response,responded_by,responded_at").eq("token", token).maybeSingle(); if (!s) notFound();
  if (!s.viewed_at && !/bot|crawl|spider|preview|whatsapp|facebookexternalhit|slack|telegram/i.test((await headers()).get("user-agent") || "")) await sb.from("statements").update({ viewed_at: new Date().toISOString() }).eq("id", s.id).is("viewed_at", null);
  const n = s.snapshot, m = (x) => fmt(BigInt(x), n.currency);
  return (<div className="pub"><p className="mut">{(await brand()).name}</p><h1>Statement of account</h1><p className="mut">{s.number} · {n.from} to {n.to} · {n.client.name}</p>
    <section className="ds"><p className="mut">Opening balance {m(n.opening)}</p><div className="scroll"><table className="at"><thead><tr><th>Date</th><th>Details</th><th>Charge</th><th>Paid</th><th>Balance</th></tr></thead><tbody>
      {n.entries.map((e, i) => <tr key={i}><td>{e.date}</td><td>{e.ref} {e.desc}</td><td>{BigInt(e.debit) ? m(e.debit) : ""}</td><td>{BigInt(e.credit) ? m(e.credit) : ""}</td><td>{m(e.balance)}</td></tr>)}</tbody></table></div>
      <p style={{ marginTop: 14 }}><strong>Balance at {n.to}: {m(n.closing)}</strong>{BigInt(n.overdue) > 0n && ` (of which ${m(n.overdue)} is past its due date)`}</p></section>
    <p><a className="ln" href={`/s/${token}/pdf`}>Download PDF</a></p>
    {s.response ? <p className="note">{s.response === "confirmed" ? "Thank you. You confirmed this statement" : "Thank you. Your query was recorded"} on {s.responded_at?.slice(0, 10)}.</p> :
      <form action={respond} className="form"><h2>Does this match your records?</h2><input type="hidden" name="token" value={token} />{sp?.e && <p className="err">Enter your name{" "}and, for a query, a short note.</p>}
        <label>Your name<input name="name" required maxLength={120} /></label><label>Note <span>(needed if you have a question)</span><textarea name="note" rows={3} maxLength={1000} /></label>
        <p className="actrow"><button className="btn" name="response" value="confirmed" formNoValidate>This matches my records</button><button className="btn q" name="response" value="disputed" formNoValidate>I have a question</button></p>
        <p className="mut">Your reply is recorded for our reference. It does not change the account.</p></form>}</div>);
}
