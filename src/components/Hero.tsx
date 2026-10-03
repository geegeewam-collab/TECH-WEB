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
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 text-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 technical-grid opacity-40" />

      <div className="absolute top-12 left-12 text-[10px] font-mono text-paper/30 uppercase tracking-widest pointer-events-none">
        System / 001 <br /> Lat: 01°17′S <br /> Lon: 36°49′E
      </div>
      <div className="absolute top-12 right-12 text-[10px] font-mono text-paper/30 uppercase tracking-widest pointer-events-none text-right">
        Operational Status: Active <br /> Protocol: High-Performance <br /> Region: East Africa
      </div>

      <div className="relative z-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.215, 0.61, 0.355, 1] }}
          className="flex flex-col items-center"
        >
          <h1 className="text-[clamp(4rem,15vw,12rem)] leading-[0.85] tracking-tighter text-paper uppercase">
            Stop <br />
            The <br />
            <span className="text-accent">Leakage.</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
            className="mt-12 max-w-xl text-lg md:text-xl text-paper/60 leading-relaxed"
          >
            Payment, booking and business systems built around how African businesses actually operate.
          </motion.p>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <Link
              href="#contact"
              className="group relative px-8 py-4 text-xs font-bold uppercase tracking-widest text-paper transition-all hover:text-accent"
            >
              Start a project
              <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ml-1">↗</span>
            </Link>
            <Link
              href="#work"
              className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-paper/40 transition-all hover:text-paper"
            >
              View Selected Work ↓
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 mt-32 w-full max-w-4xl">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="flex items-center justify-between w-full max-w-2xl relative">
            {[
              { label: "Enquiry", id: "01" },
              { label: "Booking", id: "02" },
              { label: "Payment", id: "03" },
              { label: "Confirmation", id: "04" },
              { label: "Revenue", id: "05" },
            ].map((node, i, arr) => (
              <div key={node.id} className="relative flex flex-col items-center group">
                <span className="text-[10px] font-mono text-paper/40 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {node.id}
                </span>
                <div className="w-2 h-2 rounded-full bg-paper/30 group-hover:bg-accent transition-colors" />
                <span className="absolute top-6 text-[11px] uppercase tracking-widest text-paper/60 group-hover:text-paper transition-colors">
                  {node.label}
                </span>
                {i < arr.length - 1 && (
                  <div className="absolute left-1/2 top-1 w-[calc(100%-100%)] h-px bg-paper/10 group-hover:bg-accent/40 transition-colors" style={{ width: 'calc(100% - 2rem)', left: '1rem' }} />
                )}
              </div>
            ))}
          </div>
          <div className="text-[10px] font-mono text-paper/30 uppercase tracking-widest">
            Infrastructure Flow / V.01
          </div>
        </div>
      </div>
    </section>
  );
}
