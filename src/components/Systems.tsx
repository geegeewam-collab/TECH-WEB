"use client";

import { motion } from "framer-motion";

const systems = [
  {
    id: "01",
    title: "Payment Systems",
    desc: "Secure M-Pesa and card flows that eliminate payment leakage and turn visitors into paying customers automatically.",
    roi: " typically recovers 10-20 hours of manual finance admin per week"
  },
  {
    id: "02",
    title: "Booking Platforms",
    desc: "Multi-tenant booking engines for hospitality and services that eliminate double-bookings and manual coordination.",
    roi: " eliminating booking errors and manual tracking entirely"
  },
  {
    id: "03",
    title: "Business Management",
    desc: "Custom operational dashboards and workflow tools that replace spreadsheets and fragmented WhatsApp messages.",
    roi: " centralizing business logic into a single source of truth"
  },
  {
    id: "04",
    title: "Automation",
    desc: "Intelligent triggers and API integrations that handle the repetitive parts of your business while you sleep.",
    roi: " reducing operational overhead by up to 40%"
  },
  {
    id: "05",
    title: "Custom Digital Products",
    desc: "High-performance software for complex business logic that off-the-shelf tools simply cannot handle.",
    roi: " tailored exactly to your unique operational DNA"
  },
];

export default function Systems() {
  return (
    <section id="systems" className="mx-auto max-w-7xl px-6 py-32 md:py-40">
      <div className="flex flex-col mb-24">
        <span className="text-[10px] font-mono text-paper/30 uppercase tracking-[0.3em] mb-4">Capabilities</span>
        <h2 className="text-5xl md:text-8xl uppercase tracking-tighter text-paper">What I Build</h2>
      </div>

      <div className="flex flex-col border-t border-paper/10">
        {systems.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group relative grid grid-cols-1 md:grid-cols-12 py-12 border-b border-paper/10 cursor-pointer hover:bg-paper/[0.02] transition-colors duration-500"
          >
            <div className="md:col-span-1 flex items-center">
              <span className="text-xs font-mono text-paper/30 group-hover:text-accent transition-colors">{s.id}</span>
            </div>
            <div className="md:col-span-6 py-4 md:py-0">
              <h3 className="text-2xl md:text-4xl uppercase tracking-tighter text-paper group-hover:translate-x-2 transition-transform duration-500">
                {s.title}
              </h3>
            </div>
            <div className="md:col-span-5 flex flex-col justify-center text-right">
              <p className="text-sm text-paper/50 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                {s.desc} <span className="text-accent font-medium">{s.roi}</span>
              </p>
              <span className="text-[10px] uppercase tracking-widest text-paper/20 mt-2">Explore System ↗</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
