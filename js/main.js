(function () {
  "use strict";

  var LANG_KEY = "dvd-lang";
  var html = document.documentElement;

  function applyLang(lang) {
    html.setAttribute("data-lang", lang);
    html.setAttribute("lang", lang);
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang-btn") === lang);
    });
    document.querySelectorAll("title[data-title-ru]").forEach(function (t) {
      t.textContent = lang === "en" ? t.getAttribute("data-title-en") : t.getAttribute("data-title-ru");
    });
  }

  function initLang() {
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    applyLang(saved || "ru");
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = btn.getAttribute("data-lang-btn");
        applyLang(lang);
        try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
      });
    });
  }

  function initHeaderScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 12); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (!toggle || !panel) return;
    toggle.addEventListener("click", function () {
      var isOpen = panel.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        panel.classList.remove("is-open");
        toggle.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal, .reveal-img");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    items.forEach(function (el) { io.observe(el); });
  }

  function initParallax() {
    if (window.matchMedia && (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    var layers = document.querySelectorAll(".hero-bg");
    if (!layers.length) return;
    var ticking = false;
    function update() {
      var y = window.scrollY || 0;
      layers.forEach(function (el) {
        var shift = Math.min(y * 0.18, 90);
        el.style.transform = "translateY(" + shift + "px)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }

  function initContactForm() {
    var form = document.querySelector("#contact-form");
    if (!form) return;
    var status = document.querySelector("#form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var subjects = data.getAll("subject").join(", ");
      var lang = html.getAttribute("data-lang") || "ru";

      var lines = lang === "en"
        ? ["Name: " + data.get("name"), "Company: " + data.get("company"), "Phone: " + data.get("phone"), "Subject: " + subjects, "", data.get("message")]
        : ["Имя: " + data.get("name"), "Компания: " + data.get("company"), "Телефон: " + data.get("phone"), "Тема: " + subjects, "", data.get("message")];

      var subjectLine = lang === "en" ? "Website inquiry from " + data.get("company") : "Заявка с сайта от " + data.get("company");
      window.location.href = "mailto:info@dvd-g.ru?subject=" + encodeURIComponent(subjectLine) + "&body=" + encodeURIComponent(lines.join("\n"));

      if (status) {
        status.textContent = lang === "en" ? "Opening your email client to send the request…" : "Открываем почтовый клиент для отправки заявки…";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLang();
    initHeaderScroll();
    initMobileNav();
    initReveal();
    initParallax();
    initContactForm();
  });
})();
