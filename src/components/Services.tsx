const services = [
  ["Payment integration", "Secure M-Pesa and card payment flows that turn visitors into paying customers.", "From $1,500"],
  ["Business platforms", "Booking, inventory and management systems built around how you operate.", "From $3,000"],
  ["Custom systems", "Software for business logic that off-the-shelf tools can't handle.", "Contact for a quote"],
];

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="text-5xl md:text-7xl">Services</h2>
      <div className="mt-12">
        {services.map(([title, desc, price]) => (
          <div key={title} className="flex flex-col justify-between gap-3 border-t-2 border-ink py-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl">{title}</h3>
              <p className="mt-2 text-ink/70">{desc}</p>
            </div>
            <p className="font-medium">{price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
