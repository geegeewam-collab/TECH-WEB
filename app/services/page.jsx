import Link from "next/link";
import { SERVICES } from "../../lib/site";
import Closing from "../../components/Closing";
export const metadata = { title: "Services", description: "Websites, business systems and automation." };
export default function Services() {
  return (<><div className="w pg"><h1>Services</h1><p className="lead">Three focused service areas. Each one starts with the problem it solves.</p></div>
    <section><div className="w"><div className="rows">{SERVICES.map((s, i) => <Link key={s.slug} href={`/services/${s.slug}`} className="row"><small>0{i + 1}</small><h3>{s.n}</h3><small>{s.short}</small><span className="ar" aria-hidden="true">→</span></Link>)}</div></div></section><Closing /></>);
}
