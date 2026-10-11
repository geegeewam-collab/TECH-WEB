const hits = new Map();
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export async function POST(req) {
  let b; try { b = await req.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  if (b.website) return Response.json({ ok: true }); // honeypot: silently drop bots
  const ip = (req.headers.get("x-forwarded-for") || "x").split(",")[0], now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 600000);
  if (recent.length >= 5) return Response.json({ error: "Too many enquiries. Please try again later." }, { status: 429 });
  const name = String(b.name || "").trim(), email = String(b.email || "").trim(), message = String(b.message || "").trim(), business = String(b.business || "").trim();
  if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160 || message.length < 10 || message.length > 3000)
    return Response.json({ error: "Please check your name, email and message." }, { status: 400 });
  const key = process.env.RESEND_API_KEY, to = process.env.ENQUIRY_TO_EMAIL, from = process.env.ENQUIRY_FROM_EMAIL;
  if (!key || !to || !from) return Response.json({ error: "Enquiries are not set up on this site yet. Please try again later." }, { status: 503 });
  try {
    const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject: `New enquiry from ${name}`,
        html: `<p><b>${esc(name)}</b> (${esc(email)})${business ? `<br>Business: ${esc(business)}` : ""}</p><p>${esc(message).replace(/\n/g, "<br>")}</p>` }) });
    if (!r.ok) { console.error("Resend failed", r.status); return Response.json({ error: "We could not send your enquiry. Please try again." }, { status: 502 }); }
  } catch { return Response.json({ error: "We could not send your enquiry. Please try again." }, { status: 502 }); }
  hits.set(ip, [...recent, now]);
  return Response.json({ ok: true });
}
