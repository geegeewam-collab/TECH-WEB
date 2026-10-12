import fs from "fs";
import path from "path";
import { requireAdmin } from "../../../../lib/supabase";
import { brand } from "../../../../lib/settings";
import { saveSettings } from "../../settings-actions";
export const dynamic = "force-dynamic";
export default async function Settings({ searchParams }) {
  const { db } = await requireAdmin(); const sp = await searchParams;
  const { data } = await db.from("settings").select("key,value"); const s = Object.fromEntries((data || []).map((r) => [r.key, r.value || ""]));
  const b = await brand(), e = process.env, has = (k) => !!e[k];
  const shots = fs.existsSync(path.join(process.cwd(), "public", "work")) ? fs.readdirSync(path.join(process.cwd(), "public", "work")).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).length : 0;
  const checks = [["Database connected", has("NEXT_PUBLIC_SUPABASE_URL") && has("SUPABASE_SERVICE_ROLE_KEY")], ["Admin email list set", has("ADMIN_EMAILS")], ["Public site URL set", has("NEXT_PUBLIC_SITE_URL")],
    ["Business name saved here", !!s.brand_name], ["Contact email saved here", !!s.contact_email], ["WhatsApp number saved here", !!s.whatsapp], ["Payment instructions saved here", !!(s.payment_instructions || e.PAYMENT_INSTRUCTIONS)],
    ["Email alerts and sending (Resend key, from, to)", has("RESEND_API_KEY") && has("ENQUIRY_FROM_EMAIL") && has("ENQUIRY_TO_EMAIL")], ["Real project screenshots added", shots >= 2]];
  return (<><h1>Settings</h1>{sp?.saved && <p className="ok">Saved.</p>}{sp?.e && <p className="err">Check the email, WhatsApp number (digits only, with country code) and payment days.</p>}
    <form action={saveSettings} className="form wide"><label>Business name<input name="brand_name" maxLength={160} defaultValue={s.brand_name || ""} placeholder={b.name} /></label>
      <label>Short description<textarea name="description" rows={2} maxLength={1000} defaultValue={s.description || ""} placeholder={b.desc} /></label>
      <label>Contact email (shown on the site)<input name="contact_email" type="email" defaultValue={s.contact_email || ""} /></label>
      <label>WhatsApp number (digits only, e.g. 254712345678)<input name="whatsapp" inputMode="numeric" defaultValue={s.whatsapp || ""} /></label>
      <label>Payment instructions (printed on new invoices)<textarea name="payment_instructions" rows={3} maxLength={1000} defaultValue={s.payment_instructions || ""} placeholder="M-Pesa Paybill/Till, account name, bank details" /></label>
      <label>Payment terms (days until an invoice is due)<input name="payment_terms_days" inputMode="numeric" defaultValue={s.payment_terms_days || ""} placeholder="14" /></label><button className="btn">Save settings</button></form>
    <h2>Launch checklist</h2><div className="card">{checks.map(([t, ok]) => <p key={t}>{ok ? "✓" : "○"} {t}</p>)}<p className="mut">Secrets such as keys are set in your hosting settings and are never shown here.</p></div></>);
}
