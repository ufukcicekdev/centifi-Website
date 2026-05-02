# Centifi marketing site

Static HTML/CSS/JS — **not** the Expo app. Deploy this folder to any static host.

## Local preview

From this directory:

```bash
npx serve .
# or: python3 -m http.server 8080
```

Open `http://localhost:3000` (serve) or `http://localhost:8080`.

Locales live at `/` (English), `/tr/`, `/de/`, `/fr/`, `/es/`. Privacy: `privacy.html` and `/<lang>/privacy.html`.

## Deploy

- **Vercel / Netlify**: root directory = `website`, publish the folder root (`index.html` at site root).
- **GitHub Pages**: put contents in `docs/` or a `gh-pages` branch, or use the whole `website/` folder as the site root.
- Ensure **pretty URLs** for locale folders: `/tr/` should serve `tr/index.html` (most static hosts do this by default).

## SEO and domain

Before launch, replace the placeholder origin **`https://centifi.app`** everywhere it appears:

- `index.html`, `privacy.html`, and each `*/index.html` / `*/privacy.html` (`canonical`, `og:url`, `hreflang`, JSON-LD).
- `sitemap.xml` and `robots.txt` (`Sitemap:` line).

Add a real **Open Graph / Twitter image** (`og:image`) when you have an asset.

## Logo

- Brand mark: `assets/centifi-logo.svg` — geometry matches `frontend/components/CentifiLogo.tsx` (purple tile + white C arc).
- Swap this file if you export a new master asset; keep the same path or update every `<img>` / `favicon` / JSON-LD `logo` URL.

## Customize

- **Store badges** (`assets/badges/`): official **App Store** SVGs per locale (`app-store-black-*.svg` on light theme, `app-store-white-*.svg` on dark theme) from Apple’s badge API; **Google Play** PNGs (`google-play-*.png`) from Google’s badge CDN — keep them current with [Apple App Store marketing](https://developer.apple.com/app-store/marketing/guidelines-and-resources/) and [Google Play badge guidelines](http://play.google.com/intl/en_us/badges/). Replace `#` hrefs on `.store-badge-link` with real App Store and Play URLs in every localized `index.html`.
- Replace the contact placeholder in each `privacy.html` with your real support channel.
- Fonts load from Google Fonts (DM Sans); remove or swap in each HTML file if you need offline-only.

## Theme and language

- **Dark/light**: `assets/site.js` + `localStorage` key `centifi-site-theme`; inline script in `<head>` avoids flash of wrong theme.
- **Language**: custom dropdown in the nav (flags + labels); each page sets `data-lang`, `data-page`, and `data-depth` on `<body>` for correct relative links (`assets/site.js`).
