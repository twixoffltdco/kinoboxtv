/* ===========================
   KinoBox.tv — App Logic
   =========================== */

(function ($) {
  'use strict';

  var currentKpId   = null;
  var currentType   = 'films';
  var playerInited  = false;
  var CONTAINER     = '#kinoboxContainer';
  var DEFAULT_ID    = 301;  // Матрица — запасной ID

  /* ===========================
     PLAYER
     =========================== */

  function waitForKinobox(cb, attempts) {
    attempts = attempts || 0;
    if (typeof window.kinobox === 'function') {
      cb();
    } else if (attempts < 30) {
      setTimeout(function () { waitForKinobox(cb, attempts + 1); }, 200);
    } else {
      showPlayerError('Ошибка: скрипт плеера не загрузился. Проверьте подключение к интернету.');
    }
  }

  function initPlayer(kinopoiskId) {
    if (!kinopoiskId || isNaN(kinopoiskId)) {
      showPlayerError('Некорректный ID. Укажите числовой ID Кинопоиска в адресной строке.');
      return;
    }

    var $container = $(CONTAINER);
    $container.empty();
    $container.attr('data-kinopoisk', kinopoiskId);
    $('#currentKpBadge').text('ID: ' + kinopoiskId);

    waitForKinobox(function () {
      try {
        window.kinobox(CONTAINER, {
          search: { kinopoisk: kinopoiskId }
        });
        playerInited = true;

        // Geo-фильтр: убираем источник для определённых стран
        setTimeout(function () {
          applyGeoFilter();
        }, 1000);

      } catch (e) {
        console.error('[KinoBox] Ошибка плеера:', e);
        showPlayerError('Ошибка инициализации плеера. Попробуйте обновить страницу.');
      }
    });
  }

  function showPlayerError(msg) {
    $(CONTAINER).html(
      '<div style="padding:60px 20px;text-align:center;color:#fca5a5;font-size:14px;">' +
      '⚠️ ' + (msg || 'Ошибка загрузки плеера') +
      '</div>'
    );
  }

  function applyGeoFilter() {
    var blockedCountries = ['AU','CA','DE','JP','NL','ES','TR','GB','US','FR'];
    fetch('https://ip.nf/me.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var cc = data && data.ip && data.ip.country_code;
        if (cc && blockedCountries.indexOf(cc) !== -1) {
          var menu = document.querySelector('.kinobox__menuBody');
          if (menu) {
            var obrut = menu.querySelector('.kinobox__menuItem[data-iframe-url*="obrut"]');
            if (obrut) obrut.remove();
            var first = menu.querySelector('.kinobox__menuItem');
            if (first) first.click();
          }
        }
      })
      .catch(function () { /* тихо игнорируем */ });
  }

  /* ===========================
     ROUTING
     =========================== */

  function parseRoute() {
    var path = window.location.pathname;

    // /films/123 или /serials/123
    var m = path.match(/^\/(films|serials)\/(\d+)/i);
    if (m) {
      return { type: m[1].toLowerCase(), id: parseInt(m[2], 10) };
    }

    // /player или /watch?kp=123
    var qp = new URLSearchParams(window.location.search);
    var kpParam = qp.get('kp') || qp.get('id');
    if (kpParam && /^\d+$/.test(kpParam)) {
      return { type: 'films', id: parseInt(kpParam, 10) };
    }

    return null;
  }

  /* ===========================
     PAGES
     =========================== */

  function showPage(pageId) {
    $('.info-page').removeClass('active-page');
    var pageMap = {
      player:  '#playerPage',
      landing: '#landingPage',
      faq:     '#faqPage',
      docs:    '#docsPage',
      terms:   '#termsPage',
      privacy: '#privacyPage',
      about:   '#aboutPage'
    };
    var sel = pageMap[pageId] || '#landingPage';
    $(sel).addClass('active-page');

    // Обновляем активную ссылку в навигации
    $('.main-nav a').removeClass('active-link');
    $('.main-nav a[data-page="' + pageId + '"]').addClass('active-link');

    // Прокручиваем наверх
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToPlayer(id, type) {
    id   = id   || DEFAULT_ID;
    type = type || 'films';
    currentKpId  = id;
    currentType  = type;

    window.history.pushState({ page: 'player', id: id, type: type }, '',
      '/' + type + '/' + id);

    showPage('player');
    initPlayer(id);
  }

  /* ===========================
     NAVIGATION BINDING
     =========================== */

  function bindNav() {
    // Делегирование кликов по всему документу (для кнопок внутри страниц тоже)
    $(document).on('click', 'a[data-page]', function (e) {
      e.preventDefault();
      var page = $(this).attr('data-page');

      if (page === 'player') {
        var route = parseRoute();
        if (route) {
          goToPlayer(route.id, route.type);
        } else {
          // Если нет маршрута — показываем демо
          goToPlayer(DEFAULT_ID, 'films');
        }
      } else {
        window.history.pushState({ page: page }, '', '#' + page);
        showPage(page);
      }
    });
  }

  /* ===========================
     POPSTATE (кнопки вперёд/назад)
     =========================== */

  window.addEventListener('popstate', function (e) {
    var state = e.state;
    if (state && state.page === 'player') {
      showPage('player');
      initPlayer(state.id);
    } else {
      var route = parseRoute();
      if (route) {
        showPage('player');
        initPlayer(route.id);
      } else {
        showPage('landing');
      }
    }
  });

  /* ===========================
     INIT ON DOM READY
     =========================== */

  $(document).ready(function () {
    bindNav();

    var route = parseRoute();
    if (route) {
      currentKpId  = route.id;
      currentType  = route.type;
      showPage('player');
      initPlayer(route.id);
    } else {
      showPage('landing');
    }
  });

})(jQuery);
