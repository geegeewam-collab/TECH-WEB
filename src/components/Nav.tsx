"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full relative z-50">
      <div className="flex items-center gap-8">
        <Link href="/" className="font-anton text-xl tracking-tighter text-ink">
          GEEGEE TECH
        </Link>
        <div className="hidden md:flex items-center gap-6 text-[14px] font-inter font-medium text-ink/70">
          <Link href="#services" className="hover:text-ink transition-colors">Services</Link>
          <Link href="#process" className="hover:text-ink transition-colors">Process</Link>
          <Link href="#about" className="hover:text-ink transition-colors">About</Link>
          <Link href="#contact" className="hover:text-ink transition-colors">Contact</Link>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <a
          href="https://wa.me/yournumber"
          className="hidden sm:block text-[14px] font-inter font-medium text-ink/70 hover:text-ink transition-colors"
        >
          WhatsApp
        </a>
        <Link
          href="#contact"
          className="px-5 py-2 rounded-full bg-ink text-paper text-[14px] font-inter font-bold transition-all hover:bg-opacity-90 active:scale-95"
        >
          Start a project
        </Link>
      </div>
    </nav>
  );
}
