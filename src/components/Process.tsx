"use client";

import { motion } from "framer-motion";

const steps = [
  { title: "Discover", desc: "Deep dive into business goals and user pain points." },
  { title: "Design", desc: "Intentional blueprints and high-fidelity prototypes." },
  { title: "Build", desc: "Clean, scalable code with iterative shipping." },
  { title: "Launch", desc: "Smooth deployment and ongoing support." },
];

export default function Process() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <h2 className="text-5xl md:text-7xl font-anton mb-16">How I Work</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            <span className="block text-8xl md:text-9xl font-anton opacity-10"
                  style={{ WebkitTextStroke: "2px var(--ink)" }}>
              0{i + 1}
            </span>
            <h3 className="text-sm font-inter uppercase tracking-widest opacity-60 mt-2 mb-4">{step.title}</h3>
            <p className="text-inter opacity-70">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
