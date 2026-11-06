// Подборки: готовые наборы пиратских ресурсов под конкретные задачи.
// Каждая подборка — это фильтр над каталогом, а не ручной список,
// поэтому новые ресурсы попадают в подборки сами.

import { RESOURCES, CATEGORIES } from './data.js';

export const COLLECTIONS = [
  {
    id: 'trackers',
    title: 'Трекеры и индексы',
    desc: 'Где искать раздачи: трекеры, индексы и поисковики',
    rule: { cat: ['torrents'] },
    limit: 12,
  },
  {
    id: 'novpn',
    title: 'Открывается напрямую',
    desc: 'Ссылки, которые работают без обходных инструментов',
    rule: { ru: ['ok'] },
    limit: 12,
  },
  {
    id: 'bypass',
    title: 'Обход блокировок',
    desc: 'VPN, конфиги и инструменты против DPI',
    rule: { cat: ['bypass'] },
    limit: 12,
  },
  {
    id: 'streaming',
    title: 'Смотреть онлайн',
    desc: 'Кино, сериалы и аниме без загрузки',
    rule: { cat: ['streaming', 'anime'] },
    limit: 12,
  },
  {
    id: 'books',
    title: 'Книги и аудиокниги',
    desc: 'Библиотеки, зеркала и статьи',
    rule: { cat: ['books'] },
    limit: 12,
  },
  {
    id: 'games',
    title: 'Игры и репаки',
    desc: 'Готовые сборки, ROM и эмуляторы',
    rule: { cat: ['games'] },
    limit: 12,
  },
  {
    id: 'music',
    title: 'Музыка',
    desc: 'Альбомы, рипы и радио',
    rule: { cat: ['music'] },
    limit: 12,
  },
  {
    id: 'tools',
    title: 'Инструменты',
    desc: 'Клиенты, архиваторы и загрузчики',
    rule: { cat: ['tools'] },
    limit: 12,
  },
  {
    id: 'downloads',
    title: 'Файлообменники',
    desc: 'Временные ссылки на большие файлы',
    rule: { cat: ['downloads'] },
    limit: 12,
  },
  {
    id: 'mirrors',
    title: 'Нужно зеркало',
    desc: 'Домены, которые регулярно меняются',
    rule: { ru: ['mirror', 'blocked'] },
    limit: 12,
  },
];

/** Отбирает ресурсы подборки по её правилу. */
export function collectionItems(col) {
  const r = col.rule || {};
  let list = RESOURCES;

  if (r.cat) list = list.filter((x) => r.cat.includes(x.cat));
  if (r.ru) list = list.filter((x) => r.ru.includes(x.ru || 'ok'));
  if (r.tags) {
    list = list.filter((x) => r.tags.some((t) => x.tags.includes(t)));
  }

  // приоритет: сначала то, что работает, потом популярные разделы
  const weight = (x) => {
    let w = 0;
    if ((x.ru || 'ok') === 'ok') w += 3;
    if (x.tags.includes('русский')) w += 1;
    if (x.tags.includes('бесплатно')) w += 1;
    return w;
  };
  return [...list]
    .sort((a, b) => weight(b) - weight(a) || a.name.localeCompare(b.name, 'ru'))
    .slice(0, col.limit || 12);
}

/** Сколько всего ресурсов попадает в подборку (без ограничения limit). */
export function collectionTotal(col) {
  const r = col.rule || {};
  let list = RESOURCES;
  if (r.cat) list = list.filter((x) => r.cat.includes(x.cat));
  if (r.ru) list = list.filter((x) => r.ru.includes(x.ru || 'ok'));
  if (r.tags) list = list.filter((x) => r.tags.some((t) => x.tags.includes(t)));
  return list.length;
}

/** Иконка для подборки — по её id. */
export const COLLECTION_ICONS = {
  trackers: 'download',
  novpn: 'shield',
  bypass: 'shield',
  streaming: 'film',
  books: 'book',
  games: 'gamepad',
  music: 'music',
  tools: 'tool',
  downloads: 'download',
  mirrors: 'search',
};

export const CATEGORY_COUNT = CATEGORIES.length;
