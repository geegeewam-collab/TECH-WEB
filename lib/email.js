import "server-only";
import { brand } from "./settings";
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// Plain table layout with inline styles so it renders in Gmail and Outlook.
export const emailHtml = ({ brandName, title, lines, cta, footer }) => `<!doctype html><html><body style="margin:0;background:#EDEFE8;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px"><table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px"><tr><td style="background:#0C3B2E;color:#F6F7F2;padding:20px 28px;font-weight:bold;font-size:16px">${esc(brandName)}</td></tr><tr><td style="padding:28px;color:#0C3B2E;font-size:15px;line-height:1.6"><h1 style="font-size:22px;margin:0 0 16px">${esc(title)}</h1>${lines.map((l) => `<p style="margin:0 0 14px">${esc(l)}</p>`).join("")}${cta ? `<p style="margin:24px 0"><a href="${esc(cta.url)}" style="background:#0C3B2E;color:#ffffff;padding:12px 22px;border-radius:99px;text-decoration:none;display:inline-block">${esc(cta.label)}</a></p>` : ""}</td></tr><tr><td style="padding:16px 28px;color:#4F6358;font-size:12px">${esc(footer || "")}</td></tr></table></td></tr></table></body></html>`;
// Every send is logged first. "accepted" means the email provider took it, not that it was delivered.
export async function sendEmail({ db, to, subject, html, kind, entity, entityId, by, attachments }) {
  const key = process.env.RESEND_API_KEY, from = process.env.ENQUIRY_FROM_EMAIL;
  if (!key || !from) return { ok: false, error: "Email sending is not set up yet." };
  const { data: log } = await db.from("email_log").insert({ kind, to_email: to, subject, entity, entity_id: entityId, sent_by: by }).select("id").single();
  const done = (patch) => log && db.from("email_log").update(patch).eq("id", log.id);
  let r; const b = await brand();
  try { r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [to], subject, html, reply_to: b.email || undefined, attachments }) }); }
  catch { await done({ status: "failed", error: "network error" }); return { ok: false, error: "Network error." }; }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { const e = `HTTP ${r.status}${j.message ? `: ${String(j.message).slice(0, 160)}` : ""}`; await done({ status: "failed", error: e }); return { ok: false, error: e }; }
  await done({ status: "accepted", provider_id: j.id || null }); return { ok: true };
}
