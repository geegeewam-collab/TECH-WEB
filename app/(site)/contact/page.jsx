import ContactForm from "../../../components/ContactForm";
import { brand } from "../../../lib/settings";
export const metadata = { title: "Start a project", description: "Tell us what your business needs." };
export default async function Contact() {
  const b = await brand();
  return (<div className="w pg"><div className="cgrid"><div><p className="kick">Start a project</p><h1>Tell us what you need.</h1>
    <p className="lead">A short description of the problem is enough to begin. We reply by email.</p>
    {(b.email || b.whatsapp) && <div className="cinfo">{b.email && <a className="ln" href={`mailto:${b.email}`}>{b.email}</a>}{b.whatsapp && <a className="ln" href={`https://wa.me/${b.whatsapp}`}>WhatsApp</a>}</div>}</div>
    <div className="cform"><ContactForm /></div></div></div>);
}
