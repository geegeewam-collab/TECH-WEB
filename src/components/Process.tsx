"use client";

import { motion } from "framer-motion";

export default function Process() {
  const steps = [
    { id: "01", title: "Find the Leak", desc: "Analyze your current manual processes to identify where time, money, or customers are being lost." },
    { id: "02", title: "Design the System", desc: "Turn the operational problem into a clear, efficient digital workflow and a refined technical blueprint." },
    { id: "03", title: "Build & Deploy", desc: "High-velocity development and deployment of your system directly into your real-world business." },
  ];

  return (
    <section id="process" className="mx-auto max-w-7xl px-6 py-32 md:py-40">
      <div className="flex flex-col mb-24">
        <span className="text-[10px] font-mono text-paper/30 uppercase tracking-[0.3em] mb-4">Methodology</span>
        <h2 className="text-5xl md:text-8xl uppercase tracking-tighter text-paper">How it works</h2>
      </div>

      <div className="flex flex-col gap-12">
        {steps.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group relative grid grid-cols-1 md:grid-cols-12 items-start py-12 border-t border-paper/10"
          >
            <div className="md:col-span-2">
              <span className="text-6xl md:text-8xl font-display text-paper/10 group-hover:text-accent/40 transition-colors duration-700">
                {s.id}
              </span>
            </div>
            <div className="md:col-span-10">
              <h3 className="text-3xl md:text-5xl uppercase tracking-tighter text-paper mb-6">{s.title}</h3>
              <p className="text-lg md:text-xl text-paper/60 leading-relaxed max-w-2xl">
                {s.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
