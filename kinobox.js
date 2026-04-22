/*!
 * KinoBox.js — Embeddable movie player
 * Based on kinobox API
 * Adapted for kinobox.tv
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory()
    : typeof define === 'function' && define.amd
    ? define(factory)
    : (global.kinobox = factory());
}(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  var API_BASE = 'https://kinoplayer.tatnet.app/';

  var SOURCES = [
    { id: 'collaps',  label: 'Collaps',  url: 'https://api.linktovideo.ru/api/kp/{id}' },
    { id: 'alloha',   label: 'Alloha',   url: 'https://api.alloha.tv/?kp={id}' },
    { id: 'kodik',    label: 'Kodik',    url: 'https://kodik.info/search?kinopoisk_id={id}&types=film,foreign-film,cartoon,anime,animated-series,foreign-serial,serial&with_material_data=true' },
    { id: 'hdvb',     label: 'HDVB',     url: 'https://videoapi.my/api/videos/movie?api_token=api&kinopoisk_id={id}' },
    { id: 'videocdn', label: 'VideoCDN', url: 'https://videocdn.tv/api/short?api_token=api&kinopoisk_id={id}' },
  ];

  var CSS_INJECTED = false;

  function injectCSS() {
    if (CSS_INJECTED) return;
    CSS_INJECTED = true;
    var style = document.createElement('style');
    style.textContent = [
      '.kb-wrap{width:100%;font-family:"Montserrat",sans-serif;background:#080c18;border-radius:16px;overflow:hidden;}',
      '.kb-menu{display:flex;flex-wrap:wrap;gap:6px;padding:12px 14px;background:#0b1020;border-bottom:1px solid #1e2540;}',
      '.kb-btn{cursor:pointer;padding:6px 16px;border-radius:30px;font-size:12px;font-weight:600;',
        'color:#8aa0d4;background:#141929;border:1px solid #1e2a48;transition:.15s;}',
      '.kb-btn:hover{background:#1e2a48;color:#fff;}',
      '.kb-btn.kb-active{background:#3b5bdb;color:#fff;border-color:#3b5bdb;}',
      '.kb-frame-wrap{width:100%;position:relative;padding-top:56.25%;}',
      '.kb-frame-wrap iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:none;}',
      '.kb-loading{padding:60px 20px;text-align:center;color:#6a78a3;font-size:14px;}',
      '.kb-error{padding:40px 20px;text-align:center;color:#fca5a5;font-size:13px;}',
    ].join('');
    document.head.appendChild(style);
  }

  function buildIframeUrl(source, kinopoiskId) {
    return source.url.replace('{id}', kinopoiskId);
  }

  function renderPlayer(container, sources, activeIdx) {
    activeIdx = activeIdx || 0;
    var wrap  = document.createElement('div');
    wrap.className = 'kb-wrap';

    // Menu
    var menu = document.createElement('div');
    menu.className = 'kb-menu';

    sources.forEach(function (src, i) {
      var btn = document.createElement('div');
      btn.className = 'kb-btn' + (i === activeIdx ? ' kb-active' : '');
      btn.textContent = src.label;
      btn.setAttribute('data-idx', i);
      menu.appendChild(btn);
    });

    // Frame area
    var frameArea = document.createElement('div');

    function loadFrame(idx) {
      menu.querySelectorAll('.kb-btn').forEach(function (b) {
        b.classList.toggle('kb-active', parseInt(b.getAttribute('data-idx'), 10) === idx);
      });
      frameArea.innerHTML =
        '<div class="kb-frame-wrap"><iframe src="' +
        sources[idx].iframeUrl +
        '" allowfullscreen allow="autoplay; fullscreen"></iframe></div>';
    }

    menu.addEventListener('click', function (e) {
      var btn = e.target.closest('.kb-btn');
      if (!btn) return;
      loadFrame(parseInt(btn.getAttribute('data-idx'), 10));
    });

    wrap.appendChild(menu);
    wrap.appendChild(frameArea);
    container.innerHTML = '';
    container.appendChild(wrap);

    loadFrame(activeIdx);
  }

  function showLoading(container) {
    container.innerHTML = '<div class="kb-loading">⏳ Загрузка источников...</div>';
  }

  function showError(container, msg) {
    container.innerHTML = '<div class="kb-error">⚠️ ' + (msg || 'Не удалось загрузить плеер') + '</div>';
  }

  /* ── Fallback: загружаем через публичный kinobox CDN ── */
  function loadViaCDN(container, options) {
    var kpId = options.search && options.search.kinopoisk;
    if (!kpId) { showError(container, 'Не указан ID Кинопоиска'); return; }

    showLoading(container);

    var script = document.createElement('script');
    var cdnUrl = 'https://widgets.kino.pub/player.js';

    // Если CDN недоступен — рисуем ручные источники
    script.onerror = function () {
      buildFallbackPlayer(container, kpId);
    };

    script.onload = function () {
      if (typeof window._kinopub_player === 'function') {
        window._kinopub_player(container, { kinopoisk: kpId });
      } else {
        buildFallbackPlayer(container, kpId);
      }
    };

    document.head.appendChild(script);
    script.src = cdnUrl;
  }

  function buildFallbackPlayer(container, kpId) {
    injectCSS();

    var available = SOURCES.map(function (s) {
      return {
        id: s.id,
        label: s.label,
        iframeUrl: buildIframeUrl(s, kpId)
      };
    });

    renderPlayer(container, available, 0);
  }

  /* ── MAIN EXPORT ── */
  function kinobox(selector, options) {
    options = options || {};

    var container = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (!container) {
      console.error('[KinoBox] Контейнер не найден:', selector);
      return;
    }

    var kpId = options.search && options.search.kinopoisk;

    if (!kpId) {
      showError(container, 'Укажите ID Кинопоиска в параметрах');
      return;
    }

    injectCSS();
    buildFallbackPlayer(container, kpId);
  }

  return kinobox;
}));
