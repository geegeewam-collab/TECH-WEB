import Link from "next/link";
import { requireAdmin } from "../../../../lib/supabase";
import { createClient } from "../../proposal-actions";
export const dynamic = "force-dynamic";
const MSG = { name: "Enter a name.", dup: "A client with that email already exists.", save: "Could not save. Try again." };
export default async function Clients({ searchParams }) {
  const { db } = await requireAdmin();
  const sp = await searchParams;
  const lead = /^[0-9a-f-]{36}$/.test(sp?.from || "") ? (await db.from("leads").select("id,name,email,phone,business").eq("id", sp.from).maybeSingle()).data : null;
  const { data: list, error } = await db.from("clients").select("id,name,email,phone").order("created_at", { ascending: false }).limit(100);
  return (<><h1>Clients</h1>{sp?.e && <p className="err">{MSG[sp.e] || MSG.save}</p>}
    <form action={createClient} className="form"><h2>New client</h2>{lead && <input type="hidden" name="lead_id" value={lead.id} />}
      <label>Client or business name<input name="name" required maxLength={160} defaultValue={lead?.business || lead?.name || ""} /></label>
      <label>Contact person<input name="contact_name" maxLength={120} defaultValue={lead?.name || ""} /></label>
      <label>Email<input name="email" type="email" maxLength={160} defaultValue={lead?.email || ""} /></label>
      <label>Phone<input name="phone" maxLength={40} defaultValue={lead?.phone || ""} /></label>
      <label>Billing address<input name="address" maxLength={300} /></label><button className="btn">Save and start a proposal</button></form>
    <h2>All clients</h2>{error ? <p className="err">Could not load clients.</p> : list.length === 0 ? <p className="mut">No clients yet.</p> :
      <div className="scroll"><table className="at"><tbody>{list.map((c) => <tr key={c.id}><td><Link href={`/admin/clients/${c.id}`}>{c.name}</Link><small>{c.email || c.phone || ""}</small></td><td><Link href={`/admin/proposals/new?client=${c.id}`}>New proposal</Link> · <Link href={`/admin/statements?client=${c.id}`}>Statement</Link></td></tr>)}</tbody></table></div>}</>);
}
