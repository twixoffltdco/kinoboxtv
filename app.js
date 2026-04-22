/* ===========================
   KinoBox.tv — App Logic v2.1
   Фикс: правильный роутинг при обновлении страницы
   =========================== */

(function ($) {
  'use strict';

  var currentKpId  = null;
  var currentType  = 'films';
  var CONTAINER    = '#kinoboxContainer';
  var DEFAULT_ID   = 301;
  var MAX_PLAYER_RETRIES = 3;
  var RETRY_DELAY_MS = 1800;
  var playerWatchTimer = null;
  var playerWatchObserver = null;

  /* === PLAYER === */

  function waitForKinobox(cb, attempts) {
    attempts = attempts || 0;
    if (typeof window.kinobox === 'function') {
      cb();
    } else if (attempts < 40) {
      setTimeout(function () { waitForKinobox(cb, attempts + 1); }, 150);
    } else {
      showPlayerError('Ошибка: скрипт плеера не загрузился.');
    }
  }

  function clearPlayerWatchers() {
    if (playerWatchTimer) {
      clearTimeout(playerWatchTimer);
      playerWatchTimer = null;
    }
    if (playerWatchObserver) {
      playerWatchObserver.disconnect();
      playerWatchObserver = null;
    }
  }

  function isRecoverablePlayerMessage(text) {
    if (!text) return false;
    var normalized = String(text).toLowerCase();
    return normalized.indexOf('плеер долго отвечает') !== -1 ||
           normalized.indexOf('ошибка загрузки') !== -1 ||
           normalized.indexOf('error') !== -1;
  }

  function schedulePlayerRetry(kinopoiskId, attempt, reasonText) {
    if (attempt >= MAX_PLAYER_RETRIES) {
      var reason = reasonText ? '<br><small style="opacity:.8">' + reasonText + '</small>' : '';
      showPlayerError('Плеер временно недоступен. Попробуйте позже или обновите страницу.' + reason);
      return;
    }

    var nextAttempt = attempt + 1;
    $(CONTAINER).html(
      '<div style="padding:60px 20px;text-align:center;color:#fcd34d;font-size:14px;">' +
      '⚠️ Проблема с источником, повторная попытка ' + nextAttempt + '/' + MAX_PLAYER_RETRIES + '…' +
      '</div>'
    );

    setTimeout(function () {
      initPlayer(kinopoiskId, { attempt: nextAttempt, isRetry: true });
    }, RETRY_DELAY_MS);
  }

  function watchPlayerState(kinopoiskId, attempt) {
    clearPlayerWatchers();
    var container = document.querySelector(CONTAINER);
    if (!container) return;

    var hasLoadedIframe = function () {
      var iframe = container.querySelector('iframe');
      return !!(iframe && iframe.getAttribute('src'));
    };

    var inspectForRetry = function () {
      if (hasLoadedIframe()) return;
      var messageNode = container.querySelector('.kinobox_message');
      var messageText = messageNode ? messageNode.textContent : container.textContent;
      if (isRecoverablePlayerMessage(messageText)) {
        clearPlayerWatchers();
        schedulePlayerRetry(kinopoiskId, attempt, messageText);
      }
    };

    playerWatchObserver = new MutationObserver(inspectForRetry);
    playerWatchObserver.observe(container, { childList: true, subtree: true, characterData: true });

    playerWatchTimer = setTimeout(function () {
      if (hasLoadedIframe()) return;
      inspectForRetry();
    }, 12000);
  }

  function initPlayer(kinopoiskId, options) {
    options = options || {};
    var attempt = options.attempt || 0;
    if (!kinopoiskId || isNaN(kinopoiskId)) {
      showPlayerError('Некорректный ID.');
      return;
    }
    var $container = $(CONTAINER);
    clearPlayerWatchers();
    $container.empty();
    $container.attr('data-kinopoisk', kinopoiskId);
    $('#currentKpBadge').text('ID: ' + kinopoiskId);
    $container.html(
      '<div style="padding:60px 20px;text-align:center;color:#6a78a3;font-size:14px;">' +
      '⏳ Загрузка плеера' + (attempt ? ' (попытка ' + (attempt + 1) + ')' : '') + '...' +
      '</div>'
    );

    waitForKinobox(function () {
      $container.empty();
      try {
        window.kinobox(CONTAINER, { search: { kinopoisk: kinopoiskId } });
        if (window.kinoboxTitleName) window.kinoboxTitleName.update(kinopoiskId);
        setTimeout(applyGeoFilter, 1200);
        watchPlayerState(kinopoiskId, attempt);
      } catch (e) {
        console.error('[KinoBox]', e);
        schedulePlayerRetry(kinopoiskId, attempt, 'Ошибка инициализации');
      }
    });
  }

  function showPlayerError(msg) {
    $(CONTAINER).html('<div style="padding:60px 20px;text-align:center;color:#fca5a5;font-size:14px;">⚠️ ' + msg + '</div>');
  }

  function applyGeoFilter() {
    var blocked = ['AU','CA','DE','JP','NL','ES','TR','GB','US','FR'];
    fetch('https://ip.nf/me.json').then(function(r){return r.json();}).then(function(data){
      var cc = data && data.ip && data.ip.country_code;
      if (cc && blocked.indexOf(cc) !== -1) {
        var menu = document.querySelector('.kinobox__menuBody');
        if (menu) {
          var obrut = menu.querySelector('.kinobox__menuItem[data-iframe-url*="obrut"]');
          if (obrut) obrut.remove();
          var first = menu.querySelector('.kinobox__menuItem');
          if (first) first.click();
        }
      }
    }).catch(function(){});
  }

  /* === ROUTING === */

  function parseRoute(path) {
    path = path || window.location.pathname;
    var m = path.match(/^\/(films|serials)\/(\d+)/i);
    if (m) return { type: m[1].toLowerCase(), id: parseInt(m[2], 10) };
    var qp = new URLSearchParams(window.location.search);
    var kpParam = qp.get('kp') || qp.get('id');
    if (kpParam && /^\d+$/.test(kpParam)) return { type: 'films', id: parseInt(kpParam, 10) };
    return null;
  }

  /* === PAGES === */

  function showPage(pageId) {
    if (pageId !== 'player') clearPlayerWatchers();
    $('.info-page').removeClass('active-page');
    var map = {
      player: '#playerPage', landing: '#landingPage', faq: '#faqPage',
      docs: '#docsPage', terms: '#termsPage', privacy: '#privacyPage', about: '#aboutPage'
    };
    $(map[pageId] || '#landingPage').addClass('active-page');
    $('.main-nav a').removeClass('active-link');
    $('.main-nav a[data-page="' + pageId + '"]').addClass('active-link');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToPlayer(id, type) {
    id = parseInt(id, 10) || DEFAULT_ID;
    type = type || 'films';
    currentKpId = id;
    currentType = type;
    var newUrl = '/' + type + '/' + id;
    if (window.location.pathname !== newUrl) {
      window.history.pushState({ page: 'player', id: id, type: type }, '', newUrl);
    }
    showPage('player');
    initPlayer(id);
  }

  /* === NAV === */

  function bindNav() {
    $(document).on('click', 'a[data-page]', function (e) {
      e.preventDefault();
      var page = $(this).attr('data-page');
      if (page === 'player') {
        var route = parseRoute();
        goToPlayer(route ? route.id : DEFAULT_ID, route ? route.type : 'films');
      } else {
        window.history.pushState({ page: page }, '', '/#' + page);
        showPage(page);
      }
    });
  }

  window.addEventListener('popstate', function (e) {
    var state = e.state;
    if (state && state.page === 'player') { showPage('player'); initPlayer(state.id); return; }
    if (state && state.page && state.page !== 'player') { showPage(state.page); return; }
    var route = parseRoute();
    if (route) { showPage('player'); initPlayer(route.id); } else { showPage('landing'); }
  });

  /* ===========================
     INIT — ГЛАВНЫЙ ФИХ БАГА
     При обновлении страницы /films/301
     сразу парсим URL и показываем плеер
     =========================== */
  $(document).ready(function () {
    bindNav();

    var route = parseRoute();

    if (route) {
      // Пришли на /films/ID или /serials/ID — сразу грузим плеер
      currentKpId = route.id;
      currentType = route.type;
      showPage('player');
      initPlayer(route.id);
    } else {
      // Главная или хэш-навигация
      var hash = window.location.hash.replace('#', '');
      var valid = ['faq', 'docs', 'terms', 'privacy', 'about', 'player'];
      if (hash && valid.indexOf(hash) !== -1) {
        if (hash === 'player') { goToPlayer(DEFAULT_ID, 'films'); }
        else { showPage(hash); }
      } else {
        showPage('landing');
      }
    }
  });

})(jQuery);
