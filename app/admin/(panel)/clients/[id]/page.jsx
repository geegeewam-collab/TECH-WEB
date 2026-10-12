import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../../lib/supabase";
import { createPortalLogin, resetPortalPassword, removePortalAccess } from "../../../portal-actions";
export const dynamic = "force-dynamic";
const MSG = { invalid: "Enter a valid email and a password of at least 10 characters (not an admin email).", exists: "That email already has an account.", auth: "Could not complete that. Try again." };
export default async function ClientPage({ params, searchParams }) {
  const { db } = await requireAdmin(); const { id } = await params, sp = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { data: c } = await db.from("clients").select("*").eq("id", id).maybeSingle(); if (!c) notFound();
  const { data: users } = await db.from("client_users").select("user_id,email").eq("client_id", id);
  return (<><p><Link href="/admin/clients">← Clients</Link></p><h1>{c.name}</h1><p className="mut">{[c.contact_name, c.email, c.phone].filter(Boolean).join(" · ")}</p>
    <p className="actrow"><Link className="btn sm" href={`/admin/proposals/new?client=${c.id}`}>New proposal</Link><Link className="btn sm q" href={`/admin/statements?client=${c.id}`}>Statement</Link></p>
    {sp?.saved && <p className="ok">Saved.</p>}{sp?.e && <p className="err">{MSG[sp.e] || MSG.auth}</p>}
    <h2>Client portal access</h2>
    {users?.map((u) => <div className="card" key={u.user_id} style={{ marginBottom: 12 }}><strong>{u.email}</strong>
      <form action={resetPortalPassword} className="actrow"><input type="hidden" name="user_id" value={u.user_id} /><input type="hidden" name="client_id" value={c.id} /><input name="password" type="text" placeholder="New temporary password" minLength={10} aria-label="New password" /><button className="btn sm q">Reset password</button></form>
      <form action={removePortalAccess}><input type="hidden" name="user_id" value={u.user_id} /><input type="hidden" name="client_id" value={c.id} /><button className="btn sm q">Remove access</button></form></div>)}
    <form action={createPortalLogin} className="form"><h3>Create a portal login</h3><input type="hidden" name="client_id" value={c.id} />
      <label>Client's email<input name="email" type="email" required defaultValue={c.email || ""} /></label><label>Temporary password (min 10 characters)<input name="password" type="text" required minLength={10} /></label>
      <p className="mut">Send these to the client on WhatsApp. They sign in at /portal/login. The email is not sent automatically.</p><button className="btn">Create login</button></form></>);
}
