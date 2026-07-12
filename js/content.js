/* ==========================================================
   Roots and Roof — shared content model
   Used by both index.html (public site) and admin.html
   ========================================================== */

const STORAGE_KEY = "rootsandroof_content_v1";
const ADMIN_AUTH_KEY = "rr_admin_auth";
const ADMIN_PASSWORD = "rootsandroof2026";

const DEFAULT_CONTENT = {
  brand: {
    name: "Roots and Roof",
    tagline: "Finding Home in Berlin",
    instagram: "@rootsandroof",
  },
  nav: ["About", "Services", "Process", "Stories", "FAQ", "Contact"],
  hero: {
    eyebrow: "Berlin Property Advisory",
    headline: "Finding Home in Berlin",
    subheadline:
      "Roots and Roof guides Indian diaspora and international buyers through every step of owning property in Germany — with local expertise and a personal hand to hold.",
    ctaPrimary: "Book a Consultation",
    ctaSecondary: "See How It Works",
    backgroundImage:
      "https://images.unsplash.com/photo-1560184897-6c50e5d1a5f8?auto=format&fit=crop&w=1800&q=80",
  },
  stats: [
    { value: "80+", label: "Families relocated" },
    { value: "12", label: "Berlin districts covered" },
    { value: "€45M+", label: "Property value advised" },
    { value: "6", label: "Languages spoken" },
  ],
  about: {
    eyebrow: "Why Roots and Roof",
    heading: "A guide who has walked the path you're on",
    body:
      "Buying property in a foreign country is equal parts exciting and disorienting — new laws, new language, a market that plays by its own rules. Roots and Roof was founded to close that gap: a single trusted advisor who understands both where you come from and how Berlin works, so you can make confident decisions instead of guesses.",
    ownerName: "Desh Bhardwaj",
    ownerTitle: "Founder & Principal Advisor",
    ownerBio:
      "Desh has spent over a decade between Berlin and the Indian diaspora community, helping families and investors turn 'someday' into a signed contract. He built Roots and Roof around a simple idea — that finding a home abroad shouldn't mean navigating it alone.",
    ownerImage:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    highlights: [
      "Fluent guidance in English, Hindi and German",
      "Direct network of notaries, banks and surveyors",
      "End-to-end support, from search to keys in hand",
    ],
  },
  services: [
    { icon: "Search", title: "Property Search & Sourcing", description: "Curated listings matched to your budget, district preferences and investment goals — including off-market opportunities." },
    { icon: "Landmark", title: "Financing & Mortgage Guidance", description: "Introductions to banks that work with international and NRI buyers, plus help structuring financing that makes sense abroad." },
    { icon: "FileText", title: "Legal & Notary Coordination", description: "We coordinate with trusted notaries and lawyers so contracts, translations and registrations are handled correctly the first time." },
    { icon: "TrendingUp", title: "Investment Advisory", description: "Rental yield analysis, district growth trends and portfolio strategy for buyers treating Berlin as a long-term investment." },
    { icon: "Home", title: "Relocation Support", description: "From viewing trips to utility setup and neighbourhood orientation — practical help for families actually moving to Berlin." },
    { icon: "ShieldCheck", title: "Ongoing Property Management", description: "Post-purchase support for owners abroad — tenant coordination, maintenance oversight and annual reporting." },
  ],
  process: [
    { title: "Discovery Call", description: "We learn your goals, budget and timeline — whether you're buying a home or building an investment portfolio." },
    { title: "Curated Search", description: "You receive a shortlist of properties matched to your brief, including honest notes on each district and building." },
    { title: "Viewings & Due Diligence", description: "In-person or virtual viewings, followed by structural, legal and financial checks before you commit to anything." },
    { title: "Offer & Financing", description: "We negotiate on your behalf and connect you with financing partners experienced with international buyers." },
    { title: "Notary & Closing", description: "We coordinate the notary appointment, translations and registration so the legal process is smooth and understood." },
    { title: "Keys & Beyond", description: "From handover to setting up your new home or tenancy, we stay involved until you're truly settled." },
  ],
  testimonials: [
    { name: "Ritu & Sameer Kapoor", location: "Moved from Mumbai", quote: "We looked at Berlin for two years from a distance and got nowhere. Desh had us under contract on an apartment in Prenzlauer Berg within four months of our first call.", rating: 5 },
    { name: "Anand Menon", location: "NRI Investor, Dubai", quote: "Roots and Roof made an unfamiliar market feel manageable. The financing introductions alone saved me months of dead ends with German banks.", rating: 5 },
    { name: "Priya Raghavan", location: "Relocated from Bengaluru", quote: "It wasn't just the paperwork — Desh helped us actually understand which neighbourhood would feel like home for our family. That mattered more than we expected.", rating: 5 },
  ],
  faq: [
    { q: "Can non-residents buy property in Germany?", a: "Yes. Germany places no restrictions on foreign or non-resident buyers, including NRIs and Indian citizens. Residency is not required to purchase property here." },
    { q: "Do I need to be in Berlin in person to buy?", a: "Not necessarily. Viewings can often be done virtually, and the notary appointment can be handled via power of attorney in many cases. We'll advise what's realistic for your situation." },
    { q: "What additional costs should I budget for?", a: "Beyond the purchase price, expect notary and registration fees, real estate transfer tax, and possibly agent commission — typically 8-12% combined. We walk through exact figures on your discovery call." },
    { q: "Can I get financing as a foreign buyer?", a: "Yes, though terms vary by bank and residency status. We work with lenders experienced in financing international and NRI buyers and help you understand what to expect." },
    { q: "Do you help with rental management after purchase?", a: "Yes — many of our clients buy as investors based abroad. We offer ongoing coordination for tenants, maintenance and annual reporting." },
  ],
  contact: {
    heading: "Let's find your Berlin address",
    body: "Tell us a little about what you're looking for, and Desh will personally get back to you within one business day.",
    email: "hello@rootsandroof.de",
    phone: "+49 30 1234 5678",
    instagram: "@rootsandroof",
    city: "Berlin, Germany",
    formMode: "netlify", // "netlify" (captured by Netlify Forms, needs a notification email set up in the Netlify dashboard) or "mailto" (opens the visitor's own email app, addressed to notificationEmail)
    notificationEmail: "hello@rootsandroof.de",
  },
  socialLinks: [
    { platform: "Instagram", url: "https://instagram.com/rootsandroof" },
    { platform: "LinkedIn", url: "" },
    { platform: "Facebook", url: "" },
    { platform: "WhatsApp", url: "" },
  ],
  footer: {
    note: "Roots and Roof is an independent real estate advisory and is not a licensed bank or law firm. We coordinate with licensed partners for financing and legal matters.",
  },
};

function loadContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return deepMerge(structuredClone(DEFAULT_CONTENT), parsed);
    }
  } catch (e) {
    console.error("Failed to load saved content, using defaults", e);
  }
  return structuredClone(DEFAULT_CONTENT);
}

function saveContent(content) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    return true;
  } catch (e) {
    console.error("Failed to save content", e);
    return false;
  }
}

function deepMerge(base, override) {
  if (Array.isArray(override)) return override;
  if (typeof override !== "object" || override === null) return override;
  const out = { ...base };
  for (const key in override) {
    out[key] = key in base ? deepMerge(base[key], override[key]) : override[key];
  }
  return out;
}

/* Simple inline icon set (24x24 stroke icons), no external icon library needed */
const ICONS = {
  Home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/>',
  Search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  FileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6M9 9h1"/>',
  Landmark: '<path d="M3 22h18M6 18v-8M10 18v-8M14 18v-8M18 18v-8M4 10h16L12 3 4 10Z"/>',
  TrendingUp: '<path d="m3 17 6-6 4 4 8-8"/><path d="M17 7h4v4"/>',
  ShieldCheck: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  Users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17.5" cy="9.5" r="2.8"/><path d="M15.8 13.8A5.6 5.6 0 0 1 21.5 20"/>',
};

/* Social platform icons — keys must match the <select> options used in admin.js */
const SOCIAL_ICONS = {
  Instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/>',
  Facebook: '<path d="M14 9h3V5h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4v-2a1 1 0 0 1 1-1Z"/>',
  LinkedIn: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7.5 10v7M7.5 7v.01M11.5 17v-4a2 2 0 0 1 4 0v4M11.5 10v7"/>',
  WhatsApp: '<path d="M4 20l1.3-3.9A8 8 0 1 1 8.9 19L4 20Z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.5 0 1-.7 1-1.3 0-.3-.2-.5-.4-.6l-1.6-.8c-.3-.1-.5-.1-.7.1l-.5.6c-1-.5-1.9-1.4-2.4-2.4l.6-.5c.2-.2.2-.5.1-.7l-.8-1.6c-.1-.3-.4-.4-.6-.4-.6 0-1.2.5-1.2 1Z"/>',
  X: '<path d="M4 4l7.5 8.5M20 4l-7.5 8.5M4 20l7.5-8.5M20 20l-7.5-8.5"/>',
  YouTube: '<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none"/>',
};
