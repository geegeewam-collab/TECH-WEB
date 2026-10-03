export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="max-w-3xl text-5xl md:text-7xl">Three things I build</h2>
      <div className="mt-12 grid gap-4 md:grid-cols-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink p-8 text-paper md:col-span-4 md:min-h-80">
          <div className="dots absolute inset-0 text-paper/15" aria-hidden="true" style={{ maskImage: "linear-gradient(115deg, transparent 35%, black)", WebkitMaskImage: "linear-gradient(115deg, transparent 35%, black)" }} />
          <h3 className="relative text-5xl">Payment integration</h3>
          <p className="relative mt-4 max-w-sm text-paper/70">Secure M-Pesa and card flows that turn visitors into paying customers.</p>
          <p className="relative mt-10 font-display text-2xl font-bold">From $1,500</p>
        </div>
        <div className="rounded-[2rem] bg-accent p-8 text-paper md:col-span-2">
          <h3 className="text-4xl">Business platforms</h3>
          <p className="mt-4 text-paper/80">Booking, inventory and management systems built around how you operate.</p>
          <p className="mt-10 font-display text-2xl font-bold">From $3,000</p>
        </div>
        <div className="flex flex-col justify-between gap-4 rounded-2xl border-2 border-ink p-8 md:col-span-6 md:flex-row md:items-center">
          <div>
            <h3 className="text-3xl">Custom systems</h3>
            <p className="mt-2 max-w-xl text-ink/70">Software for business logic that off-the-shelf tools can&apos;t handle.</p>
          </div>
          <p className="font-display text-xl font-bold">Contact for a quote</p>
        </div>
      </div>
    </section>
  );
}
