"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 text-center">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 technical-grid pointer-events-none" />

      {/* Floating Coordinate Metadata */}
      <div className="absolute top-20 left-12 text-[10px] font-mono text-paper/20 uppercase tracking-widest pointer-events-none hidden md:block">
        System / 001 <br /> Lat: 01°17′S <br /> Lon: 36°49′E
      </div>
      <div className="absolute top-20 right-12 text-[10px] font-mono text-paper/20 uppercase tracking-widest pointer-events-none text-right hidden md:block">
        Operational Status: Active <br /> Protocol: High-Performance <br /> Region: East Africa
      </div>

      <div className="relative z-10 max-w-7xl">
        <div className="flex flex-col items-center">
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.215, 0.61, 0.355, 1] }}
              className="text-[clamp(4rem,18vw,14rem)] leading-[0.8] tracking-tighter text-paper uppercase font-display"
            >
              Stop <br />
              The <br />
              <span className="text-accent">Leakage.</span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            className="mt-16 max-w-xl text-lg md:text-xl text-paper/60 leading-relaxed text-balance"
          >
            Payment, booking and business systems built around how African businesses actually operate.
          </motion.p>

          <div className="mt-16 flex flex-wrap justify-center gap-12">
            <Link
              href="#contact"
              className="group relative px-0 py-4 text-xs font-bold uppercase tracking-[0.2em] text-paper transition-all hover:text-accent"
            >
              Start a project
              <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ml-2">↗</span>
            </Link>
            <Link
              href="#work"
              className="px-0 py-4 text-xs font-bold uppercase tracking-[0.2em] text-paper/40 transition-all hover:text-paper"
            >
              View Selected Work ↓
            </Link>
          </div>
        </div>
      </div>

      {/* System Visualization */}
      <div className="relative z-10 mt-40 w-full max-w-5xl">
        <div className="flex flex-col items-center justify-center gap-12">
          <div className="flex items-center justify-between w-full max-w-3xl relative px-4">
            {[
              { label: "Enquiry", id: "01" },
              { label: "Booking", id: "02" },
              { label: "Payment", id: "03" },
              { label: "Confirmation", id: "04" },
              { label: "Revenue", id: "05" },
            ].map((node, i, arr) => (
              <div key={node.id} className="relative flex flex-col items-center group">
                <span className="text-[9px] font-mono text-paper/20 mb-3 opacity-0 group-hover:opacity-100 transition-opacity uppercase">
                  {node.id}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-paper/30 group-hover:bg-accent transition-colors duration-500" />
                <span className="absolute top-8 text-[10px] uppercase tracking-widest text-paper/40 group-hover:text-paper transition-colors duration-500">
                  {node.label}
                </span>
                {i < arr.length - 1 && (
                  <div className="absolute left-1/2 top-1 w-[calc(100%-100%)] h-px bg-paper/10 group-hover:bg-accent/40 transition-colors duration-500" style={{ width: 'calc(100% - 2rem)', left: '1rem' }} />
                )}
              </div>
            ))}
          </div>
          <div className="text-[9px] font-mono text-paper/20 uppercase tracking-[0.3em]">
            Infrastructure Flow / V.01
          </div>
        </div>
      </div>
    </section>
  );
}
