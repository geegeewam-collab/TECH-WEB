import Link from "next/link";
import Menu from "../../components/Menu";
import { SITE } from "../../lib/site";
export default function SiteLayout({ children }) {
  return (<>
    <header><div className="w bar"><Link href="/" className="logo">{SITE.name}</Link><Menu /><Link href="/contact" className="btn sm am">Start a project</Link></div></header>
    <main id="main">{children}</main>
    <footer><div className="w foot">
      <div><Link href="/" className="logo">{SITE.name}</Link><p>{SITE.desc}</p></div>
      <div className="fl"><Link href="/work">Portfolio</Link><Link href="/services">Services</Link><Link href="/approach">Approach</Link><Link href="/contact">Contact</Link>{SITE.email && <a href={`mailto:${SITE.email}`}>{SITE.email}</a>}</div>
      <p className="cp">© {new Date().getFullYear()} {SITE.name}</p>
    </div></footer></>);
}
