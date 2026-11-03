// Поиск: нормализация, корпус, синонимы, ранжирование.

import { RESOURCES, CAT_BY_ID } from './data.js';
import { SYNONYMS, TAG_LABELS } from './labels.js';

const STOP = new Set([
  'и', 'в', 'на', 'с', 'для', 'по', 'из', 'к', 'о', 'об', 'у', 'а', 'то', 'же',
  'the', 'a', 'an', 'of', 'for', 'to', 'and', 'or', 'is',
]);

export function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9+#.\s-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokens(str) {
  return normalize(str)
    .split(' ')
    .filter((t) => t && !STOP.has(t));
}

/** Разворачивает запрос в набор поисковых терминов с учётом синонимов. */
export function expand(query) {
  const base = tokens(query);
  if (!base.length) return [];
  const out = new Set();
  for (const t of base) {
    out.add(t);
    const syn = SYNONYMS[t];
    if (syn) for (const s of syn) out.add(normalize(s));
  }
  return [...out];
}

/** Полнотекстовый корпус ресурса: имя, описание, категория, метки. */
function buildCorpus() {
  return RESOURCES.map((r) => {
    const cat = CAT_BY_ID[r.cat];
    const tagText = r.tags.map((t) => TAG_LABELS[t] || t).join(' ');
    // описание категории в корпус не берём: иначе «vpn» находит весь раздел «Приватность»
    const haystack = normalize(
      `${r.name} ${r.desc} ${cat ? cat.title : ''} ${tagText} ${r.url}`
    );
    return {
      res: r,
      name: normalize(r.name),
      desc: normalize(r.desc),
      tags: normalize(tagText),
      cat: cat ? normalize(cat.title) : '',
      host: normalize(hostOf(r.url)),
      haystack,
    };
  });
}

export function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

const CORPUS = buildCorpus();

/**
 * Ищет по корпусу. Возвращает массив { res, score, fields }.
 * Совпадение в имени весит больше, чем в описании или метках.
 */
export function search(query, limit = 30) {
  const terms = expand(query);
  if (!terms.length) return [];

  const hits = [];
  for (const entry of CORPUS) {
    let score = 0;
    const matched = new Set();
    for (const t of terms) {
      let s = 0;
      if (entry.name === t) s += 120;
      else if (wordHit(entry.name, t)) s += 80;
      else if (entry.name.startsWith(t)) s += 60;
      else if (entry.name.includes(t)) s += 40;
      if (entry.tags.includes(t)) s += 22;
      if (entry.cat.includes(t)) s += 16;
      if (entry.host.includes(t)) s += 18;
      if (entry.desc.includes(t)) s += 10;
      if (entry.haystack.includes(t)) s += 4;
      if (s > 0) {
        score += s;
        matched.add(t);
      }
    }
    if (score > 0) {
      hits.push({ res: entry.res, score, fields: matched });
    }
  }

  hits.sort((a, b) => b.score - a.score || a.res.name.localeCompare(b.res.name, 'ru'));
  return hits.slice(0, limit);
}

/** Совпадение по границе слова: «vpn» находит «Proton VPN», но не «IVPN». */
function wordHit(text, term) {
  const i = text.indexOf(term);
  if (i < 0) return false;
  const before = i === 0 ? ' ' : text[i - 1];
  const after = i + term.length >= text.length ? ' ' : text[i + term.length];
  return !/[a-zа-я0-9]/.test(before) && !/[a-zа-я0-9]/.test(after);
}

/**
 * Подсвечивает совпадения в тексте. Возвращает безопасный HTML.
 */
export function highlight(text, terms) {
  const raw = String(text);
  if (!terms || !terms.length) return escapeHtml(raw);
  const norm = normalize(raw);
  const ranges = [];
  for (const t of terms) {
    if (!t) continue;
    let from = 0;
    for (;;) {
      const i = norm.indexOf(t, from);
      if (i < 0) break;
      ranges.push([i, i + t.length]);
      from = i + t.length;
    }
  }
  if (!ranges.length) return escapeHtml(raw);

  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([...r]);
  }

  let out = '';
  let pos = 0;
  for (const [start, end] of merged) {
    out += escapeHtml(raw.slice(pos, start));
    out += '<mark>' + escapeHtml(raw.slice(start, end)) + '</mark>';
    pos = end;
  }
  out += escapeHtml(raw.slice(pos));
  return out;
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
