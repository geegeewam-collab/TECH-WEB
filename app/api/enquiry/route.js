import { validateEnquiry } from "../../../lib/leads.mjs";
import { db } from "../../../lib/supabase";
const hits = new Map();
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fail = (m, s) => Response.json({ error: m }, { status: s });
export async function POST(req) {
  let b; try { b = await req.json(); } catch { return fail("Invalid request.", 400); }
  const v = validateEnquiry(b);
  if (v.bot) return Response.json({ ok: true });
  if (v.error) return fail(v.error, 400);
  const ip = (req.headers.get("x-forwarded-for") || "x").split(",")[0], now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 600000);
  if (recent.length >= 5) return fail("Too many enquiries. Please try again later.", 429);
  const sb = db(), d = v.data;
  if (!sb) return fail("Enquiries are not set up on this site yet. Please try again later.", 503);
  const since = new Date(now - 600000).toISOString();
  const dup = await sb.from("leads").select("id").eq("email", d.email).eq("message", d.message).gte("created_at", since).limit(1);
  if (dup.error) { console.error("lead lookup failed", dup.error.code); return fail("We could not save your enquiry. Please try again.", 500); }
  if (dup.data.length) return Response.json({ ok: true });
  const ins = await sb.from("leads").insert(d).select("id").single();
  if (ins.error) { console.error("lead insert failed", ins.error.code); return fail("We could not save your enquiry. Please try again.", 500); }
  hits.set(ip, [...recent, now]);
  // The lead is saved. Email is a recorded best-effort notification, never the only copy.
  const key = process.env.RESEND_API_KEY, to = process.env.ENQUIRY_TO_EMAIL, from = process.env.ENQUIRY_FROM_EMAIL;
  let ns = "skipped", ne = null;
  if (key && to && from) {
    try {
      const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [to], reply_to: d.email, subject: `New enquiry from ${d.name}`, html: `<p><b>${esc(d.name)}</b> (${esc(d.email)})${d.business ? `<br>${esc(d.business)}` : ""}</p><p>${esc(d.message).replace(/\n/g, "<br>")}</p>` }) });
      ns = r.ok ? "sent" : "failed"; if (!r.ok) ne = `HTTP ${r.status}`;
    } catch { ns = "failed"; ne = "network error"; }
  }
  await sb.from("leads").update({ notify_status: ns, notify_error: ne }).eq("id", ins.data.id);
  return Response.json({ ok: true });
}
