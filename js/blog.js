/* ==========================================================
   Roots and Roof — Blog page behaviour
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const content = loadContent();
  initSharedChrome(content, false);
  render(content);
});

function render(content) {
  document.title = `Blog — ${content.brand.name}`;

  el("page-eyebrow").textContent = content.blogPage.eyebrow;
  el("page-heading").textContent = content.blogPage.heading;
  el("page-intro").textContent = content.blogPage.intro;

  const posts = [...content.blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

  el("blog-grid").innerHTML = posts
    .map(
      (p) => `
      <div class="blog-card reveal">
        <span class="date-tag">${calendarIcon()} ${formatDate(p.date)}</span>
        <h2>${p.title}</h2>
        <p class="excerpt">${p.excerpt}</p>
        <a class="read-link" href="#${p.slug}">Read the full post →</a>
      </div>`
    )
    .join("");

  el("blog-articles").innerHTML = posts
    .map(
      (p) => `
      <article class="blog-article reveal" id="${p.slug}">
        <span class="date-tag">${calendarIcon()} ${formatDate(p.date)}</span>
        <h2>${p.title}</h2>
        ${paragraphize(p.body)}
        <a class="back-to-top" href="#top" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">↑ Back to top</a>
      </article>`
    )
    .join("");

  wireReveal();
}

function paragraphize(body) {
  return (body || "")
    .split(/\n\s*\n/)
    .map((para) => `<p>${para.trim()}</p>`)
    .join("");
}
