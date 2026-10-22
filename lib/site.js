// Central brand + content. Edit here; nothing else needs touching to change copy or add projects.
export const SITE = {
  name: "GEEGEE TECH", short: "GEEGEE",
  desc: "Websites, business systems and automation for businesses that want to present professionally and work better.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "", whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "",
};
export const SERVICES = [
  { slug: "websites", t: "Websites and Digital Experiences", n: "Websites", short: "Business websites, landing pages and online booking that make a company look as capable as it is.",
    problem: "A business can be excellent and still lose customers because its website looks unfinished, loads slowly or makes the next step unclear.",
    build: ["Business websites with clear structure and fast loading", "Landing pages built around one action", "Online booking and enquiry experiences", "Content you can edit without a developer"],
    expect: ["A written scope before design begins", "Mobile-first layouts tested on small screens", "Enquiries that reach you reliably"] },
  { slug: "systems", t: "Business Systems and Custom Software", n: "Systems", short: "Client portals, booking systems and admin dashboards tailored to how your business actually runs.",
    problem: "When bookings, clients and payments live in chats and spreadsheets, work gets repeated and records go missing.",
    build: ["Booking and reservation systems", "Client portals with secure, per-client access", "Admin dashboards for day-to-day operations", "Internal tools shaped around your workflow"],
    expect: ["Real data from day one, no fake dashboards", "Role-based access so clients see only their own records", "A hosting setup you can afford to run"] },
  { slug: "automation", t: "Automation and Integrations", n: "Automation", short: "Connected tools so repetitive work runs the same way every time.",
    problem: "Sending the same confirmations, reminders and payment follow-ups by hand costs time and leads to inconsistency.",
    build: ["Automatic booking and payment confirmations", "Email and notification workflows", "Payment integrations, including M-Pesa where it fits", "Connections between the apps you already use"],
    expect: ["Every automated message previewed before it goes live", "Failures recorded and visible, never hidden", "Integrations called live only after they are tested"] },
];
export const WORK = [
  { slug: "arverdor", t: "Arverdor International Safaris", cat: "Tours platform", st: "Live", url: "https://www.arverdorinternationalsafaris.co.ke",
    sum: "A safari tours website with an admin platform for managing bookings and building itineraries.",
    brief: "A tours business with a public booking website and a back-office platform behind it.",
    built: ["Public tours website with experiences, gallery, shop and booking tracking", "KES and USD currency switch", "Admin platform for bookings and reviews", "Drag-and-drop itinerary builder with day columns"],
    stack: "React, Vite, Node, Express, Firebase (auth and Firestore), hosted on Vercel and Render" },
  { slug: "el-suites", t: "African El Suites", cat: "Booking system", st: "Live", url: "https://african-el-suites.vercel.app",
    sum: "Short-stay property booking software where each property gets its own booking page.",
    brief: "Booking software for short-stay properties, with a live property site as its first use.",
    built: ["Multi-tenant structure with dynamic slug routing", "Per-property page metadata", "A live property site with rates, amenities, location and WhatsApp contact", "M-Pesa payments through Daraja: in development"],
    stack: "Next.js, Firebase, Safaricom Daraja, hosted on Vercel" },
  { slug: "webuild", t: "Webuild", cat: "Website", st: "Live", url: "https://webuild-xi.vercel.app",
    sum: "A marketing website for a construction and project delivery business.",
    brief: "A website that presents residential and commercial construction services and invites visitors to request a quote.",
    built: ["Pages for About, Services, Projects, Process, Journal and Contact", "Request-a-quote call to action", "Service highlights with project imagery"],
    stack: "Hosted on Vercel" },
  { slug: "winniep", t: "Winniep", cat: "Online store", st: "Live", url: "https://winniep.vercel.app",
    sum: "An online storefront for household, electronics and décor products.",
    brief: "A store front for a household, electronics and décor retailer.",
    built: ["Storefront with Household, Electronics and Décor sections", "Product-led hero and category navigation", "Search, chat and cart controls in the header"],
    stack: "Hosted on Vercel" },
];
export const PROCESS = [["Discover", "Understand the business and the problem."], ["Define", "Agree requirements, scope and deliverables."], ["Design and build", "Create the experience and the system behind it."], ["Launch", "Test, configure integrations and release."], ["Improve", "Agreed support and future enhancements."]];
