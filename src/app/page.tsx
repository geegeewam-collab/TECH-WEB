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
      <section id="about" className="mx-auto grid max-w-7xl gap-10 px-6 py-24 md:grid-cols-2">
        <h2 className="text-5xl md:text-7xl">Developer, Nairobi.</h2>
        <div>
          <p className="text-xl leading-relaxed md:text-2xl">
            I build payment, booking and management systems for businesses in Africa, from M-Pesa integrations to platforms that serve many clients at once.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2 text-sm">
            {stack.map((t) => (
              <li key={t} className="rounded-full bg-ink px-4 py-2 text-paper">{t}</li>
            ))}
          </ul>
        </div>
      </section>
      <Contact />
      <footer className="py-10 text-center text-sm text-ink/50">© {new Date().getFullYear()} GEEGEE TECH, Nairobi</footer>
    </main>
  );
}
