"use client";

import { whatsappUrl } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";
import { CheckCircle2 } from "lucide-react";

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
      <Reveal>
        <div className="text-center">
          <h2 className="text-5xl md:text-7xl">Let's build it</h2>
          <p className="mt-6 text-xl text-ink/70">Ready to automate your revenue? Let's talk.</p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12 rounded-3xl bg-accent/10 p-8 border-2 border-accent/20">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="text-accent w-6 h-6" />
            <h3 className="text-2xl font-bold">Free 15-minute Payment Audit</h3>
          </div>
          <p className="text-ink/80 mb-6">
            I'll review your current checkout flow and identify exactly where you're losing money through operational leakage.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="#contact-form" 
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent/90"
            >
              Claim your audit
            </a>
          </div>
        </div>
      </Reveal>

      <div id="contact-form" className="mt-16">
        {whatsappUrl ? (
          <Reveal delay={0.2}>
            <form onSubmit={send} className="grid gap-4">
              <input name="name" required placeholder="Your name" aria-label="Your name" className={field} />
              <input name="email" type="email" placeholder="Email (optional)" aria-label="Email" className={field} />
              <textarea name="message" required rows={4} placeholder="Tell me about your project or audit request" aria-label="Project details" className={field} />
              <button className="rounded-full bg-ink py-4 font-medium text-paper transition hover:bg-accent">Send on WhatsApp</button>
            </form>
          </Reveal>
        ) : (
          process.env.NODE_ENV !== "production" && (
            <p className="mt-12 text-center text-ink/60">Set NEXT_PUBLIC_WHATSAPP in .env.local (for example 2547XXXXXXXX) to enable the contact form.</p>
          )
        )}
      </div>
    </section>
  );
}
