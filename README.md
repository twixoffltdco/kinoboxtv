# 🎬 KinoBox.tv

> Плеер нового поколения для фильмов и сериалов. Быстро, бесплатно, без регистрации.

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/version-3.0.0-green?style=for-the-badge)]()

---

## 🚀 Деплой (один клик)

### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/twixoffltdco/kinoboxtv)

> `vercel.json` уже настроен. После деплоя всё работает.

### Netlify
Подключи репо — `_redirects` обрабатывает роутинг автоматически.

### Apache / cPanel
Загрузи файлы в `public_html`, `.htaccess` уже в корне.

---

## 📌 Как работает роутинг

Сайт использует **hash-роутинг** — он работает на любом хостинге без серверных настроек.

```
kinobox.tv/#/films/301       — фильм Матрица
kinobox.tv/#/serials/77321   — сериал
kinobox.tv/#/faq             — FAQ
kinobox.tv/#/embed           — страница встраивания
kinobox.tv/embed/#301        — чистый embed-плеер
```

При обновлении страницы — всё работает корректно ✅

---

## ⚙️ Встроить плеер на свой сайт

### Способ 1: через kinobox.js

```html
<div id="player"></div>
<script src="https://kinobox.tv/kinobox.js"></script>
<script>
  kinobox('#player', { search: { kinopoisk: 301 } });
</script>
```

### Способ 2: через iframe

```html
<iframe
  src="https://kinobox.tv/embed/#301"
  width="100%"
  height="500"
  frameborder="0"
  allowfullscreen
></iframe>
```

---

## 📂 Структура проекта

```
kinoboxtv/
├── index.html      — главный SPA (hash-роутинг)
├── embed.html      — чистый embed-плеер
├── kinobox.js      — библиотека плеера
├── kinobox.css     — стили для внешнего подключения
├── titlename.js    — получение названий по ID
├── vercel.json     — настройки Vercel
├── _redirects      — настройки Netlify
├── .htaccess       — настройки Apache
├── .gitignore
└── README.md
```

---

## 🌐 Поддерживаемые источники

| Источник | Фильмы | Сериалы |
|---|---|---|
| Collaps | ✅ | ✅ |
| Alloha | ✅ | ✅ |
| HDVB | ✅ | ✅ |
| Kodik | ✅ | ✅ |
| VideoCDN | ✅ | ✅ |
| Bazon | ✅ | ✅ |
| Ashdi | ✅ | ✅ |

---

## 📜 Лицензия

MIT License © 2025 KinoBox.tv
