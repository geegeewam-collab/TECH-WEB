"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import HeroArt from './HeroArt';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-[#F4F3F0]">
      {/* Grain Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[clamp(2.75rem,7vw,6rem)] font-anton text-ink leading-[0.95] tracking-tight mb-6"
        >
          Software That Gets <br />
          African Businesses Paid.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base text-[#444] max-w-[420px] mb-10 font-inter"
        >
          Payment integrations, booking platforms and custom systems built around how African businesses actually run.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            href="#contact"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-ink text-paper font-bold transition-all hover:-translate-y-1 hover:shadow-lg active:scale-95"
          >
            Start a project
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="13 7 17 7 17 13"></polyline>
            </svg>
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 w-full h-[45vh] md:h-[55vh] overflow-hidden pointer-events-none">
        <div
          className="relative w-full h-full"
          style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%)' }}
        >
          <HeroArt />
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 opacity-50 z-10">
        <span className="text-[12px] font-inter text-ink/60 uppercase tracking-widest">Built with</span>
        <div className="flex gap-4 text-[13px] font-inter font-medium text-ink">
          <span>Next.js</span>
          <span className="opacity-30">•</span>
          <span>Supabase</span>
          <span className="opacity-30">•</span>
          <span>Firebase</span>
          <span className="opacity-30">•</span>
          <span>Vercel</span>
          <span className="opacity-30">•</span>
          <span>M-Pesa Daraja</span>
        </div>
      </div>
    </section>
  );
}
