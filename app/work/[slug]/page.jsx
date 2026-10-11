import Link from "next/link";
import { notFound } from "next/navigation";
import { WORK } from "../../../lib/site";
import Closing from "../../../components/Closing";
export const generateStaticParams = () => WORK.map((w) => ({ slug: w.slug }));
export async function generateMetadata({ params }) { const { slug } = await params; const w = WORK.find((x) => x.slug === slug); return w ? { title: w.t, description: w.sum } : {}; }
export default async function Case({ params }) {
  const { slug } = await params; const w = WORK.find((x) => x.slug === slug); if (!w) notFound();
  return (<><div className="w pg"><p className="kick"><Link href="/work">Work</Link> · {w.cat}</p><h1>{w.t}</h1><p className="lead">{w.sum}</p>
    <div className="act"><a className="btn" href={w.url} target="_blank" rel="noopener noreferrer">Visit the live site</a></div>
    <div className="cols"><div><h2>The brief</h2><p>{w.brief}</p><h2 style={{ marginTop: 28 }}>Stack</h2><p>{w.stack}</p></div><div><h2>What was built</h2><ul>{w.built.map((x) => <li key={x}>{x}</li>)}</ul></div></div>
    <p className="note">Measured results are not published yet. They will be added here once they have been documented.</p></div><section /><Closing /></>);
}
