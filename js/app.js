import { CATEGORIES, RESOURCES } from './data.js';

const FAV_KEY = 'mt_favorites';
const OS_LABELS = {
  all: 'Все ОС',
  w: 'Windows',
  m: 'macOS',
  l: 'Linux',
  a: 'Android',
  i: 'iOS',
  any: 'Любая'
};

const state = {
  view: 'home',
  category: null,
  tag: 'all',
  os: 'all',
  favorites: loadFavorites()
};

const el = {
  views: {
    home: document.getElementById('view-home'),
    category: document.getElementById('view-category'),
    favorites: document.getElementById('view-favorites')
  },
  catGrid: document.getElementById('cat-grid'),
  resList: document.getElementById('res-list'),
  favList: document.getElementById('fav-list'),
  catTitle: document.getElementById('cat-title'),
  catDesc: document.getElementById('cat-desc'),
  filters: document.getElementById('filters'),
  osFilters: document.getElementById('os-filters'),
  search: document.getElementById('search'),
  searchResults: document.getElementById('search-results'),
  metaTotal: document.getElementById('meta-total'),
  metaCats: document.getElementById('meta-cats'),
  suggest: document.getElementById('suggest-link'),
  suggestMobile: document.getElementById('suggest-link-mobile')
};

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(FAV_KEY, JSON.stringify(state.favorites));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"');
}

function getCategory(id) {
  return CATEGORIES.find((item) => item.id === id);
}

function resourceKey(item) {
  return item.url;
}

function isFavorite(item) {
  return state.favorites.includes(resourceKey(item));
}

function toggleFavorite(item) {
  const key = resourceKey(item);
  if (state.favorites.includes(key)) {
    state.favorites = state.favorites.filter((value) => value !== key);
  } else {
    state.favorites.push(key);
  }
  saveFavorites();
}

function detectOs() {
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return 'a';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'i';
  if (/Mac/i.test(ua)) return 'm';
  if (/Linux/i.test(ua)) return 'l';
  return 'w';
}

function setupSuggestLinks() {
  const title = encodeURIComponent('[Ресурс] ');
  const body = encodeURIComponent(
    'Название:\nСсылка:\nКатегория:\nПочему стоит добавить:\n'
  );
  const href = `https://github.com/Stintik-123/MegaThread/issues/new?title=${title}&body=${body}`;
  el.suggest.href = href;
  el.suggestMobile.href = href;
}

function setView(name) {
  state.view = name;
  Object.entries(el.views).forEach(([key, node]) => {
    node.classList.toggle('active', key === name);
  });

  document.querySelectorAll('[data-view]').forEach((node) => {
    node.classList.toggle('active', node.getAttribute('data-view') === name);
  });

  if (name === 'favorites') renderFavorites();
  if (name === 'home') el.searchResults.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderHome() {
  el.metaTotal.textContent = String(RESOURCES.length);
  el.metaCats.textContent = String(CATEGORIES.length);

  el.catGrid.innerHTML = CATEGORIES.map((cat) => {
    const count = RESOURCES.filter((item) => item.cat === cat.id).length;
    return `
      <button class="cat" type="button" data-open="${cat.id}">
        <strong>${escapeHtml(cat.title)}</strong>
        <span>${escapeHtml(cat.desc)}</span>
        <div class="pill">Открыть →</div>
        <small>${count} ресурсов</small>
      </button>
    `;
  }).join('');
}

function uniqueTags(items) {
  const set = new Set();
  items.forEach((item) => item.tags.forEach((tag) => set.add(tag)));
  return Array.from(set).sort();
}

function uniqueOs(items) {
  const set = new Set();
  items.forEach((item) => (item.os || ['any']).forEach((os) => set.add(os)));
  return Array.from(set);
}

function renderChips() {
  const items = RESOURCES.filter((item) => item.cat === state.category);
  const tags = uniqueTags(items);
  const osList = uniqueOs(items);

  el.filters.innerHTML = [
    `<button class="chip ${state.tag === 'all' ? 'active' : ''}" type="button" data-tag="all">Все</button>`,
    ...tags.map(
      (tag) =>
        `<button class="chip ${state.tag === tag ? 'active' : ''}" type="button" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`
    )
  ].join('');

  el.osFilters.innerHTML = [
    `<button class="chip ${state.os === 'all' ? 'active' : ''}" type="button" data-os="all">${OS_LABELS.all}</button>`,
    ...osList.map((os) => {
      const mine = detectOs() === os ? ' · ваша' : '';
      return `<button class="chip ${state.os === os ? 'active' : ''}" type="button" data-os="${escapeHtml(os)}">${escapeHtml(OS_LABELS[os] || os)}${mine}</button>`;
    })
  ].join('');
}

function filteredCategoryItems() {
  return RESOURCES.filter((item) => {
    if (item.cat !== state.category) return false;
    if (state.tag !== 'all' && !item.tags.includes(state.tag)) return false;
    if (state.os !== 'all') {
      const os = item.os || ['any'];
      if (!os.includes(state.os) && !os.includes('any')) return false;
    }
    return true;
  });
}

function renderItem(item) {
  const fav = isFavorite(item);
  const tags = item.tags.slice(0, 4).join(' · ');
  return `
    <div class="item" data-url="${escapeHtml(item.url)}">
      <div>
        <b>${escapeHtml(item.name)}</b>
        <p>${escapeHtml(item.desc)}</p>
        <div class="tags">${escapeHtml(tags)}</div>
      </div>
      <button class="star ${fav ? 'on' : ''}" type="button" data-fav="${escapeHtml(item.url)}" aria-label="Избранное">${fav ? '★' : '☆'}</button>
      <a class="open" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="Открыть">→</a>
    </div>
  `;
}

function renderResources() {
  const items = filteredCategoryItems();
  if (!items.length) {
    el.resList.innerHTML = '<div class="empty">Ничего не найдено по фильтрам</div>';
    return;
  }
  el.resList.innerHTML = items.map(renderItem).join('');
}

function renderFavorites() {
  const items = RESOURCES.filter((item) => state.favorites.includes(item.url));
  if (!items.length) {
    el.favList.innerHTML = '<div class="empty">Пока пусто. Добавляй ресурсы звёздочкой.</div>';
    return;
  }
  el.favList.innerHTML = items.map(renderItem).join('');
}

function openCategory(id) {
  const cat = getCategory(id);
  if (!cat) return;
  state.category = id;
  state.tag = 'all';
  state.os = 'all';
  el.catTitle.textContent = cat.title;
  el.catDesc.textContent = cat.desc;
  renderChips();
  renderResources();
  setView('category');
}

function search(query) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) {
    el.searchResults.classList.remove('open');
    el.searchResults.innerHTML = '';
    return;
  }

  const hits = RESOURCES.filter((item) => {
    const hay = `${item.name} ${item.desc} ${item.tags.join(' ')}`.toLowerCase();
    return hay.includes(q);
  }).slice(0, 12);

  if (!hits.length) {
    el.searchResults.innerHTML = '<div class="empty">Ничего не найдено</div>';
    el.searchResults.classList.add('open');
    return;
  }

  el.searchResults.innerHTML = hits
    .map((item) => {
      const cat = getCategory(item.cat);
      return `
        <a class="hit" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
          <b>${escapeHtml(item.name)}</b>
          <small>${escapeHtml(cat ? cat.title : item.cat)} · ${escapeHtml(item.desc)}</small>
        </a>
      `;
    })
    .join('');
  el.searchResults.classList.add('open');
}

function bindEvents() {
  document.addEventListener('click', (event) => {
    const viewBtn = event.target.closest('[data-view]');
    if (viewBtn && viewBtn.tagName === 'BUTTON') {
      const view = viewBtn.getAttribute('data-view');
      if (view === 'home' || view === 'favorites') setView(view);
      return;
    }

    const openBtn = event.target.closest('[data-open]');
    if (openBtn) {
      openCategory(openBtn.getAttribute('data-open'));
      return;
    }

    const tagBtn = event.target.closest('[data-tag]');
    if (tagBtn) {
      state.tag = tagBtn.getAttribute('data-tag');
      renderChips();
      renderResources();
      return;
    }

    const osBtn = event.target.closest('[data-os]');
    if (osBtn) {
      state.os = osBtn.getAttribute('data-os');
      renderChips();
      renderResources();
      return;
    }

    const favBtn = event.target.closest('[data-fav]');
    if (favBtn) {
      const url = favBtn.getAttribute('data-fav');
      const item = RESOURCES.find((entry) => entry.url === url);
      if (!item) return;
      toggleFavorite(item);
      if (state.view === 'favorites') renderFavorites();
      else if (state.view === 'category') renderResources();
      return;
    }

    if (!event.target.closest('.search')) {
      el.searchResults.classList.remove('open');
    }
  });

  let timer = null;
  el.search.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => search(el.search.value), 140);
  });

  el.search.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      el.searchResults.classList.remove('open');
      el.search.blur();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      event.preventDefault();
      el.search.focus();
    }
  });
}

function init() {
  setupSuggestLinks();
  renderHome();
  bindEvents();
}

init();
