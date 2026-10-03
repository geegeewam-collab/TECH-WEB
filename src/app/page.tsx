import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Process from "@/components/Process";
import Services from "@/components/Services";
import Contact from "@/components/Contact";

const stack = ["Next.js", "React", "TypeScript", "Supabase", "Firebase", "Vercel", "M-Pesa Daraja"];

export default function Home() {
  return (
    <main>
      <Hero />
      <Work />
      <Process />
      <Services />
      <section id="about" className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-5xl md:text-7xl">About</h2>
        <p className="mt-8 text-xl leading-relaxed md:text-2xl">
          I'm a developer in Nairobi. I build payment, booking and management systems for businesses in Africa, from M-Pesa integrations to platforms that serve many clients at once.
        </p>
        <ul className="mt-10 flex flex-wrap justify-center gap-3 text-sm">
          {stack.map((t) => (
            <li key={t} className="rounded-full border border-ink/30 px-4 py-2">{t}</li>
          ))}
        </ul>
      </section>
      <Contact />
      <footer className="py-10 text-center text-sm text-ink/50">© {new Date().getFullYear()} GEEGEE TECH, Nairobi</footer>
    </main>
  );
}
