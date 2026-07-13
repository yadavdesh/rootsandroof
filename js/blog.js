/* ==========================================================
   Roots and Roof — Blog listing page (tiles only)
   Posts with a hand-built static page (best for SEO / AI crawlers
   that don't run JavaScript) link straight there. Any post added later
   via the admin panel that isn't in this list yet falls back to the
   dynamic blog-post.html template, so the link always works — ask
   Claude to generate a matching static page under /blog/ for full SEO.
   ========================================================== */

const STATIC_POST_SLUGS = [
  "berlin-prices-moving-again",
  "apartments-safer-than-offices",
  "renting-easier-buying-isnt",
  "mortgage-rate-372-percent",
  "not-booming-worth-a-look",
];

document.addEventListener("DOMContentLoaded", () => {
  const content = loadContent();
  initSharedChrome(content, false);
  render(content);
  wireReveal();
});

function render(content) {
  document.title = `Blog — ${content.brand.name}`;

  el("page-eyebrow").textContent = content.blogPage.eyebrow;
  el("page-heading").textContent = content.blogPage.heading;
  el("page-intro").textContent = content.blogPage.intro;

  const posts = [...content.blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

  el("blog-grid").innerHTML = posts
    .map((p) => {
      const href = STATIC_POST_SLUGS.includes(p.slug)
        ? `blog/${encodeURIComponent(p.slug)}.html`
        : `blog-post.html?slug=${encodeURIComponent(p.slug)}`;
      return `
      <a class="blog-card reveal" href="${href}" style="text-decoration:none;">
        <span class="date-tag">${calendarIcon()} ${formatDate(p.date)}</span>
        <h2>${p.title}</h2>
        <p class="excerpt">${p.excerpt}</p>
        <span class="read-link">Read the full post →</span>
      </a>`;
    })
    .join("");
}
