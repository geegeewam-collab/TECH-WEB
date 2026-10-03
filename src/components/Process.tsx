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
    <section className="py-[10rem] px-6 max-w-7xl mx-auto">
      <h2 className="text-6xl md:text-8xl font-anton mb-32 text-center">Process</h2>

      <div className="flex flex-col gap-32 md:gap-64">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            className={`relative flex flex-col ${i % 2 === 0 ? 'md:items-start' : 'md:items-end'} text-left md:text-right`}
          >
            <span className="text-[12rem] md:text-[20rem] font-anton text-ink/5 absolute -top-24 -z-10 left-0 md:left-auto md:right-0 select-none pointer-events-none">
              0{i + 1}
            </span>
            <div className="relative z-10 max-w-md">
              <h3 className="text-sm font-inter uppercase tracking-[0.3em] opacity-50 mb-4">{step.title}</h3>
              <p className="text-2xl md:text-4xl font-inter leading-tight text-ink">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
