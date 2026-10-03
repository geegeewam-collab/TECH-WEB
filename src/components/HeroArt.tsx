const fade = "linear-gradient(to bottom, transparent, black 18%)";
const shade = "linear-gradient(110deg, black, transparent 85%)";

// Placeholder art. Swap this component's contents for the real halftone artwork later.
export default function HeroArt() {
  return (
    <div className="relative h-full min-h-[340px] overflow-hidden" style={{ maskImage: fade, WebkitMaskImage: fade }}>
      <div className="absolute left-1/2 top-4 h-[540px] w-[270px] -translate-x-1/2 -rotate-3 rounded-[42px] border-2 border-ink bg-paper">
        <div className="dots absolute inset-0 rounded-[40px] text-ink" style={{ maskImage: shade, WebkitMaskImage: shade }} />
        <div className="absolute inset-x-5 top-16 rounded-2xl border-2 border-ink bg-paper p-4 text-left">
          <p className="text-xs text-ink/60">M-Pesa payment</p>
          <p className="font-display text-3xl">Received</p>
          <p className="mt-1 text-sm text-accent">Booking confirmed</p>
        </div>
      </div>
    </div>
  );
}
