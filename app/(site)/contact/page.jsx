import ContactForm from "../../../components/ContactForm";
import { brand } from "../../../lib/settings";
export const metadata = { title: "Start a project", description: "Tell us what your business needs." };
export default async function Contact() {
  return (<div className="w pg"><h1>Start a project</h1><p className="lead">A short description of the problem is enough to begin. We reply by email.</p>
    <ContactForm />
    {((await brand()).email || (await brand()).whatsapp) && <div className="act">{(await brand()).email && <a className="ln" href={`mailto:${(await brand()).email}`}>{(await brand()).email}</a>}{(await brand()).whatsapp && <a className="ln" href={`https://wa.me/${(await brand()).whatsapp}`}>WhatsApp</a>}</div>}</div>);
}
