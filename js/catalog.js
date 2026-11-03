// Фильтрация, сортировка и подсчёты каталога.

import { RESOURCES, CATEGORIES, CAT_BY_ID } from './data.js';

/**
 * Фильтрует каталог.
 * tags/os — массивы активных значений (пусто = без ограничения).
 * Пустое значение 'any' означает «любая ОС» и не ограничивает выбор.
 */
export function filterResources({ cat = null, tags = [], os = [] } = {}) {
  const tagSet = new Set(tags);
  const osSet = new Set(os);

  return RESOURCES.filter((r) => {
    if (cat && r.cat !== cat) return false;
    if (tagSet.size) {
      let ok = false;
      for (const t of tagSet) if (r.tags.includes(t)) { ok = true; break; }
      if (!ok) return false;
    }
    if (osSet.size && !matchOs(r, osSet)) return false;
    return true;
  });
}

/**
 * Платформенный фильтр.
 * 'any' в выборе означает «без ограничений»: подходят только ресурсы без привязки к ОС.
 * Любая другая платформа подходит и тем, кто работает на любой ОС.
 */
function matchOs(r, osSet) {
  if (osSet.has('any')) return r.os.includes('any');
  if (r.os.includes('any')) return true;
  for (const o of osSet) if (r.os.includes(o)) return true;
  return false;
}

/** Считает, сколько ресурсов останется при каждом значении фильтра. */
export function tagCounts(base, currentTags = []) {
  const counts = new Map();
  const others = new Set(currentTags.filter((t) => t !== 'all'));
  for (const r of base) {
    if (others.size) {
      let ok = false;
      for (const t of others) if (r.tags.includes(t)) { ok = true; break; }
      if (!ok) continue;
    }
    for (const t of r.tags) counts.set(t, (counts.get(t) || 0) + 1);
  }
  return counts;
}

export function osCounts(base, currentOs = []) {
  const counts = new Map();
  const others = new Set(currentOs.filter((o) => o !== 'any'));
  for (const r of base) {
    if (others.size) {
      let ok = r.os.includes('any');
      if (!ok) {
        for (const o of others) if (r.os.includes(o)) { ok = true; break; }
      }
      if (!ok) continue;
    }
    for (const o of r.os) counts.set(o, (counts.get(o) || 0) + 1);
  }
  return counts;
}

/** Все метки каталога по убыванию частоты. */
export function allTags(list = RESOURCES) {
  const counts = new Map();
  for (const r of list) for (const t of r.tags) counts.set(t, (counts.get(t) || 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ru'))
    .map(([id, n]) => ({ id, n }));
}

/** Все платформы каталога в фиксированном порядке. */
export function allOs(list = RESOURCES) {
  const counts = new Map();
  for (const r of list) for (const o of r.os) counts.set(o, (counts.get(o) || 0) + 1);
  return [...counts.entries()].map(([id, n]) => ({ id, n }));
}

const SORTERS = {
  name: (a, b) => a.name.localeCompare(b.name, 'ru'),
  cat: (a, b) => {
    const d = (CAT_BY_ID[a.cat]?.title || '').localeCompare(CAT_BY_ID[b.cat]?.title || '', 'ru');
    return d || a.name.localeCompare(b.name, 'ru');
  },
  default: (a, b) => {
    const d = CATEGORIES.findIndex((c) => c.id === a.cat) - CATEGORIES.findIndex((c) => c.id === b.cat);
    return d !== 0 ? d : a.name.localeCompare(b.name, 'ru');
  },
};

export function sortResources(list, mode = 'default') {
  const fn = SORTERS[mode] || SORTERS.default;
  return [...list].sort(fn);
}

/** Сколько ресурсов в каждой категории. */
export function categoryCounts(list = RESOURCES) {
  const counts = new Map();
  for (const r of list) counts.set(r.cat, (counts.get(r.cat) || 0) + 1);
  return counts;
}

/** Находит ресурс по имени (без учёта регистра). */
export function findByName(name) {
  const n = String(name || '').trim().toLowerCase();
  return RESOURCES.find((r) => r.name.toLowerCase() === n) || null;
}
