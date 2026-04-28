# Floi Design — Self-Host ToDo

Plan: self-host the Webflow static export (Noura template) on user's home server, fronted by Cloudflare Tunnel. No React rebuild — the export is already a static site.

## Architecture

- **Source folder:** `/home/coding/Documents/nameless-projects/Francesca/` (original Webflow export, do not modify — it's the backup)
- **Deploy folder:** `/home/coding/Documents/nameless-projects/Francesca/floidesign/` (cleaned copy that gets shipped to the home server)
- **Web server:** Caddy on the home server, listening on `localhost:8080`
- **Public exposure:** Cloudflare Tunnel (`cloudflared`) — no port forwarding, automatic HTTPS via Cloudflare
- **DNS:** already on Cloudflare (user-provided)

## Open questions (need answers from user before proceeding)

- [ ] **Domain name** — what should the site live at? (e.g. `floi.it`, `www.floi.it`, both?)
- [ ] **Home server OS / distro** — so install + systemd commands are correct
- [ ] **Stub pages — OK to delete?** These are 41–43 line redirect/empty stubs:
  - `bisu-2.html`, `konfetti-2.html`, `tatdocs-2.html`, `b2b-kon-dashboard.html`
  - `detail_category.html`, `detail_filter-categories.html`, `detail_nomi.html`
  - `detail_product.html`, `detail_sku.html`, `detail_work-items.html`
- [ ] **Google Analytics** — strip the template author's tag (`G-CB88B9PP0Y`)? Replace with user's own GA/Plausible tag, or leave none?
- [ ] **Contact form** — Formspree (free, 50/mo) or convert to a `mailto:francesca@floi.it` link?
- [ ] **Webflow badge / "Made in Webflow"** — remove?
- [ ] **Any content edits** before deploy, or ship as-is and edit later?

## Build steps (in order)

### Phase 1 — Stage the site in `floidesign/`
- [ ] Copy all HTML files from `Francesca/` to `floidesign/`
- [ ] Copy `css/`, `js/`, `images/`, `videos/`, `fonts/`, `template/` directories
- [ ] Verify file paths in HTML still resolve (relative paths should just work)

### Phase 2 — Surgical cleanups (no design changes)
- [ ] Strip Google Analytics `<script>` blocks from all HTMLs (search for `G-CB88B9PP0Y`)
- [ ] Fix broken CV link — currently `href="#https://drive.google.com/..."` (the `#` prefix breaks it). Should be `href="https://drive.google.com/..."` with `target="_blank"`
- [ ] Remove Webflow badge if present (search for `webflow-badge` class or "Made in Webflow")
- [ ] Delete confirmed stub pages (see open questions)
- [ ] Replace Webflow form `action` URL with Formspree endpoint OR convert to `mailto:` (decision pending)
- [ ] Update the `<title>` and meta description on each page from "Noura - Webflow HTML website template" to floi-appropriate copy (confirm with user)

### Phase 3 — Server config
- [ ] Write `Caddyfile` in `floidesign/` with:
  - Listen on `:8080`
  - Serve files from current directory
  - Clean URLs: `/about` resolves to `/about.html`
  - Gzip / zstd encoding
  - Long cache headers for `/images`, `/css`, `/js`, `/fonts`, `/videos` (immutable, 1 year)
  - Short cache for HTML (so edits propagate)
  - Custom 404 → `404.html`
- [ ] (Optional) Dockerfile if user wants containerized deploy

### Phase 4 — Home server deploy
- [ ] Install Caddy on home server (command depends on distro)
- [ ] Install `cloudflared`
- [ ] Copy `floidesign/` to server (rsync or git)
- [ ] Set up systemd unit for Caddy → starts on boot
- [ ] `cloudflared tunnel login` → authenticate with Cloudflare
- [ ] `cloudflared tunnel create floi` → creates tunnel
- [ ] Configure tunnel to route `<domain>` → `localhost:8080`
- [ ] `cloudflared tunnel route dns floi <domain>` → creates DNS record automatically
- [ ] Set up systemd unit for cloudflared → starts on boot
- [ ] Verify HTTPS works at the domain

### Phase 5 — Verify
- [ ] Click through every page on the live site, compare to original
- [ ] Test contact form actually delivers
- [ ] Test on mobile (responsive)
- [ ] Run Lighthouse — confirm no broken assets, decent performance score
- [ ] Confirm 404 page works for bad URLs

## Notes / context

- Webflow JS (`js/webflow.js`) drives all scroll/hover animations — keep as-is, do not touch
- 632 images includes Webflow's auto-generated responsive variants (`-p-500.png`, `-p-800.png`, etc.) — all referenced via `srcset`, keep all of them
- External deps the site loads from CDNs (keep these — they work fine self-hosted): WebFont.js (Google Fonts loader), Finsweet Attributes (CMS list filtering), Flowbase before/after slider booster
- `checkout.html` is a non-functional Webflow Ecommerce stub — the shop is actually on Gumroad, so this page is unused. Consider deleting or leaving as a graveyard.
