import Link from "next/link";
import HeroArt from "./HeroArt";

const stack = ["Next.js", "Supabase", "Firebase", "Vercel", "M-Pesa Daraja"];

export default function Hero() {
  return (
    <section className="grain relative flex min-h-[calc(100svh-4.75rem)] flex-col items-center overflow-hidden px-6 pt-14 text-center md:pt-20">
      <h1 className="rise relative max-w-4xl text-[clamp(2.9rem,8vw,6.5rem)]">Software That Gets African Businesses Paid.</h1>
      <p className="rise relative mt-6 max-w-md text-base text-ink/70" style={{ animationDelay: ".1s" }}>
        Payment integrations, booking platforms and custom systems built around how African businesses actually run.
      </p>
      <Link
        href="#contact"
        style={{ animationDelay: ".2s" }}
        className="rise relative mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-medium text-paper transition hover:bg-accent"
      >
        Start a project
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="7" y1="17" x2="17" y2="7" /><polyline points="8 7 17 7 17 16" />
        </svg>
      </Link>
      <div className="relative mt-10 w-full flex-1">
        <HeroArt />
      </div>
      <p className="relative pb-6 pt-4 text-sm text-ink/50">Built with {stack.join(", ")}</p>
    </section>
  );
}
