"use client";

import { motion } from "framer-motion";

const services = [
  { title: "Payment Integration", desc: "Secure, seamless payment flows that increase conversion rates.", price: "From $1,500" },
  { title: "Business Platforms", desc: "Custom booking, inventory, and management systems built to run.", price: "From $3,000" },
  { title: "Custom Systems", desc: "Tailored software solutions for complex business logic.", price: "Contact for quote" },
];

export default function Services() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <h2 className="text-5xl md:text-7xl font-anton mb-12">Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, i) => (
          <motion.div
            key={i}
            whileHover={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
            className="p-8 border-2 border-ink rounded-lg transition-all duration-300 cursor-pointer group"
          >
            <h3 className="text-3xl font-anton mb-4">{service.title}</h3>
            <p className="text-inter opacity-70 group-hover:opacity-100 mb-8">{service.desc}</p>
            <span className="block font-bold text-lg">{service.price}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
