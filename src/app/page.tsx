"use client";

import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Process from "@/components/Process";
import Systems from "@/components/Systems";
import Contact from "@/components/Contact";
import Reveal from "@/components/ui/Reveal";

export default function Home() {
  return (
    <main className="bg-ink text-paper">
      <Hero />

      <Reveal>
        <Work />
      </Reveal>

      <Reveal>
        <Systems />
      </Reveal>

      <Reveal>
        <Process />
      </Reveal>

      <section id="about" className="mx-auto max-w-7xl px-6 py-32 md:py-40">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-20 items-center">
          <div className="md:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <h2 className="text-5xl md:text-8xl uppercase tracking-tighter leading-[0.85] mb-12">
                Built in <br /> Nairobi. <br />
                <span className="text-accent">Built for real business.</span>
              </h2>
            </motion.div>
          </div>
          <div className="md:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-8"
            >
              <p className="text-xl md:text-2xl text-paper/60 leading-relaxed">
                I build digital infrastructure for businesses that have outgrown spreadsheets, WhatsApp messages and manual processes.
              </p>
              <div className="flex items-center gap-6 pt-8 border-t border-paper/10">
                <span className="text-[10px] font-mono text-paper/40 uppercase tracking-widest">Nairobi / Kenya</span>
                <span className="text-[10px] font-mono text-paper/40 uppercase tracking-widest">01°17′S / 36°49′E</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-32 md:py-40">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-20">
          <div className="md:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <h3 className="text-3xl uppercase tracking-tighter mb-6">GeeGee Tech / Digital Systems / Nairobi</h3>
              <p className="text-lg text-paper/60 leading-relaxed">
                A specialized technology studio focused on the intersection of financial infrastructure and operational efficiency in East Africa. We don't just build websites; we build the systems that drive revenue.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <Reveal>
        <Contact />
      </Reveal>

      <footer className="mx-auto max-w-7xl px-6 py-20 border-t border-paper/10 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col gap-4">
          <span className="font-display text-xl tracking-tighter">GEEGEE TECH</span>
          <span className="text-[10px] font-mono text-paper/40 uppercase tracking-widest">Nairobi / Kenya</span>
        </div>
        <nav className="flex gap-12 text-[10px] font-medium uppercase tracking-widest text-paper/50">
          <Link href="#work" className="hover:text-paper transition-colors">Work</Link>
          <Link href="#systems" className="hover:text-paper transition-colors">About</Link>
          <Link href="#contact" className="hover:text-paper transition-colors">Contact</Link>
        </nav>
        <div className="flex gap-6 text-[10px] font-medium uppercase tracking-widest text-paper/50">
          <a href="#" className="hover:text-paper transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-paper transition-colors">GitHub</a>
          <a href="mailto:hello@geegeetech.com" className="hover:text-paper transition-colors">Email</a>
        </div>
        <div className="text-[10px] font-mono text-paper/20 uppercase tracking-widest">
          © 2026 GEEGEE TECH
        </div>
      </footer>
    </main>
  );
}
