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
  <button class="btn btn--quiet" type="button" data-copy-url="${escapeHtml(r.url)}">Копировать ссылку</button>
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
