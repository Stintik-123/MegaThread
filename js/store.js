// Состояние приложения, localStorage и подписки.

import { RESOURCES } from './data.js';

const KEY = 'megathread.v1';

const DEFAULTS = {
  favorites: [],
  recent: [],
  theme: null, // null = как в системе
  sort: 'default',
  lang: null,
};

function readStore() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw);
    return {
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      recent: Array.isArray(parsed.recent) ? parsed.recent : [],
      theme: typeof parsed.theme === 'string' ? parsed.theme : null,
      sort: typeof parsed.sort === 'string' ? parsed.sort : 'default',
      lang: typeof parsed.lang === 'string' ? parsed.lang : null,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

let state = readStore();
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* приватный режим или переполнение — работаем без сохранения */
  }
}

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  for (const fn of listeners) fn(state);
}

/* --------------------------- избранное --------------------------- */

export function isFavorite(name) {
  return state.favorites.includes(name);
}

export function toggleFavorite(name) {
  const i = state.favorites.indexOf(name);
  if (i >= 0) state.favorites.splice(i, 1);
  else state.favorites.unshift(name);
  persist();
  emit();
  return i < 0;
}

export function clearFavorites() {
  state.favorites = [];
  persist();
  emit();
}

export function favoriteResources() {
  return state.favorites
    .map((name) => RESOURCES.find((r) => r.name === name))
    .filter(Boolean);
}

/* --------------------------- недавние --------------------------- */

const RECENT_LIMIT = 12;

export function pushRecent(name) {
  state.recent = [name, ...state.recent.filter((n) => n !== name)].slice(0, RECENT_LIMIT);
  persist();
  emit();
}

export function clearRecent() {
  state.recent = [];
  persist();
  emit();
}

export function recentResources() {
  return state.recent
    .map((name) => RESOURCES.find((r) => r.name === name))
    .filter(Boolean);
}

/* --------------------------- настройки --------------------------- */

export function setTheme(theme) {
  state.theme = theme;
  persist();
  emit();
}

export function setSort(sort) {
  state.sort = sort;
  persist();
  emit();
}
