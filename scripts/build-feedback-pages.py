#!/usr/bin/env python3
"""Generate localized feedback.html pages for the Centifi marketing site."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CHEVRON_SVG = """<svg class="lang-dropdown-chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M3 4.5 6 7.5 9 4.5"/></svg>"""

CATEGORY_OPTIONS = """
              <li role="presentation">
                <button type="button" role="option" class="lang-dropdown-option is-active" data-value="general" aria-selected="true">
                  <span class="lang-flag" aria-hidden="true">💬</span>
                  <span class="dropdown-option-label">General</span>
                </button>
              </li>
              <li role="presentation">
                <button type="button" role="option" class="lang-dropdown-option" data-value="bug" aria-selected="false">
                  <span class="lang-flag" aria-hidden="true">🐛</span>
                  <span class="dropdown-option-label">Bug report</span>
                </button>
              </li>
              <li role="presentation">
                <button type="button" role="option" class="lang-dropdown-option" data-value="feature" aria-selected="false">
                  <span class="lang-flag" aria-hidden="true">✨</span>
                  <span class="dropdown-option-label">Feature request</span>
                </button>
              </li>
              <li role="presentation">
                <button type="button" role="option" class="lang-dropdown-option" data-value="billing" aria-selected="false">
                  <span class="lang-flag" aria-hidden="true">💳</span>
                  <span class="dropdown-option-label">Billing / subscription</span>
                </button>
              </li>
              <li role="presentation">
                <button type="button" role="option" class="lang-dropdown-option" data-value="other" aria-selected="false">
                  <span class="lang-flag" aria-hidden="true">📎</span>
                  <span class="dropdown-option-label">Other</span>
                </button>
              </li>"""

LOCALES = {
    "en": {
        "html_lang": "en",
        "title": "Feedback — Centifi",
        "description": "Send feedback, report a bug, or request a feature for Centifi.",
        "canonical_path": "feedback.html",
        "nav_features": "Features",
        "nav_download": "Download",
        "h1": "Send feedback",
        "lead": "Tell us what you think — bugs, ideas, or questions about Centifi. We read every message.",
        "home_href": "/index.html",
        "features_href": "/index.html#features",
        "download_href": "/index.html#download",
    },
    "tr": {
        "html_lang": "tr",
        "title": "Geri bildirim — Centifi",
        "description": "Centifi için geri bildirim, hata bildirimi veya özellik isteği gönderin.",
        "canonical_path": "tr/feedback.html",
        "nav_features": "Özellikler",
        "nav_download": "İndir",
        "h1": "Geri bildirim gönder",
        "lead": "Fikirlerinizi, hataları veya sorularınızı paylaşın — her mesajı okuyoruz.",
        "home_href": "/tr/",
        "features_href": "/tr/#features",
        "download_href": "/tr/#download",
    },
    "de": {
        "html_lang": "de",
        "title": "Feedback — Centifi",
        "description": "Feedback, Fehlermeldung oder Feature-Wunsch für Centifi senden.",
        "canonical_path": "de/feedback.html",
        "nav_features": "Funktionen",
        "nav_download": "Download",
        "h1": "Feedback senden",
        "lead": "Teilen Sie Ideen, Fehler oder Fragen zu Centifi — wir lesen jede Nachricht.",
        "home_href": "/de/",
        "features_href": "/de/#features",
        "download_href": "/de/#download",
    },
    "fr": {
        "html_lang": "fr",
        "title": "Commentaires — Centifi",
        "description": "Envoyez vos commentaires, signalez un bug ou proposez une fonctionnalité pour Centifi.",
        "canonical_path": "fr/feedback.html",
        "nav_features": "Fonctionnalités",
        "nav_download": "Télécharger",
        "h1": "Envoyer un commentaire",
        "lead": "Partagez vos idées, bugs ou questions sur Centifi — nous lisons chaque message.",
        "home_href": "/fr/",
        "features_href": "/fr/#features",
        "download_href": "/fr/#download",
    },
    "es": {
        "html_lang": "es",
        "title": "Comentarios — Centifi",
        "description": "Envía comentarios, reporta un error o solicita una función para Centifi.",
        "canonical_path": "es/feedback.html",
        "nav_features": "Funciones",
        "nav_download": "Descargar",
        "h1": "Enviar comentarios",
        "lead": "Comparte ideas, errores o preguntas sobre Centifi — leemos cada mensaje.",
        "home_href": "/es/",
        "features_href": "/es/#features",
        "download_href": "/es/#download",
    },
}

LANG_OPTIONS = """
                    <button class="lang-dropdown-option is-active" type="button" data-lang="en" role="option">🇬🇧 English</button>
                    <button class="lang-dropdown-option" type="button" data-lang="tr" role="option">🇹🇷 Türkçe</button>
                    <button class="lang-dropdown-option" type="button" data-lang="de" role="option">🇩🇪 Deutsch</button>
                    <button class="lang-dropdown-option" type="button" data-lang="fr" role="option">🇫🇷 Français</button>
                    <button class="lang-dropdown-option" type="button" data-lang="es" role="option">🇪🇸 Español</button>
"""


def render(lang: str, cfg: dict) -> str:
    depth = 0 if lang == "en" else 1
    active = {code: ' class="lang-dropdown-option is-active"' if code == lang else ' class="lang-dropdown-option"' for code in LOCALES}
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
  <body data-lang="{lang}" data-page="feedback" data-depth="{depth}">
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

      <form id="centifi-feedback-form" class="feedback-form" novalidate>
        <div class="feedback-field">
          <label for="feedback-name" id="feedback-name-label">Name</label>
          <input id="feedback-name" name="name" type="text" autocomplete="name" maxlength="120" />
        </div>
        <div class="feedback-field">
          <label for="feedback-email" id="feedback-email-label">Email <span class="feedback-required">*</span></label>
          <input id="feedback-email" name="email" type="email" autocomplete="email" required maxlength="254" />
        </div>
        <div class="feedback-field">
          <label for="feedback-category-trigger" id="feedback-category-label">Topic</label>
          <div class="form-dropdown lang-dropdown" id="feedback-category-dropdown">
            <button
              type="button"
              class="lang-dropdown-trigger"
              id="feedback-category-trigger"
              aria-expanded="false"
              aria-haspopup="listbox"
              aria-controls="feedback-category-list"
              aria-labelledby="feedback-category-label"
            >
              <span class="lang-dropdown-value" id="feedback-category-value">
                <span class="lang-flag" aria-hidden="true">💬</span>
                <span>General</span>
              </span>
              {CHEVRON_SVG}
            </button>
            <ul class="lang-dropdown-list" id="feedback-category-list" role="listbox" hidden>
{CATEGORY_OPTIONS}
            </ul>
            <input type="hidden" id="feedback-category" name="category" value="general" />
          </div>
        </div>
        <div class="feedback-field">
          <label for="feedback-message" id="feedback-message-label">Message <span class="feedback-required">*</span></label>
          <textarea id="feedback-message" name="message" rows="6" required minlength="10" maxlength="5000"></textarea>
          <p class="feedback-hint" id="feedback-message-hint">At least 10 characters.</p>
        </div>
        <div class="feedback-hp" aria-hidden="true">
          <label for="feedback-website">Website</label>
          <input id="feedback-website" name="website" type="text" tabindex="-1" autocomplete="off" />
        </div>
        <p class="feedback-status" id="feedback-status" role="status" aria-live="polite" hidden></p>
        <div class="feedback-actions">
          <button type="submit" class="cookie-btn cookie-btn--primary" id="feedback-submit">Send feedback</button>
        </div>
      </form>

      <p class="feedback-alt">
        <span id="feedback-alt-text">Prefer email?</span>
        <a href="mailto:info@centifi.app" id="feedback-alt-link">info@centifi.app</a>
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
