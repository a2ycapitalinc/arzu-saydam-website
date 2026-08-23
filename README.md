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
Live at: https://www.arzusaydamauthor.com

Canonical, Open Graph, Twitter image, `sitemap.xml`, and `robots.txt` URLs use that `www` host so search and share previews stay on one domain.

## Known follow-ups
- Purchase links and ISBNs on `books.html` are live (Amazon, Lulu, Kobo).
- Instagram and Facebook already point to Arzu's profiles in the footer and on Contact. LinkedIn and Goodreads are not linked on the site.
- Contact and newsletter forms are still front-end only (no email delivery). They show a thank-you state in the browser and are not wired to a form service.
