const projects = [
  {
    name: "Arverdor Safaris",
    url: "https://arverdorinternationalsafaris.com",
    metric: "90% faster bookings",
    result: "Reduced booking time from 3 days to 3 minutes with a custom itinerary builder."
  },
  {
    name: "African El Suites",
    url: "https://african-el-suites.vercel.app",
    metric: "100% booking accuracy",
    result: "Launched a multi-tenant booking platform handling multiple properties with zero double-bookings."
  },
];

export default function Work() {
  return (
    <section id="work" className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="text-5xl md:text-7xl">Live results</h2>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {projects.map((p) => (
          <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="group block">
            <div className="relative h-72 overflow-hidden rounded-[2rem] bg-ink md:h-96">
              <div className="dots absolute inset-0 text-paper/20" aria-hidden="true" />
              <iframe src={p.url} title={`${p.name} preview`} loading="lazy" tabIndex={-1} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-[200%] w-[200%] origin-top-left scale-50 border-0 transition group-hover:opacity-90" />
            </div>
            <div className="mt-5">
              <span className="text-sm font-bold uppercase tracking-wider text-accent">{p.metric}</span>
              <h3 className="text-3xl group-hover:text-accent">{p.name}</h3>
              <p className="mt-2 text-ink/70">{p.result}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
