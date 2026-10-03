const steps = [
  ["Discover", "Understand the business, the customers and where money gets stuck."],
  ["Design", "Map the flows and agree the screens before any code is written."],
  ["Build", "Ship in small releases you can test as we go."],
  ["Launch", "Go live, watch the payments, and keep supporting it."],
];

export default function Process() {
  return (
    <section id="process" className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="text-5xl md:text-7xl">How I work</h2>
      <ol className="mt-12 grid gap-10 md:grid-cols-4">
        {steps.map(([title, desc], i) => (
          <li key={title} className="border-t-2 border-ink pt-4">
            <span className="font-display text-xl text-accent">{i + 1}</span>
            <h3 className="mt-2 text-3xl">{title}</h3>
            <p className="mt-3 text-ink/70">{desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
