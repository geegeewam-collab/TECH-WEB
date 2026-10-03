"use client";

import { motion } from "framer-motion";

export default function ProofStrip() {
  const stats = [
    { label: "Products Live", value: "12+" },
    { label: "Clients Served", value: "40+" },
    { label: "Payments Processed", value: "$2M+" },
  ];

  return (
    <div className="w-full bg-ink text-paper py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-12">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col"
          >
            <span className="text-5xl md:text-7xl font-anton leading-none">{stat.value}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-inter opacity-60 mt-2">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
