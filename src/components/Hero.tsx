"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl md:text-9xl font-anton text-ink leading-none mb-8 max-w-5xl"
      >
        Software that gets <br />
        <span className="text-accent">African businesses paid.</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="relative w-64 h-[450px] md:w-80 md:h-[550px] rounded-[40px] overflow-hidden shadow-2xl"
      >
        {/* Resolve Animation Container */}
        <motion.div
          initial={{ filter: "contrast(200%) brightness(100%) grayscale(1) blur(20px)", opacity: 0 }}
          animate={{ filter: "contrast(100%) brightness(100%) grayscale(0) blur(0)", opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          <Image
            src="/hero-inspire.jfif"
            alt="Hero Inspiration"
            fill
            className="object-cover"
          />
          {/* Halftone Overlay SVG */}
          <div className="absolute inset-0 pointer-events-none opacity-30"
               style={{ backgroundImage: 'radial-gradient(circle, var(--ink) 1px, transparent 1px)', backgroundSize: '4px 4px' }}
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-12"
      >
        <a
          href="#contact"
          className="px-8 py-4 rounded-full border-2 border-accent bg-accent text-paper font-bold transition-all duration-300 hover:bg-ink hover:border-ink"
        >
          Start a project
        </a>
      </motion.div>
    </section>
  );
}
