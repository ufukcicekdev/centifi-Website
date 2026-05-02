/**
 * Centifi marketing site — theme + language dropdown + year.
 * Expects on <body>: data-lang (en|tr|de|fr|es), data-page (home|privacy), data-depth (0|1).
 */
(function () {
  var THEME_KEY = "centifi-site-theme";

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

  initThemeToggle();
  initLangDropdown();
  initYear();
})();
