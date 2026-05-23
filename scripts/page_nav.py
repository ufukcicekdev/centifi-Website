"""Shared site header nav for generated pages (matches index.html)."""

from __future__ import annotations

CHEVRON_SVG = (
    '<svg class="lang-dropdown-chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">'
    '<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" '
    'stroke-linejoin="round" d="M3 4.5 6 7.5 9 4.5"/></svg>'
)

LANG_LABELS = {
    "en": ("🇬🇧", "English"),
    "tr": ("🇹🇷", "Türkçe"),
    "de": ("🇩🇪", "Deutsch"),
    "fr": ("🇫🇷", "Français"),
    "es": ("🇪🇸", "Español"),
}


def render_nav(*, lang: str, home_href: str, features_href: str, download_href: str, nav_features: str, nav_download: str) -> str:
    flag, label = LANG_LABELS[lang]
    options = []
    for code, (f, name) in LANG_LABELS.items():
        active = " is-active" if code == lang else ""
        selected = "true" if code == lang else "false"
        options.append(
            f"""                <li role="presentation">
                  <button type="button" role="option" class="lang-dropdown-option{active}" data-lang="{code}" aria-selected="{selected}">
                    <span class="lang-flag" aria-hidden="true">{f}</span> {name}
                  </button>
                </li>"""
        )
    options_html = "\n".join(options)

    return f"""    <header class="nav">
      <div class="nav-overlay" id="nav-overlay" hidden></div>
      <div class="wrap nav-strip">
        <div class="nav-inner">
          <a class="logo" href="{home_href}">
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
                <li><a href="{features_href}">{nav_features}</a></li>
                <li><a class="btn-nav" href="{download_href}">{nav_download}</a></li>
              </ul>
              <div class="nav-controls">
                <span id="centifi-lang-label" class="visually-hidden">Language</span>
                <div class="lang-dropdown" id="centifi-lang-dropdown">
                  <button
                    type="button"
                    class="lang-dropdown-trigger"
                    id="centifi-lang-trigger"
                    aria-expanded="false"
                    aria-haspopup="listbox"
                    aria-controls="centifi-lang-list"
                    aria-labelledby="centifi-lang-label"
                  >
                    <span class="lang-dropdown-value"><span class="lang-flag" aria-hidden="true">{flag}</span> {label}</span>
                    {CHEVRON_SVG}
                  </button>
                  <ul class="lang-dropdown-list" id="centifi-lang-list" role="listbox" hidden>
{options_html}
                  </ul>
                </div>
                <button type="button" class="theme-toggle" id="centifi-theme" aria-pressed="true" aria-label="Switch to light mode">☀️</button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>"""
