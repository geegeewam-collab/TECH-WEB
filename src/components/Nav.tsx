import Link from "next/link";
import { whatsappUrl } from "@/lib/site";

const links = [["Services", "#services"], ["Process", "#process"], ["Work", "#work"], ["About", "#about"]];

export default function Nav() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
      <div className="flex items-center gap-10">
        <Link href="/" className="font-display text-xl">GEEGEE TECH</Link>
        <nav className="hidden gap-6 text-sm text-ink/70 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-ink">{label}</Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-5 text-sm">
        {whatsappUrl && <a href={whatsappUrl} className="hidden text-ink/70 hover:text-ink sm:block">WhatsApp</a>}
        <Link href="#contact" className="rounded-full bg-ink px-5 py-2 font-medium text-paper transition hover:bg-accent">Start a project</Link>
      </div>
    </header>
  );
}
