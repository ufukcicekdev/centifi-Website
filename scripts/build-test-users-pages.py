#!/usr/bin/env python3
"""Generate localized test-users.html pages for the Centifi marketing site."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

LOCALES = {
    "en": {
        "html_lang": "en",
        "title": "Become a test user — Centifi",
        "description": "Apply to test Centifi on iOS or Android before public release.",
        "canonical_path": "test-users.html",
        "nav_features": "Features",
        "nav_download": "Download",
        "h1": "Become a test user",
        "lead": "Want early access to Centifi? Leave your email and platform — we’ll contact you when a spot opens.",
        "home_href": "/index.html",
        "features_href": "/index.html#features",
        "download_href": "/index.html#download",
    },
    "tr": {
        "html_lang": "tr",
        "title": "Test kullanıcısı ol — Centifi",
        "description": "Centifi’yi iOS veya Android’de erken denemek için başvurun.",
        "canonical_path": "tr/test-users.html",
        "nav_features": "Özellikler",
        "nav_download": "İndir",
        "h1": "Test kullanıcısı ol",
        "lead": "Centifi’ye erken erişim mi istiyorsunuz? E-postanızı ve platformunuzu bırakın — yer açıldığında sizinle iletişime geçeriz.",
        "home_href": "/tr/",
        "features_href": "/tr/#features",
        "download_href": "/tr/#download",
    },
    "de": {
        "html_lang": "de",
        "title": "Testnutzer werden — Centifi",
        "description": "Bewerben Sie sich, Centifi auf iOS oder Android vor dem Release zu testen.",
        "canonical_path": "de/test-users.html",
        "nav_features": "Funktionen",
        "nav_download": "Download",
        "h1": "Testnutzer werden",
        "lead": "Frühen Zugang zu Centifi? Hinterlassen Sie E-Mail und Plattform — wir melden uns, sobald ein Platz frei ist.",
        "home_href": "/de/",
        "features_href": "/de/#features",
        "download_href": "/de/#download",
    },
    "fr": {
        "html_lang": "fr",
        "title": "Devenir testeur — Centifi",
        "description": "Candidatez pour tester Centifi sur iOS ou Android avant la sortie publique.",
        "canonical_path": "fr/test-users.html",
        "nav_features": "Fonctionnalités",
        "nav_download": "Télécharger",
        "h1": "Devenir testeur",
        "lead": "Accès anticipé à Centifi ? Laissez votre e-mail et votre plateforme — nous vous contacterons dès qu’une place se libère.",
        "home_href": "/fr/",
        "features_href": "/fr/#features",
        "download_href": "/fr/#download",
    },
    "es": {
        "html_lang": "es",
        "title": "Ser usuario de prueba — Centifi",
        "description": "Solicita probar Centifi en iOS o Android antes del lanzamiento público.",
        "canonical_path": "es/test-users.html",
        "nav_features": "Funciones",
        "nav_download": "Descargar",
        "h1": "Usuario de prueba",
        "lead": "¿Quieres acceso anticipado a Centifi? Deja tu correo y plataforma — te contactaremos cuando haya plaza.",
        "home_href": "/es/",
        "features_href": "/es/#features",
        "download_href": "/es/#download",
    },
}


def render(lang: str, cfg: dict) -> str:
    depth = 0 if lang == "en" else 1
    active = {
        code: ' class="lang-dropdown-option is-active"' if code == lang else ' class="lang-dropdown-option"'
        for code in LOCALES
    }
    options = "\n".join(
        f'                    <button{active[code]} type="button" data-lang="{code}" role="option">'
        f'{"🇬🇧 English" if code == "en" else "🇹🇷 Türkçe" if code == "tr" else "🇩🇪 Deutsch" if code == "de" else "🇫🇷 Français" if code == "fr" else "🇪🇸 Español"}</button>'
        for code in LOCALES
    )
    flag_label = {"en": ("🇬🇧", "EN"), "tr": ("🇹🇷", "TR"), "de": ("🇩🇪", "DE"), "fr": ("🇫🇷", "FR"), "es": ("🇪🇸", "ES")}[lang]

    return f"""<!DOCTYPE html>
<html lang="{cfg["html_lang"]}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{cfg["title"]}</title>
    <meta name="description" content="{cfg["description"]}" />
    <meta name="robots" content="index,follow" />
    <link rel="canonical" href="https://centifi.app/{cfg["canonical_path"]}" />
    <meta name="centifi-api-base" content="https://centifi-backend-production.up.railway.app" />
    <meta name="theme-color" content="#6c63ff" />
    <link rel="icon" type="image/png" sizes="48x48" href="https://centifi.app/assets/favicon-48.png" />
    <link rel="icon" type="image/png" sizes="96x96" href="https://centifi.app/assets/favicon-96.png" />
    <link rel="icon" href="https://centifi.app/assets/centifi-logo.svg" type="image/svg+xml" />
    <script>
      (function () {{
        try {{
          var k = "centifi-site-theme";
          var t = localStorage.getItem(k);
          var d = window.matchMedia("(prefers-color-scheme: dark)").matches;
          var th = t === "light" || t === "dark" ? t : d ? "dark" : "light";
          document.documentElement.setAttribute("data-theme", th);
        }} catch (e) {{}}
      }})();
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body data-lang="{lang}" data-page="test-users" data-depth="{depth}">
    <header class="nav">
      <div class="nav-overlay" id="nav-overlay" hidden></div>
      <div class="wrap nav-strip">
        <div class="nav-inner">
          <a class="logo" href="{cfg["home_href"]}">
            <img src="/assets/centifi-logo.svg" alt="" width="36" height="36" decoding="async" class="logo-img" />
            <span class="logo-text">Centifi</span>
          </a>
          <button type="button" class="nav-menu-toggle" id="nav-menu-toggle" aria-expanded="false" aria-controls="nav-drawer">
            <span class="visually-hidden">Menu</span>
            <span class="nav-menu-toggle-bars" aria-hidden="true">
              <span class="nav-menu-toggle-line"></span>
              <span class="nav-menu-toggle-line"></span>
              <span class="nav-menu-toggle-line"></span>
            </span>
          </button>
          <nav class="nav-drawer" id="nav-drawer" aria-label="Primary">
            <div class="nav-drawer-shell">
              <ul class="nav-links">
                <li><a href="{cfg["features_href"]}">{cfg["nav_features"]}</a></li>
                <li><a class="btn-nav" href="{cfg["download_href"]}">{cfg["nav_download"]}</a></li>
              </ul>
              <div class="nav-controls">
                <span id="centifi-lang-label" class="visually-hidden">Language</span>
                <div class="lang-dropdown" id="centifi-lang-dropdown">
                  <button type="button" class="lang-dropdown-trigger" id="centifi-lang-trigger" aria-expanded="false" aria-haspopup="listbox" aria-controls="centifi-lang-list" aria-labelledby="centifi-lang-label">
                    <span class="lang-flag" aria-hidden="true">{flag_label[0]}</span>
                    <span class="lang-label">{flag_label[1]}</span>
                    <span class="lang-caret" aria-hidden="true">▾</span>
                  </button>
                  <div class="lang-dropdown-list" id="centifi-lang-list" role="listbox" tabindex="-1" hidden>
{options}
                  </div>
                </div>
                <button type="button" class="theme-toggle" id="centifi-theme" aria-pressed="true" aria-label="Switch to light mode">☀️</button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>

    <main class="wrap feedback-page">
      <h1>{cfg["h1"]}</h1>
      <p class="feedback-lead">{cfg["lead"]}</p>

      <form id="centifi-test-users-form" class="feedback-form" novalidate>
        <div class="feedback-field">
          <label for="test-users-platform" id="test-users-platform-label">Platform <span class="feedback-required">*</span></label>
          <select id="test-users-platform" name="platform" required>
            <option value="">Select…</option>
            <option value="ios">iOS</option>
            <option value="android">Android</option>
          </select>
        </div>
        <div class="feedback-field">
          <label for="test-users-email" id="test-users-email-label">Email <span class="feedback-required">*</span></label>
          <input id="test-users-email" name="email" type="email" autocomplete="email" required maxlength="254" />
        </div>
        <div class="feedback-hp" aria-hidden="true">
          <label for="test-users-website">Website</label>
          <input id="test-users-website" name="website" type="text" tabindex="-1" autocomplete="off" />
        </div>
        <p class="feedback-status" id="test-users-status" role="status" aria-live="polite" hidden></p>
        <div class="feedback-actions">
          <button type="submit" class="cookie-btn cookie-btn--primary" id="test-users-submit">Apply</button>
        </div>
      </form>

      <p class="feedback-alt">
        <span id="test-users-alt-text">Questions?</span>
        <a href="feedback.html" id="test-users-alt-link">Send feedback</a>
      </p>
    </main>

    <footer>
      <div class="wrap">
        <p class="copyright">© <span class="copyright-year"></span> Centifi. All rights reserved.</p>
      </div>
    </footer>
    <script src="/assets/site.js" defer></script>
  </body>
</html>
"""


def main() -> None:
    for lang, cfg in LOCALES.items():
        out = ROOT / cfg["canonical_path"]
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(render(lang, cfg), encoding="utf-8")
        print("wrote", out.relative_to(ROOT))


if __name__ == "__main__":
    main()
