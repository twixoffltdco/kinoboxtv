# 🎬 KinoBox.tv

> Плеер нового поколения для фильмов и сериалов. Быстро, бесплатно, без регистрации.

![KinoBox](https://img.shields.io/badge/KinoBox-ff6b35?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xOCA0bDIgNEg0bDItNGgxMnpNMiA2djE0aDE2VjZIMnptOCA3bDQgMi41TDEwIDE4VjEzeiIvPjwvc3ZnPg==)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-2.0.0-green?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML-78%25-orange?style=for-the-badge)
![CSS](https://img.shields.io/badge/CSS-14%25-blue?style=for-the-badge)
![JS](https://img.shields.io/badge/JS-8%25-yellow?style=for-the-badge)

---

## 📖 О проекте

**KinoBox.tv** — открытый веб-плеер, который позволяет смотреть фильмы и сериалы онлайн через ID Кинопоиска. Плеер автоматически перебирает доступные источники (Collaps, Alloha, Kodik и др.) и загружает первый рабочий.

### Возможности

- 🔗 **Простые URL** — `/films/1234567` или `/serials/1234567`
- 📱 **Адаптивный дизайн** — работает на телефоне, планшете и ПК
- 🎯 **Множество источников** — Collaps, Alloha, Kodik, HDVB, VideoCDN и другие
- 🌐 **Geo-фильтрация** — автоматический выбор источника по региону
- 🚫 **Без регистрации** — открыл и смотришь
- 📘 **Встраиваемый** — плеер можно добавить на любой сайт

---

## 🚀 Быстрый старт

### Онлайн
Просто перейдите по ссылке:
```
https://kinobox.tv/films/301234
https://kinobox.tv/serials/77321
```

### Локально

```bash
# Клонировать репозиторий
git clone https://github.com/your-username/kinobox.git
cd kinobox

# Запустить через Python
python3 -m http.server 8080

# Открыть в браузере
# → http://localhost:8080/films/301234
```

> ⚠️ Открывать `index.html` напрямую через `file://` не рекомендуется — используйте локальный сервер.

---

## 📂 Структура проекта

```
kinobox/
├── index.html        — главная страница (плеер + все разделы)
├── kinobox.css       — стили
├── kinobox.js        — логика плеера
├── titlename.js      — получение названия фильма по ID
├── app.js            — роутинг и навигация
├── docs/
│   ├── faq.md        — часто задаваемые вопросы
│   ├── terms.md      — условия использования
│   ├── privacy.md    — политика конфиденциальности
│   └── integration.md— гайд по интеграции
├── .github/
│   ├── ISSUE_TEMPLATE.md
│   └── CONTRIBUTING.md
└── README.md
```

---

## ⚙️ Интеграция на свой сайт

```html
<!-- Стили -->
<link rel="stylesheet" href="https://kinobox.tv/kinobox.css">

<!-- Контейнер -->
<div id="myPlayer"></div>

<!-- Скрипты -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://kinobox.tv/kinobox.js"></script>

<script>
  kinobox('#myPlayer', {
    search: { kinopoisk: 301234 }
  });
</script>
```

### Параметры

| Параметр | Тип | Описание |
|---|---|---|
| `search.kinopoisk` | `number` | ID фильма/сериала на Кинопоиске |
| `search.imdb` | `string` | IMDB ID (например, `tt0111161`) |
| `search.title` | `string` | Название для поиска |
| `search.year` | `number` | Год (уточнение поиска) |

---

## 🌐 Поддерживаемые источники

| Источник | Фильмы | Сериалы |
|---|---|---|
| Collaps | ✅ | ✅ |
| Alloha | ✅ | ✅ |
| Kodik | ✅ | ✅ |
| HDVB | ✅ | ✅ |
| VideoCDN | ✅ | ✅ |
| Bazon | ✅ | ✅ |

---

## 📄 Страницы

| Страница | Путь |
|---|---|
| Плеер | `/#player` или `/films/ID` |
| FAQ | `/#faq` |
| Документация | `/#docs` |
| Условия использования | `/#terms` |
| Политика конфиденциальности | `/#privacy` |
| О сайте | `/#about` |

---

## 🤝 Вклад в проект

Pull request'ы приветствуются! Для крупных изменений сначала откройте Issue.

1. Fork репозитория
2. Создайте ветку: `git checkout -b feature/my-feature`
3. Зафиксируйте изменения: `git commit -m 'Add my feature'`
4. Запушьте: `git push origin feature/my-feature`
5. Откройте Pull Request

---

## 📜 Лицензия

MIT License © 2025 KinoBox.tv

---

**KinoBox.tv — Смотри кино и сериалы онлайн.** Сделано с ❤️
