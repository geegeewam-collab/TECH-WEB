const projects = [
  { name: "Arverdor Safaris", url: "https://arverdorinternationalsafaris.com", note: "Tours platform with an itinerary builder for a safari operator." },
  { name: "African El Suites", url: "https://african-el-suites.vercel.app", note: "Multi-tenant booking platform for short-stay properties." },
];

export default function Work() {
  return (
    <section id="work" className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="text-5xl md:text-7xl">Selected work</h2>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {projects.map((p) => (
          <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-3xl border-2 border-ink transition hover:border-accent">
            {/* Placeholder: replace with a screenshot of the live site */}
            <div className="dots h-48 text-ink/60 transition group-hover:text-accent" />
            <div className="border-t-2 border-inherit p-6">
              <h3 className="text-3xl">{p.name}</h3>
              <p className="mt-2 text-ink/70">{p.note}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
