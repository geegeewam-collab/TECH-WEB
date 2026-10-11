import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES } from "../../../lib/site";
import Closing from "../../../components/Closing";
export const generateStaticParams = () => SERVICES.map((s) => ({ slug: s.slug }));
export async function generateMetadata({ params }) { const { slug } = await params; const s = SERVICES.find((x) => x.slug === slug); return s ? { title: s.t, description: s.short } : {}; }
export default async function Service({ params }) {
  const { slug } = await params; const s = SERVICES.find((x) => x.slug === slug); if (!s) notFound();
  return (<><div className="w pg"><p className="kick"><Link href="/services">Services</Link></p><h1>{s.t}</h1><p className="lead">{s.problem}</p>
    <div className="cols"><div><h2>What we build</h2><ul>{s.build.map((x) => <li key={x}>{x}</li>)}</ul></div><div><h2>What to expect</h2><ul>{s.expect.map((x) => <li key={x}>{x}</li>)}</ul></div></div>
    <div className="act"><Link href="/contact" className="btn">Start a project</Link></div></div><section /><Closing /></>);
}
