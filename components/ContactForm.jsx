"use client";
import { useState } from "react";
import { trackLead } from "../lib/track";
export default function ContactForm() {
  const [s, setS] = useState({ k: "idle" });
  async function go(e) {
    e.preventDefault(); setS({ k: "busy" });
    const d = Object.fromEntries(new FormData(e.target));
    try { d.attribution = JSON.parse(localStorage.getItem("gg_attr") || "{}"); } catch {}
    try {
      const r = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
      const j = await r.json().catch(() => ({}));
      if (r.ok) { e.target.reset(); setS({ k: "ok" }); trackLead(); } else setS({ k: "err", m: j.error || "Something went wrong. Please try again." });
    } catch { setS({ k: "err", m: "Network error. Please try again." }); }
  }
  if (s.k === "ok") return <p className="ok" role="status">Thank you. Your enquiry has been received and we will reply by email.</p>;
  return (
    <form onSubmit={go} className="form" noValidate={false}>
      <label>Your name<input name="name" required maxLength={120} autoComplete="name" /></label>
      <label>Email<input name="email" type="email" required maxLength={160} autoComplete="email" /></label>
      <label>Business <span>(optional)</span><input name="business" maxLength={160} /></label>
      <label>What do you need?<textarea name="message" required minLength={10} maxLength={3000} rows={5} /></label>
      <label>Phone <span>(optional)</span><input name="phone" type="tel" maxLength={40} autoComplete="tel" /></label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />
      <p className="fine">We only use these details to reply to your enquiry. <a href="/privacy">Privacy</a></p>
      <button className="btn" disabled={s.k === "busy"}>{s.k === "busy" ? "Sending…" : "Send enquiry"}</button>
      {s.k === "err" && <p className="err" role="alert">{s.m}</p>}
    </form>);
}
