export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  // Accept same-origin submissions only when an Origin header is present.
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return res.status(403).json({ message: "This request could not be verified." });
    } catch {
      return res.status(403).json({ message: "This request could not be verified." });
    }
  }

  const body = typeof req.body === "object" && req.body !== null ? req.body : {};
  // Honeypot: quietly accept bot submissions without adding them to the list.
  if (typeof body.website === "string" && body.website.trim()) {
    return res.status(200).json({ message: "Thanks — you're on the list." });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ message: "The signup service is not connected yet. Please try again later." });
  }

  const contact = { email, unsubscribed: false };
  if (process.env.RESEND_SEGMENT_ID) contact.segments = [{ id: process.env.RESEND_SEGMENT_ID }];

  try {
    const upstream = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contact)
    });
    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      // Do not reveal provider response details or internal configuration.
      const message = upstream.status === 409
        ? "You're already on our list — thank you."
        : "We couldn't save your email just now. Please try again shortly.";
      return res.status(upstream.status === 409 ? 200 : 502).json({ message });
    }
    return res.status(200).json({ message: "You're on the list. Thanks for being here." });
  } catch {
    return res.status(502).json({ message: "The signup service is temporarily unavailable. Please try again." });
  }
}
