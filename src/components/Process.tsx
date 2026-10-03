const steps = [
  ["Audit", "Analyze your current flows to identify where money and time are leaking."],
  ["Blueprint", "Map the optimized revenue flow and agree on the screens before any code is written."],
  ["Build", "Ship in high-velocity releases you can test and iterate on as we go."],
  ["Scale", "Go live, monitor payments, and optimize for growth."],
];

export default function Process() {
  return (
    <section id="process" className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="text-5xl md:text-7xl">The Path to ROI</h2>
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
