import Link from "next/link";

const stack = ["Next.js", "React", "TypeScript", "Supabase", "Firebase", "Vercel"];

// Concentric halftone bands: big dots in the middle, finer toward the edge.
const bands = [
  { from: 0, to: 30, r: 3.4 },
  { from: 26, to: 55, r: 2.5 },
  { from: 51, to: 78, r: 1.7 },
  { from: 74, to: 100, r: 1 },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-4.75rem)] flex-col items-center overflow-hidden px-6 pt-12 text-center md:pt-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] text-ink">
        {bands.map((b) => {
          const m = `radial-gradient(ellipse 62% 100% at 50% 100%, transparent ${b.from}%, black ${b.from + 4}%, black ${b.to - 4}%, transparent ${b.to}%)`;
          return (
            <div
              key={b.r}
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, currentColor ${b.r}px, transparent ${b.r + 0.6}px)`,
                backgroundSize: "9px 9px",
                maskImage: m,
                WebkitMaskImage: m,
              }}
            />
          );
        })}
      </div>
      <h1 className="relative max-w-4xl text-[clamp(3.4rem,9vw,7.5rem)]">Stop the leakage. Automate your payments and booking systems.</h1>
      <p className="relative mt-6 max-w-md text-base text-ink/70">
        I build high-performance M-Pesa integrations and multi-tenant platforms that turn operational chaos into scalable revenue.
      </p>
      <Link href="#contact" className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition hover:bg-accent">
        Get in touch
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="7" y1="17" x2="17" y2="7" /><polyline points="8 7 17 7 17 16" />
        </svg>
      </Link>
      <div className="relative mt-auto w-full pb-8 pt-24">
        <p className="text-sm text-ink/60">Built with</p>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-10 gap-y-3 font-display text-xl text-ink">
          {stack.map((t) => (<li key={t}>{t}</li>))}
        </ul>
      </div>
    </section>
  );
}
