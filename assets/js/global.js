/* ==========================================================================
   DVD Group — global shell (header, footer, language switch, mobile menu)
   Plain vanilla JavaScript. No frameworks, no build step.

   Every page includes this file and provides two empty mount points plus
   a data-page attribute on <body> for nav highlighting:

     <body data-page="home">
       <header id="site-header" class="site-header"></header>
       <main id="main-content">...page content...</main>
       <footer id="site-footer" class="site-footer"></footer>
       <script src="assets/js/global.js" defer></script>
     </body>

   Editing the header/footer markup here changes it on every page at once.
   ========================================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'dvd-lang';

  var HEADER_HTML =
    '<div class="header-inner">' +
      '<div class="header-left">' +
        '<a href="index.html" class="header-logo" aria-label="DVD Group — Home">' +
          '<img src="images/DVD_EN_transparent.png" ' +
               'data-src-en="images/DVD_EN_transparent.png" ' +
               'data-src-ru="images/DVD_RUS_transparent.png" ' +
               'alt="DVD Group">' +
        '</a>' +
        '<span class="header-divider" aria-hidden="true"></span>' +
        '<div class="lang-switch" role="group" aria-label="Language">' +
          '<button type="button" class="lang-link" data-lang="ru">Русский</button>' +
          '<button type="button" class="lang-link is-active" data-lang="en">English</button>' +
        '</div>' +
      '</div>' +
      '<nav class="header-nav" aria-label="Primary">' +
        '<a href="partners.html" class="nav-btn" data-page="partners" data-ru="Партнёры" data-en="Partners">Partners</a>' +
        '<a href="about.html" class="nav-btn" data-page="about" data-ru="О нас" data-en="About">About</a>' +
        '<a href="contact.html" class="nav-btn" data-page="contact" data-ru="Контакты" data-en="Contact">Contact</a>' +
      '</nav>' +
      '<button type="button" class="header-burger" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">' +
        '<span class="burger-line"></span>' +
      '</button>' +
    '</div>' +
    '<div class="mobile-menu" id="mobileMenu">' +
      '<div class="mobile-menu-top">' +
        '<button type="button" class="mobile-menu-close" aria-label="Close menu">&times;</button>' +
      '</div>' +
      '<nav class="mobile-nav" aria-label="Mobile">' +
        '<a href="partners.html" data-page="partners" data-ru="Партнёры" data-en="Partners">Partners</a>' +
        '<a href="about.html" data-page="about" data-ru="О нас" data-en="About">About</a>' +
        '<a href="contact.html" data-page="contact" data-ru="Контакты" data-en="Contact">Contact</a>' +
      '</nav>' +
    '</div>';

  var FOOTER_HTML =
    '<div class="footer-inner">' +
      '<div class="footer-left" data-ru="©2026 DVD Group" data-en="©2026 DVD Group">©2026 DVD Group</div>' +
      '<div class="footer-center">' +
        '<a href="privacy-policy.html" data-ru="Политика конфиденциальности" data-en="Privacy Policy">Privacy Policy</a>' +
      '</div>' +
      '<div class="footer-right" data-ru="Все права защищены." data-en="All Rights Reserved.">All Rights Reserved.</div>' +
    '</div>';

  function injectPartials() {
    var headerMount = document.getElementById('site-header');
    var footerMount = document.getElementById('site-footer');
    if (headerMount) headerMount.innerHTML = HEADER_HTML;
    if (footerMount) footerMount.innerHTML = FOOTER_HTML;
  }

  function markCurrentPage() {
    var page = document.body.getAttribute('data-page');
    if (!page) return;
    var matches = document.querySelectorAll('[data-page="' + page + '"]');
    for (var i = 0; i < matches.length; i++) {
      matches[i].classList.add('is-current');
      matches[i].setAttribute('aria-current', 'page');
    }
  }

  function setLang(lang) {
    var isRu = lang === 'ru';
    document.documentElement.setAttribute('lang', isRu ? 'ru' : 'en');

    var textEls = document.querySelectorAll('[data-ru][data-en]');
    for (var i = 0; i < textEls.length; i++) {
      var el = textEls[i];
      el.textContent = isRu ? el.getAttribute('data-ru') : el.getAttribute('data-en');
    }

    var imgEls = document.querySelectorAll('[data-src-ru][data-src-en]');
    for (var j = 0; j < imgEls.length; j++) {
      var img = imgEls[j];
      img.src = isRu ? img.getAttribute('data-src-ru') : img.getAttribute('data-src-en');
    }

    var langBtns = document.querySelectorAll('.lang-link');
    for (var k = 0; k < langBtns.length; k++) {
      var btn = langBtns[k];
      btn.classList.toggle('is-active', btn.getAttribute('data-lang') === lang);
    }

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* private browsing / storage disabled — language just won't persist */
    }
  }

  function wireLangSwitch() {
    var langBtns = document.querySelectorAll('.lang-link');
    for (var i = 0; i < langBtns.length; i++) {
      langBtns[i].addEventListener('click', function (event) {
        setLang(event.currentTarget.getAttribute('data-lang'));
      });
    }
  }

  function wireMobileMenu() {
    var burger = document.querySelector('.header-burger');
    var menu = document.getElementById('mobileMenu');
    var closeBtn = document.querySelector('.mobile-menu-close');
    if (!burger || !menu) return;

    function openMenu() {
      menu.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    var menuLinks = menu.querySelectorAll('a');
    for (var i = 0; i < menuLinks.length; i++) {
      menuLinks[i].addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  function init() {
    injectPartials();
    markCurrentPage();
    wireLangSwitch();
    wireMobileMenu();

    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
    setLang(saved === 'ru' ? 'ru' : 'en');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
