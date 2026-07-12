/* ==========================================================
   Roots and Roof — public site behaviour
   ========================================================== */

let SITE_CONTENT = null;

document.addEventListener("DOMContentLoaded", () => {
  SITE_CONTENT = loadContent();
  render(SITE_CONTENT);
  wireNav(SITE_CONTENT);
  wireScroll();
  wireReveal();
  wireFAQ();
  wireContactForm();
});

function el(id) { return document.getElementById(id); }
function icon(name, size = 20) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.Home}</svg>`;
}

function render(content) {
  document.title = `${content.brand.name} — ${content.brand.tagline}`;

  // Nav / brand
  el("brand-name").textContent = content.brand.name;
  el("footer-brand-name").textContent = content.brand.name;
  const navLinks = content.nav.map((n) => `<button class="nav-link" data-scroll="${n.toLowerCase()}">${n}</button>`).join("");
  el("nav-links").innerHTML = navLinks + `<button class="btn btn-gold" data-scroll="contact" style="padding:10px 20px">Get in Touch</button>`;
  el("nav-mobile").innerHTML = navLinks + `<button class="btn btn-gold" data-scroll="contact" style="justify-content:center">Get in Touch</button>`;

  // Hero
  el("hero-bg-img").src = content.hero.backgroundImage;
  el("hero-eyebrow").textContent = content.hero.eyebrow;
  el("hero-headline").textContent = content.hero.headline;
  el("hero-sub").textContent = content.hero.subheadline;
  el("hero-cta-primary").textContent = content.hero.ctaPrimary;
  el("hero-cta-secondary").textContent = content.hero.ctaSecondary;

  // Stats
  el("stats-grid").innerHTML = content.stats
    .map((s) => `<div class="reveal"><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>`)
    .join("");
  el("stats-grid").style.display = "grid";
  el("stats-grid").style.gridTemplateColumns = "repeat(4, 1fr)";

  // About
  el("about-photo").src = content.about.ownerImage;
  el("about-photo").alt = content.about.ownerName;
  el("about-owner-name").textContent = content.about.ownerName;
  el("about-owner-title").textContent = content.about.ownerTitle;
  el("about-eyebrow").textContent = content.about.eyebrow;
  el("about-heading").textContent = content.about.heading;
  el("about-body").textContent = content.about.body;
  el("about-owner-bio").textContent = content.about.ownerBio;
  el("about-highlights").innerHTML = content.about.highlights
    .map((h) => `<li>${icon("Home", 18).replace(ICONS.Home, '<polyline points="20 6 9 17 4 12"/>')}<span>${h}</span></li>`)
    .join("");

  // Services
  el("service-grid").innerHTML = content.services
    .map(
      (s) => `
      <div class="service-card reveal">
        <div class="service-icon">${icon(s.icon, 22)}</div>
        <h3>${s.title}</h3>
        <p>${s.description}</p>
      </div>`
    )
    .join("");

  // Process
  el("process-grid").innerHTML = content.process
    .map(
      (p, i) => `
      <div class="process-step reveal">
        <div class="process-num">${i + 1}</div>
        <div><h3>${p.title}</h3><p>${p.description}</p></div>
      </div>`
    )
    .join("");

  // Testimonials
  el("testi-grid").innerHTML = content.testimonials
    .map(
      (t) => `
      <div class="testi-card reveal">
        <div class="quote-icon">${icon("FileText", 22).replace(/<path[^>]*\/>|<path[^>]*>.*?<\/path>/g, "")}
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M9.5 8C7 8 5 10 5 12.5S7 17 9.5 17c.3 0 .6 0 .9-.1-.4 1.6-1.8 2.9-3.6 3.3l.5 1.7c3.2-.7 5.7-3.5 5.7-7.2V12.5C13 10 11 8 9.5 8Zm9 0c-2.5 0-4.5 2-4.5 4.5S16 17 18.5 17c.3 0 .6 0 .9-.1-.4 1.6-1.8 2.9-3.6 3.3l.5 1.7c3.2-.7 5.7-3.5 5.7-7.2V12.5C22 10 20 8 18.5 8Z"/></svg>
        </div>
        <p class="quote-text">"${t.quote}"</p>
        <div class="testi-stars">${Array.from({ length: t.rating }).map(() => `<svg width="14" height="14" viewBox="0 0 24 24" fill="#b6902f"><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9"/></svg>`).join("")}</div>
        <p class="name">${t.name}</p>
        <p class="loc">${t.location}</p>
      </div>`
    )
    .join("");

  // FAQ
  el("faq-wrap").innerHTML = content.faq
    .map(
      (f, i) => `
      <div class="faq-item ${i === 0 ? "open" : ""}" data-idx="${i}">
        <button class="faq-q">
          <span>${f.q}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="faq-a"><p>${f.a}</p></div>
      </div>`
    )
    .join("");

  // Contact
  el("contact-heading").textContent = content.contact.heading;
  el("contact-body").textContent = content.contact.body;
  el("contact-info").innerHTML = `
    <a class="contact-info-row" href="mailto:${content.contact.email}">${mailIcon()}<span>${content.contact.email}</span></a>
    <a class="contact-info-row" href="tel:${content.contact.phone.replace(/\s/g, "")}">${phoneIcon()}<span>${content.contact.phone}</span></a>
    <div class="contact-info-row">${pinIcon()}<span>${content.contact.city}</span></div>
  `;
  el("contact-social").innerHTML = socialIconLinks(content.socialLinks);
  el("contact-social").classList.add("on-cream");

  // Footer
  el("footer-contact").innerHTML = `<span>${content.contact.email}</span>`;
  el("footer-social").innerHTML = socialIconLinks(content.socialLinks);
  el("footer-note").textContent = content.footer.note;
  el("footer-copyright").textContent = `© ${new Date().getFullYear()} ${content.brand.name}`;
}

function socialIconLinks(links) {
  return (links || [])
    .filter((s) => s.url && s.url.trim())
    .map((s) => {
      const svgPath = SOCIAL_ICONS[s.platform] || SOCIAL_ICONS.Instagram;
      return `<a href="${s.url}" target="_blank" rel="noopener noreferrer" title="${s.platform}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${svgPath}</svg>
      </a>`;
    })
    .join("");
}

function mailIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`;
}
function phoneIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L7.9 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z"/></svg>`;
}
function instaIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/></svg>`;
}
function pinIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
}

/* ---- Nav ---- */
function wireNav() {
  window.addEventListener("scroll", () => {
    el("navbar").classList.toggle("scrolled", window.scrollY > 40);
  });
  const toggle = el("nav-toggle");
  const mobile = el("nav-mobile");
  toggle.addEventListener("click", () => mobile.classList.toggle("open"));

  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-scroll]");
    if (!target) return;
    const id = target.getAttribute("data-scroll");
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    mobile.classList.remove("open");
  });
}

/* ---- Smooth scroll fallback already handled via data-scroll ---- */
function wireScroll() {}

/* ---- Reveal on scroll ---- */
function wireReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
}

/* ---- FAQ accordion ---- */
function wireFAQ() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".faq-q");
    if (!btn) return;
    const item = btn.closest(".faq-item");
    const wasOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("open"));
    if (!wasOpen) item.classList.add("open");
  });
}

/* ---- Contact form ----
   Two submission modes, controlled from the admin dashboard (Contact tab):
   - "netlify": posts to Netlify Forms. Works automatically once deployed on
     Netlify — set up a notification email in Site settings → Forms → Notifications.
   - "mailto": opens the visitor's own email app addressed to your notification email.
     Works anywhere, no hosting-specific setup required. */
function wireContactForm() {
  const form = el("contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = el("cf-name").value;
    const email = el("cf-email").value;
    const message = el("cf-message").value;
    const mode = (SITE_CONTENT && SITE_CONTENT.contact.formMode) || "netlify";
    const dest = (SITE_CONTENT && SITE_CONTENT.contact.notificationEmail) || (SITE_CONTENT && SITE_CONTENT.contact.email) || "";

    if (mode === "mailto") {
      const subject = encodeURIComponent(`New enquiry from ${name} — Roots and Roof`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:${dest}?subject=${subject}&body=${body}`;
      setTimeout(() => showFormSuccess(true), 300);
    } else {
      const body = new URLSearchParams(new FormData(form)).toString();
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      })
        .then(() => showFormSuccess(false))
        .catch(() => showFormSuccess(false));
    }
  });
}

function showFormSuccess(viaMailClient) {
  el("contact-form-wrap").innerHTML = `
    <div class="form-success">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/></svg>
      <p class="title">${viaMailClient ? "Almost there" : "Message received"}</p>
      <p>${
        viaMailClient
          ? "Your email app should have opened with your message ready to send."
          : "Desh will get back to you within one business day."
      }</p>
    </div>`;
}
