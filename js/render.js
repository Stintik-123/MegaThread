// Чистые функции разметки. Никаких обращений к DOM-состоянию.

import { icon } from './icons.js';
import { TAG_LABELS, OS_LABELS, RU_LABELS } from './labels.js';
import { CAT_BY_ID } from './data.js';
import { escapeHtml, highlight, hostOf } from './search.js';

export function tagLabel(tag) {
  return TAG_LABELS[tag] || tag;
}

export function osLabel(os) {
  return OS_LABELS[os] || os;
}

/** Метка доступности. */
export function ruLabel(ru) {
  return RU_LABELS[ru] || RU_LABELS.ok;
}

export function ruBadge(ru) {
  const id = ru || 'ok';
  return `<span class="ru ru--${id}" title="Доступность">${escapeHtml(ruLabel(id))}</span>`;
}

/** Строка ресурса в общем списке. */
export function renderResource(r, { fav = false, terms = null } = {}) {
  const cat = CAT_BY_ID[r.cat];
  const name = terms ? highlight(r.name, terms) : escapeHtml(r.name);
  const desc = terms ? highlight(r.desc, terms) : escapeHtml(r.desc);
  const osText = r.os.map(osLabel).join(', ');

  return `
<article class="row" data-name="${escapeHtml(r.name)}">
  <div class="row__main">
    <button class="row__name" type="button" data-open="${escapeHtml(r.name)}">${name}</button>
    <p class="row__desc">${desc}</p>
    <div class="row__meta">
      <span class="row__cat" data-cat="${escapeHtml(r.cat)}">${escapeHtml(cat ? cat.title : '')}</span>
      <span class="row__os">${escapeHtml(osText)}</span>
      ${ruBadge(r.ru)}
    </div>
  </div>
  <div class="row__tags">
    ${r.tags.map((t) => `<span class="tag">${escapeHtml(tagLabel(t))}</span>`).join('')}
  </div>
  <div class="row__actions">
    <button class="ico" type="button" data-fav="${escapeHtml(r.name)}" aria-pressed="${fav}"
      aria-label="${fav ? 'Убрать из избранного' : 'В избранное'}" title="${fav ? 'Убрать из избранного' : 'В избранное'}">${icon('star', 15)}</button>
    <a class="ico" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer"
      aria-label="Открыть ${escapeHtml(r.name)}" title="Открыть ${escapeHtml(r.name)}">${icon('external', 15)}</a>
  </div>
</article>`;
}

/** Строка в результатах поиска. */
export function renderHit(hit, terms) {
  const r = hit.res;
  const cat = CAT_BY_ID[r.cat];
  return `
<div class="hit" data-name="${escapeHtml(r.name)}" role="option" aria-selected="false">
  <div class="hit__text">
    <b>${highlight(r.name, terms)}</b>
    <small>${highlight(r.desc, terms)}</small>
    <small class="hit__cat">${escapeHtml(cat ? cat.title : '')}</small>
  </div>
</div>`;
}

/** Строка категории. */
export function renderCategory(cat, count) {
  return `
<button class="catline" type="button" data-cat="${escapeHtml(cat.id)}">
  <span class="catline__icon">${icon(cat.icon, 18)}</span>
  <span class="catline__text">
    <b>${escapeHtml(cat.title)}</b>
    <span>${escapeHtml(cat.desc)}</span>
  </span>
  <span class="catline__count">${count}</span>
</button>`;
}

/** Пустое состояние. */
export function renderEmpty(title, hint) {
  return `
<div class="empty">
  <b>${escapeHtml(title)}</b>
  <span>${escapeHtml(hint)}</span>
</div>`;
}

/** Кнопка-фильтр. */
export function renderChip(id, label, count, active) {
  return `
<button class="chip${active ? ' is-active' : ''}" type="button" data-filter="tag" data-value="${escapeHtml(id)}"
  aria-pressed="${active}">${escapeHtml(label)}<span class="chip__count">${count}</span></button>`;
}

export function renderOsChip(id, label, count, active) {
  return `
<button class="chip${active ? ' is-active' : ''}" type="button" data-filter="os" data-value="${escapeHtml(id)}"
  aria-pressed="${active}">${escapeHtml(label)}<span class="chip__count">${count}</span></button>`;
}

/** Диалог с подробностями ресурса. */
export function renderResourceDialog(r, fav) {
  const cat = CAT_BY_ID[r.cat];
  const osText = r.os.map(osLabel).join(', ');
  const ru = r.ru || 'ok';
  const shot = 'previews/' + previewFile(r.url);
  return `
<div class="modal__shot">
  <img src="${shot}" alt="Скриншот сайта ${escapeHtml(r.name)}" loading="lazy" data-shot>
  <span class="modal__shotfail" hidden>Превью недоступно</span>
</div>
<div class="modal__head">
  <div class="modal__headtext">
    <h2 class="modal__title" id="res-dialog-title">${escapeHtml(r.name)}</h2>
    <p class="modal__cat">${escapeHtml(cat ? cat.title : '')}</p>
  </div>
  <button class="icon-btn" type="button" data-close-res aria-label="Закрыть">
    ${icon('x', 15)}
  </button>
</div>
<p class="modal__desc">${escapeHtml(r.desc)}</p>
<div class="modal__meta">
  ${ruBadge(ru)}
  ${r.tags.map((t) => `<span class="tag">${escapeHtml(tagLabel(t))}</span>`).join('')}
  <span class="tag tag--os">${escapeHtml(osText)}</span>
</div>
${r.note ? `<div class="modal__note modal__note--ru"><b>${escapeHtml(ruLabel(ru))}</b><span>${escapeHtml(r.note)}</span></div>` : ''}
<p class="modal__url">${escapeHtml(r.url)}</p>
<div class="modal__actions">
  <a class="btn btn--primary" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">Открыть сайт</a>
  <button class="btn btn--quiet${fav ? ' is-star' : ''}" type="button" data-fav="${escapeHtml(r.name)}">
    ${fav ? 'В избранном' : 'В избранное'}
  </button>
  <button class="btn btn--quiet" type="button" data-copy-url="${escapeHtml(r.url)}">Скопировать ссылку</button>
</div>`;
}

/** Имя файла превью: домен в kebab-case. */
export function previewFile(url) {
  const host = hostOf(url).toLowerCase();
  return host.replace(/[^a-z0-9]/g, '-') + '.jpg';
}

/** Карточка подборки. */
export function renderCollection(col, items) {
  return `
<article class="colcard" data-collection="${escapeHtml(col.id)}">
  <div class="colcard__head">
    <h3>${escapeHtml(col.title)}</h3>
    <p>${escapeHtml(col.desc)}</p>
  </div>
  <ul class="colcard__list">
    ${items
      .map(
        (r) => `<li>
      <button type="button" data-open="${escapeHtml(r.name)}">${escapeHtml(r.name)}</button>
      <span class="colcard__tag tag--${r.ru || 'ok'}">${escapeHtml(ruLabel(r.ru))}</span>
    </li>`
      )
      .join('')}
  </ul>
  <button class="btn btn--quiet colcard__more" type="button" data-collection-open="${escapeHtml(col.id)}">
    Показать все
  </button>
</article>`;
}

/** Облако меток. */
export function renderTagCloud(tags) {
  const max = tags.reduce((m, t) => Math.max(m, t.n), 1);
  return tags
    .map((t) => {
      const size = 12 + Math.round((t.n / max) * 8);
      return `<button class="tagcloud__item" type="button" data-tag-page="${escapeHtml(t.id)}"
        style="font-size:${size}px">${escapeHtml(tagLabel(t.id))}<span>${t.n}</span></button>`;
    })
    .join('');
}

/** Легенда статусов доступности. */
export function renderRuLegend(entries) {
  return entries
    .map(
      (e) => `<li><span class="ru ru--${e.id}">${escapeHtml(e.label)}</span>
      <span>${escapeHtml(e.hint)}</span></li>`
    )
    .join('');
}

/** Таблица горячих клавиш. */
export function renderShortcuts(list) {
  return `
<dl class="shortcuts">
  ${list.map((s) => `<div class="shortcuts__row"><dt>${escapeHtml(s.keys)}</dt><dd>${escapeHtml(s.desc)}</dd></div>`).join('')}
</dl>`;
}

/** Полоса фактов: только измеренные числа. */
export function renderFacts(facts) {
  return facts
    .map((f) => `<div class="fact"><b>${escapeHtml(f.value)}</b><span>${escapeHtml(f.label)}</span></div>`)
    .join('');
}

/* =====================================================================
   НОВЫЙ СЛОЙ: сайдбар, плитка разделов, «докс»-списки и палитра поиска
   ===================================================================== */

/** Цвета категорий: 13 различимых оттенков, пригодных под белую иконку. */
export const CAT_COLORS = {
  media: '#1f8fb3',
  games: '#7c5cff',
  software: '#e0653b',
  privacy: '#2f9e44',
  bypass: '#c2255c',
  ai: '#0c8599',
  music: '#8a6d3b',
  books: '#5f3dc4',
  torrents: '#d9480f',
  mobile: '#1971c2',
  learning: '#0b7285',
  tools: '#2b8a3e',
  downloads: '#b35309',
};

/** Цвет категории по id. */
export function catColor(catId) {
  return CAT_COLORS[catId] || '#5f3dc4';
}

/** Число ресурсов из карты или объекта счётчиков. */
function countOf(counts, id) {
  if (!counts) return 0;
  if (typeof counts.get === 'function') return counts.get(id) || 0;
  return counts[id] || 0;
}

/**
 * Пункты меню сайдбара.
 * @param {Array} cats — категории каталога
 * @param {Map|Object} counts — количество ресурсов по id категории
 * @param {string} activeCat — id активной категории (для класса is-active)
 */
export function renderSidebarCats(cats, counts, activeCat = null) {
  return (cats || [])
    .map(
      (cat) => `<a class="sidenav__link${cat.id === activeCat ? ' is-active' : ''}" href="#/cat/${escapeHtml(cat.id)}">
  <span class="sidenav__icon">${icon(cat.icon, 18)}</span>
  <span class="sidenav__text">${escapeHtml(cat.title)}</span>
  <span class="sidenav__count">${countOf(counts, cat.id)}</span>
</a>`
    )
    .join('');
}

/** Карточка раздела в плитке на главной. */
export function renderCatCard(cat, count) {
  const color = catColor(cat.id);
  return `
<a class="catcard" href="#/cat/${escapeHtml(cat.id)}" style="--cat-color:${color}">
  <span class="catcard__icon">${icon(cat.icon, 20)}</span>
  <span class="catcard__body"><b class="catcard__title">${escapeHtml(cat.title)}</b><span class="catcard__desc">${escapeHtml(cat.desc)}</span></span>
  <span class="catcard__count">${count}</span>
</a>`;
}

/**
 * «Докс»-список страницы раздела.
 * @param {Array} groups — [{ id, title, desc, items }]
 */
export function renderDocGroups(groups) {
  return (groups || [])
    .filter((g) => g && g.items && g.items.length)
    .map((g) => {
      const id = escapeHtml(g.id);
      const desc = g.desc ? `<p class="docgroup__desc">${escapeHtml(g.desc)}</p>` : '';
      const items = g.items.map((r) => renderDocItem(r)).join('');
      return `
<section class="docgroup" id="grp-${id}">
  <h2 class="docgroup__title">${escapeHtml(g.title)} <span class="docgroup__count">${g.items.length}</span></h2>
  ${desc}
  <ul class="docitems">
    ${items}
  </ul>
</section>`;
    })
    .join('');
}

/** Один ресурс в «докс»-списке. */
function renderDocItem(r) {
  const name = escapeHtml(r.name);
  // Метки берём только те, для которых есть человекочитаемая подпись.
  const tags = (r.tags || []).filter((t) => TAG_LABELS[t]).slice(0, 3);
  const tagHtml = tags.map((t) => `<span class="tag">${escapeHtml(tagLabel(t))}</span>`).join('');
  const note = r.note ? ` <em class="docitem__note">${escapeHtml(r.note)}</em>` : '';

  return `
    <li class="docitem" data-name="${name}">
      <div class="docitem__main">
        <button class="docitem__name" type="button" data-open="${name}">${name}</button>
        <span class="docitem__desc">${escapeHtml(r.desc)}${note}</span>
      </div>
      <div class="docitem__meta">${ruBadge(r.ru)}${tagHtml}</div>
      <div class="docitem__actions">
        <button class="ico" type="button" data-fav="${name}" aria-pressed="false" aria-label="В избранное" title="В избранное">${icon('star', 15)}</button>
        <a class="ico" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer" aria-label="Открыть ${name}" title="Открыть ${name}">${icon('external', 15)}</a>
      </div>
    </li>`;
}

/**
 * Результаты палитры поиска.
 * @param {Array} items — массив ресурсов или объектов { res }
 */
export function renderPaletteItems(items) {
  const list = items || [];
  if (!list.length) {
    return `<div class="palette__empty">Ничего не найдено. Попробуйте другой запрос.</div>`;
  }
  return list
    .map((item, i) => {
      const r = item && item.res ? item.res : item;
      if (!r) return '';
      const cat = CAT_BY_ID[r.cat];
      return `
<div class="palette__item" role="option" aria-selected="false" data-name="${escapeHtml(r.name)}" data-index="${i}">
  <span class="palette__item-icon">${icon(cat ? cat.icon : 'app', 18)}</span>
  <span class="palette__item-text"><b>${escapeHtml(r.name)}</b><small>${escapeHtml(r.desc)}</small></span>
  <span class="palette__item-cat">${escapeHtml(cat ? cat.title : '')}</span>
</div>`;
    })
    .join('');
}
