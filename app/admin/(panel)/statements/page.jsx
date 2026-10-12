import Link from "next/link";
import { requireAdmin } from "../../../../lib/supabase";
import { RESP } from "../../../../lib/billing.mjs";
import { fmt } from "../../../../lib/money.mjs";
import { generateStatement } from "../../statement-actions";
export const dynamic = "force-dynamic";
export default async function Statements({ searchParams }) {
  const { db } = await requireAdmin(); const sp = await searchParams, today = new Date().toISOString().slice(0, 10);
  const { data: clients } = await db.from("clients").select("id,name").order("name");
  const { data: list, error } = await db.from("statements").select("id,number,period_from,period_to,snapshot,response,clients(name)").order("created_at", { ascending: false }).limit(50);
  return (<><h1>Statements</h1>{sp?.e && <p className="err">Check the client and dates, then try again.</p>}
    <form action={generateStatement} className="form"><h2>New statement</h2><label>Client<select name="client_id" required defaultValue={sp?.client || ""}><option value="" disabled>Choose a client</option>{clients?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label>From<input type="date" name="from" required defaultValue={`${today.slice(0, 4)}-01-01`} /></label><label>To<input type="date" name="to" required defaultValue={today} /></label>
      <p className="mut">Built from recorded invoices and payments. You review it before sharing anything.</p><button className="btn">Generate and preview</button></form>
    <h2>Generated</h2>{error ? <p className="err">Could not load. Have you run supabase/004_statements.sql?</p> : list.length === 0 ? <p className="mut">None yet.</p> :
      <div className="scroll"><table className="at"><tbody>{list.map((s) => <tr key={s.id}><td><Link href={`/admin/statements/${s.id}`}>{s.number}</Link><small>{s.clients?.name} · {s.period_from} to {s.period_to}</small></td><td>{fmt(BigInt(s.snapshot.closing), s.snapshot.currency)}</td><td>{s.response && <span className={`bd${s.response === "disputed" ? " bad" : ""}`}>{RESP[s.response]}</span>}</td></tr>)}</tbody></table></div>}</>);
}
