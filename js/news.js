/* ==========================================================
   Roots and Roof — News page behaviour
   Shows the 5 most recent items; a "Load more" button reveals
   the rest, 5 at a time, as more are added via the admin panel.
   ========================================================== */

const NEWS_PAGE_SIZE = 5;
let sortedNews = [];
let newsShownCount = NEWS_PAGE_SIZE;

document.addEventListener("DOMContentLoaded", () => {
  const content = loadContent();
  initSharedChrome(content, false);

  document.title = `Latest News — ${content.brand.name}`;
  el("page-eyebrow").textContent = content.newsPage.eyebrow;
  el("page-heading").textContent = content.newsPage.heading;
  el("page-intro").textContent = content.newsPage.intro;

  sortedNews = [...content.news].sort((a, b) => new Date(b.date) - new Date(a.date));
  newsShownCount = Math.min(NEWS_PAGE_SIZE, sortedNews.length);

  renderNewsList();
  el("news-load-more").addEventListener("click", () => {
    newsShownCount = Math.min(newsShownCount + NEWS_PAGE_SIZE, sortedNews.length);
    renderNewsList();
  });
});

function renderNewsList() {
  const items = sortedNews.slice(0, newsShownCount);

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

  const moreBtn = el("news-load-more");
  moreBtn.style.display = newsShownCount >= sortedNews.length ? "none" : "inline-flex";

  wireReveal();
}
