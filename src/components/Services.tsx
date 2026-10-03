"use client";

import { motion } from "framer-motion";

const services = [
  { title: "Payment Integration", desc: "Secure, seamless payment flows that increase conversion rates.", price: "From $1,500" },
  { title: "Business Platforms", desc: "Custom booking, inventory, and management systems built to run.", price: "From $3,000" },
  { title: "Custom Systems", desc: "Tailored software solutions for complex business logic.", price: "Contact for quote" },
];

export default function Services() {
  return (
    <section className="py-[10rem] px-6 max-w-7xl mx-auto">
      <h2 className="text-6xl md:text-8xl font-anton mb-24 text-center">Services</h2>
      <div className="flex flex-col gap-0">
        {services.map((service, i) => (
          <motion.div
            key={i}
            whileHover="hover"
            className="group relative py-12 border-t border-ink/10 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
          >
            <div className="flex flex-col max-w-2xl">
              <motion.h3
                variants={{ hover: { x: 20 } }}
                className="text-2xl md:text-4xl font-anton mb-2 transition-all duration-300"
              >
                {service.title}
              </motion.h3>
              <p className="text-inter opacity-60 group-hover:opacity-100 transition-opacity">
                {service.desc}
              </p>
            </div>
            <div className="text-lg font-inter font-bold text-accent group-hover:translate-x-2 transition-transform">
              {service.price}
            </div>
            {/* Minimalist accent line */}
            <motion.div
              variants={{ hover: { width: "100%" } }}
              initial={{ width: 0 }}
              className="absolute bottom-0 left-0 h-[2px] bg-accent transition-all duration-300"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
