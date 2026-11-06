// Точка входа: события, экраны, инициализация.

import { RESOURCES, CATEGORIES, CAT_BY_ID } from './data.js';
import { icon } from './icons.js';
import { TAG_LABELS, OS_LABELS, SORT_OPTIONS, SHORTCUTS, RU_LABELS, RU_HINTS } from './labels.js';
import * as store from './store.js';
import * as search from './search.js';
import * as catalog from './catalog.js';
import * as render from './render.js';
import { groupResources } from './groups.js';
import { COLLECTIONS, collectionItems, collectionTotal } from './collections.js';
import { parseHash, buildHash, navigate, readFilters, writeFilters } from './router.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const PAGE_SIZE = 48;
const TAGS_PREVIEW = 10;
const PALETTE_LIMIT = 20;

const el = {
  views: {
    home: $('#view-home'),
    catalog: $('#view-catalog'),
    category: $('#view-category'),
    favorites: $('#view-favorites'),
    collections: $('#view-collections'),
    tags: $('#view-tags'),
    search: $('#view-search'),
    about: $('#view-about'),
    rules: $('#view-rules'),
  },
  facts: $('#facts'),
  catGrid: $('#cat-grid'),
  sidebarCats: $('#sidebar-cats'),
  heroBadge: $('#hero-badge'),
  allList: $('#all-list'),
  allTags: $('#all-tags'),
  allOs: $('#all-os'),
  allCount: $('#all-count'),
  moreBtn: $('#more-btn'),
  sortSelect: $('#sort-select'),
  catList: $('#cat-list'),
  catTags: $('#cat-tags'),
  catOs: $('#cat-os'),
  catTitle: $('#cat-title'),
  catDesc: $('#cat-desc'),
  catCount: $('#cat-count'),
  catIcon: $('#cat-icon'),
  favList: $('#fav-list'),
  favCount: $('#fav-count'),
  favBadge: $('#fav-badge'),
  favActions: $('#fav-actions'),
  recentBlock: $('#recent-block'),
  startGrid: $('#start-grid'),
  novpnGrid: $('#novpn-grid'),
  collections: $('#collections'),
  collectionsPage: $('#collections-page'),
  colCount: $('#col-count'),
  tagcloud: $('#tagcloud'),
  tagsCount: $('#tags-count'),
  searchTitle: $('#search-title'),
  searchCount: $('#search-count'),
  searchList: $('#search-list'),
  ruLegend: $('#ru-legend'),
  toast: $('#toast'),
  live: $('#live-status'),
  themeToggle: $('#theme-toggle'),
  helpDialog: $('#help-dialog'),
  helpBody: $('#help-dialog-body'),
  resDialog: $('#res-dialog'),
  resDialogBody: $('#res-dialog-body'),
  header: $('#header'),
  toTop: $('#to-top'),
  burger: $('#burger'),
  sidebar: $('#sidebar'),
  nav: $('.nav'),
  installBtn: $('#install-btn'),
  offlineNotice: $('#offline-notice'),
  palette: $('#palette'),
  paletteInput: $('#palette-input'),
  paletteResults: $('#palette-results'),
  searchOpen: $('#search-open'),
  searchOpenHero: $('#search-open-hero'),
};

/** Текущее состояние вида. */
const state = {
  filters: { tags: [], os: [] },
  catFilters: { tags: [], os: [] },
  allShown: PAGE_SIZE,
  catShown: PAGE_SIZE,
  hits: [],
  hitIndex: -1,
  view: 'home',
  catId: null,
  tagsExpanded: { all: false, cat: false },
};

/* ============================ тосты ============================ */

let toastTimer = null;
function toast(message) {
  if (!el.toast) return;
  el.toast.textContent = message;
  el.toast.classList.add('is-shown');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove('is-shown'), 2400);
}

function announce(message) {
  if (el.live) el.live.textContent = message;
}

/* ============================ тема ============================ */

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light' || theme === 'dark') {
    root.setAttribute('data-theme', theme);
  } else {
    root.removeAttribute('data-theme');
  }
  const meta = $('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#ffffff' : '#15171c');
}

function initTheme() {
  const saved = store.getState().theme;
  applyTheme(saved);
  el.themeToggle.addEventListener('click', () => {
    const current = store.getState().theme;
    const systemDark = !window.matchMedia('(prefers-color-scheme: light)').matches;
    const effective = current || (systemDark ? 'dark' : 'light');
    const next = effective === 'dark' ? 'light' : 'dark';
    store.setTheme(next);
    applyTheme(next);
    toast(next === 'dark' ? 'Тёмная тема' : 'Светлая тема');
  });
}

/* ============================ виды ============================ */

function showView(name) {
  for (const [key, node] of Object.entries(el.views)) {
    if (node) node.classList.toggle('is-active', key === name);
  }
  const hrefFor = {
    home: '#/',
    catalog: '#/catalog',
    favorites: '#/favorites',
    collections: '#/collections',
    tags: '#/tags',
    about: '#/about',
    rules: '#/rules',
    search: '#/search',
  };
  $$('.nav__link[data-link]').forEach((a) => {
    a.classList.toggle('is-active', a.getAttribute('href') === hrefFor[name]);
  });
  $$('.sidenav__link').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href) return;
    const active =
      (name === 'category' && href.startsWith('#/cat/') && href === `#/cat/${state.catId}`) ||
      href === hrefFor[name];
    a.classList.toggle('is-active', Boolean(active));
  });
  state.view = name;
  document.title = titleFor(name);
  closeSidebar();
}

function titleFor(name) {
  switch (name) {
    case 'catalog': return 'Весь каталог — MegaThread';
    case 'favorites': return 'Избранное — MegaThread';
    case 'collections': return 'Подборки — MegaThread';
    case 'tags': return 'Метки — MegaThread';
    case 'about': return 'О проекте — MegaThread';
    case 'rules': return 'Правила — MegaThread';
    case 'search': return 'Поиск — MegaThread';
    case 'category': return 'Категория — MegaThread';
    default: return 'MegaThread — бесплатные ресурсы интернета в одном каталоге';
  }
}

/* ============================ главный вид ============================ */

function renderFacts() {
  const tagCount = catalog.allTags().length;
  const working = RESOURCES.filter((r) => (r.ru || 'ok') === 'ok').length;
  el.facts.innerHTML = render.renderFacts([
    { value: String(RESOURCES.length), label: 'ресурсов в каталоге' },
    { value: String(CATEGORIES.length), label: 'разделов' },
    { value: String(working), label: 'открываются напрямую' },
    { value: String(tagCount), label: 'меток' },
  ]);
  if (el.heroBadge) {
    el.heroBadge.textContent = `${RESOURCES.length} ресурсов · ${CATEGORIES.length} разделов`;
  }
}

const START_PICKS = [
  'AmneziaVPN', 'RuStore', 'yt-dlp', 'Смотрим', 'Lampa',
  'uBlock Origin', 'Anna’s Archive: зеркала', 'Stepik', 'AdGuard DNS', 'TorrentSearch',
];

function renderStartPicks() {
  const picks = START_PICKS.map((n) => RESOURCES.find((r) => r.name === n)).filter(Boolean);
  el.startGrid.innerHTML = picks
    .map(
      (r) => `
<div class="pick">
  <span class="pick__icon">${icon(CAT_BY_ID[r.cat] ? CAT_BY_ID[r.cat].icon : 'app', 18)}</span>
  <span class="pick__body">
    <button class="pick__name" type="button" data-open="${r.name.replace(/"/g, '&quot;')}">${r.name}</button>
    <span class="pick__why">${r.desc}</span>
  </span>
</div>`
    )
    .join('');
}

function renderCategories() {
  const counts = catalog.categoryCounts();
  el.catGrid.innerHTML = CATEGORIES.map((c) => render.renderCatCard(c, counts.get(c.id) || 0)).join('');
}

/** Боковое меню с разделами. */
function renderSidebar() {
  const counts = catalog.categoryCounts();
  el.sidebarCats.innerHTML = render.renderSidebarCats(CATEGORIES, counts);
}

/** Ресурсы, которые открываются напрямую, без обходных инструментов. */
function renderNoVpn() {
  const list = RESOURCES.filter((r) => (r.ru || 'ok') === 'ok').slice(0, 9);
  el.novpnGrid.innerHTML = list
    .map(
      (r) => `
<button class="novpn" type="button" data-open="${r.name.replace(/"/g, '&quot;')}">
  <span class="novpn__icon">${icon(CAT_BY_ID[r.cat] ? CAT_BY_ID[r.cat].icon : 'app', 16)}</span>
  <span class="novpn__body">
    <span class="novpn__name">${r.name}</span>
    <span class="novpn__desc">${r.desc}</span>
  </span>
</button>`
    )
    .join('');
}

function renderRecent() {
  const list = store.recentResources();
  if (!list.length) {
    el.recentBlock.hidden = true;
    el.recentBlock.innerHTML = '';
    return;
  }
  el.recentBlock.hidden = false;
  el.recentBlock.innerHTML = `
<div class="section__head">
  <h2>Недавние</h2>
  <button class="link-btn" type="button" data-clear-recent>очистить</button>
</div>
<div class="recent">
  ${list
    .map(
      (r) => `
<button class="recent__item" type="button" data-open="${r.name.replace(/"/g, '&quot;')}">
    <span class="recent__name">${r.name}</span>
    <span class="recent__desc">${r.desc}</span>
  </button>`
    )
    .join('')}
</div>`;
}

/* ============================ весь каталог ============================ */

function renderAll() {
  const list = catalog.sortResources(
    catalog.filterResources({ tags: state.filters.tags, os: state.filters.os }),
    store.getState().sort
  );

  el.allCount.textContent = String(list.length);
  el.allList.innerHTML = list.length
    ? list.slice(0, state.allShown).map((r) => render.renderResource(r, { fav: store.isFavorite(r.name) })).join('')
    : render.renderEmpty('Ничего не найдено', 'Сбросьте фильтры или уточните запрос.');

  el.moreBtn.hidden = list.length <= state.allShown;
  el.moreBtn.textContent = 'показать ещё ' + Math.min(PAGE_SIZE, list.length - state.allShown);

  renderFilterBar(el.allTags, el.allOs, state.filters, list, 'all');
}

function renderFilterBar(tagsEl, osEl, filters, base, barKey) {
  const tCounts = catalog.tagCounts(base, filters.tags);
  const oCounts = catalog.osCounts(base, filters.os);

  const tags = catalog.allTags(base);
  const expanded = state.tagsExpanded[barKey];
  const visible = expanded ? tags : tags.slice(0, TAGS_PREVIEW);

  tagsEl.innerHTML =
    visible
      .map((t) => render.renderChip(t.id, render.tagLabel(t.id), tCounts.get(t.id) || 0, filters.tags.includes(t.id)))
      .join('') +
    (tags.length > TAGS_PREVIEW
      ? `<button class="chip chip--more" type="button" data-more-tags="${barKey}">${
          expanded ? 'свернуть' : 'ещё ' + (tags.length - TAGS_PREVIEW)
        }</button>`
      : '');

  const os = catalog.allOs(base);
  osEl.innerHTML = os
    .map((o) => render.renderOsChip(o.id, render.osLabel(o.id), oCounts.get(o.id) || 0, filters.os.includes(o.id)))
    .join('');
}

function plural(n, one, few, many) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

/* ============================ вид категории ============================ */

function renderCategory(catId) {
  const cat = CAT_BY_ID[catId];
  if (!cat) {
    navigate('#/');
    return;
  }
  state.catId = catId;
  el.catTitle.textContent = cat.title;
  el.catDesc.textContent = cat.desc;
  if (el.catIcon) el.catIcon.innerHTML = icon(cat.icon, 22);

  const list = catalog.sortResources(
    catalog.filterResources({ cat: catId, tags: state.catFilters.tags, os: state.catFilters.os }),
    store.getState().sort
  );

  el.catCount.textContent = String(list.length);
  const groups = groupResources(catId, list);
  el.catList.innerHTML = groups.length
    ? render.renderDocGroups(groups)
    : render.renderEmpty('В этой категории пусто', 'Фильтры отсекли все ресурсы.');

  renderFilterBar(el.catTags, el.catOs, state.catFilters, list, 'cat');
}

/* ============================ избранное ============================ */

function renderFavorites() {
  const list = store.favoriteResources();
  el.favCount.textContent = String(list.length);
  el.favActions.hidden = list.length === 0;
  el.favList.innerHTML = list.length
    ? list.map((r) => render.renderResource(r, { fav: true })).join('')
    : render.renderEmpty('Список пуст', 'Нажмите на звезду у любого ресурса, чтобы сохранить его здесь.');
}

function updateFavBadge() {
  const n = store.getState().favorites.length;
  el.favBadge.textContent = String(n);
  el.favBadge.hidden = n === 0;
}

/* ============================ палитра поиска ============================ */

function openPalette(query = '') {
  if (!el.palette) return;
  if (!el.palette.open) el.palette.showModal();
  el.paletteInput.value = query;
  el.paletteInput.focus();
  el.paletteInput.select();
  renderPalette(query);
}

function closePalette() {
  if (el.palette && el.palette.open) el.palette.close();
}

function renderPalette(query) {
  const q = query.trim();
  state.hits = [];
  state.hitIndex = -1;

  if (!q) {
    el.paletteResults.innerHTML = `<div class="palette__empty">Начните вводить запрос: кино, аниме, торренты, VPN, репаки…</div>`;
    return;
  }

  const hits = search.search(q, PALETTE_LIMIT);
  state.hits = hits;
  if (!hits.length) {
    el.paletteResults.innerHTML = `<div class="palette__empty">Ничего не найдено. Попробуйте другой запрос.</div>`;
    return;
  }
  el.paletteResults.innerHTML = render.renderPaletteItems(hits.map((h) => h.res));
  setPaletteActive(0);
}

/** Подсвечивает активный элемент в палитре. */
function setPaletteActive(index) {
  const list = $$('.palette__item', el.paletteResults);
  if (!list.length) return;
  state.hitIndex = (index + list.length) % list.length;
  list.forEach((node, i) => {
    const active = i === state.hitIndex;
    node.classList.toggle('is-active', active);
    node.setAttribute('aria-selected', String(active));
  });
  list[state.hitIndex].scrollIntoView({ block: 'nearest' });
}

/* ============================ карточка ресурса ============================ */

function showResourceDialog(r) {
  el.resDialogBody.innerHTML = render.renderResourceDialog(r, store.isFavorite(r.name));
  const shot = $('[data-shot]', el.resDialogBody);
  if (shot) {
    shot.addEventListener('error', () => {
      shot.hidden = true;
      const fail = $('.modal__shotfail', el.resDialogBody);
      if (fail) fail.hidden = false;
    });
  }
  if (!el.resDialog.open) el.resDialog.showModal();
}

function openResource(name) {
  const r = catalog.findByName(name);
  if (!r) return;
  store.pushRecent(r.name);
  showResourceDialog(r);
}

function openByHash(name) {
  const r = catalog.findByName(name);
  if (!r) {
    navigate('#/');
    return;
  }
  store.pushRecent(r.name);
  showResourceDialog(r);
  history.replaceState(null, '', '#/');
}

/* ============================ подборки ============================ */

function renderCollections() {
  el.colCount.textContent = String(COLLECTIONS.length);
  const html = COLLECTIONS.map((col) => {
    const items = collectionItems(col);
    const total = collectionTotal(col);
    return render.renderCollection({ ...col, total }, items);
  }).join('');
  if (el.collections) el.collections.innerHTML = html;
  if (el.collectionsPage) el.collectionsPage.innerHTML = html;
}

/* ============================ облако меток ============================ */

function renderTags() {
  const tags = catalog.allTags();
  el.tagsCount.textContent = String(tags.length);
  el.tagcloud.innerHTML = render.renderTagCloud(tags);
}

/* ============================ страница поиска ============================ */

function searchPageItems(params) {
  const q = params.get('q');
  const tag = params.get('tag');
  const os = params.get('os');
  const cat = params.get('cat');
  const ru = params.get('ru');

  let list = RESOURCES;
  if (cat) list = list.filter((r) => r.cat === cat);
  if (tag) list = list.filter((r) => r.tags.includes(tag));
  if (ru) list = list.filter((r) => (r.ru || 'ok') === ru);
  if (os) {
    const set = new Set(os.split(','));
    list = list.filter((r) => (set.has('any') ? r.os.includes('any') : r.os.includes('any') || set.has(r.os[0])));
  }
  if (q) {
    const terms = search.expand(q);
    list = list.filter((r) => {
      const hay = search.normalize(`${r.name} ${r.desc} ${r.tags.join(' ')} ${r.url}`);
      return terms.some((t) => hay.includes(t));
    });
  }
  return list;
}

function renderSearchPage(params) {
  const q = params.get('q');
  const tag = params.get('tag');
  const cat = params.get('cat');

  const list = catalog.sortResources(searchPageItems(params), store.getState().sort);

  let title = 'Поиск';
  if (q) title = 'Результаты: ' + q;
  else if (tag) title = 'Метка: ' + (TAG_LABELS[tag] || tag);
  else if (cat) title = 'Раздел: ' + (CAT_BY_ID[cat] ? CAT_BY_ID[cat].title : cat);

  el.searchTitle.textContent = title;
  el.searchCount.textContent = list.length + ' ' + plural(list.length, 'ресурс', 'ресурса', 'ресурсов');
  el.searchList.innerHTML = list.length
    ? list.map((r) => render.renderResource(r, { fav: store.isFavorite(r.name) })).join('')
    : render.renderEmpty('Ничего не найдено', 'Попробуйте другой запрос или сбросьте фильтры.');
}

/* ============================ легенда статусов ============================ */

function renderRuLegend() {
  el.ruLegend.innerHTML = render.renderRuLegend(
    Object.keys(RU_LABELS).map((id) => ({ id, label: RU_LABELS[id], hint: RU_HINTS[id] }))
  );
}

/* ============================ роутинг ============================ */

function applyRoute() {
  const route = parseHash();

  if (route.name === 'home') {
    state.filters = readFilters(route.params);
    showView('home');
    renderAll();
    return;
  }
  if (route.name === 'catalog') {
    state.filters = readFilters(route.params);
    showView('catalog');
    renderAll();
    return;
  }
  if (route.name === 'favorites') {
    showView('favorites');
    renderFavorites();
    return;
  }
  if (route.name === 'category') {
    state.catId = route.cat;
    showView('category');
    renderCategory(route.cat);
    return;
  }
  if (route.name === 'collections') {
    showView('collections');
    renderCollections();
    return;
  }
  if (route.name === 'tags') {
    showView('tags');
    renderTags();
    return;
  }
  if (route.name === 'search') {
    showView('search');
    renderSearchPage(route.params);
    return;
  }
  if (route.name === 'about') {
    showView('about');
    return;
  }
  if (route.name === 'rules') {
    showView('rules');
    return;
  }
  if (route.name === 'resource') {
    openByHash(route.res);
  }
}

/* ============================ экспорт ============================ */

function toMarkdown(list) {
  const head = '# MegaThread — избранное\n';
  const byCat = new Map();
  for (const r of list) {
    if (!byCat.has(r.cat)) byCat.set(r.cat, []);
    byCat.get(r.cat).push(r);
  }
  let out = head;
  for (const cat of CATEGORIES) {
    const items = byCat.get(cat.id);
    if (!items || !items.length) continue;
    out += `\n## ${cat.title}\n\n`;
    for (const r of items) {
      out += `- [${r.name}](${r.url}) — ${r.desc}\n`;
    }
  }
  return out;
}

function download(filename, text) {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast('Скопировано');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      toast('Скопировано');
    } catch {
      toast('Не удалось скопировать');
    }
    ta.remove();
  }
}

/* ============================ сайдбар ============================ */

function openSidebar() {
  document.body.classList.add('nav-open');
  el.burger.setAttribute('aria-expanded', 'true');
}

function closeSidebar() {
  document.body.classList.remove('nav-open');
  if (el.burger) el.burger.setAttribute('aria-expanded', 'false');
}

/* ============================ события ============================ */

function initEvents() {
  // --- палитра поиска ---
  if (el.searchOpen) el.searchOpen.addEventListener('click', () => openPalette());
  if (el.searchOpenHero) el.searchOpenHero.addEventListener('click', () => openPalette());

  el.paletteInput.addEventListener('input', () => renderPalette(el.paletteInput.value));

  el.paletteResults.addEventListener('click', (e) => {
    const item = e.target.closest('.palette__item');
    if (!item) return;
    closePalette();
    openResource(item.dataset.name);
  });

  el.palette.addEventListener('click', (e) => {
    if (e.target === el.palette) closePalette();
  });

  document.addEventListener('keydown', (e) => {
    const inField = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);

    if (e.key === 'Escape') {
      if (el.palette.open) {
        closePalette();
        return;
      }
      if (el.resDialog.open) el.resDialog.close();
      else if (el.helpDialog.open) el.helpDialog.close();
      return;
    }

    if (el.palette.open) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setPaletteActive(state.hitIndex + 1);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setPaletteActive(state.hitIndex - 1);
        return;
      }
      if (e.key === 'Enter') {
        const hit = state.hits[state.hitIndex];
        if (hit) {
          e.preventDefault();
          closePalette();
          openResource(hit.res.name);
        }
        return;
      }
    }

    if (inField) return;

    if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      openPalette();
      return;
    }
    if (e.key === '?') {
      e.preventDefault();
      openHelp();
      return;
    }
    if (e.key.toLowerCase() === 'r') {
      e.preventDefault();
      randomResource();
    }
  });

  // --- глобальный клик по делегированным кнопкам ---
  document.addEventListener('click', (e) => {
    const closeRes = e.target.closest('[data-close-res]');
    if (closeRes) {
      el.resDialog.close();
      return;
    }
    const colBtn = e.target.closest('[data-collection-open]');
    if (colBtn) {
      const col = COLLECTIONS.find((c) => c.id === colBtn.dataset.collectionOpen);
      if (col) {
        const r = col.rule || {};
        const params = {};
        if (r.cat) params.cat = r.cat[0];
        if (r.tags) params.tag = r.tags[0];
        if (r.ru) params.ru = r.ru[0];
        navigate(buildHash('search', { params }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    const tagBtn = e.target.closest('[data-tag-page]');
    if (tagBtn) {
      navigate(buildHash('search', { params: { tag: tagBtn.dataset.tagPage } }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const qchip = e.target.closest('[data-q]');
    if (qchip) {
      openPalette(qchip.dataset.q);
      return;
    }
    const openBtn = e.target.closest('[data-open]');
    if (openBtn) {
      openResource(openBtn.dataset.open);
      return;
    }
    const favBtn = e.target.closest('[data-fav]');
    if (favBtn) {
      const added = store.toggleFavorite(favBtn.dataset.fav);
      toast(added ? 'Добавлено в избранное' : 'Убрано из избранного');
      refreshLists();
      return;
    }
    const catBtn = e.target.closest('[data-cat]');
    if (catBtn && catBtn.tagName === 'BUTTON') {
      navigate(buildHash('category', { cat: catBtn.dataset.cat }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const filterBtn = e.target.closest('[data-filter]');
    if (filterBtn) {
      toggleFilter(filterBtn);
      return;
    }
    const moreTags = e.target.closest('[data-more-tags]');
    if (moreTags) {
      const key = moreTags.dataset.moreTags;
      state.tagsExpanded[key] = !state.tagsExpanded[key];
      if (key === 'cat') renderCategory(state.catId);
      else renderAll();
      return;
    }
    const copyUrl = e.target.closest('[data-copy-url]');
    if (copyUrl) {
      copyText(copyUrl.dataset.copyUrl);
      return;
    }
    if (e.target.closest('[data-random]')) {
      randomResource();
      return;
    }
    if (e.target.closest('[data-export-all]')) {
      download('megathread-каталог.md', toMarkdown(RESOURCES));
      toast('Каталог сохранён в файл');
      return;
    }
    if (e.target.closest('[data-export-fav]')) {
      download('megathread-избранное.md', toMarkdown(store.favoriteResources()));
      toast('Избранное сохранено в файл');
      return;
    }
    if (e.target.closest('[data-copy-fav]')) {
      const list = store.favoriteResources();
      const text = list.map((r) => `${r.name} — ${r.url}`).join('\n');
      copyText(text || 'Избранное пусто');
      return;
    }
    if (e.target.closest('[data-clear-fav]')) {
      store.clearFavorites();
      toast('Избранное очищено');
      refreshLists();
      return;
    }
    if (e.target.closest('[data-clear-recent]')) {
      store.clearRecent();
      toast('История очищена');
      return;
    }
    if (e.target.closest('[data-help]')) {
      openHelp();
      return;
    }
    if (e.target.closest('[data-close-help]')) {
      el.helpDialog.close();
      return;
    }
    if (e.target.closest('.sidenav__link')) {
      closeSidebar();
    }
  });

  // --- сортировка ---
  el.sortSelect.innerHTML = SORT_OPTIONS.map(
    (o) => `<option value="${o.id}">${o.label}</option>`
  ).join('');
  el.sortSelect.value = store.getState().sort;
  el.sortSelect.addEventListener('change', () => {
    store.setSort(el.sortSelect.value);
    refreshLists();
  });

  // --- показать ещё ---
  el.moreBtn.addEventListener('click', () => {
    state.allShown += PAGE_SIZE;
    renderAll();
  });

  // --- мобильное меню ---
  el.burger.addEventListener('click', () => {
    if (document.body.classList.contains('nav-open')) closeSidebar();
    else openSidebar();
  });

  // --- наверх ---
  window.addEventListener('scroll', () => {
    el.toTop.hidden = window.scrollY < 600;
    el.header.classList.toggle('is-stuck', window.scrollY > 8);
  }, { passive: true });
  el.toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // --- клик по фону диалога закрывает его ---
  for (const dialog of [el.resDialog, el.helpDialog, el.palette]) {
    if (!dialog) continue;
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
  }

  window.addEventListener('hashchange', applyRoute);
}

function toggleFilter(btn) {
  const kind = btn.dataset.filter === 'tag' ? 'tags' : 'os';
  const value = btn.dataset.value;
  const filters = state.view === 'category' ? state.catFilters : state.filters;
  const list = filters[kind];

  const i = list.indexOf(value);
  if (i >= 0) list.splice(i, 1);
  else list.push(value);

  if (state.view === 'category') {
    state.catShown = PAGE_SIZE;
    renderCategory(state.catId);
  } else {
    state.allShown = PAGE_SIZE;
    if (state.view === 'home' || state.view === 'catalog') writeFilters(state.filters);
    renderAll();
  }
  announce(btn.getAttribute('aria-pressed') === 'true' ? 'Фильтр снят' : 'Фильтр включён');
}

function randomResource() {
  const list = catalog.filterResources({ tags: state.filters.tags, os: state.filters.os });
  const pool = list.length ? list : RESOURCES;
  const r = pool[Math.floor(Math.random() * pool.length)];
  openResource(r.name);
}

function openHelp() {
  el.helpBody.innerHTML = render.renderShortcuts(SHORTCUTS);
  if (!el.helpDialog.open) el.helpDialog.showModal();
}

/** Перерисовывает списки после изменения избранного/темы/сортировки. */
function refreshLists() {
  updateFavBadge();
  renderRecent();
  if (state.view === 'home' || state.view === 'catalog') renderAll();
  else if (state.view === 'category') renderCategory(state.catId);
  else if (state.view === 'favorites') renderFavorites();
  if (!el.resDialog.open) return;
  const title = $('.modal__title', el.resDialogBody);
  if (!title) return;
  const r = catalog.findByName(title.textContent);
  if (r) showResourceDialog(r);
}

/* ============================ PWA ============================ */

function initPwa() {
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  let deferred = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e;
    el.installBtn.hidden = false;
  });
  el.installBtn.addEventListener('click', async () => {
    if (!deferred) return;
    deferred.prompt();
    deferred = null;
    el.installBtn.hidden = true;
  });

  window.addEventListener('offline', () => {
    if (el.offlineNotice) el.offlineNotice.hidden = false;
  });
  window.addEventListener('online', () => {
    if (el.offlineNotice) el.offlineNotice.hidden = true;
  });
}

/* ============================ старт ============================ */

function init() {
  initTheme();
  initEvents();
  initPwa();

  renderFacts();
  renderCategories();
  renderSidebar();
  renderStartPicks();
  renderNoVpn();
  renderCollections();
  renderTags();
  renderRuLegend();
  updateFavBadge();
  renderRecent();
  renderAll();
  applyRoute();

  store.subscribe(() => {
    updateFavBadge();
  });

  document.documentElement.classList.add('is-ready');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
