"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Contact() {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto text-center">
      <h2 className="text-6xl md:text-9xl font-anton mb-16">Let's build it</h2>

      <div className="flex flex-col items-center gap-12">
        <motion.a
          href="https://wa.me/yournumber"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-12 py-6 rounded-full bg-[#25D366] text-white font-bold text-xl shadow-xl hover:bg-accent transition-colors"
        >
          Chat on WhatsApp
        </motion.a>

        <div className="w-full max-w-2xl relative">
          {/* Visual Inspiration integration */}
          <div className="absolute -inset-4 opacity-10 pointer-events-none rotate-3">
            <Image src="/contact-inspire.jfif" alt="Inspiration" fill className="object-cover rounded-2xl" />
          </div>

          <form className="relative z-10 grid grid-cols-1 gap-4 text-left">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-xs uppercase tracking-widest opacity-50">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your Name"
                className="w-full p-4 bg-transparent border border-ink/20 rounded-lg focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs uppercase tracking-widest opacity-50">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Email Address"
                className="w-full p-4 bg-transparent border border-ink/20 rounded-lg focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="message" className="text-xs uppercase tracking-widest opacity-50">Project Details</label>
              <textarea
                id="message"
                rows={4}
                placeholder="Tell me about your project..."
                className="w-full p-4 bg-transparent border border-ink/20 rounded-lg focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <button className="w-full py-4 bg-ink text-paper font-bold rounded-full hover:bg-accent transition-all duration-300">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
