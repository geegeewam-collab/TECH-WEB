"use server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { requireAdmin } from "../../lib/supabase";
import { brand } from "../../lib/settings";
import { emailHtml, sendEmail } from "../../lib/email";
import { invoiceBook } from "../../lib/ledger";
import { invoicePdf } from "../../lib/pdf.mjs";
import { toMinor, lineTotal, dec, fmt } from "../../lib/money.mjs";
const UUID = /^[0-9a-f-]{36}$/, PATH = { proposal: "proposals", invoice: "invoices", statement: "statements" };
export async function sendDocEmail(fd) {
  const { user, db } = await requireAdmin(); const kind = String(fd.get("kind")), id = String(fd.get("id"));
  if (!UUID.test(id) || !PATH[kind]) return; const back = `/admin/${PATH[kind]}/${id}`, b = await brand(), h = await headers(), base = `${h.get("x-forwarded-proto") || "https"}://${h.get("host")}`;
  const since = new Date(Date.now() - 120000).toISOString();
  const { data: recent } = await db.from("email_log").select("id").eq("kind", kind).eq("entity_id", id).in("status", ["pending", "accepted"]).gte("created_at", since).limit(1);
  if (recent?.length) redirect(`${back}?mail=recent`);
  let m;
  if (kind === "proposal") {
    const { data: p } = await db.from("proposals").select("title,number,token,status,valid_until,clients(name,contact_name,email)").eq("id", id).maybeSingle();
    if (!p || p.status !== "sent" || !p.clients?.email) redirect(`${back}?mail=missing`);
    m = { to: p.clients.email, subject: `Proposal: ${p.title}`, title: "Your proposal", lines: [`Hi ${p.clients.contact_name || p.clients.name},`, `Please find our proposal "${p.title}" (${p.number}).`, p.valid_until ? `It is valid until ${p.valid_until}.` : "Please let us know if you have any questions."], cta: { label: "View and respond", url: `${base}/p/${p.token}` } };
  } else if (kind === "statement") {
    const { data: s } = await db.from("statements").select("number,token,period_from,period_to,snapshot,clients(name,contact_name,email)").eq("id", id).maybeSingle();
    if (!s?.clients?.email) redirect(`${back}?mail=missing`);
    m = { to: s.clients.email, subject: `Statement of account ${s.number}`, title: "Your statement of account", lines: [`Hi ${s.clients.contact_name || s.clients.name},`, `Your statement for ${s.period_from} to ${s.period_to} shows a balance of ${fmt(BigInt(s.snapshot.closing), s.snapshot.currency)}.`, "Please tell us if anything differs from your records."], cta: { label: "View statement", url: `${base}/s/${s.token}` } };
  } else {
    const { rows } = await invoiceBook(db, (q) => q.eq("id", id).eq("status", "issued")); const r = rows?.[0];
    const { data: f } = await db.from("invoices").select("payment_instructions,clients(name,contact_name,email),invoice_items(description,quantity,unit_price,position)").eq("id", id).maybeSingle();
    if (!r || !f?.clients?.email) redirect(`${back}?mail=missing`);
    const items = [...f.invoice_items].sort((a, c) => a.position - c.position).map((i) => ({ description: i.description, quantity: dec(toMinor(String(i.quantity))), unit_price: i.unit_price, total: lineTotal(toMinor(String(i.quantity)), toMinor(String(i.unit_price))) }));
    const pdf = await invoicePdf({ ...r, client: f.clients.name, payment_instructions: f.payment_instructions, items }, b.name);
    m = { to: f.clients.email, subject: `Invoice ${r.number}`, title: `Invoice ${r.number}`, lines: [`Hi ${f.clients.contact_name || f.clients.name},`, `Your invoice ${r.number} for ${fmt(r.total, r.currency)} is attached. It is due on ${r.due_date}.`, ...(f.payment_instructions ? [`How to pay: ${f.payment_instructions}`] : [])], attachments: [{ filename: `${r.number}.pdf`, content: pdf.toString("base64") }] };
  }
  const res = await sendEmail({ db, to: m.to, subject: m.subject, html: emailHtml({ brandName: b.name, title: m.title, lines: m.lines, cta: m.cta, footer: b.email ? `Questions? Reply to this email or write to ${b.email}.` : "Questions? Just reply to this email." }), kind, entity: PATH[kind], entityId: id, by: user.email, attachments: m.attachments });
  redirect(`${back}?mail=${res.ok ? "ok" : "fail"}`);
}
