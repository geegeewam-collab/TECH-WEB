import Link from "next/link";
export default function Closing() {
  return (<section style={{ paddingTop: 0 }}><div className="fin"><h2>Let's make your next step a better one.</h2>
    <p>Tell us what your business needs. We'll start by understanding the problem and identifying a practical way forward.</p><Link href="/contact" className="btn">Start a project</Link></div></section>);
}
