"use client";

import Reveal from "@/components/ui/Reveal";

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <h2 className="max-w-3xl text-5xl md:text-7xl">Invest in scalable systems</h2>
      </Reveal>
      
      <div className="mt-12 grid gap-4 md:grid-cols-6">
        <Reveal delay={0.1} className="relative overflow-hidden rounded-[2rem] bg-ink p-8 text-paper md:col-span-4 md:min-h-80">
          <div className="dots absolute inset-0 text-paper/15" aria-hidden="true" style={{ maskImage: "linear-gradient(115deg, transparent 35%, black)", WebkitMaskImage: "linear-gradient(115deg, transparent 35%, black)" }} />
          <div className="relative">
            <div className="flex items-center gap-3">
              <h3 className="text-5xl">Payment integration</h3>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">ROI: High</span>
            </div>
            <p className="mt-4 max-w-sm text-paper/70">Secure M-Pesa and card flows that eliminate payment leakage and turn visitors into paying customers automatically.</p>
            <p className="mt-10 font-display text-2xl font-bold">Investment from $1,500</p>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="rounded-[2rem] bg-accent p-8 text-paper md:col-span-2">
          <div className="relative">
            <div className="flex items-center gap-3">
              <h3 className="text-4xl">Business platforms</h3>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">ROI: Scalable</span>
            </div>
            <p className="mt-4 text-paper/80">Booking, inventory and management systems built around your actual operations to reduce overhead.</p>
            <p className="mt-10 font-display text-2xl font-bold">Investment from $3,000</p>
          </div>
        </Reveal>

        <Reveal delay={0.3} className="flex flex-col justify-between gap-4 rounded-2xl border-2 border-ink p-8 md:col-span-6 md:flex-row md:items-center">
          <div className="relative">
            <div className="flex items-center gap-3">
              <h3 className="text-3xl">Custom systems</h3>
              <span className="rounded-full bg-ink/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">ROI: Tailored</span>
            </div>
            <p className="mt-2 max-w-xl text-ink/70">High-value software for complex business logic that off-the-shelf tools simply cannot handle.</p>
          </div>
          <p className="font-display text-xl font-bold">Contact for a tailored quote</p>
        </Reveal>
      </div>
    </section>
  );
}
