/**
 * Centifi marketing site — locale redirect, cookie consent + GA4, theme, language, year.
 * Expects on <body>: data-lang (en|tr|de|fr|es), data-page (home|privacy), data-depth (0|1).
 */
(function () {
  var THEME_KEY = "centifi-site-theme";
  var COOKIE_CONSENT_KEY = "centifi-cookie-consent";
  var LANG_CHOICE_KEY = "centifi-lang-choice";
  var GA_MEASUREMENT_ID = "G-0LGX5F8ZK0";

  var COOKIE_COPY = {
    en: {
      title: "Cookies & analytics",
      text:
        "We use optional Google Analytics to understand traffic. Theme choice stays in your browser. You can accept or decline analytics cookies.",
      accept: "Accept",
      reject: "Decline",
      privacy: "Privacy policy",
    },
    tr: {
      title: "Çerezler ve istatistik",
      text:
        "Trafik hakkında bilgi için isteğe bağlı Google Analytics kullanıyoruz. Tema tercihi tarayıcınızda kalır. Analitik çerezlerini kabul edebilir veya reddedebilirsiniz.",
      accept: "Kabul et",
      reject: "Reddet",
      privacy: "Gizlilik politikası",
    },
    de: {
      title: "Cookies & Analyse",
      text:
        "Wir setzen optional Google Analytics ein. Ihr Theme wird lokal gespeichert. Sie können Analyse-Cookies akzeptieren oder ablehnen.",
      accept: "Akzeptieren",
      reject: "Ablehnen",
      privacy: "Datenschutz",
    },
    fr: {
      title: "Cookies et mesure d’audience",
      text:
        "Nous utilisons Google Analytics de façon optionnelle. Votre thème est stocké localement. Vous pouvez accepter ou refuser les cookies de mesure.",
      accept: "Accepter",
      reject: "Refuser",
      privacy: "Politique de confidentialité",
    },
    es: {
      title: "Cookies y analítica",
      text:
        "Usamos Google Analytics de forma opcional. El tema se guarda en tu navegador. Puedes aceptar o rechazar las cookies de analítica.",
      accept: "Aceptar",
      reject: "Rechazar",
      privacy: "Privacidad",
    },
  };

  function getLang() {
    return (document.body && document.body.getAttribute("data-lang")) || "en";
  }

  function cookieStrings() {
    var L = getLang();
    return COOKIE_COPY[L] || COOKIE_COPY.en;
  }

  function privacyHref() {
    return "privacy.html";
  }

  function browserPreferredLang() {
    var supported = { tr: 1, de: 1, fr: 1, es: 1 };
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "en"];
    for (var i = 0; i < list.length; i++) {
      var b = String(list[i]).split("-")[0].toLowerCase();
      if (supported[b]) return b;
    }
    return "en";
  }

  function hrefForLocale(lang, page) {
    if (page === "home") {
      if (lang === "en") return "index.html";
      return lang + "/";
    }
    if (lang === "en") return "privacy.html";
    return lang + "/privacy.html";
  }

  function getLangChoice() {
    try {
      return localStorage.getItem(LANG_CHOICE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setLangChoice(lang) {
    try {
      localStorage.setItem(LANG_CHOICE_KEY, lang);
    } catch (e) {}
  }

  /** @returns {boolean} true if page is unloading for redirect */
  function initLocaleRedirect() {
    var body = document.body;
    if (!body) return false;
    var cur = body.getAttribute("data-lang") || "en";
    var page = body.getAttribute("data-page") || "home";
    var depth = parseInt(body.getAttribute("data-depth") || "0", 10);
    var choice = getLangChoice();

    if (depth !== 0 || cur !== "en") {
      if (choice === null) {
        setLangChoice(cur);
      }
      return false;
    }

    var browser = browserPreferredLang();
    if (choice === null) {
      if (browser !== "en") {
        setLangChoice(browser);
        window.location.replace(hrefForLocale(browser, page));
        return true;
      }
      setLangChoice("en");
      return false;
    }

    if (choice !== "en") {
      window.location.replace(hrefForLocale(choice, page));
      return true;
    }
    return false;
  }

  function loadGoogleAnalytics() {
    if (window.__centifiGaLoaded) return;
    window.__centifiGaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
    document.head.appendChild(s);
    s.onload = function () {
      gtag("js", new Date());
      gtag("config", GA_MEASUREMENT_ID);
    };
  }

  function getCookieConsent() {
    try {
      return localStorage.getItem(COOKIE_CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  function setCookieConsent(value) {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
    } catch (e) {}
  }

  function removeCookieBanner() {
    var el = document.getElementById("centifi-cookie-banner");
    if (el && el.parentNode) el.parentNode.removeChild(el);
    document.body.classList.remove("cookie-banner-visible");
  }

  function initCookieBanner() {
    var consent = getCookieConsent();
    if (consent === "accepted") {
      loadGoogleAnalytics();
      return;
    }
    if (consent === "rejected") {
      return;
    }

    var copy = cookieStrings();
    var bar = document.createElement("div");
    bar.id = "centifi-cookie-banner";
    bar.className = "cookie-banner";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", copy.title);

    bar.innerHTML =
      '<div class="cookie-banner-inner wrap">' +
      '<div class="cookie-banner-text">' +
      "<strong>" +
      copy.title +
      "</strong> " +
      copy.text +
      ' <a class="cookie-banner-privacy" href="' +
      privacyHref() +
      '">' +
      copy.privacy +
      "</a></div>" +
      '<div class="cookie-banner-actions">' +
      '<button type="button" class="cookie-btn cookie-btn--ghost" id="centifi-cookie-reject">' +
      copy.reject +
      "</button>" +
      '<button type="button" class="cookie-btn cookie-btn--primary" id="centifi-cookie-accept">' +
      copy.accept +
      "</button>" +
      "</div></div>";

    document.body.appendChild(bar);
    document.body.classList.add("cookie-banner-visible");

    document.getElementById("centifi-cookie-accept").addEventListener("click", function () {
      setCookieConsent("accepted");
      loadGoogleAnalytics();
      removeCookieBanner();
    });
    document.getElementById("centifi-cookie-reject").addEventListener("click", function () {
      setCookieConsent("rejected");
      removeCookieBanner();
    });
  }

  function linkForLang(lang) {
    var page = document.body.getAttribute("data-page") || "home";
    var depth = parseInt(document.body.getAttribute("data-depth") || "0", 10);
    var cur = document.body.getAttribute("data-lang") || "en";

    if (page === "home") {
      if (depth === 0) {
        if (lang === "en") return "index.html";
        return lang + "/";
      }
      if (lang === "en") return "../index.html";
      if (lang === cur) return "./";
      return "../" + lang + "/";
    }

    if (depth === 0) {
      if (lang === "en") return "privacy.html";
      return lang + "/privacy.html";
    }
    if (lang === "en") return "../privacy.html";
    if (lang === cur) return "privacy.html";
    return "../" + lang + "/privacy.html";
  }

  function initThemeToggle() {
    var btn = document.getElementById("centifi-theme");
    if (!btn) return;

    function currentTheme() {
      return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    }

    function setTheme(next) {
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {}
      btn.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
      btn.setAttribute(
        "aria-label",
        next === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
      btn.textContent = next === "dark" ? "☀️" : "🌙";
    }

    btn.addEventListener("click", function () {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
    });

    setTheme(currentTheme());
  }

  function initMobileNav() {
    var mq = window.matchMedia("(max-width: 767px)");
    var header = document.querySelector("header.nav");
    var toggle = document.getElementById("nav-menu-toggle");
    var drawer = document.getElementById("nav-drawer");
    var overlay = document.getElementById("nav-overlay");
    if (!header || !toggle || !drawer) return;

    function narrow() {
      return mq.matches;
    }

    function setOpen(open) {
      drawer.classList.toggle("nav-drawer--open", open);
      header.classList.toggle("nav-menu-is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (overlay) overlay.hidden = !open || !narrow();
      document.body.classList.toggle("nav-drawer-lock", open && narrow());
    }

    toggle.addEventListener("click", function () {
      if (!narrow()) return;
      setOpen(!drawer.classList.contains("nav-drawer--open"));
    });

    function closeIfOpen() {
      if (drawer.classList.contains("nav-drawer--open") && narrow()) setOpen(false);
    }

    if (overlay)
      overlay.addEventListener("click", function () {
        closeIfOpen();
      });

    mq.addEventListener("change", function () {
      setOpen(false);
      if (overlay) overlay.hidden = true;
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !narrow()) return;
      if (!drawer.classList.contains("nav-drawer--open")) return;
      setOpen(false);
      toggle.focus();
    });

    drawer.querySelectorAll('a[href*="#"]').forEach(function (a) {
      a.addEventListener("click", function () {
        if (narrow()) setOpen(false);
      });
    });
  }

  function initLangDropdown() {
    var root = document.getElementById("centifi-lang-dropdown");
    var trigger = document.getElementById("centifi-lang-trigger");
    var list = document.getElementById("centifi-lang-list");
    if (!root || !trigger || !list) return;

    var options = Array.prototype.slice.call(list.querySelectorAll(".lang-dropdown-option"));

    function isOpen() {
      return !list.hidden;
    }

    function open() {
      list.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      root.classList.add("is-open");
    }

    function close() {
      list.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      root.classList.remove("is-open");
    }

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      if (isOpen()) close();
      else open();
    });

    document.addEventListener("click", function (e) {
      if (!root.contains(e.target)) close();
    });

    root.addEventListener("focusout", function () {
      requestAnimationFrame(function () {
        if (!root.contains(document.activeElement)) close();
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) {
        close();
        trigger.focus();
      }
    });

    function focusOptionIndex(ix) {
      if (ix < 0 || ix >= options.length) return;
      options[ix].focus();
    }

    function activeIndex() {
      var i = options.indexOf(document.activeElement);
      if (i >= 0) return i;
      var ai = options.findIndex(function (o) {
        return o.classList.contains("is-active");
      });
      return ai >= 0 ? ai : 0;
    }

    trigger.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!isOpen()) open();
        focusOptionIndex(0);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!isOpen()) open();
        focusOptionIndex(options.length - 1);
      }
    });

    list.addEventListener("keydown", function (e) {
      if (!isOpen()) return;
      var ix = activeIndex();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        focusOptionIndex(Math.min(options.length - 1, ix + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        focusOptionIndex(Math.max(0, ix - 1));
      } else if (e.key === "Home") {
        e.preventDefault();
        focusOptionIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        focusOptionIndex(options.length - 1);
      } else if (e.key === "Enter" || e.key === " ") {
        if (options.indexOf(document.activeElement) >= 0) {
          e.preventDefault();
          document.activeElement.click();
        }
      }
    });

    options.forEach(function (opt) {
      opt.addEventListener("click", function () {
        if (opt.classList.contains("is-active")) {
          close();
          return;
        }
        var lang = opt.getAttribute("data-lang");
        setLangChoice(lang);
        var url = linkForLang(lang);
        if (url) window.location.href = url;
      });
    });
  }

  function initYear() {
    var y = new Date().getFullYear();
    document.querySelectorAll(".copyright-year").forEach(function (el) {
      el.textContent = y;
    });
  }

  if (initLocaleRedirect()) return;

  initCookieBanner();
  initThemeToggle();
  initMobileNav();
  initLangDropdown();
  initYear();
})();
