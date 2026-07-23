# Arzu Saydam — Author Website

Static site (plain HTML/CSS/JS). No build step, no framework, no dependencies.

Bilingual: Turkish by default, with an English toggle (`data-lang` attributes + `partials.js`, persisted via `localStorage`).

## Structure
- `index.html` and the other `*.html` pages — one file per section (About, Books, Journal, Reflections, Events, Media Kit, Contact, Newsletter, Reviews, FAQ)
- `styles.css` — single shared stylesheet (design tokens as CSS custom properties)
- `partials.js` — injects the shared nav/footer and handles the language toggle + mobile menu
- `assets/` — the real, in-use images and the homepage hero video (`hero-walk.mp4`, `hero_poster.jpg` fallback)
- `404.html` — custom not-found page, auto-served by Vercel
- `sitemap.xml`, `robots.txt` — search engine discovery
- `vercel.json` — cache headers for `/assets`, security headers, clean URLs

## Run locally
Open `index.html` in a browser, or serve the folder:
`python3 -m http.server` then visit http://localhost:8000

## Deploy
Connected to Vercel via GitHub — every push to `main` deploys automatically.
Live at: https://arzu-saydam-author.vercel.app

## Known follow-ups
- `books.html` has placeholder ISBNs and purchase links (`href="#"`) — swap in the real ones when available.
- Social links (Instagram/Facebook/LinkedIn/Goodreads) point to platform homepages — update to Arzu's actual profile URLs once created.
- Contact and newsletter forms are front-end only (no email delivery yet) — wire to a form service (e.g. Formspree) when ready.
- Once `arzusaydamauthor.com` is pointed at this project in Vercel, update the canonical URLs, `sitemap.xml`, and OG image URLs from the `.vercel.app` domain to the custom domain.
