import ContactForm from "../../../components/ContactForm";
import { SITE } from "../../../lib/site";
export const metadata = { title: "Start a project", description: "Tell us what your business needs." };
export default function Contact() {
  return (<div className="w pg"><h1>Start a project</h1><p className="lead">A short description of the problem is enough to begin. We reply by email.</p>
    <ContactForm />
    {(SITE.email || SITE.whatsapp) && <div className="act">{SITE.email && <a className="ln" href={`mailto:${SITE.email}`}>{SITE.email}</a>}{SITE.whatsapp && <a className="ln" href={`https://wa.me/${SITE.whatsapp}`}>WhatsApp</a>}</div>}</div>);
}
