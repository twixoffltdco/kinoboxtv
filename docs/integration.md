# 📘 Документация по интеграции KinoBox

## Быстрый старт

Вставьте следующий код на любую страницу:

```html
<!-- Подключите стили -->
<link rel="stylesheet" href="https://kinobox.tv/kinobox.css">

<!-- Контейнер для плеера -->
<div id="myPlayer"></div>

<!-- jQuery (если не подключён) -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- KinoBox скрипт -->
<script src="https://kinobox.tv/kinobox.js"></script>

<script>
  kinobox('#myPlayer', {
    search: { kinopoisk: 301234 }
  });
</script>
```

---

## Параметры kinobox()

```javascript
kinobox(selector, options)
```

| Параметр | Тип | Описание |
|---|---|---|
| `selector` | `string` | CSS-селектор контейнера |
| `options.search.kinopoisk` | `number` | ID Кинопоиска |
| `options.search.imdb` | `string` | IMDB ID (`tt0111161`) |
| `options.search.title` | `string` | Название для поиска |
| `options.search.year` | `number` | Год (уточнение) |

---

## Примеры

### Фильм по ID Кинопоиска

```javascript
kinobox('#player', {
  search: { kinopoisk: 435 }
});
```

### Сериал по ID

```javascript
kinobox('#player', {
  search: { kinopoisk: 77321 }
});
```

### По названию и году

```javascript
kinobox('#player', {
  search: { title: 'Матрица', year: 1999 }
});
```

---

## Маршруты URL

```
/films/{id}    — воспроизведение фильма
/serials/{id}  — воспроизведение сериала
```

Пример: `kinobox.tv/films/301234`

---

## Встраивание через iframe

```html
<iframe
  src="https://kinobox.tv/films/301234"
  width="100%"
  height="500"
  frameborder="0"
  allowfullscreen
></iframe>
```

---

## Локальный запуск

```bash
git clone https://github.com/your-username/kinobox.git
cd kinobox
python3 -m http.server 8080
# → http://localhost:8080
```

---

## Зависимости

- [jQuery 3.6+](https://jquery.com/)
- Браузер с поддержкой ES5+
- Нет npm/webpack/babel — чистый HTML/CSS/JS
