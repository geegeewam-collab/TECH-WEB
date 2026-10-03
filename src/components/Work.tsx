"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const projects = [
  {
    id: "01",
    name: "Arverdor Safaris",
    url: "https://arverdorinternationalsafaris.co.ke",
    result: "Automated the booking and itinerary flow, reducing manual coordination by 60% and enabling instant confirmation for international clients.",
    tags: ["BOOKING", "ITINERARY", "AUTOMATION"]
  },
  {
    id: "02",
    name: "African El Suites",
    url: "https://african-el-suites.vercel.app",
    result: "Launched a multi-tenant booking engine that scales across multiple properties, centralizing revenue management and reducing booking errors.",
    tags: ["DIRECT BOOKING", "MULTI-TENANT", "REVENUE MGMT"]
  },
  {
    id: "03",
    name: "GeeGee System",
    url: "#",
    result: "Custom business operations and workflow infrastructure designed to eliminate spreadsheets and manual WhatsApp tracking.",
    tags: ["OPERATIONS", "WORKFLOW", "INFRASTRUCTURE"]
  },
];

export default function Work() {
  return (
    <section id="work" className="mx-auto max-w-7xl px-6 py-32 md:py-40">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-6">
        <h2 className="text-5xl md:text-8xl uppercase tracking-tighter text-paper">Selected Work</h2>
        <p className="text-sm text-paper/50 max-w-xs uppercase tracking-widest leading-relaxed">
          Digital systems built around real operational problems.
        </p>
      </div>

      <div className="flex flex-col gap-40">
        {projects.map((p) => (
          <div key={p.id} className="group relative grid gap-12 md:grid-cols-12 items-center">
            <div className="md:col-span-4 flex flex-col gap-4">
              <span className="text-[10px] font-mono text-paper/30 uppercase tracking-widest">{p.id} / {p.name}</span>
              <h3 className="text-4xl md:text-6xl uppercase tracking-tighter text-paper">{p.name}</h3>
              <p className="text-lg text-paper/60 leading-relaxed max-w-sm">{p.result}</p>
              <div className="flex flex-wrap gap-3 mt-4">
                {p.tags.map(tag => (
                  <span key={tag} className="text-[9px] uppercase tracking-widest text-paper/40 border border-paper/10 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={p.url}
                target="_blank"
                className="mt-8 text-xs font-bold uppercase tracking-widest text-accent group-hover:translate-x-2 transition-transform inline-flex items-center gap-2"
              >
                View Project <span className="text-lg">↗</span>
              </Link>
            </div>

            <div className="md:col-span-8 relative overflow-hidden rounded-sm aspect-video bg-ink border border-paper/5">
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                className="w-full h-full relative"
              >
                <iframe
                  src={p.url}
                  title={`${p.name} preview`}
                  loading="lazy"
                  className="pointer-events-none absolute inset-0 w-full h-full scale-125 origin-top-left border-0"
                />
                <div className="absolute inset-0 bg-ink/20 group-hover:bg-transparent transition-colors duration-500" />
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
