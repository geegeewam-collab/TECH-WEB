"use client";

import Reveal from "@/components/ui/Reveal";

const projects = [
  { 
    name: "Arverdor Safaris", 
    url: "https://arverdorinternationalsafaris.com", 
    result: "Automated the booking and itinerary flow, reducing manual coordination by 60% and enabling instant confirmation for international clients." 
  },
  { 
    name: "African El Suites", 
    url: "https://african-el-suites.vercel.app", 
    result: "Launched a multi-tenant booking engine that scales across multiple properties, centralizing revenue management and reducing booking errors." 
  },
];

export default function Work() {
  return (
    <section id="work" className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <h2 className="text-5xl md:text-7xl">Proven results</h2>
      </Reveal>
      
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1}>
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="group block">
              <div className="relative h-72 overflow-hidden rounded-[2rem] bg-ink md:h-96">
                <div className="dots absolute inset-0 text-paper/20" aria-hidden="true" />
                <div className="absolute inset-0 flex items-center justify-center bg-ink/40 opacity-0 transition-opacity group-hover:opacity-100">
                   <span className="rounded-full bg-paper px-6 py-3 font-medium text-ink">Visit Site $\rightarrow$</span>
                </div>
                <iframe 
                  src={p.url} 
                  title={`${p.name} preview`} 
                  loading="lazy" 
                  tabIndex={-1} 
                  aria-hidden="true" 
                  className="pointer-events-none absolute left-0 top-0 h-[200%] w-[200%] origin-top-left scale-50 border-0 transition group-hover:scale-[0.52]" 
                />
              </div>
              <h3 className="mt-5 text-3xl group-hover:text-accent">{p.name}</h3>
              <p className="mt-2 text-ink/70">{p.result}</p>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
