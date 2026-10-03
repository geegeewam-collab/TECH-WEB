"use client";

import { motion } from "framer-motion";

export default function ProofStrip() {
  const stats = [
    { label: "Products Live", value: "12+" },
    { label: "Clients Served", value: "40+" },
    { label: "Payments Processed", value: "$2M+" },
  ];

  return (
    <div className="w-full border-y-2 border-ink py-12 px-6 flex flex-wrap justify-around gap-8 items-center">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="text-center"
        >
          <div className="text-3xl md:text-5xl font-anton font-bold uppercase">{stat.value}</div>
          <div className="text-sm font-inter uppercase tracking-widest opacity-70">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
