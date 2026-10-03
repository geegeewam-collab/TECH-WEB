"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const works = [
  {
    title: "Flagship Fintech",
    result: "Reduced payment friction by 40% for 10k users.",
    size: "large",
    image: "/hero-inspire.jfif", // Using hero as placeholder
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
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <h2 className="text-5xl md:text-7xl font-anton mb-12">Selected Work</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[300px] gap-6">
        {works.map((work, i) => (
          <motion.a
            key={i}
            href="#"
            whileHover={{ y: -10 }}
            className={`relative group overflow-hidden rounded-2xl border border-black/10 p-8 flex flex-col justify-end transition-colors hover:border-accent ${
              work.size === "large" ? "md:col-span-2 md:row-span-2" : ""
            }`}
          >
            <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity">
              <Image src={work.image} alt={work.title} fill className="object-cover" />
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, var(--ink) 1px, transparent 1px)', backgroundSize: '6px 6px' }} />
            </div>

            <div className="relative z-10">
              <h3 className="text-xs font-inter uppercase tracking-widest opacity-60 mb-2">{work.title}</h3>
              <p className="text-inter opacity-80 mb-4">{work.result}</p>
              <motion.div
                whileHover={{ x: 5 }}
                className="text-2xl transition-colors group-hover:text-accent"
              >
                <ArrowRight size={32} />
              </motion.div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
