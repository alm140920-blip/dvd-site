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
    var lang = saved || "ru";
    applyLang(lang);

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
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
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
    var items = document.querySelectorAll(".reveal");
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
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach(function (el) { io.observe(el); });
  }

  function initTilt() {
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;
    var cards = document.querySelectorAll("[data-tilt]");
    cards.forEach(function (card) {
      card.style.transformStyle = "preserve-3d";
      card.style.perspective = "800px";
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "rotateY(" + (x * 6).toFixed(2) + "deg) rotateX(" + (-y * 6).toFixed(2) + "deg) translateY(-2px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "rotateY(0) rotateX(0) translateY(0)";
      });
    });
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
        ? [
            "Name: " + data.get("name"),
            "Company: " + data.get("company"),
            "Phone: " + data.get("phone"),
            "Subject: " + subjects,
            "",
            data.get("message")
          ]
        : [
            "Имя: " + data.get("name"),
            "Компания: " + data.get("company"),
            "Телефон: " + data.get("phone"),
            "Тема: " + subjects,
            "",
            data.get("message")
          ];

      var subjectLine = lang === "en"
        ? "Website inquiry from " + data.get("company")
        : "Заявка с сайта от " + data.get("company");

      var mailto =
        "mailto:info@dvd-g.ru" +
        "?subject=" + encodeURIComponent(subjectLine) +
        "&body=" + encodeURIComponent(lines.join("\n")) +
        (data.get("email") ? "&cc=" : "");

      window.location.href = mailto;

      if (status) {
        status.textContent = lang === "en"
          ? "Opening your email client to send the request…"
          : "Открываем почтовый клиент для отправки заявки…";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLang();
    initHeaderScroll();
    initMobileNav();
    initReveal();
    initTilt();
    initContactForm();
  });
})();
