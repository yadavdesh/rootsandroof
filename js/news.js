/* ==========================================================
   Roots and Roof — News page behaviour
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const content = loadContent();
  initSharedChrome(content, false);
  render(content);
});

function render(content) {
  document.title = `Latest News — ${content.brand.name}`;

  el("page-eyebrow").textContent = content.newsPage.eyebrow;
  el("page-heading").textContent = content.newsPage.heading;
  el("page-intro").textContent = content.newsPage.intro;

  const items = [...content.news].sort((a, b) => new Date(b.date) - new Date(a.date));

  el("news-list").innerHTML = items
    .map(
      (n) => `
      <article class="news-card reveal">
        <div class="news-meta">
          <span class="date-tag">${calendarIcon()} ${formatDate(n.date)}</span>
          <span>·</span>
          <span>${n.source}</span>
        </div>
        <h2>${n.title}</h2>
        <p class="summary">${n.summary}</p>
        <a class="source-link" href="${n.sourceUrl}" target="_blank" rel="noopener noreferrer">
          Read the original source ${externalLinkIcon()}
        </a>
      </article>`
    )
    .join("");

  // Newly injected cards need the reveal observer re-run
  wireReveal();
}
