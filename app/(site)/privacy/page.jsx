import { SITE } from "../../../lib/site";
export const metadata = { title: "Privacy", description: "How enquiry details are used and stored." };
export default function Privacy() {
  return (<div className="w pg"><h1>Privacy</h1><p className="lead">What happens to the details you send us.</p>
    <div className="cols" style={{ gridTemplateColumns: "1fr" }}><div style={{ maxWidth: 680 }}>
      <h2>What we collect</h2><p>Your name, email address, optional phone number and business name, and your message. We also record where you came from: the campaign tags in the link, the page you landed on and the website that referred you.</p>
      <h2 style={{ marginTop: 28 }}>Why</h2><p>To reply to your enquiry and, if we work together, to manage the project. We do not sell your details.</p>
      <h2 style={{ marginTop: 28 }}>Where it is kept</h2><p>In our database, hosted by Supabase. If email alerts are switched on, the enquiry is also sent to us through Resend. This website is hosted on Vercel.</p>
      <h2 style={{ marginTop: 28 }}>How long</h2><p>For as long as we need it to deal with your enquiry and any work that follows, unless you ask us to delete it sooner.</p>
      <h2 style={{ marginTop: 28 }}>Your choices</h2><p>You can ask to see, correct or delete your details{SITE.email ? <> by emailing <a href={`mailto:${SITE.email}`}>{SITE.email}</a></> : " by using the contact page"}.</p>
      <p className="note">Last updated October 2026.</p></div></div></div>);
}
