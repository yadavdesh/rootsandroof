/* ==========================================================
   Roots and Roof — homepage-specific behaviour
   (nav/footer/reveal logic now lives in js/shared.js)
   ========================================================== */

let SITE_CONTENT = null;

document.addEventListener("DOMContentLoaded", () => {
  SITE_CONTENT = loadContent();
  initSharedChrome(SITE_CONTENT, true);
  render(SITE_CONTENT);
  wireFAQ();
  wireContactForm();
});

function render(content) {
  // Hero
  el("hero-bg-img").src = content.hero.backgroundImage;
  el("hero-eyebrow").textContent = content.hero.eyebrow;
  el("hero-headline").textContent = content.hero.headline;
  el("hero-sub").textContent = content.hero.subheadline;
  el("hero-cta-primary").textContent = content.hero.ctaPrimary;
  el("hero-cta-secondary").textContent = content.hero.ctaSecondary;

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
        <div class="quote-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M9.5 8C7 8 5 10 5 12.5S7 17 9.5 17c.3 0 .6 0 .9-.1-.4 1.6-1.8 2.9-3.6 3.3l.5 1.7c3.2-.7 5.7-3.5 5.7-7.2V12.5C13 10 11 8 9.5 8Zm9 0c-2.5 0-4.5 2-4.5 4.5S16 17 18.5 17c.3 0 .6 0 .9-.1-.4 1.6-1.8 2.9-3.6 3.3l.5 1.7c3.2-.7 5.7-3.5 5.7-7.2V12.5C22 10 20 8 18.5 8Z"/></svg>
        </div>
        <p class="quote-text">"${t.quote}"</p>
        <div class="testi-stars">${Array.from({ length: t.rating }).map(() => `<svg width="14" height="14" viewBox="0 0 24 24" fill="#b8963f"><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9"/></svg>`).join("")}</div>
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
    <div class="contact-info-row">${pinIcon()}<span>${content.contact.city}</span></div>
  `;
  el("whatsapp-cta").innerHTML = `
    <a href="${content.contact.whatsapp}" target="_blank" rel="noopener noreferrer" class="btn btn-gold">
      ${whatsappIcon()}
      Chat with us on WhatsApp
    </a>`;
  el("contact-social").innerHTML = socialIconLinks(content.socialLinks);
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
      fetch(window.location.pathname, {
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
