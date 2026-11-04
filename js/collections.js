// Подборки: готовые наборы ресурсов под конкретные задачи.
// Каждая подборка — это фильтр над каталогом, а не ручной список,
// поэтому новые ресурсы попадают в подборки сами.

import { RESOURCES, CATEGORIES } from './data.js';

export const COLLECTIONS = [
  {
    id: 'novpn',
    title: 'Без обхода блокировок',
    desc: 'Открывается напрямую, без обходных инструментов',
    rule: { ru: ['ok'] },
    limit: 12,
  },
  {
    id: 'bypass',
    title: 'Обход блокировок',
    desc: 'VPN, конфиги и клиенты для обхода блокировок',
    rule: { cat: ['bypass'] },
    limit: 12,
  },
  {
    id: 'free',
    title: 'Бесплатно и легально',
    desc: 'Свободный контент, open-source и бесплатные тарифы',
    rule: { tags: ['легально'] },
    limit: 12,
  },
  {
    id: 'russian',
    title: 'На русском',
    desc: 'Интерфейс, документация и контент на русском языке',
    rule: { tags: ['русский'] },
    limit: 12,
  },
  {
    id: 'movies',
    title: 'Кино и сериалы',
    desc: 'Где смотреть и где искать раздачи',
    rule: { cat: ['media'] },
    limit: 12,
  },
  {
    id: 'ai',
    title: 'ИИ без подписки',
    desc: 'Чаты и генераторы, которые открываются напрямую',
    rule: { cat: ['ai'], ru: ['ok', 'limited'] },
    limit: 12,
  },
  {
    id: 'android',
    title: 'Вместо Google Play',
    desc: 'Магазины приложений, когда Play недоступен',
    rule: { cat: ['mobile'] },
    limit: 12,
  },
  {
    id: 'torrents',
    title: 'Торренты',
    desc: 'Клиенты, трекеры и индексы раздач',
    rule: { cat: ['torrents'] },
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

  // приоритет: сначала то, что работает, потом популярные категории
  const weight = (x) => {
    let w = 0;
    if ((x.ru || 'ok') === 'ok') w += 3;
    if (x.tags.includes('бесплатно')) w += 1;
    if (x.tags.includes('русский')) w += 1;
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
  novpn: 'shield',
  bypass: 'shield',
  free: 'check',
  russian: 'book',
  movies: 'film',
  ai: 'spark',
  android: 'phone',
  torrents: 'download',
};

export const CATEGORY_COUNT = CATEGORIES.length;
