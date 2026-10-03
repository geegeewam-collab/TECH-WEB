"use client";

import { whatsappUrl } from "@/lib/site";

const field = "w-full rounded-2xl border-2 border-ink/20 bg-white/40 bg-transparent p-4 outline-none focus:border-accent";

export default function Contact() {
  function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!whatsappUrl) return;
    const d = new FormData(e.currentTarget);
    const text = `Hi, I'm ${d.get("name")} (${d.get("email")}). ${d.get("message")}`;
    window.open(`${whatsappUrl}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  return (
    <section id="contact" className="mx-auto max-w-2xl px-6 py-24">
      <h2 className="text-5xl md:text-7xl">Let's build it</h2>
      {whatsappUrl ? (
        <form onSubmit={send} className="mt-12 grid gap-4">
          <input name="name" required placeholder="Your name" aria-label="Your name" className={field} />
          <input name="email" type="email" placeholder="Email (optional)" aria-label="Email" className={field} />
          <textarea name="message" required rows={4} placeholder="Tell me about your project" aria-label="Project details" className={field} />
          <button className="rounded-full bg-ink py-4 font-medium text-paper transition hover:bg-accent">Send on WhatsApp</button>
        </form>
      ) : (
        process.env.NODE_ENV !== "production" && (
          <p className="mt-12 text-center text-ink/60">Set NEXT_PUBLIC_WHATSAPP in .env.local (for example 2547XXXXXXXX) to enable the contact form.</p>
        )
      )}
    </section>
  );
}
