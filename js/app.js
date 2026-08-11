import { CATEGORIES, RESOURCES } from './data.js';

const GRADIENTS = ['', 'g2', 'g3', 'g4', 'g5'];

const state = {
  view: 'home',
  category: null,
  filter: 'all',
  query: ''
};

const el = {
  home: document.getElementById('home'),
  panel: document.getElementById('category-panel'),
  catGrid: document.getElementById('cat-grid'),
  resList: document.getElementById('res-list'),
  panelTitle: document.getElementById('panel-title'),
  panelDesc: document.getElementById('panel-desc'),
  filters: document.getElementById('filters'),
  search: document.getElementById('search'),
  searchResults: document.getElementById('search-results'),
  statTotal: document.getElementById('stat-total'),
  statCats: document.getElementById('stat-cats')
};

function countByCategory(id) {
  return RESOURCES.filter((item) => item.cat === id).length;
}

function getCategory(id) {
  return CATEGORIES.find((item) => item.id === id);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"');
}

function renderHome() {
  el.statTotal.textContent = String(RESOURCES.length);
  el.statCats.textContent = String(CATEGORIES.length);

  el.catGrid.innerHTML = CATEGORIES.map((cat) => {
    const count = countByCategory(cat.id);
    return `
      <button class="cat-card" data-open="${cat.id}" type="button">
        <div class="cat-emoji">${cat.emoji}</div>
        <h3>${escapeHtml(cat.title)}</h3>
        <p>${escapeHtml(cat.desc)}</p>
        <div class="cat-meta">${count} ресурсов</div>
      </button>
    `;
  }).join('');
}

function uniqueTags(items) {
  const set = new Set();
  items.forEach((item) => item.tags.forEach((tag) => set.add(tag)));
  return Array.from(set).sort();
}

function renderFilters(items) {
  const tags = uniqueTags(items);
  const buttons = [
    `<button class="filter-btn ${state.filter === 'all' ? 'active' : ''}" data-filter="all" type="button">Все</button>`
  ];

  tags.forEach((tag) => {
    buttons.push(
      `<button class="filter-btn ${state.filter === tag ? 'active' : ''}" data-filter="${escapeHtml(tag)}" type="button">${escapeHtml(tag)}</button>`
    );
  });

  el.filters.innerHTML = buttons.join('');
}

function renderResources() {
  let items = RESOURCES.filter((item) => item.cat === state.category);

  if (state.filter !== 'all') {
    items = items.filter((item) => item.tags.includes(state.filter));
  }

  if (!items.length) {
    el.resList.innerHTML = '<div class="empty">В этом фильтре пока пусто</div>';
    return;
  }

  el.resList.innerHTML = items.map((item, index) => {
    const grad = GRADIENTS[index % GRADIENTS.length];
    const letter = escapeHtml((item.name[0] || 'M').toUpperCase());
    const tags = item.tags
      .slice(0, 3)
      .map((tag) => `<span class="tag ${escapeHtml(tag)}">${escapeHtml(tag)}</span>`)
      .join('');

    return `
      <a class="res-item" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
        <div class="res-ico ${grad}">${letter}</div>
        <div class="res-body">
          <b>${escapeHtml(item.name)}</b>
          <span>${escapeHtml(item.desc)}</span>
        </div>
        <div class="res-tags">${tags}</div>
        <div class="res-go">→</div>
      </a>
    `;
  }).join('');
}

function openCategory(id) {
  const cat = getCategory(id);
  if (!cat) return;

  state.view = 'category';
  state.category = id;
  state.filter = 'all';

  el.panelTitle.textContent = `${cat.emoji} ${cat.title}`;
  el.panelDesc.textContent = cat.desc;

  const items = RESOURCES.filter((item) => item.cat === id);
  renderFilters(items);
  renderResources();

  el.home.style.display = 'none';
  el.panel.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showHome() {
  state.view = 'home';
  state.category = null;
  state.filter = 'all';
  el.panel.classList.remove('active');
  el.home.style.display = 'block';
  el.searchResults.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function searchResources(query) {
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

  el.searchResults.innerHTML = hits.map((item) => {
    const cat = getCategory(item.cat);
    return `
      <a class="search-hit" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
        <div class="res-ico">${escapeHtml((item.name[0] || 'M').toUpperCase())}</div>
        <div>
          <b>${escapeHtml(item.name)}</b>
          <small>${escapeHtml(cat ? cat.title : item.cat)} · ${escapeHtml(item.desc)}</small>
        </div>
      </a>
    `;
  }).join('');

  el.searchResults.classList.add('open');
}

function bindEvents() {
  document.addEventListener('click', (event) => {
    const openBtn = event.target.closest('[data-open]');
    if (openBtn) {
      openCategory(openBtn.dataset.open);
      return;
    }

    const filterBtn = event.target.closest('[data-filter]');
    if (filterBtn) {
      state.filter = filterBtn.dataset.filter;
      renderFilters(RESOURCES.filter((item) => item.cat === state.category));
      renderResources();
      return;
    }

    if (event.target.closest('[data-home]')) {
      showHome();
      return;
    }

    if (!event.target.closest('.search-box')) {
      el.searchResults.classList.remove('open');
    }
  });

  let timer = null;
  el.search.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      state.query = el.search.value;
      searchResources(state.query);
    }, 160);
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
  renderHome();
  bindEvents();
}

init();
