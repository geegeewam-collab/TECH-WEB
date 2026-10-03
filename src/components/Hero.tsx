"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const stack = ["Next.js", "React", "TypeScript", "Supabase", "Firebase", "Vercel", "M-Pesa Daraja"];

const bands = [
  { from: 0, to: 30, r: 3.4 },
  { from: 26, to: 55, r: 2.5 },
  { from: 51, to: 78, r: 1.7 },
  { from: 74, to: 100, r: 1 },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-4.75rem)] flex-col items-center overflow-hidden px-6 pt-12 text-center md:pt-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-end justify-center">
        <div
          className="w-full h-[70%] opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 2px)`,
            backgroundSize: "16px 16px",
            maskImage: "radial-gradient(circle at 50% 100%, black 0%, transparent 60%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 100%, black 0%, transparent 60%)",
            color: "var(--color-ink)"
          }}
        />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
        className="relative z-10 max-w-4xl text-[clamp(3.4rem,9vw,7.5rem)]"
      >
        Stop the leakage. Automate your payments and booking systems.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.215, 0.61, 0.355, 1] }}
        className="relative z-10 mt-6 max-w-md text-base text-ink/70"
      >
        I build high-performance M-Pesa integrations and multi-tenant platforms that turn operational chaos into scalable revenue.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        className="relative z-10"
      >
        <Link href="#contact" className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition hover:bg-accent">
          Get in touch
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="7" y1="17" x2="17" y2="7" /><polyline points="8 7 17 7 17 16" />
          </svg>
        </Link>
      </motion.div>

      <div className="relative z-10 mt-auto w-full pb-8 pt-24">
        <p className="text-sm text-ink/60">Built with</p>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-10 gap-y-3 font-display text-xl text-ink">
          {stack.map((t) => (<li key={t}>{t}</li>))}
        </ul>
      </div>
    </section>
  );
}
