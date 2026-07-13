# Roots and Roof — Static Site

**Design note:** the palette is now **navy & champagne-gold** — a professional, trustworthy real-estate-advisory look (think private banking, not tech startup), replacing an earlier warm terracotta direction that read too red for the brand. Colors live as CSS variables at the top of `css/styles.css` if you want to adjust further.

**Photos:** the About section now uses a local photo at `images/owner-photo.png` rather than a remote URL — more reliable (nothing to break if an external host goes down) and it's already included in this folder. Swap it any time by replacing that file, pasting a new URL in the admin panel, or using the admin panel's "Upload from device" button.

Plain HTML/CSS/JS — no build step, no dependencies. Ready to drag-and-drop onto Netlify.

## Folder structure

```
rootsandroof-site/
├── index.html          Public website
├── admin.html           Password-protected content editor
├── netlify.toml          Netlify config (optional)
├── css/
│   └── styles.css        All styling
├── js/
│   ├── content.js         Shared content data + localStorage helpers
│   ├── main.js             Public site rendering + interactions
│   └── admin.js             Admin dashboard logic
└── images/                (optional — for your own local images)
```

## Deploy to Netlify

**Option A — drag and drop (fastest)**
1. Go to https://app.netlify.com/drop
2. Drag the whole `rootsandroof-site` folder onto the page
3. Netlify gives you a live URL immediately

**Option B — connect a Git repo**
1. Push this folder to a GitHub repo
2. In Netlify: "Add new site" → "Import an existing project" → pick the repo
3. Build command: leave blank. Publish directory: `.` (repo root)
4. Deploy

**Option C — Netlify CLI**
```bash
npm install -g netlify-cli
cd rootsandroof-site
netlify deploy --prod
```

## Custom domain
Once deployed, go to Site settings → Domain management → Add a custom domain, and point your domain's DNS to Netlify as instructed there.

## One shared header & footer across every page
The header (nav) and footer markup exists in exactly one place: `js/shared.js`. Every page — homepage, Blog, News, and every individual blog post — just has two empty placeholders (`<div id="site-header-root">` and `<div id="site-footer-root">`) that get filled in identically on load. This means editing the nav or footer never requires touching more than one file, and every page is guaranteed to look the same instead of quietly drifting apart over time.

## Blog & News pages
- `blog.html` — five original posts written for Roots and Roof, each tied to a real market development. Preview cards up top, full posts below (click "Read the full post" to jump down).
- `news.html` — five real, sourced news items about the Berlin/German property market, each linking back to its original source.
- Both are fully editable in Admin → **News** and **Blog** tabs: add, remove, or rewrite any item, and the page updates instantly. Items are sorted newest-first automatically based on the date field, so you don't need to reorder anything manually — just update the date.
- Both pages share the same header/nav/footer as the homepage (edited in Admin → Header & Footer), so your brand name, nav links, and social icons stay consistent everywhere.


## SEO — Google + AI answer engines (ChatGPT, Claude, Gemini, Perplexity)
- **Meta tags, Open Graph, and structured data (JSON-LD)** are on every page — titles, descriptions, and a `RealEstateAgent` schema on the homepage, `Article` schema on every blog post. This is what lets Google show rich results and lets AI tools understand and accurately cite who you are.
- **`robots.txt`** explicitly allows the major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) alongside regular search engines, blocking only `/admin.html`.
- **`sitemap.xml`** lists every page. Submit it in Google Search Console once you're live (Search Console → Sitemaps → enter `sitemap.xml`).
- **⚠️ Important — update the domain:** all canonical/OG URLs are currently placeholder `https://rootsandroof.de/`. Once you know your real live domain, do a find-and-replace for `rootsandroof.de` across `index.html`, `blog.html`, `news.html`, `sitemap.xml`, and `robots.txt` (and each file in `blog/`) — otherwise search engines will be pointed at the wrong address.
- **Individual blog posts are static HTML** (`blog/{slug}.html`), not JavaScript-rendered — this matters because several AI crawlers don't execute JavaScript, so a JS-only page would look blank to them. The blog listing page still updates live from the admin panel, but for a *new* post to get its own crawlable static page with full SEO tags, ask me (Claude) to generate one — it's a five-minute job, just not something the admin panel can do on its own without a backend. Until then, new posts still get a working link automatically (via `blog-post.html?slug=...`), just without the same SEO strength.

## Admin dashboard
- Visit `yoursite.com/admin.html`
- **Two layers of protection now:**
  1. **Server-side login (real security)** — Netlify itself will prompt for a username/password *before* sending `admin.html` to the browser at all. Default: `desh` / `rootsandroof2026`. Change these anytime by editing the `_headers` file in this folder (it's a plain text file — open it, edit the line, redeploy). This only works once the site is deployed on Netlify; it does nothing when opening `admin.html` as a local file.
  2. **In-app password (convenience only)** — after passing the Netlify login above, the admin panel itself still asks for `rootsandroof2026` before showing the dashboard. This one lives in plain JavaScript (`js/content.js`, search `ADMIN_PASSWORD`) and is downloadable by anyone who gets past layer 1 — so it's not real security on its own, just a second small speed bump. Change it there if you like, but the Netlify login above is what actually keeps strangers out.
- Edits are saved to the browser's `localStorage`, so they persist on the device/browser used to make them, but do **not** sync across visitors or devices — this is a client-side only setup with no backend/database.
- The "Reset" button restores all content to the original defaults.

### What you can edit
- **Header & Footer** — business name, tagline, every nav link, and the footer disclaimer text.
- **Hero / About** — all copy, plus photos. Each photo field lets you either paste an image URL *or* click "Upload from device" to use your own photo directly (stored as the site's data, no external image host needed).
- **Social** — add/remove/edit links for Instagram, Facebook, LinkedIn, WhatsApp, X, and YouTube. Only platforms with a URL filled in are shown on the live site (in the footer and contact section).
- **Contact → Contact Form Submission** — choose where the contact form goes: Netlify Forms (recommended if hosting on Netlify — see setup note below) or a `mailto:` link that opens the visitor's own email app.

### Contact form email setup (Netlify Forms) — do this once, it's required
This is the mode the site ships with: submissions happen silently in the background (no email-app pop-up for the visitor), and the message needs to be forwarded to your inbox. That forwarding step lives entirely in Netlify's dashboard — no code can set it up for you. Steps:
1. Deploy this site on Netlify at least once (drag-and-drop or Git-connected — either works)
2. In your Netlify dashboard, open this site → **Forms** in the left sidebar
3. Click **Notifications → Add notification → Email notification**
4. Enter `info@rootsandroof.de`, save
5. Submit the live contact form yourself once to test — the message should land in your Zoho inbox within a minute or two

Until step 3 is done, submissions are still being captured (visible in that same Forms tab), they just aren't being emailed to you yet.

If you'd rather skip Netlify's dashboard entirely, switch the admin dropdown (Contact → "Where should submissions go?") to **mailto** instead — no setup, but it opens the visitor's own email app rather than submitting silently.

## Important limitations to know about
- **Admin auth is client-side only.** The password lives in plain JavaScript, so anyone who views the page source can find it. Fine for a personal/low-stakes site; not real security. For a production-grade login, you'd want a backend (e.g. Netlify Identity, or a small serverless function).
- **Content changes don't sync between devices/browsers.** If you edit content on your laptop, visitors on other devices still see the original defaults baked into `js/content.js` — localStorage never leaves the browser it was set in. To make edits genuinely "publish" to everyone, you'd need a real backend or a headless CMS (Netlify CMS/Decap, Sanity, etc.).
- The **contact form** currently just shows a "Message received" confirmation in the browser — it doesn't actually send an email. To make it functional, the easiest path is Netlify Forms: add `data-netlify="true"` to the `<form>` tag in `index.html` and Netlify will capture submissions automatically (no backend needed).

## Editing content directly (alternative to the admin panel)
All site copy lives in one place: `js/content.js`, inside the `DEFAULT_CONTENT` object. You can edit it directly and redeploy if you'd rather not use the admin panel at all.
