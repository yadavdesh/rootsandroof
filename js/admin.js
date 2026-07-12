/* ==========================================================
   Roots and Roof — Admin dashboard behaviour
   ========================================================== */

const TABS = ["Hero", "About", "Services", "Process", "Stories", "FAQ", "Contact"];
let draft = null;
let currentTab = "Hero";

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

/* Bind all inputs/textareas with data-path inside the panel to update `draft` live */
function bindFieldEvents() {
  document.querySelectorAll("#admin-panel [data-path]").forEach((elm) => {
    elm.addEventListener("input", () => {
      setByPath(draft, elm.getAttribute("data-path"), elm.value);
    });
  });
}

/* ---------- tab renderers ---------- */
function renderTab(tab) {
  const panel = document.getElementById("admin-panel");
  if (tab === "Hero") panel.innerHTML = renderHeroTab();
  else if (tab === "About") panel.innerHTML = renderAboutTab();
  else if (tab === "Services") panel.innerHTML = renderArrayTab("services", renderServiceCard, {
    icon: "Home",
    title: "New Service",
    description: "Describe this service.",
  });
  else if (tab === "Process") panel.innerHTML = renderArrayTab("process", renderProcessCard, {
    title: "New Step",
    description: "Describe this step.",
  });
  else if (tab === "Stories") panel.innerHTML = renderArrayTab("testimonials", renderTestimonialCard, {
    name: "New Client",
    location: "Location",
    quote: "Their experience...",
    rating: 5,
  });
  else if (tab === "FAQ") panel.innerHTML = renderArrayTab("faq", renderFaqCard, {
    q: "New question?",
    a: "Answer goes here.",
  });
  else if (tab === "Contact") panel.innerHTML = renderContactTab();

  bindFieldEvents();
  wireArrayButtons();
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
      ${field("Background Image URL", draft.hero.backgroundImage, "hero.backgroundImage")}
    </div>`;
}

function renderAboutTab() {
  const highlightsRows = draft.about.highlights
    .map(
      (h, i) => `
      <div class="admin-list-row">
        <input type="text" value="${(h || "").replace(/"/g, "&quot;")}" data-highlight-idx="${i}" />
        <button data-remove-highlight="${i}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
        </button>
      </div>`
    )
    .join("");

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
      ${field("Photo URL", draft.about.ownerImage, "about.ownerImage")}
    </div>
    <div class="admin-card">
      <p class="admin-card-title">Highlights</p>
      <div id="highlights-list">${highlightsRows}</div>
      <button class="admin-add-btn" id="add-highlight">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Highlight
      </button>
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

function renderContactTab() {
  return `
    <div class="admin-card">
      <p class="admin-card-title">Contact Details</p>
      ${field("Section Heading", draft.contact.heading, "contact.heading")}
      ${field("Section Body", draft.contact.body, "contact.body", true)}
      ${field("Email", draft.contact.email, "contact.email")}
      ${field("Phone", draft.contact.phone, "contact.phone")}
      ${field("Instagram Handle", draft.contact.instagram, "contact.instagram")}
      ${field("City", draft.contact.city, "contact.city")}
      ${field("Footer Disclaimer", draft.footer.note, "footer.note", true)}
    </div>`;
}

function trashSvg() {
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>`;
}

function renderArrayTab(arrKey, cardRenderer, template) {
  const items = draft[arrKey].map((item, i) => cardRenderer(item, i)).join("");
  return `${items}
    <button class="admin-add-btn" id="add-${arrKey}">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Add ${arrKey === "faq" ? "Question" : arrKey === "testimonials" ? "Testimonial" : arrKey === "process" ? "Step" : "Service"}
    </button>`;
}

/* ---------- array add/remove wiring ---------- */
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
  };
  ["services", "process", "testimonials", "faq"].forEach((key) => {
    const btn = document.getElementById(`add-${key}`);
    if (btn) {
      btn.addEventListener("click", () => {
        draft[key].push(structuredClone(addMap[key]));
        renderTab(currentTab);
      });
    }
  });

  // Highlights (simple string array, not object array)
  document.querySelectorAll("[data-highlight-idx]").forEach((inp) => {
    inp.addEventListener("input", () => {
      draft.about.highlights[Number(inp.getAttribute("data-highlight-idx"))] = inp.value;
    });
  });
  document.querySelectorAll("[data-remove-highlight]").forEach((btn) => {
    btn.addEventListener("click", () => {
      draft.about.highlights.splice(Number(btn.getAttribute("data-remove-highlight")), 1);
      renderTab(currentTab);
    });
  });
  const addHighlightBtn = document.getElementById("add-highlight");
  if (addHighlightBtn) {
    addHighlightBtn.addEventListener("click", () => {
      draft.about.highlights.push("New highlight");
      renderTab(currentTab);
    });
  }
}
