/*!
 * titlename.js — KinoBox.tv
 * Утилита для получения названия фильма/сериала по ID Кинопоиска
 */

(function (global) {
  'use strict';

  /**
   * Пытается получить название через публичные API.
   * @param {number} kinopoiskId
   * @param {function} callback — function(title, year)
   */
  function getTitleByKpId(kinopoiskId, callback) {
    if (!kinopoiskId || !callback) return;

    // Попытка 1: Кинопоиск unofficial API (без ключа, публичный)
    fetch('https://kinopoiskapiunofficial.tech/api/v2.2/films/' + kinopoiskId, {
      headers: { 'X-API-KEY': 'undefined' }  // Попытка без ключа
    })
    .then(function (r) {
      if (!r.ok) throw new Error('no_kp');
      return r.json();
    })
    .then(function (data) {
      var title = data.nameRu || data.nameEn || data.nameOriginal || '';
      var year  = data.year || '';
      if (title) { callback(title, year); return; }
      throw new Error('no_title');
    })
    .catch(function () {
      // Попытка 2: kinobd.net публичный API
      fetch('https://api.kinobd.net/api/titles?kp=' + kinopoiskId)
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (data) {
          if (data && (data.ru || data.en)) {
            callback(data.ru || data.en, data.year || '');
          }
        })
        .catch(function () { /* тихо */ });
    });
  }

  /**
   * Обновляет <title> и заголовок плеера по ID.
   * @param {number} kinopoiskId
   */
  function updatePageTitle(kinopoiskId) {
    if (!kinopoiskId) return;
    getTitleByKpId(kinopoiskId, function (title, year) {
      var full = title + (year ? ' (' + year + ')' : '') + ' — KinoBox';
      document.title = full;

      var h2 = document.querySelector('#playerTitle');
      if (h2) {
        h2.textContent = '🎥 ' + title + (year ? ' (' + year + ')' : '');
      }
    });
  }

  // Экспорт
  global.kinoboxTitleName = {
    get:    getTitleByKpId,
    update: updatePageTitle
  };

})(typeof window !== 'undefined' ? window : this);
