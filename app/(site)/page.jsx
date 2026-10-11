import Link from "next/link";
import { SERVICES, PROCESS } from "../../lib/site";
import { WORK } from "../../lib/site";
import Frame from "../../components/Frame";
import WorkCards from "../../components/WorkCards";
import Closing from "../../components/Closing";
export default function Home() {
  return (<>
    <section className="hero"><div className="w hg">
      <div>
        <p className="kick">Websites, systems and automation</p>
        <h1>Your business, built to work better.</h1>
        <p className="lead">We design digital experiences and connected business systems that help businesses present themselves professionally and deliver better client experiences.</p>
        <div className="act"><Link href="/contact" className="btn am">Start a project</Link><Link href="/work" className="ln">View portfolio</Link></div>
      </div>
      <div className="hv" aria-label="Recent projects">
        <Link href={`/work/${WORK[0].slug}`} className="f1"><Frame w={WORK[0]} /></Link>
        <Link href={`/work/${WORK[1].slug}`} className="f2"><Frame w={WORK[1]} /></Link>
      </div>
    </div></section>
    <section id="portfolio"><div className="w"><div className="sh"><h2>Portfolio</h2><Link href="/work" className="ln">All projects</Link></div><WorkCards /></div></section>
    <section style={{ paddingTop: 0 }}><div className="w"><div className="sh"><h2>What we build</h2><p>Three focused areas. Each starts with the business problem.</p></div>
      <div className="sv3">{SERVICES.map((s, i) => <Link key={s.slug} href={`/services/${s.slug}`} className={`sc c${i}`}><small>0{i + 1}</small><h3>{s.n}</h3><p>{s.short}</p><span>Explore</span></Link>)}</div></div></section>
    <section style={{ paddingTop: 0 }}><div className="stm"><div className="w"><h2>Good digital experiences need more than good design.</h2><p>A beautiful website that sends enquiries into an inbox is only half the work. The page, the process behind it and what the client sees afterwards should feel like one product.</p><Link href="/approach" className="ln">How we work</Link></div></div></section>
    <section><div className="w"><div className="sh"><h2>How we work</h2></div><div className="proc">{PROCESS.map((p, i) => <div key={p[0]}><small>0{i + 1}</small><h3>{p[0]}</h3><p>{p[1]}</p></div>)}</div></div></section>
    <Closing />
  </>);
}
