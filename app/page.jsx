import Link from "next/link";
import { SERVICES, WORK, PROCESS, SITE } from "../lib/site";
import Closing from "../components/Closing";
export default function Home() {
  return (<>
    <div className="w hero">
      <h1>Your business, built to work better.</h1>
      <p className="lead">We design digital experiences and connected business systems that help businesses present themselves professionally and deliver better client experiences.</p>
      <div className="wm" aria-hidden="true">{SITE.short}</div>
      <div className="pills" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="gl" aria-hidden="true"><div><span>Proposal</span><em>Accepted</em></div><div><span>Client portal</span><em>Milestone 3 of 5</em></div><div><span>Invoice</span><em>Paid</em></div></div>
      <div className="act"><Link href="/contact" className="btn">Start a project</Link><Link href="/work" className="ln">Explore our work</Link></div>
    </div>
    <div className="band"><div className="w">{SERVICES.map((s) => <Link key={s.slug} href={`/services/${s.slug}`}><h3>{s.n}</h3><p>{s.short}</p><span>Explore</span></Link>)}</div></div>
    <section><div className="w st"><div><h2>Good digital experiences need more than good design.</h2><p>A beautiful website that sends enquiries into an inbox is only half the work. The page, the process behind it and what the client sees afterwards should feel like one product.</p></div>
      <div className="mock" role="img" aria-label="Concept interface showing a proposal, a project milestone and an invoice"><div><span>Website and booking system<small>Proposal</small></span><b>Sent</b></div><div><span>Client portal<small>Project</small></span><b>In progress</b></div><div><span>Deposit<small>Invoice</small></span><b>Issued</b></div></div></div></section>
    <section style={{ paddingTop: 0 }}><div className="w"><div className="sh"><h2>Selected work</h2><p>Real projects, shown as they are.</p></div>
      <div className="rows">{WORK.map((w, i) => <Link key={w.slug} href={`/work/${w.slug}`} className="row"><small>0{i + 1}</small><h3>{w.t}</h3><small>{w.cat}</small><span className="ar" aria-hidden="true">→</span></Link>)}</div></div></section>
    <section style={{ paddingTop: 0 }}><div className="w"><div className="sh"><h2>How we work</h2></div>
      <div className="proc">{PROCESS.map((p, i) => <div key={p[0]}><small>0{i + 1}</small><h3>{p[0]}</h3><p>{p[1]}</p></div>)}</div></div></section>
    <Closing />
  </>);
}
