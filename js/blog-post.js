/* ==========================================================
   Roots and Roof — Individual blog post page
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const content = loadContent();
  initSharedChrome(content, false);

  const slug = new URLSearchParams(window.location.search).get("slug");
  const post = (content.blogPosts || []).find((p) => p.slug === slug);

  if (post) {
    document.title = `${post.title} — ${content.brand.name}`;
    el("post-content").innerHTML = `
      <article class="blog-article" style="margin:0;padding-top:0;border-top:none;">
        <span class="date-tag">${calendarIcon()} ${formatDate(post.date)}</span>
        <h2>${post.title}</h2>
        ${paragraphize(post.body)}
      </article>`;
  } else {
    document.title = `Post not found — ${content.brand.name}`;
    el("post-content").innerHTML = `
      <div style="max-width:640px;">
        <h2 style="font-family:var(--font-display);font-size:1.6rem;color:var(--green-dark);margin-bottom:12px;">We couldn't find that post</h2>
        <p style="color:var(--muted);margin-bottom:20px;">It may have been renamed or removed. Head back to the blog to see everything currently published.</p>
        <a href="blog.html" class="btn btn-green">Back to Blog</a>
      </div>`;
  }

  wireReveal();
});

function paragraphize(body) {
  return (body || "")
    .split(/\n\s*\n/)
    .map((para) => `<p>${para.trim()}</p>`)
    .join("");
}
