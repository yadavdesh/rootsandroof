/* ==========================================================
   Roots and Roof — Admin dashboard behaviour
   ========================================================== */

const TABS = ["Header & Footer", "Hero", "About", "Services", "Process", "Stories", "FAQ", "Contact", "Social", "News", "Blog"];
let draft = null;
let currentTab = "Header & Footer";

document.addEventListener("DOMContentLoaded", () => {
  const isAuthed = sessionStorage.getItem(ADMIN_AUTH_KEY) === "true";
  if (isAuthed) showDashboard();
  else showLogin();

  wireLogin();
  wireTopbar();
});

function showLogin() {
  document.getElementById("login-view").style.display = "flex";
  document.getElementById("dashboard-view").style.display = "none";
  document.getElementById("password-input").focus();
}

function showDashboard() {
  document.getElementById("login-view").style.display = "none";
  document.getElementById("dashboard-view").style.display = "block";
  draft = loadContent();
  renderSidebar();
  renderTab(currentTab);
}

function wireLogin() {
  const form = document.getElementById("login-form");
  const input = document.getElementById("password-input");
  const errorEl = document.getElementById("login-error");
  const toggle = document.getElementById("toggle-password");

  toggle.addEventListener("click", () => {
    input.type = input.type === "password" ? "text" : "password";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
      errorEl.style.display = "none";
      showDashboard();
    } else {
      errorEl.textContent = "Incorrect password. Please try again.";
      errorEl.style.display = "block";
    }
  });
}

function wireTopbar() {
  document.getElementById("logout-btn").addEventListener("click", () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    window.location.href = "index.html";
  });

  document.getElementById("save-btn").addEventListener("click", () => {
    saveContent(draft);
    const flash = document.getElementById("saved-flash");
    flash.style.display = "flex";
    setTimeout(() => (flash.style.display = "none"), 2200);
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    if (confirm("Reset all content to the original defaults? This cannot be undone.")) {
      draft = structuredClone(DEFAULT_CONTENT);
      saveContent(draft);
      renderTab(currentTab);
    }
  });
}

function renderSidebar() {
  const sidebar = document.getElementById("admin-sidebar");
  const mobileTabs = document.getElementById("admin-tabs-mobile");
  const build = (container) => {
    container.innerHTML = TABS.map(
      (t) => `<button data-tab="${t}" class="${t === currentTab ? "active" : ""}">${t}</button>`
    ).join("");
  };
  build(sidebar);
  build(mobileTabs);

  document.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentTab = btn.getAttribute("data-tab");
      renderSidebar();
      renderTab(currentTab);
    });
  });
}

/* ---------- field helpers ---------- */
function field(label, value, path, textarea = false) {
  const safeVal = (value ?? "").toString().replace(/"/g, "&quot;");
  return `
    <div class="admin-field">
      <label>${label}</label>
      ${
        textarea
          ? `<textarea rows="3" data-path="${path}">${escapeHtml(value ?? "")}</textarea>`
          : `<input type="text" value="${safeVal}" data-path="${path}" />`
      }
    </div>`;
}

function selectField(label, value, path, options) {
  const opts = options
    .map((o) => `<option value="${o.value}" ${o.value === value ? "selected" : ""}>${o.label}</option>`)
    .join("");
  return `
    <div class="admin-field">
      <label>${label}</label>
      <select data-path="${path}">${opts}</select>
    </div>`;
}

function note(text) {
  return `<p class="admin-note">${text}</p>`;
}

/* Image field: URL text input + live preview + "upload from device" button.
   Uploaded files are converted to base64 data URLs and stored directly in
   the content object, so they persist in localStorage with no external host. */
function imageField(label, value, path) {
  const safeVal = (value ?? "").toString().replace(/"/g, "&quot;");
  const previewId = `preview-${path.replace(/\./g, "-")}`;
  const fileId = `file-${path.replace(/\./g, "-")}`;
  return `
    <div class="admin-field">
      <label>${label}</label>
      <div class="admin-image-row">
        <img class="admin-image-preview" id="${previewId}" src="${safeVal}" alt="" onerror="this.style.visibility='hidden'" onload="this.style.visibility='visible'" />
        <button type="button" class="admin-upload-btn" data-trigger-file="${fileId}">Upload from device</button>
        <input type="file" accept="image/*" class="admin-file-input" id="${fileId}" data-image-path="${path}" data-preview-target="${previewId}" />
      </div>
      <input type="text" value="${safeVal}" data-path="${path}" data-preview-target="${previewId}" placeholder="Paste an image URL, or upload from device above" />
    </div>`;
}

function escapeHtml(str) {
  return (str ?? "").toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function setByPath(obj, path, value) {
  const keys = path.split(".");
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
  cur[keys[keys.length - 1]] = value;
}

/* Bind all inputs/textareas/selects with data-path inside the panel to update `draft` live */
function bindFieldEvents() {
  document.querySelectorAll("#admin-panel [data-path]").forEach((elm) => {
    const evt = elm.tagName === "SELECT" ? "change" : "input";
    elm.addEventListener(evt, () => {
      setByPath(draft, elm.getAttribute("data-path"), elm.value);
      const previewTarget = elm.getAttribute("data-preview-target");
      if (previewTarget) {
        const img = document.getElementById(previewTarget);
        if (img) img.src = elm.value;
      }
    });
  });
}

/* Wire up "Upload from device" buttons + file inputs for image fields */
function wireImageFields() {
  document.querySelectorAll("[data-trigger-file]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.getAttribute("data-trigger-file"));
      if (input) input.click();
    });
  });
  document.querySelectorAll(".admin-file-input").forEach((input) => {
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        setByPath(draft, input.getAttribute("data-image-path"), dataUrl);
        const previewImg = document.getElementById(input.getAttribute("data-preview-target"));
        if (previewImg) previewImg.src = dataUrl;
        const textInput = document.querySelector(`[data-path="${input.getAttribute("data-image-path")}"]`);
        if (textInput && textInput.tagName !== "SELECT") textInput.value = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  });
}

/* ---------- generic string-list editor (used for nav links, highlights) ---------- */
function stringListEditor(path, items, addLabel) {
  const rows = (items || [])
    .map(
      (val, i) => `
      <div class="admin-list-row">
        <input type="text" value="${(val || "").toString().replace(/"/g, "&quot;")}" data-strlist-idx="${path}:${i}" />
        <button data-strlist-remove="${path}:${i}">${trashSvg()}</button>
      </div>`
    )
    .join("");
  return `
    <div id="strlist-${path.replace(/\./g, "-")}">${rows}</div>
    <button class="admin-add-btn" data-strlist-add="${path}">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      ${addLabel}
    </button>`;
}

function wireStringLists() {
  document.querySelectorAll("[data-strlist-idx]").forEach((inp) => {
    inp.addEventListener("input", () => {
      const [path, idx] = inp.getAttribute("data-strlist-idx").split(":");
      getByPath(draft, path)[Number(idx)] = inp.value;
    });
  });
  document.querySelectorAll("[data-strlist-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const [path, idx] = btn.getAttribute("data-strlist-remove").split(":");
      getByPath(draft, path).splice(Number(idx), 1);
      renderTab(currentTab);
    });
  });
  document.querySelectorAll("[data-strlist-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const path = btn.getAttribute("data-strlist-add");
      getByPath(draft, path).push("New item");
      renderTab(currentTab);
    });
  });
}

/* ---------- tab renderers ---------- */
function renderTab(tab) {
  const panel = document.getElementById("admin-panel");
  if (tab === "Header & Footer") panel.innerHTML = renderHeaderFooterTab();
  else if (tab === "Hero") panel.innerHTML = renderHeroTab();
  else if (tab === "About") panel.innerHTML = renderAboutTab();
  else if (tab === "Services") panel.innerHTML = renderArrayTab("services", renderServiceCard, "Service");
  else if (tab === "Process") panel.innerHTML = renderArrayTab("process", renderProcessCard, "Step");
  else if (tab === "Stories") panel.innerHTML = renderArrayTab("testimonials", renderTestimonialCard, "Testimonial");
  else if (tab === "FAQ") panel.innerHTML = renderArrayTab("faq", renderFaqCard, "Question");
  else if (tab === "Contact") panel.innerHTML = renderContactTab();
  else if (tab === "Social") panel.innerHTML = note("Instagram appears as an icon in the top-right of the navigation bar on every page, instead of in the Contact section, so it stays visible without competing with the WhatsApp button. All other platforms here show in the Contact section and footer as usual.") + renderArrayTab("socialLinks", renderSocialCard, "Social Link");
  else if (tab === "News") panel.innerHTML = renderNewsTab();
  else if (tab === "Blog") panel.innerHTML = renderBlogTab();

  bindFieldEvents();
  wireArrayButtons();
  wireStringLists();
  wireImageFields();
}

function renderHeaderFooterTab() {
  return `
    <div class="admin-card">
      <p class="admin-card-title">Brand</p>
      ${field("Business Name", draft.brand.name, "brand.name")}
      ${field("Tagline", draft.brand.tagline, "brand.tagline")}
    </div>
    <div class="admin-card">
      <p class="admin-card-title">Header Navigation Links</p>
      ${note("Only \"About\", \"Services\" and \"Process\" appear in the top navigation bar — keeping the header short and uncluttered. Every other item here (Stories, FAQ, Contact) automatically moves to the footer instead, alongside \"Blog\" and \"News\". Renaming an item still works either way, as long as it doesn't match About/Services/Process it'll show in the footer.")}
      ${stringListEditor("nav", draft.nav, "Add Nav Link")}
    </div>
    <div class="admin-card">
      <p class="admin-card-title">Footer</p>
      ${field("Footer Disclaimer Text", draft.footer.note, "footer.note", true)}
    </div>`;
}

function renderHeroTab() {
  return `
    <div class="admin-card">
      <p class="admin-card-title">Hero Section</p>
      ${field("Eyebrow", draft.hero.eyebrow, "hero.eyebrow")}
      ${field("Headline", draft.hero.headline, "hero.headline")}
      ${field("Subheadline", draft.hero.subheadline, "hero.subheadline", true)}
      ${field("Primary Button Text", draft.hero.ctaPrimary, "hero.ctaPrimary")}
      ${field("Secondary Button Text", draft.hero.ctaSecondary, "hero.ctaSecondary")}
      ${imageField("Background Photo", draft.hero.backgroundImage, "hero.backgroundImage")}
    </div>`;
}

function renderAboutTab() {
  return `
    <div class="admin-card">
      <p class="admin-card-title">About Section</p>
      ${field("Eyebrow", draft.about.eyebrow, "about.eyebrow")}
      ${field("Heading", draft.about.heading, "about.heading")}
      ${field("Body", draft.about.body, "about.body", true)}
    </div>
    <div class="admin-card">
      <p class="admin-card-title">Owner Details</p>
      ${field("Name", draft.about.ownerName, "about.ownerName")}
      ${field("Title", draft.about.ownerTitle, "about.ownerTitle")}
      ${field("Bio", draft.about.ownerBio, "about.ownerBio", true)}
      ${imageField("Owner Photo", draft.about.ownerImage, "about.ownerImage")}
    </div>
    <div class="admin-card">
      <p class="admin-card-title">Highlights</p>
      ${stringListEditor("about.highlights", draft.about.highlights, "Add Highlight")}
    </div>`;
}

function renderServiceCard(s, i) {
  return `
    <div class="admin-card" data-card="services-${i}">
      <button class="admin-remove-btn" data-remove="services:${i}">${trashSvg()}</button>
      <p class="admin-card-title">Service ${i + 1}</p>
      ${field("Icon (Home, Search, FileText, Landmark, Users, TrendingUp, ShieldCheck)", s.icon, `services.${i}.icon`)}
      ${field("Title", s.title, `services.${i}.title`)}
      ${field("Description", s.description, `services.${i}.description`, true)}
    </div>`;
}

function renderProcessCard(p, i) {
  return `
    <div class="admin-card" data-card="process-${i}">
      <button class="admin-remove-btn" data-remove="process:${i}">${trashSvg()}</button>
      <p class="admin-card-title">Step ${i + 1}</p>
      ${field("Title", p.title, `process.${i}.title`)}
      ${field("Description", p.description, `process.${i}.description`, true)}
    </div>`;
}

function renderTestimonialCard(t, i) {
  return `
    <div class="admin-card" data-card="testimonials-${i}">
      <button class="admin-remove-btn" data-remove="testimonials:${i}">${trashSvg()}</button>
      <p class="admin-card-title">Testimonial ${i + 1}</p>
      ${field("Client Name", t.name, `testimonials.${i}.name`)}
      ${field("Location / Role", t.location, `testimonials.${i}.location`)}
      ${field("Quote", t.quote, `testimonials.${i}.quote`, true)}
      ${field("Rating (1-5)", t.rating, `testimonials.${i}.rating`)}
    </div>`;
}

function renderFaqCard(f, i) {
  return `
    <div class="admin-card" data-card="faq-${i}">
      <button class="admin-remove-btn" data-remove="faq:${i}">${trashSvg()}</button>
      <p class="admin-card-title">Question ${i + 1}</p>
      ${field("Question", f.q, `faq.${i}.q`)}
      ${field("Answer", f.a, `faq.${i}.a`, true)}
    </div>`;
}

function renderSocialCard(s, i) {
  const platformOptions = Object.keys(SOCIAL_ICONS).map((p) => ({ value: p, label: p }));
  return `
    <div class="admin-card" data-card="social-${i}">
      <button class="admin-remove-btn" data-remove="socialLinks:${i}">${trashSvg()}</button>
      <p class="admin-card-title">Social Link ${i + 1}</p>
      ${selectField("Platform", s.platform, `socialLinks.${i}.platform`, platformOptions)}
      ${field("Profile URL", s.url, `socialLinks.${i}.url`)}
    </div>`;
}

function renderNewsCard(n, i) {
  return `
    <div class="admin-card" data-card="news-${i}">
      <button class="admin-remove-btn" data-remove="news:${i}">${trashSvg()}</button>
      <p class="admin-card-title">News Item ${i + 1}</p>
      ${field("Headline", n.title, `news.${i}.title`)}
      ${field("Date (YYYY-MM-DD)", n.date, `news.${i}.date`)}
      ${field("Source Name", n.source, `news.${i}.source`)}
      ${field("Source URL", n.sourceUrl, `news.${i}.sourceUrl`)}
      ${field("Summary", n.summary, `news.${i}.summary`, true)}
    </div>`;
}

function renderNewsTab() {
  return `
    <div class="admin-card">
      <p class="admin-card-title">News Page Header</p>
      ${field("Eyebrow", draft.newsPage.eyebrow, "newsPage.eyebrow")}
      ${field("Heading", draft.newsPage.heading, "newsPage.heading")}
      ${field("Intro Text", draft.newsPage.intro, "newsPage.intro", true)}
    </div>
    ${note("News items are shown newest-first automatically based on the date field, regardless of the order below.")}
    ${renderArrayTab("news", renderNewsCard, "News Item")}`;
}

function renderBlogCard(p, i) {
  return `
    <div class="admin-card" data-card="blog-${i}">
      <button class="admin-remove-btn" data-remove="blogPosts:${i}">${trashSvg()}</button>
      <p class="admin-card-title">Blog Post ${i + 1}</p>
      ${field("Title", p.title, `blogPosts.${i}.title`)}
      ${field("URL Slug (no spaces, e.g. berlin-prices-rising)", p.slug, `blogPosts.${i}.slug`)}
      ${field("Date (YYYY-MM-DD)", p.date, `blogPosts.${i}.date`)}
      ${field("Excerpt (shown on the preview card)", p.excerpt, `blogPosts.${i}.excerpt`, true)}
      ${field("Full Post (leave a blank line between paragraphs)", p.body, `blogPosts.${i}.body`, true)}
    </div>`;
}

function renderBlogTab() {
  return `
    <div class="admin-card">
      <p class="admin-card-title">Blog Page Header</p>
      ${field("Eyebrow", draft.blogPage.eyebrow, "blogPage.eyebrow")}
      ${field("Heading", draft.blogPage.heading, "blogPage.heading")}
      ${field("Intro Text", draft.blogPage.intro, "blogPage.intro", true)}
    </div>
    ${note("Posts are shown newest-first automatically based on the date field. In the full-post text box, leave a blank line between paragraphs — that's how the page knows where to break them up.")}
    ${renderArrayTab("blogPosts", renderBlogCard, "Blog Post")}`;
}

function renderContactTab() {
  return `
    <div class="admin-card">
      <p class="admin-card-title">Contact Section Text</p>
      ${field("Section Heading", draft.contact.heading, "contact.heading")}
      ${field("Section Body", draft.contact.body, "contact.body", true)}
      ${field("Email (shown on site)", draft.contact.email, "contact.email")}
      ${field("WhatsApp Link (e.g. https://wa.me/4917645936837)", draft.contact.whatsapp, "contact.whatsapp")}
      ${field("City", draft.contact.city, "contact.city")}
    </div>
    <div class="admin-card">
      <p class="admin-card-title">Contact Form Submission</p>
      ${selectField("Where should submissions go?", draft.contact.formMode, "contact.formMode", [
        { value: "netlify", label: "Netlify Forms — silent submit, needs one-time setup below" },
        { value: "mailto", label: "Open visitor's email app (mailto link) — no setup, less seamless" },
      ])}
      ${field("Notification Email", draft.contact.notificationEmail, "contact.notificationEmail")}
      ${note(
        "Netlify Forms — one-time setup required (2 minutes): (1) Deploy this site on Netlify at least once. (2) In your Netlify dashboard, open this site → Forms tab in the left sidebar. (3) Click Notifications → Add notification → Email notification. (4) Enter the address above and save. After that, every submission is captured silently — no email app pop-up for the visitor — and forwarded straight to your inbox automatically. This step lives entirely in Netlify's dashboard; it can't be set from this admin panel or from code."
      )}
    </div>`;
}

function trashSvg() {
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>`;
}

function renderArrayTab(arrKey, cardRenderer, itemLabel) {
  const items = draft[arrKey].map((item, i) => cardRenderer(item, i)).join("");
  return `${items}
    <button class="admin-add-btn" id="add-${arrKey}">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Add ${itemLabel}
    </button>`;
}

/* ---------- array (object-list) add/remove wiring ---------- */
function wireArrayButtons() {
  document.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const [arrKey, idx] = btn.getAttribute("data-remove").split(":");
      draft[arrKey].splice(Number(idx), 1);
      renderTab(currentTab);
    });
  });

  const addMap = {
    services: { icon: "Home", title: "New Service", description: "Describe this service." },
    process: { title: "New Step", description: "Describe this step." },
    testimonials: { name: "New Client", location: "Location", quote: "Their experience...", rating: 5 },
    faq: { q: "New question?", a: "Answer goes here." },
    socialLinks: { platform: "Instagram", url: "" },
    news: { title: "New headline", source: "Source name", sourceUrl: "https://", date: new Date().toISOString().slice(0, 10), summary: "Summary of the news item." },
    blogPosts: { title: "New post title", slug: `new-post-${Date.now()}`, date: new Date().toISOString().slice(0, 10), excerpt: "A short preview shown on the blog grid.", body: "Write your post here.\n\nLeave a blank line between paragraphs." },
  };
  Object.keys(addMap).forEach((key) => {
    const btn = document.getElementById(`add-${key}`);
    if (btn) {
      btn.addEventListener("click", () => {
        draft[key].push(structuredClone(addMap[key]));
        renderTab(currentTab);
      });
    }
  });
}
