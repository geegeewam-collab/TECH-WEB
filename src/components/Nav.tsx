"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-8 transition-all duration-300 md:px-12">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-display text-lg tracking-tighter text-paper">
          GEEGEE TECH
        </Link>
        <div className="hidden items-center gap-2 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-medium text-accent uppercase tracking-widest sm:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
          </span>
          Available for select projects
        </div>
      </div>

      <nav className="flex items-center gap-8 text-[11px] font-medium uppercase tracking-[0.2em] text-paper/60">
        <Link href="#work" className="hover:text-paper transition-colors">Work</Link>
        <Link href="#systems" className="hover:text-paper transition-colors">Systems</Link>
        <Link href="#about" className="hover:text-paper transition-colors">About</Link>
        <Link href="#contact" className="hover:text-paper transition-colors">Contact</Link>
      </nav>
    </header>
  );
}
