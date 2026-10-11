import Link from "next/link";
import { WORK } from "../../lib/site";
import Closing from "../../components/Closing";
export const metadata = { title: "Work", description: "Selected projects." };
export default function Work() {
  return (<><div className="w pg"><h1>Selected work</h1><p className="lead">Only real projects appear here. Results are published only once they have been measured.</p></div>
    <section><div className="w"><div className="rows">{WORK.map((w, i) => <Link key={w.slug} href={`/work/${w.slug}`} className="row"><small>0{i + 1}</small><h3>{w.t}</h3><small>{w.cat}</small><span className="ar" aria-hidden="true">→</span></Link>)}</div></div></section><Closing /></>);
}
