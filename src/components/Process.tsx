"use client";

import Reveal from "@/components/ui/Reveal";

export default function Process() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <h2 className="text-5xl md:text-7xl text-center">How we work</h2>
      </Reveal>
      
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {[
          { step: "01", title: "Audit", desc: "We map your current manual processes and identify the highest-leverage automation points." },
          { step: "02", title: "Build", desc: "Rapid deployment of your custom payment or booking engine with rigorous testing." },
          { step: "03", title: "Scale", desc: "Handover and optimization to ensure the system grows with your revenue." },
        ].map((s, i) => (
          <Reveal key={s.step} delay={i * 0.1} className="relative p-8 rounded-[2rem] border-2 border-ink/10">
            <span className="font-display text-6xl text-ink/10 absolute top-4 right-8">{s.step}</span>
            <h3 className="text-3xl relative">{s.title}</h3>
            <p className="mt-4 text-ink/70 leading-relaxed">{s.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
