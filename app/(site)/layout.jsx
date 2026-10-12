export const revalidate = 60;
import Link from "next/link";
import Menu from "../../components/Menu";
import { brand } from "../../lib/settings";
export default async function SiteLayout({ children }) {
  return (<>
    <header><div className="w bar"><Link href="/" className="logo">{(await brand()).name}</Link><Menu /><Link href="/contact" className="btn sm am">Start a project</Link></div></header>
    <main id="main">{children}</main>
    <footer><div className="w foot">
      <div><Link href="/" className="logo">{(await brand()).name}</Link><p>{(await brand()).desc}</p></div>
      <div className="fl"><Link href="/work">Portfolio</Link><Link href="/services">Services</Link><Link href="/approach">Approach</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link>{(await brand()).email && <a href={`mailto:${(await brand()).email}`}>{(await brand()).email}</a>}</div>
      <p className="cp">© {new Date().getFullYear()} {(await brand()).name}</p>
    </div></footer></>);
}
