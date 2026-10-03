"use client";

import { motion } from "framer-motion";
import { whatsappUrl } from "@/lib/site";

export default function Contact() {
  const field = "w-full bg-transparent border-b border-paper/10 py-4 outline-none focus:border-accent transition-colors duration-500 placeholder:text-paper/20 text-paper";

  function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!whatsappUrl) return;
    const d = new FormData(e.currentTarget);
    const text = `Hi GEEGEE TECH, I'm ${d.get("name")} from ${d.get("company")}. ${d.get("message")}`;
    window.open(`${whatsappUrl}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-32 md:py-40">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-20">
        <div className="md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <h2 className="text-6xl md:text-9xl uppercase tracking-tighter text-paper leading-[0.85]">
              Where is your <br />
              business <br />
              losing money?
            </h2>
            <p className="mt-12 text-xl md:text-2xl text-paper/60 max-w-lg leading-relaxed">
              Tell me what you're currently doing manually. <br />
              I'll show you what can be automated.
            </p>
            <div className="mt-12">
              <a
                href="#contact-form"
                className="group inline-flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-accent hover:text-paper transition-colors"
              >
                Start a conversation <span className="transition-transform group-hover:translate-x-1">↗</span>
              </a>
            </div>
          </motion.div>
        </div>

        <div id="contact-form" className="md:col-span-5">
          {whatsappUrl ? (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onSubmit={send}
              className="flex flex-col gap-12"
            >
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-paper/40">Name</label>
                <input name="name" required placeholder="Your name" className={field} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-paper/40">Email</label>
                <input name="email" type="email" placeholder="email@company.com" className={field} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-paper/40">Company</label>
                <input name="company" placeholder="Company name" className={field} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-paper/40">Project Details</label>
                <textarea name="message" required rows={4} placeholder="What are you trying to build?" className={field} />
              </div>
              <button className="group relative overflow-hidden rounded-full bg-paper py-5 px-8 text-xs font-bold uppercase tracking-widest text-ink transition-all hover:bg-accent hover:text-paper">
                <span className="relative z-10">Send Message →</span>
              </button>
            </motion.form>
          ) : (
            <p className="text-paper/40 text-sm">Contact form currently unavailable.</p>
          )}
        </div>
      </div>
    </section>
  );
}
