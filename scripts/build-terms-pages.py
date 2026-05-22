#!/usr/bin/env python3
"""Build terms.html pages from privacy.html shell + assets/legal/terms-*.html fragments."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CONFIG = [
    {
        "privacy": "privacy.html",
        "terms": "terms.html",
        "fragment": "terms-en.html",
        "replacements": [
            ("Privacy policy", "Terms of use"),
            ("privacy policy", "terms of use"),
            ("Privacy Policy", "Terms of Use"),
            ("data-page=\"privacy\"", "data-page=\"terms\""),
            (
                "How Centifi handles your data on the marketing site and in the app. Privacy-first expense tracking.",
                "Terms of use for the Centifi mobile app and centifi.app website.",
            ),
            (
                "How Centifi handles your data. Privacy-first expense tracking.",
                "Terms of use for Centifi — subscriptions, accounts, and acceptable use.",
            ),
        ],
    },
    {
        "privacy": "tr/privacy.html",
        "terms": "tr/terms.html",
        "fragment": "terms-tr.html",
        "replacements": [
            ("Gizlilik politikası", "Kullanım şartları"),
            ("gizlilik politikası", "kullanım şartları"),
            ("data-page=\"privacy\"", "data-page=\"terms\""),
            (
                "Centifi tanıtım sitesi ve uygulama için veri işleme özeti. Gizlilik odaklı harcama takibi.",
                "Centifi mobil uygulaması ve centifi.app için kullanım şartları.",
            ),
            (
                "Verilerinizin nasıl işlendiği. Gizlilik odaklı harcama takibi.",
                "Centifi kullanım şartları — abonelik, hesap ve kabul edilebilir kullanım.",
            ),
        ],
    },
    {
        "privacy": "de/privacy.html",
        "terms": "de/terms.html",
        "fragment": "terms-de.html",
        "replacements": [
            ("Datenschutzerklärung", "Nutzungsbedingungen"),
            ("Datenschutz", "Nutzungsbedingungen"),
            ("data-page=\"privacy\"", "data-page=\"terms\""),
            (
                "Diese Seite beschreibt die öffentliche Marketing-Website. Die App kann\n        andere Daten erfassen — siehe Hinweise in der App.",
                "Nutzungsbedingungen für die Centifi-App und centifi.app.",
            ),
            (
                "Wie Centifi mit Daten umgeht — Ausgaben-Tracking mit Fokus auf Datenschutz.",
                "Nutzungsbedingungen für Centifi — Abos, Konten und zulässige Nutzung.",
            ),
        ],
    },
    {
        "privacy": "fr/privacy.html",
        "terms": "fr/terms.html",
        "fragment": "terms-fr.html",
        "replacements": [
            ("Politique de confidentialité", "Conditions d’utilisation"),
            ("confidentialité", "conditions d’utilisation"),
            ("data-page=\"privacy\"", "data-page=\"terms\""),
            (
                "Résumé du traitement des données sur le site et dans l’app Centifi.",
                "Conditions d’utilisation de l’application Centifi et du site centifi.app.",
            ),
            (
                "Comment Centifi traite vos données — suivi des dépenses axé sur la confidentialité.",
                "Conditions d’utilisation Centifi — abonnements, comptes et usage acceptable.",
            ),
        ],
    },
    {
        "privacy": "es/privacy.html",
        "terms": "es/terms.html",
        "fragment": "terms-es.html",
        "replacements": [
            ("Política de privacidad", "Términos de uso"),
            ("privacidad", "términos de uso"),
            ("data-page=\"privacy\"", "data-page=\"terms\""),
            (
                "Resumen del tratamiento de datos en el sitio y la app Centifi.",
                "Términos de uso de la app Centifi y centifi.app.",
            ),
            (
                "Cómo Centifi trata sus datos — seguimiento de gastos con enfoque en privacidad.",
                "Términos de uso de Centifi — suscripciones, cuentas y uso aceptable.",
            ),
        ],
    },
]


def build():
    legal = ROOT / "assets" / "legal"
    for cfg in CONFIG:
        src = ROOT / cfg["privacy"]
        dest = ROOT / cfg["terms"]
        body = (legal / cfg["fragment"]).read_text(encoding="utf-8")
        html = src.read_text(encoding="utf-8")

        for old, new in cfg["replacements"]:
            html = html.replace(old, new)

        html = re.sub(r"privacy\.html", "terms.html", html)

        html, n = re.subn(
            r"(<main class=\"legal-page wrap\">)\s*.*?\s*(</main>)",
            r"\1\n" + body + r"\n    \2",
            html,
            count=1,
            flags=re.DOTALL,
        )
        if n != 1:
            raise SystemExit(f"Failed to inject main into {dest}")

        dest.write_text(html, encoding="utf-8")
        print("Wrote", dest.relative_to(ROOT))


if __name__ == "__main__":
    build()
