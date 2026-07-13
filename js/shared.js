/* ==========================================================
   Roots and Roof — shared logic used by every public page
   (homepage, blog, news). Load this after content.js and
   before the page-specific script.
   ========================================================== */

function el(id) { return document.getElementById(id); }

/* Extra nav links that go to standalone pages rather than homepage sections */
const PAGE_LINKS = [
  { label: "Blog", href: "blog.html" },
  { label: "News", href: "news.html" },
];

/* Build nav markup. On the homepage, section links smooth-scroll via data-scroll.
   On other pages, the same links point back to index.html#section instead. */
function buildNavLinks(content, isHomePage) {
  const sectionLinks = content.nav
    .map((n) => {
      const slug = n.toLowerCase();
      return isHomePage
        ? `<button class="nav-link" data-scroll="${slug}">${n}</button>`
        : `<a class="nav-link" href="index.html#${slug}">${n}</a>`;
    })
    .join("");
  const pageLinks = PAGE_LINKS.map((p) => `<a class="nav-link" href="${p.href}">${p.label}</a>`).join("");
  const cta = isHomePage
    ? `<button class="btn btn-gold" data-scroll="contact" style="padding:10px 20px">Get in Touch</button>`
    : `<a class="btn btn-gold" href="index.html#contact" style="padding:10px 20px">Get in Touch</a>`;
  return { sectionLinks, pageLinks, cta };
}

function renderNav(content, isHomePage) {
  const { sectionLinks, pageLinks, cta } = buildNavLinks(content, isHomePage);
  el("brand-name").textContent = content.brand.name;
  el("nav-links").innerHTML = sectionLinks + pageLinks + cta;
  el("nav-mobile").innerHTML =
    sectionLinks +
    pageLinks +
    (isHomePage
      ? `<button class="btn btn-gold" data-scroll="contact" style="justify-content:center">Get in Touch</button>`
      : `<a class="btn btn-gold" href="index.html#contact" style="justify-content:center">Get in Touch</a>`);
}

function renderFooter(content) {
  el("footer-brand-name").textContent = content.brand.name;
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

function icon(name, size = 20) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.Home}</svg>`;
}
function mailIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`;
}
function whatsappIcon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20l1.3-3.9A8 8 0 1 1 8.9 19L4 20Z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.5 0 1-.7 1-1.3 0-.3-.2-.5-.4-.6l-1.6-.8c-.3-.1-.5-.1-.7.1l-.5.6c-1-.5-1.9-1.4-2.4-2.4l.6-.5c.2-.2.2-.5.1-.7l-.8-1.6c-.1-.3-.4-.4-.6-.4-.6 0-1.2.5-1.2 1Z"/></svg>`;
}
function pinIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
}
function calendarIcon() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`;
}
function externalLinkIcon() {
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
}

/* ---- Nav interactivity: scroll shadow, mobile toggle, smooth-scroll for data-scroll ---- */
function wireNavCommon() {
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

  // Close mobile menu when a normal link is tapped too
  mobile.addEventListener("click", (e) => {
    if (e.target.closest("a")) mobile.classList.remove("open");
  });
}

/* If the page loads with a #hash (e.g. arriving from blog.html -> index.html#contact),
   smooth-scroll to it instead of the browser's instant jump. */
function wireHashArrival() {
  if (!window.location.hash) return;
  const id = window.location.hash.slice(1);
  setTimeout(() => {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 120);
}

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

/* Call once per page after rendering page-specific content */
function initSharedChrome(content, isHomePage) {
  document.title = `${content.brand.name} — ${content.brand.tagline}`;
  renderNav(content, isHomePage);
  renderFooter(content);
  wireNavCommon();
  wireReveal();
  wireHashArrival();
}

function formatDate(iso) {
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  } catch (e) {
    return iso;
  }
}
