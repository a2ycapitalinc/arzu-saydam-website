/* Shared nav + footer for the Arzu Saydam author site — bilingual (TR default, EN toggle).
   Injected with JS so markup stays in one place and works from file://  */
(function () {
  /* apply saved language as early as possible */
  try {
    var saved = window.localStorage ? localStorage.getItem('lang') : null;
    if (saved === 'en') document.documentElement.classList.add('lang-en');
    document.documentElement.setAttribute('lang', saved === 'en' ? 'en' : 'tr');
  } catch (e) {}

  var page = document.body.getAttribute('data-page') || '';
  var onDark = document.body.getAttribute('data-nav') === 'dark';

  function L(tr, en) {
    return '<span data-lang="tr">' + tr + '</span><span data-lang="en">' + en + '</span>';
  }

  var links = [
    ['index.html', 'Ana Sayfa', 'Home', 'home'],
    ['about.html', 'Hakkında', 'About', 'about'],
    ['books.html', 'Kitaplar', 'Books', 'books'],
    ['journal.html', 'Günlük', 'Journal', 'journal'],
    ['blog.html', 'Notlar', 'Reflections', 'blog'],
    ['events.html', 'Etkinlikler', 'Events', 'events'],
    ['contact.html', 'İletişim', 'Contact', 'contact']
  ];

  var menuItems = links.map(function (l) {
    return '<li><a href="' + l[0] + '"' + (l[3] === page ? ' class="active"' : '') + '>' + L(l[1], l[2]) + '</a></li>';
  }).join('');

  var langSwitch =
    '<span class="lang-switch" id="langSwitch">' +
      '<button data-set="tr">TR</button><span class="sep">|</span><button data-set="en">EN</button>' +
    '</span>';

  var nav =
    '<nav class="nav' + (onDark ? ' on-dark' : '') + '">' +
      '<div class="nav-inner">' +
        '<a class="brand" href="index.html">' +
          '<span class="mark">Arzu Saydam<small>' + L('Yazar', 'Author') + '</small></span>' +
        '</a>' +
        '<ul class="menu" id="menu">' + menuItems +
          '<li><a href="newsletter.html" class="btn btn-gold" style="color:#fff">' + L('Bülten', 'Newsletter') + '</a></li>' +
          '<li>' + langSwitch + '</li>' +
        '</ul>' +
        '<button class="nav-toggle" id="navToggle" aria-label="Menu">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
            '<path d="M4 6h16M4 12h16M4 18h16"/></svg>' +
        '</button>' +
      '</div>' +
    '</nav>';

  var year = new Date().getFullYear();
  var ig = '<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2m0 5.4A4.4 4.4 0 1 0 16.4 12 4.4 4.4 0 0 0 12 7.6m0 7.2A2.8 2.8 0 1 1 14.8 12 2.8 2.8 0 0 1 12 14.8m4.6-7.5a1 1 0 1 0 1 1 1 1 0 0 0-1-1"/></svg>';
  var fb = '<svg viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.6V3.6c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H8.2V13h2.6v8z"/></svg>';
  var li = '<svg viewBox="0 0 24 24"><path d="M6.9 8.8H3.6V21h3.3zM5.2 3.4A1.9 1.9 0 1 0 5.2 7.2 1.9 1.9 0 0 0 5.2 3.4M21 21h-3.3v-6c0-1.4-.5-2.4-1.8-2.4a1.9 1.9 0 0 0-1.8 1.3 2.4 2.4 0 0 0-.1.9V21H10.7s.1-10 0-12.2H14v1.7a3.3 3.3 0 0 1 3-1.7c2.2 0 3.9 1.4 3.9 4.5z"/></svg>';
  var gr = '<svg viewBox="0 0 24 24"><path d="M14.5 12.7a4.3 4.3 0 0 1-3.2 1.4c-2.7 0-4.4-2-4.4-4.9S8.7 4.3 11.4 4.3a4 4 0 0 1 3.1 1.4V3h1.9v11.9c0 3.3-1.8 5.1-4.9 5.1-2.3 0-4-.9-4.4-2.9h2c.3.9 1.2 1.3 2.4 1.3 1.9 0 3-1.2 3-3.3zm0-3.5c0-1.9-1.2-3.2-3-3.2s-2.9 1.4-2.9 3.2 1.2 3.2 2.9 3.2 3-1.3 3-3.2"/></svg>';

  var footer =
    '<footer class="footer">' +
      '<div class="wrap">' +
        '<div class="footer-grid">' +
          '<div>' +
            '<a class="brand" href="index.html"><span class="mark">Arzu Saydam<small>' + L('Yazar', 'Author') + '</small></span></a>' +
            '<p style="margin-top:1rem;font-size:0.92rem;max-width:280px;color:#b7afa1">' +
              L('Bir bahçe gibi ağır ağır yetişen hikâyeler — İstanbul\'dan sessiz bir Kanada bahçesine.',
                'Stories grown slowly, the way a garden is — from Istanbul to a quiet Canadian yard.') +
            '</p>' +
            '<div class="socials">' +
              '<a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener">' + ig + '</a>' +
              '<a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener">' + fb + '</a>' +
              '<a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener">' + li + '</a>' +
              '<a href="https://goodreads.com" aria-label="Goodreads" target="_blank" rel="noopener">' + gr + '</a>' +
            '</div>' +
          '</div>' +
          '<div><h4>' + L('Keşfet', 'Explore') + '</h4><ul>' +
            '<li><a href="about.html">' + L('Arzu Hakkında', 'About Arzu') + '</a></li>' +
            '<li><a href="books.html">' + L('Kitaplar', 'Books') + '</a></li>' +
            '<li><a href="journal.html">' + L('Günlük', 'Journal') + '</a></li>' +
            '<li><a href="blog.html">' + L('Notlar', 'Reflections') + '</a></li>' +
          '</ul></div>' +
          '<div><h4>' + L('Bağlan', 'Connect') + '</h4><ul>' +
            '<li><a href="events.html">' + L('Etkinlikler', 'Events') + '</a></li>' +
            '<li><a href="testimonials.html">' + L('Yorumlar', 'Reviews') + '</a></li>' +
            '<li><a href="faq.html">' + L('Sık Sorulanlar', 'FAQ') + '</a></li>' +
            '<li><a href="media-kit.html">' + L('Basın Kiti', 'Media Kit') + '</a></li>' +
          '</ul></div>' +
          '<div><h4>' + L('İletişimde kal', 'Stay in touch') + '</h4><ul>' +
            '<li><a href="newsletter.html">' + L('Bülten', 'Newsletter') + '</a></li>' +
            '<li><a href="contact.html">' + L('İletişim', 'Contact') + '</a></li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<span>&copy; ' + year + ' Arzu Saydam. ' + L('Tüm hakları saklıdır.', 'All rights reserved.') + '</span>' +
          '<span>' + L('Sessiz bir özenle hazırlandı.', 'Made with quiet attention.') + '</span>' +
        '</div>' +
      '</div>' +
    '</footer>';

  var navSlot = document.getElementById('nav-slot');
  var footSlot = document.getElementById('footer-slot');
  if (navSlot) navSlot.innerHTML = nav;
  if (footSlot) footSlot.innerHTML = footer;

  /* mobile menu toggle */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('menu');
  if (toggle && menu) toggle.addEventListener('click', function () { menu.classList.toggle('open'); });

  /* language toggle */
  function setLang(lang) {
    if (lang === 'en') document.documentElement.classList.add('lang-en');
    else document.documentElement.classList.remove('lang-en');
    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem('lang', lang); } catch (e) {}
    updateSwitch();
  }
  function updateSwitch() {
    var isEn = document.documentElement.classList.contains('lang-en');
    var sw = document.getElementById('langSwitch');
    if (!sw) return;
    sw.querySelectorAll('button').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-set') === (isEn ? 'en' : 'tr'));
    });
  }
  var sw = document.getElementById('langSwitch');
  if (sw) {
    sw.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.getAttribute('data-set')); });
    });
    updateSwitch();
  }
})();
