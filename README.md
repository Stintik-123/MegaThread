# MegaThread

Минималистичный каталог бесплатных ресурсов. Вдохновлено [FMHY](https://fmhy.net/).

## Возможности

- Поиск по каталогу
- Фильтры по тегам и ОС
- Избранное в `localStorage` (сохраняется после перезагрузки)
- Кнопка «Предложить» → GitHub Issue с шаблоном
- Нижняя навигация на мобилках

## Структура

```
index.html
css/style.css
js/app.js
js/data.js
```

## Запуск

```bash
npx serve .
```

Или GitHub Pages на ветку `main` / root.

## Добавить ресурс

В `js/data.js`:

```js
{ cat: 'gaming', name: 'Name', desc: 'Описание', url: 'https://...', tags: ['download'], os: ['w'] }
```

ОС: `w` Windows, `m` macOS, `l` Linux, `a` Android, `i` iOS, `any` любая.

## Сменить favicon

В `index.html` замените `link rel="icon"` на свой файл, например:

```html
<link rel="icon" href="favicon.svg">
```

## Лицензия

MIT
