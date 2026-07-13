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

## Admin dashboard
- Visit `yoursite.com/admin.html`
- Password: `rootsandroof2026` (change this in `js/content.js` — search for `ADMIN_PASSWORD`)
- Edits are saved to the browser's `localStorage`, so they persist on the device/browser used to make them, but do **not** sync across visitors or devices — this is a client-side only setup with no backend/database.
- The "Reset" button restores all content to the original defaults.

### What you can edit
- **Header & Footer** — business name, tagline, every nav link, and the footer disclaimer text.
- **Hero / About** — all copy, plus photos. Each photo field lets you either paste an image URL *or* click "Upload from device" to use your own photo directly (stored as the site's data, no external image host needed).
- **Social** — add/remove/edit links for Instagram, Facebook, LinkedIn, WhatsApp, X, and YouTube. Only platforms with a URL filled in are shown on the live site (in the footer and contact section).
- **Contact → Contact Form Submission** — choose where the contact form goes: Netlify Forms (recommended if hosting on Netlify — see setup note below) or a `mailto:` link that opens the visitor's own email app.

### Contact form email setup (Netlify Forms)
The form is pre-wired for Netlify Forms. Once deployed on Netlify:
1. Go to your site's Netlify dashboard → **Forms**
2. Submissions will appear here automatically after your first real submission post-deploy
3. Go to **Forms → Notifications → Add notification → Email notification**, and enter the address you want submissions sent to (same as "Notification Email" in the admin Contact tab, for consistency)

If you'd rather not use Netlify Forms (e.g. hosting elsewhere), switch the admin dropdown to "mailto" — no setup needed, but it opens the visitor's email client instead of submitting silently.

## Important limitations to know about
- **Admin auth is client-side only.** The password lives in plain JavaScript, so anyone who views the page source can find it. Fine for a personal/low-stakes site; not real security. For a production-grade login, you'd want a backend (e.g. Netlify Identity, or a small serverless function).
- **Content changes don't sync between devices/browsers.** If you edit content on your laptop, visitors on other devices still see the original defaults baked into `js/content.js` — localStorage never leaves the browser it was set in. To make edits genuinely "publish" to everyone, you'd need a real backend or a headless CMS (Netlify CMS/Decap, Sanity, etc.).
- The **contact form** currently just shows a "Message received" confirmation in the browser — it doesn't actually send an email. To make it functional, the easiest path is Netlify Forms: add `data-netlify="true"` to the `<form>` tag in `index.html` and Netlify will capture submissions automatically (no backend needed).

## Editing content directly (alternative to the admin panel)
All site copy lives in one place: `js/content.js`, inside the `DEFAULT_CONTENT` object. You can edit it directly and redeploy if you'd rather not use the admin panel at all.
