# Arzu Saydam — Author Website

Static site (plain HTML/CSS/JS). No build step required.

## Files
- `index.html` and the other `*.html` pages
- `styles.css`, `partials.js` (shared nav/footer)
- `assets/` — images and the homepage hero video (`hero-walk.mp4`)

## Run locally
Open `index.html` in a browser, or serve the folder:
`python3 -m http.server` then visit http://localhost:8000

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. In Vercel: New Project → import the repo.
3. Framework preset: **Other** (no build). Output dir: root. Deploy.

The homepage hero plays `assets/hero-walk.mp4` (autoplay, muted, looping) with `hero_poster.jpg` as the still fallback.
