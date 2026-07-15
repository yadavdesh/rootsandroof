/* ==========================================================
   Roots and Roof — shared logic used by every public page
   (homepage, blog, news). Load this after content.js and
   before the page-specific script.
   ========================================================== */

/* ==========================================================
   Centralized header/footer markup. This is the ONLY place this HTML
   exists — every page just has an empty <div id="site-header-root">
   and <div id="site-footer-root">, and this template gets injected into
   both on load. That guarantees every page is byte-identical instead of
   relying on copy-pasted markup staying in sync across files by hand.

   basePath: "" for pages at the site root (index.html, etc.),
   "../" for pages nested one folder deep (blog/some-post.html).
   ========================================================== */
function headerTemplate(basePath, isHomePage) {
  return `
    <header class="navbar${isHomePage ? "" : " solid"}" id="navbar">
      <div class="container">
        <a class="brand-mark" href="${basePath}index.html" aria-label="Roots and Roof home">
          <svg width="52" height="52" viewBox="98 98 464 464" xmlns="http://www.w3.org/2000/svg">
            <circle cx="330" cy="330" r="218" fill="none" stroke="#c9a84c" stroke-width="2.6"/>
            <circle cx="330" cy="330" r="191" fill="none" stroke="#c9a84c" stroke-width="2"/>
            <path d="M 224 258 L 330 165 L 436 258" fill="none" stroke="#c9a84c" stroke-width="7.3" stroke-linecap="round" stroke-linejoin="round"/>
            <text x="330" y="367" text-anchor="middle" font-family="Fraunces, serif" font-weight="600" font-size="122" fill="#f5f0e8" letter-spacing="4">R&amp;R</text>
            <path d="M 330 375 L 330 428
                     M 330 401 L 274 466
                     M 330 401 L 386 466
                     M 274 466 L 236 511
                     M 386 466 L 424 511"
                  fill="none" stroke="#c9a84c" stroke-width="4.6" stroke-linecap="round"/>
          </svg>
          <span id="brand-name">Roots and Roof</span>
        </a>
        <nav class="nav-links" id="nav-links"></nav>
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
      <div class="nav-mobile" id="nav-mobile"></div>
    </header>`;
}

function footerTemplate(basePath, isHomePage) {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-row footer-row-links">
          <div class="brand-mark">
            <svg width="42" height="42" viewBox="98 98 464 464" xmlns="http://www.w3.org/2000/svg">
              <circle cx="330" cy="330" r="218" fill="none" stroke="#c9a84c" stroke-width="2.6"/>
              <circle cx="330" cy="330" r="191" fill="none" stroke="#c9a84c" stroke-width="2"/>
              <path d="M 224 258 L 330 165 L 436 258" fill="none" stroke="#c9a84c" stroke-width="7.3" stroke-linecap="round" stroke-linejoin="round"/>
              <text x="330" y="367" text-anchor="middle" font-family="Fraunces, serif" font-weight="600" font-size="122" fill="#f5f0e8" letter-spacing="4">R&amp;R</text>
              <path d="M 330 375 L 330 428
                       M 330 401 L 274 466
                       M 330 401 L 386 466
                       M 274 466 L 236 511
                       M 386 466 L 424 511"
                    fill="none" stroke="#c9a84c" stroke-width="4.6" stroke-linecap="round"/>
            </svg>
            <span id="footer-brand-name">Roots and Roof</span>
          </div>
          <div class="footer-links" id="footer-links"></div>
        </div>
        <div class="footer-row footer-row-contact">
          <div class="footer-contact" id="footer-contact"></div>
          <div class="social-row" id="footer-social"></div>
        </div>
        <div class="footer-bottom">
          <p class="footer-note" id="footer-note"></p>
          <div class="footer-meta">
            <p id="footer-copyright"></p>
            <a href="${basePath}impressum.html">Impressum</a>
            <a href="${basePath}datenschutz.html">Datenschutz</a>
            <a href="${basePath}admin.html">Admin</a>
          </div>
        </div>
      </div>
    </footer>`;
}

function el(id) { return document.getElementById(id); }

/* Top nav is intentionally short: only these sections stay in the header.
   Everything else (Stories, FAQ, Contact, Blog, News) moves to the footer. */
const TOP_NAV_LABELS = ["about", "services", "process"];
/* Extra links that go to standalone pages rather than homepage sections —
   these live in the footer now, not the top nav. */
const PAGE_LINKS = [
  { label: "Blog", href: "blog.html" },
  { label: "News", href: "news.html" },
];

/* Build top nav markup. On the homepage, section links smooth-scroll via
   data-scroll. On other pages, the same links point back to index.html#section. */
function buildNavLinks(content, isHomePage, basePath) {
  const sectionLinks = content.nav
    .filter((n) => TOP_NAV_LABELS.includes(n.toLowerCase()))
    .map((n) => {
      const slug = n.toLowerCase();
      return isHomePage
        ? `<button class="nav-link" data-scroll="${slug}">${n}</button>`
        : `<a class="nav-link" href="${basePath}index.html#${slug}">${n}</a>`;
    })
    .join("");
  const cta = isHomePage
    ? `<button class="btn btn-gold" data-scroll="contact" style="padding:10px 20px">Get in Touch</button>`
    : `<a class="btn btn-gold" href="${basePath}index.html#contact" style="padding:10px 20px">Get in Touch</a>`;
  return { sectionLinks, cta };
}

/* Everything NOT in the top nav (Stories, FAQ, Contact, plus Blog & News) */
function buildFooterLinks(content, isHomePage, basePath) {
  const remaining = content.nav.filter((n) => !TOP_NAV_LABELS.includes(n.toLowerCase()));
  const sectionLinks = remaining
    .map((n) => {
      const slug = n.toLowerCase();
      return isHomePage
        ? `<button class="footer-link" data-scroll="${slug}">${n}</button>`
        : `<a class="footer-link" href="${basePath}index.html#${slug}">${n}</a>`;
    })
    .join("");
  const pageLinks = PAGE_LINKS.map((p) => `<a class="footer-link" href="${basePath}${p.href}">${p.label}</a>`).join("");
  return sectionLinks + pageLinks;
}

/* Instagram gets its own prominent, brand-colored spot in the top nav
   rather than blending into the generic social icon row. */
function instagramNavLink(content, withLabel) {
  const insta = (content.socialLinks || []).find((s) => s.platform === "Instagram" && s.url && s.url.trim());
  if (!insta) return "";
  return `<a href="${insta.url}" target="_blank" rel="noopener noreferrer" class="nav-insta" title="Instagram" aria-label="Instagram">
    ${instagramGlyph(26)}${withLabel ? "<span>Instagram</span>" : ""}
  </a>`;
}

/* Instagram's actual brand gradient, not a monochrome outline —
   makes it read as "Instagram" at a glance instead of a generic icon. */
function instagramGlyph(size = 24) {
  const gid = "igGrad" + size;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="${gid}" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FEDA75"/>
        <stop offset="25%" stop-color="#FA7E1E"/>
        <stop offset="55%" stop-color="#D62976"/>
        <stop offset="80%" stop-color="#962FBF"/>
        <stop offset="100%" stop-color="#4F5BD5"/>
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#${gid})"/>
    <circle cx="12" cy="12" r="5" fill="none" stroke="#fff" stroke-width="1.8"/>
    <circle cx="17.2" cy="6.8" r="1.15" fill="#fff"/>
  </svg>`;
}

function renderNav(content, isHomePage, basePath) {
  const { sectionLinks, cta } = buildNavLinks(content, isHomePage, basePath);
  el("brand-name").textContent = content.brand.name;
  el("nav-links").innerHTML = sectionLinks + cta + instagramNavLink(content, false);
  el("nav-mobile").innerHTML =
    sectionLinks +
    (isHomePage
      ? `<button class="btn btn-gold" data-scroll="contact" style="justify-content:center">Get in Touch</button>`
      : `<a class="btn btn-gold" href="${basePath}index.html#contact" style="justify-content:center">Get in Touch</a>`) +
    instagramNavLink(content, true);
}

function renderFooter(content, isHomePage, basePath) {
  el("footer-brand-name").textContent = content.brand.name;
  el("footer-links").innerHTML = buildFooterLinks(content, isHomePage, basePath || "");
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

/* If the page loads with a #hash (e.g. arriving from /blog -> index.html#contact),
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

/* Call once per page after rendering page-specific content.
   basePath: "" for root pages, "../" for pages nested in /blog/.
   Note: document.title is intentionally NOT set here — each page sets its
   own, matching the SEO-optimised <title> already in its HTML <head>. */
function initSharedChrome(content, isHomePage, basePath) {
  basePath = basePath || "";
  el("site-header-root").innerHTML = headerTemplate(basePath, isHomePage);
  el("site-footer-root").innerHTML = footerTemplate(basePath, isHomePage);
  renderNav(content, isHomePage, basePath);
  renderFooter(content, isHomePage, basePath);
  wireNavCommon();
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
