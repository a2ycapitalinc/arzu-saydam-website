# Arzu Saydam — Author Website

Static site (plain HTML/CSS/JS). No build step, no framework, no dependencies.

Bilingual: Turkish by default, with an English toggle (`data-lang` attributes + `partials.js`, persisted via `localStorage`).

## Structure
- `index.html` and the other `*.html` pages — one file per section (About, Books, Art, Blog, Events, Media Kit, Contact, Newsletter, Reviews, FAQ)
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
- Purchase links and ISBNs on `books.html` are live. Garden book: Amazon, Lulu, and Kobo, in Turkish and English. *The Quiet Wisdom of Wax* (English only, ISBN 978-1-968741-72-3) links to https://www.amazon.ca/dp/1968741720. There is no Turkish edition yet.
- Homepage hero is still the garden film (`assets/hero-walk.mp4`). A studio video can replace that `src` later; the spot is marked TODO in `index.html`. Do not swap the file until the new video arrives.
- My Art (`art.html`) is a gallery scaffold. Drop photographs into `assets/art/` and follow the HTML comment in `art.html`. No painting photos are on the site yet.
- Exhibitions & Events is not in the nav. The older `events.html` page is still linked from the footer.
- Instagram and Facebook already point to Arzu's profiles in the footer and on Contact. LinkedIn and Goodreads are not linked on the site.
- Contact and newsletter forms are still front-end only (no email delivery). They show a thank-you state in the browser and are not wired to a form service. The Formspree id is still pending.
