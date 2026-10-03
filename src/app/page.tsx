import Hero from "@/components/Hero";
import ProofStrip from "@/components/ProofStrip";
import BentoWork from "@/components/BentoWork";
import Process from "@/components/Process";
import Services from "@/components/Services";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="bg-paper text-ink">
      <Hero />
      <ProofStrip />
      <BentoWork />
      <Process />
      <Services />
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-5xl font-anton mb-8">About</h2>
        <p className="text-2xl md:text-3xl leading-relaxed mb-12">
          Based in Nairobi, I specialize in the convergence of business strategy and elite engineering, transforming operational challenges into high-utility digital systems that drive measurable growth.
        </p>
        <div className="flex flex-wrap justify-center gap-4 font-bold uppercase text-xs">
          {["TypeScript", "React", "Node.js", "PostgreSQL", "AWS", "Tailwind"].map(tech => (
            <span key={tech} className="px-4 py-2 border border-ink rounded-md">{tech}</span>
          ))}
        </div>
      </section>
      <Contact />
      <footer className="py-12 text-center opacity-50 text-sm font-inter">
        © {new Date().getFullYear()} GEEGEE TECH. Designed with purpose. Engineered for scale.
      </footer>
    </main>
  );
}
