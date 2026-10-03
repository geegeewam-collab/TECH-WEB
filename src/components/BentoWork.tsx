"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const works = [
  {
    title: "Flagship Fintech",
    result: "Reduced payment friction by 40% for 10k users.",
    size: "large",
    image: "/hero-inspire.jfif",
  },
  {
    title: "Booking App",
    result: "Automated scheduling for 50+ salons.",
    size: "small",
    image: "/contact-inspire.jfif",
  },
  {
    title: "SaaS Platform",
    result: "Scaling B2B operations globally.",
    size: "small",
    image: "/hero-inspire.jfif",
  },
];

export default function BentoWork() {
  return (
    <section className="py-[10rem] px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-20">
        <h2 className="text-6xl md:text-8xl font-anton leading-none">Selected<br />Work</h2>
        <p className="hidden md:block text-sm font-inter uppercase tracking-widest opacity-40 pb-4">
          Curated Case Studies / 2024-2026
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4">
        {works.map((work, i) => (
          <motion.a
            key={i}
            href="#"
            whileHover={{ scale: 1.01 }}
            className={`relative group overflow-hidden rounded-3xl transition-all duration-500 ${
              work.size === "large" ? "md:col-span-2 md:row-span-2" : ""
            }`}
          >
            <div className="absolute inset-0 z-0">
              <Image src={work.image} alt={work.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
            </div>

            <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
              <span className="text-[10px] uppercase tracking-[0.2em] font-inter text-paper opacity-60 mb-2">
                {work.title}
              </span>
              <p className="text-paper text-lg md:text-2xl font-inter mb-6 max-w-md">
                {work.result}
              </p>
              <div className="flex items-center gap-2 text-paper font-bold text-sm uppercase tracking-widest group-hover:text-accent transition-colors">
                View Case Study <ArrowRight size={16} />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
