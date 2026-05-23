/**
 * Centifi marketing site — locale redirect, cookie consent + GA4, theme, language, year.
 * Expects on <body>: data-lang (en|tr|de|fr|es), data-page (home|privacy|terms|feedback|test-users|error), data-depth (0|1).
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
    if (page === "home" || page === "error") {
      if (lang === "en") return "index.html";
      return lang + "/";
    }
    if (page === "terms") {
      if (lang === "en") return "terms.html";
      return lang + "/terms.html";
    }
    if (page === "feedback") {
      if (lang === "en") return "feedback.html";
      return lang + "/feedback.html";
    }
    if (page === "test-users") {
      if (lang === "en") return "test-users.html";
      return lang + "/test-users.html";
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

    /* 404/500: never auto-redirect by browser locale — user should see the error page they hit. */
    if (page === "error") {
      if (choice === null) setLangChoice(cur);
      return false;
    }

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

    if (page === "error") {
      if (depth === 0) {
        if (lang === "en") return "index.html";
        return lang + "/";
      }
      if (lang === "en") return "../index.html";
      if (lang === cur) return "index.html";
      return "../" + lang + "/";
    }

    if (page === "home") {
      if (depth === 0) {
        if (lang === "en") return "index.html";
        return lang + "/";
      }
      if (lang === "en") return "../index.html";
      if (lang === cur) return "./";
      return "../" + lang + "/";
    }

    var legalPage = "privacy.html";
    if (page === "terms") legalPage = "terms.html";
    if (page === "feedback") legalPage = "feedback.html";
    if (page === "test-users") legalPage = "test-users.html";

    if (depth === 0) {
      if (lang === "en") return legalPage;
      return lang + "/" + legalPage;
    }
    if (lang === "en") return "../" + legalPage;
    if (lang === cur) return legalPage;
    return "../" + lang + "/" + legalPage;
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

  var FEEDBACK_COPY = {
    en: {
      name: "Name",
      email: "Email",
      topic: "Topic",
      message: "Message",
      required: "*",
      hint: "At least 10 characters.",
      submit: "Send feedback",
      sending: "Sending…",
      success: "Thank you! Your message was sent.",
      errorGeneric: "Something went wrong. Please try again or email us.",
      errorNetwork: "Could not reach the server. Check your connection or email info@centifi.app.",
      errorValidation: "Please check the highlighted fields.",
      alt: "Prefer email?",
      categories: {
        general: "General",
        bug: "Bug report",
        feature: "Feature request",
        billing: "Billing / subscription",
        other: "Other",
      },
    },
    tr: {
      name: "Ad",
      email: "E-posta",
      topic: "Konu",
      message: "Mesaj",
      required: "*",
      hint: "En az 10 karakter.",
      submit: "Gönder",
      sending: "Gönderiliyor…",
      success: "Teşekkürler! Mesajınız iletildi.",
      errorGeneric: "Bir sorun oluştu. Lütfen tekrar deneyin veya bize yazın.",
      errorNetwork: "Sunucuya ulaşılamadı. Bağlantınızı kontrol edin veya info@centifi.app adresine yazın.",
      errorValidation: "Lütfen işaretli alanları kontrol edin.",
      alt: "E-posta tercih eder misiniz?",
      categories: {
        general: "Genel",
        bug: "Hata bildirimi",
        feature: "Özellik isteği",
        billing: "Abonelik / ödeme",
        other: "Diğer",
      },
    },
    de: {
      name: "Name",
      email: "E-Mail",
      topic: "Thema",
      message: "Nachricht",
      required: "*",
      hint: "Mindestens 10 Zeichen.",
      submit: "Absenden",
      sending: "Wird gesendet…",
      success: "Danke! Ihre Nachricht wurde gesendet.",
      errorGeneric: "Etwas ist schiefgelaufen. Bitte erneut versuchen oder uns schreiben.",
      errorNetwork: "Server nicht erreichbar. Verbindung prüfen oder info@centifi.app schreiben.",
      errorValidation: "Bitte markierte Felder prüfen.",
      alt: "Lieber per E-Mail?",
      categories: {
        general: "Allgemein",
        bug: "Fehlermeldung",
        feature: "Feature-Wunsch",
        billing: "Abo / Abrechnung",
        other: "Sonstiges",
      },
    },
    fr: {
      name: "Nom",
      email: "E-mail",
      topic: "Sujet",
      message: "Message",
      required: "*",
      hint: "Au moins 10 caractères.",
      submit: "Envoyer",
      sending: "Envoi…",
      success: "Merci ! Votre message a été envoyé.",
      errorGeneric: "Un problème est survenu. Réessayez ou écrivez-nous.",
      errorNetwork: "Impossible de joindre le serveur. Vérifiez la connexion ou écrivez à info@centifi.app.",
      errorValidation: "Veuillez vérifier les champs indiqués.",
      alt: "Vous préférez l’e-mail ?",
      categories: {
        general: "Général",
        bug: "Signaler un bug",
        feature: "Demande de fonctionnalité",
        billing: "Abonnement / facturation",
        other: "Autre",
      },
    },
    es: {
      name: "Nombre",
      email: "Correo",
      topic: "Tema",
      message: "Mensaje",
      required: "*",
      hint: "Al menos 10 caracteres.",
      submit: "Enviar",
      sending: "Enviando…",
      success: "¡Gracias! Tu mensaje se envió correctamente.",
      errorGeneric: "Algo salió mal. Inténtalo de nuevo o escríbenos.",
      errorNetwork: "No se pudo conectar al servidor. Revisa la conexión o escribe a info@centifi.app.",
      errorValidation: "Revisa los campos marcados.",
      alt: "¿Prefieres correo?",
      categories: {
        general: "General",
        bug: "Informar error",
        feature: "Solicitud de función",
        billing: "Suscripción / facturación",
        other: "Otro",
      },
    },
  };

  function feedbackStrings() {
    var L = getLang();
    return FEEDBACK_COPY[L] || FEEDBACK_COPY.en;
  }

  function feedbackApiBase() {
    var meta = document.querySelector('meta[name="centifi-api-base"]');
    if (meta && meta.content) return meta.content.replace(/\/$/, "");
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      return "http://127.0.0.1:8000";
    }
    return "https://centifi-backend-production.up.railway.app";
  }

  function setFeedbackStatus(el, message, kind) {
    if (!el) return;
    el.hidden = !message;
    el.textContent = message || "";
    el.classList.remove("is-success", "is-error");
    if (kind) el.classList.add(kind === "success" ? "is-success" : "is-error");
  }

  function initFeedbackForm() {
    var form = document.getElementById("centifi-feedback-form");
    if (!form) return;

    var copy = feedbackStrings();
    var statusEl = document.getElementById("feedback-status");
    var submitBtn = document.getElementById("feedback-submit");

    var nameLabel = document.getElementById("feedback-name-label");
    var emailLabel = document.getElementById("feedback-email-label");
    var categoryLabel = document.getElementById("feedback-category-label");
    var messageLabel = document.getElementById("feedback-message-label");
    var hintEl = document.getElementById("feedback-message-hint");
    var altText = document.getElementById("feedback-alt-text");
    var categoryHidden = document.getElementById("feedback-category");
    var categoryValueEl = document.getElementById("feedback-category-value");

    function renderCategoryValue(value) {
      if (!categoryValueEl) return;
      var key = value || "general";
      var icon = FEEDBACK_CATEGORY_ICONS[key] || "";
      var label = (copy.categories && copy.categories[key]) || key;
      categoryValueEl.innerHTML =
        '<span class="lang-flag" aria-hidden="true">' + icon + "</span> <span>" + label + "</span>";
    }

    function applyCategoryOptionLabels() {
      document.querySelectorAll("#feedback-category-list .lang-dropdown-option").forEach(function (btn) {
        var key = btn.getAttribute("data-value");
        var labelEl = btn.querySelector(".dropdown-option-label");
        if (key && labelEl && copy.categories && copy.categories[key]) {
          labelEl.textContent = copy.categories[key];
        }
      });
    }

    if (nameLabel) nameLabel.textContent = copy.name;
    if (emailLabel)
      emailLabel.innerHTML = copy.email + ' <span class="feedback-required">' + copy.required + "</span>";
    if (categoryLabel) categoryLabel.textContent = copy.topic;
    if (messageLabel)
      messageLabel.innerHTML = copy.message + ' <span class="feedback-required">' + copy.required + "</span>";
    if (hintEl) hintEl.textContent = copy.hint;
    if (altText) altText.textContent = copy.alt;
    if (submitBtn) submitBtn.textContent = copy.submit;
    applyCategoryOptionLabels();
    renderCategoryValue(categoryHidden ? categoryHidden.value || "general" : "general");

    var categoryDropdown = initCustomDropdown({
      rootId: "feedback-category-dropdown",
      triggerId: "feedback-category-trigger",
      listId: "feedback-category-list",
      hiddenInputId: "feedback-category",
      onChange: function (val) {
        renderCategoryValue(val);
      },
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      setFeedbackStatus(statusEl, "", "");

      var email = (document.getElementById("feedback-email").value || "").trim();
      var message = (document.getElementById("feedback-message").value || "").trim();
      if (!email || message.length < 10) {
        setFeedbackStatus(statusEl, copy.errorValidation, "error");
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = copy.sending;
      }

      var payload = {
        name: (document.getElementById("feedback-name").value || "").trim(),
        email: email,
        category: categoryHidden ? categoryHidden.value || "general" : "general",
        message: message,
        language: getLang(),
        website: (document.getElementById("feedback-website").value || "").trim(),
      };

      fetch(feedbackApiBase() + "/api/feedback/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.json().catch(function () {
            return {};
          }).then(function (data) {
            if (res.ok) {
              form.reset();
              if (categoryDropdown) categoryDropdown.setValue("general", true);
              renderCategoryValue("general");
              setFeedbackStatus(statusEl, copy.success, "success");
              return;
            }
            var detail = data.detail || data.message;
            if (typeof detail === "object") detail = Object.values(detail).join(" ");
            setFeedbackStatus(statusEl, detail || copy.errorGeneric, "error");
          });
        })
        .catch(function () {
          setFeedbackStatus(statusEl, copy.errorNetwork, "error");
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = copy.submit;
          }
        });
    });
  }

  var TEST_USERS_COPY = {
    en: {
      platform: "Platform",
      email: "Email",
      required: "*",
      platformPlaceholder: "Select…",
      platforms: { ios: "iOS", android: "Android" },
      submit: "Apply",
      sending: "Sending…",
      success: "Thank you! We received your application.",
      duplicate: "This email is already registered for testing. We’ll contact you if a spot opens.",
      errorGeneric: "Something went wrong. Please try again.",
      errorNetwork: "Could not reach the server. Check your connection and try again.",
      errorValidation: "Please select a platform and enter a valid email.",
      alt: "Questions?",
      altLink: "Send feedback",
    },
    tr: {
      platform: "Platform",
      email: "E-posta",
      required: "*",
      platformPlaceholder: "Seçin…",
      platforms: { ios: "iOS", android: "Android" },
      submit: "Başvur",
      sending: "Gönderiliyor…",
      success: "Teşekkürler! Başvurunuz alındı.",
      duplicate: "Bu e-posta zaten test listesinde kayıtlı. Yer açılırsa sizinle iletişime geçeriz.",
      errorGeneric: "Bir sorun oluştu. Lütfen tekrar deneyin.",
      errorNetwork: "Sunucuya ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.",
      errorValidation: "Lütfen platform seçin ve geçerli bir e-posta girin.",
      alt: "Sorularınız mı var?",
      altLink: "Geri bildirim gönder",
    },
    de: {
      platform: "Plattform",
      email: "E-Mail",
      required: "*",
      platformPlaceholder: "Auswählen…",
      platforms: { ios: "iOS", android: "Android" },
      submit: "Bewerben",
      sending: "Wird gesendet…",
      success: "Danke! Ihre Bewerbung ist eingegangen.",
      duplicate: "Diese E-Mail ist bereits für Tests registriert. Wir melden uns bei Ihnen.",
      errorGeneric: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
      errorNetwork: "Server nicht erreichbar. Verbindung prüfen und erneut versuchen.",
      errorValidation: "Bitte Plattform wählen und gültige E-Mail eingeben.",
      alt: "Fragen?",
      altLink: "Feedback senden",
    },
    fr: {
      platform: "Plateforme",
      email: "E-mail",
      required: "*",
      platformPlaceholder: "Choisir…",
      platforms: { ios: "iOS", android: "Android" },
      submit: "Candidater",
      sending: "Envoi…",
      success: "Merci ! Votre candidature a bien été reçue.",
      duplicate: "Cet e-mail est déjà inscrit aux tests. Nous vous contacterons si une place se libère.",
      errorGeneric: "Un problème est survenu. Veuillez réessayer.",
      errorNetwork: "Impossible de joindre le serveur. Vérifiez la connexion et réessayez.",
      errorValidation: "Choisissez une plateforme et saisissez un e-mail valide.",
      alt: "Des questions ?",
      altLink: "Envoyer un commentaire",
    },
    es: {
      platform: "Plataforma",
      email: "Correo",
      required: "*",
      platformPlaceholder: "Elegir…",
      platforms: { ios: "iOS", android: "Android" },
      submit: "Solicitar",
      sending: "Enviando…",
      success: "¡Gracias! Recibimos tu solicitud.",
      duplicate: "Este correo ya está registrado para pruebas. Te contactaremos si hay plaza.",
      errorGeneric: "Algo salió mal. Inténtalo de nuevo.",
      errorNetwork: "No se pudo conectar al servidor. Revisa la conexión e inténtalo de nuevo.",
      errorValidation: "Elige una plataforma e introduce un correo válido.",
      alt: "¿Preguntas?",
      altLink: "Enviar comentarios",
    },
  };

  function testUsersStrings() {
    var L = getLang();
    return TEST_USERS_COPY[L] || TEST_USERS_COPY.en;
  }

  function feedbackHref() {
    var depth = parseInt(document.body.getAttribute("data-depth") || "0", 10);
    if (depth === 0) return "feedback.html";
    return "feedback.html";
  }

  var PLATFORM_ICONS = { ios: "\uD83C\uDF4E", android: "\uD83E\uDD16" };
  var FEEDBACK_CATEGORY_ICONS = {
    general: "\uD83D\uDCAC",
    bug: "\uD83D\uDC1B",
    feature: "\u2728",
    billing: "\uD83D\uDCB3",
    other: "\uD83D\uDCCE",
  };

  /**
   * Full-width custom dropdown (reuses .lang-dropdown styles).
   * cfg: { rootId, triggerId, listId, hiddenInputId, valueElId, placeholderElId, onChange }
   */
  function initCustomDropdown(cfg) {
    var root = document.getElementById(cfg.rootId);
    var trigger = document.getElementById(cfg.triggerId);
    var list = document.getElementById(cfg.listId);
    var hidden = cfg.hiddenInputId ? document.getElementById(cfg.hiddenInputId) : null;
    if (!root || !trigger || !list) return null;

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

    function setActive(opt) {
      options.forEach(function (o) {
        var on = o === opt;
        o.classList.toggle("is-active", on);
        o.setAttribute("aria-selected", on ? "true" : "false");
      });
    }

    function selectOption(opt, silent) {
      if (!opt) return;
      var val = opt.getAttribute("data-value") || "";
      setActive(opt);
      if (hidden) hidden.value = val;
      if (cfg.onChange) cfg.onChange(val, opt);
      if (!silent) close();
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
      } else if (e.key === "Enter" || e.key === " ") {
        if (options.indexOf(document.activeElement) >= 0) {
          e.preventDefault();
          selectOption(document.activeElement);
        }
      }
    });

    options.forEach(function (opt) {
      opt.addEventListener("click", function () {
        selectOption(opt);
      });
    });

    return {
      getValue: function () {
        return hidden ? hidden.value : "";
      },
      clear: function () {
        options.forEach(function (o) {
          o.classList.remove("is-active");
          o.setAttribute("aria-selected", "false");
        });
        if (hidden) hidden.value = "";
        if (cfg.onClear) cfg.onClear();
      },
      setInvalid: function (on) {
        root.classList.toggle("is-invalid", !!on);
      },
      setValue: function (val, silent) {
        var opt = null;
        for (var i = 0; i < options.length; i++) {
          if (options[i].getAttribute("data-value") === val) {
            opt = options[i];
            break;
          }
        }
        if (opt) selectOption(opt, silent !== false);
      },
    };
  }

  function initTestUsersForm() {
    var form = document.getElementById("centifi-test-users-form");
    if (!form) return;

    var copy = testUsersStrings();
    var statusEl = document.getElementById("test-users-status");
    var submitBtn = document.getElementById("test-users-submit");
    var platformHidden = document.getElementById("test-users-platform");
    var platformValueEl = document.getElementById("test-users-platform-value");
    var platformPlaceholderEl = document.getElementById("test-users-platform-placeholder");
    var platformLabel = document.getElementById("test-users-platform-label");
    var emailLabel = document.getElementById("test-users-email-label");
    var altText = document.getElementById("test-users-alt-text");
    var altLink = document.getElementById("test-users-alt-link");

    function renderPlatformValue(value) {
      if (!platformValueEl) return;
      if (!value) {
        platformValueEl.innerHTML =
          '<span class="form-dropdown-placeholder" id="test-users-platform-placeholder">' +
          copy.platformPlaceholder +
          "</span>";
        return;
      }
      var icon = PLATFORM_ICONS[value] || "";
      var label = copy.platforms[value] || value;
      platformValueEl.innerHTML =
        '<span class="lang-flag" aria-hidden="true">' +
        icon +
        '</span> <span>' +
        label +
        "</span>";
    }

    function applyPlatformOptionLabels() {
      document.querySelectorAll("#test-users-platform-list .lang-dropdown-option").forEach(function (btn) {
        var key = btn.getAttribute("data-value");
        var labelEl = btn.querySelector(".platform-option-label");
        if (key && labelEl && copy.platforms[key]) labelEl.textContent = copy.platforms[key];
      });
    }

    if (platformLabel)
      platformLabel.innerHTML =
        copy.platform + ' <span class="feedback-required">' + copy.required + "</span>";
    if (emailLabel)
      emailLabel.innerHTML = copy.email + ' <span class="feedback-required">' + copy.required + "</span>";
    if (altText) altText.textContent = copy.alt;
    if (altLink) {
      altLink.textContent = copy.altLink;
      altLink.setAttribute("href", feedbackHref());
    }
    if (submitBtn) submitBtn.textContent = copy.submit;
    if (platformPlaceholderEl) platformPlaceholderEl.textContent = copy.platformPlaceholder;
    applyPlatformOptionLabels();
    renderPlatformValue(platformHidden ? platformHidden.value : "");

    var platformDropdown = initCustomDropdown({
      rootId: "test-users-platform-dropdown",
      triggerId: "test-users-platform-trigger",
      listId: "test-users-platform-list",
      hiddenInputId: "test-users-platform",
      onChange: function (val) {
        renderPlatformValue(val);
        if (platformDropdown) platformDropdown.setInvalid(false);
      },
      onClear: function () {
        renderPlatformValue("");
      },
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      setFeedbackStatus(statusEl, "", "");

      var email = (document.getElementById("test-users-email").value || "").trim();
      var platform = platformHidden ? platformHidden.value : "";
      if (!email || !platform) {
        if (platformDropdown) platformDropdown.setInvalid(!platform);
        setFeedbackStatus(statusEl, copy.errorValidation, "error");
        return;
      }
      if (platformDropdown) platformDropdown.setInvalid(false);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = copy.sending;
      }

      fetch(feedbackApiBase() + "/api/test-users/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: email,
          platform: platform,
          language: getLang(),
          website: (document.getElementById("test-users-website").value || "").trim(),
        }),
      })
        .then(function (res) {
          return res.json().catch(function () {
            return {};
          }).then(function (data) {
            if (res.status === 409 || data.code === "duplicate_email") {
              setFeedbackStatus(statusEl, copy.duplicate, "error");
              return;
            }
            if (res.ok) {
              form.reset();
              if (platformDropdown) platformDropdown.clear();
              renderPlatformValue("");
              setFeedbackStatus(statusEl, copy.success, "success");
              return;
            }
            var detail = data.detail || data.message;
            if (typeof detail === "object") detail = Object.values(detail).join(" ");
            setFeedbackStatus(statusEl, detail || copy.errorGeneric, "error");
          });
        })
        .catch(function () {
          setFeedbackStatus(statusEl, copy.errorNetwork, "error");
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = copy.submit;
          }
        });
    });
  }

  if (initLocaleRedirect()) return;

  initCookieBanner();
  initThemeToggle();
  initMobileNav();
  initLangDropdown();
  initYear();
  initFeedbackForm();
  initTestUsersForm();
})();
