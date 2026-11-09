# Arzu Saydam — Author Website

Static site (plain HTML/CSS/JS). No build step, no framework, no dependencies.

Bilingual: Turkish by default, with an English toggle (`data-lang` attributes + `partials.js`, persisted via `localStorage`).

## Structure
- `index.html` and the other `*.html` pages — one file per section (About, Books, Art, Blog, Events, Media Kit, Contact, Newsletter, Reviews, FAQ)
- `styles.css` — single shared stylesheet (design tokens as CSS custom properties)
- `partials.js` — injects the shared nav/footer and handles the language toggle + mobile menu
- `assets/` — images, the homepage hero (`hero-wax.mp4`, `hero-wax-poster.jpg`), and the garden walk kept for My Books (`hero-walk.mp4`, `hero_poster.jpg`)
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
- Homepage hero is `assets/hero-wax.mp4` (autoplay, muted). The garden walk stays at `assets/hero-walk.mp4` and plays from My Books on click. Do not delete `hero-walk.mp4`.
- My Art (`art.html`) is a gallery scaffold. Drop photographs into `assets/art/` and follow the HTML comment in `art.html`. No painting photos are on the site yet.
- Exhibitions & Events is not in the nav. The older `events.html` page is still linked from the footer.
- Instagram and Facebook already point to Arzu's profiles in the footer and on Contact. LinkedIn and Goodreads are not linked on the site.
- Contact and newsletter delivery is prepared in `forms.mjs` and `forms-config.js`, but both endpoints are blank, so the thank-you stays hidden. See `FORMS.md`. Newsletter gifts (short story, sample-chapter file, printable journal page, travel essay) are not in the repo, so those signups stay closed until an autoresponse can actually send one.
