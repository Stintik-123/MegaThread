import { CATEGORIES, RESOURCES } from './data/resources.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const catMap = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

function showPage(id) {
  $$('.page').forEach((p) => p.classList.toggle('active', p.id === `page-${id}`));
  $$('.tab').forEach((t) => t.classList.toggle('active', t.dataset.page === id));
  $('#search-results')?.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function countByCat(catId) {
  return RESOURCES.filter((r) => r.cat === catId).length;
}

function renderHome() {
  const grid = $('#cat-grid');
  grid.innerHTML = CATEGORIES.map(
    (c) => `
    <button class="cat-card" data-page="${c.id}" type="button">
      <div class="cat-emoji">${c.emoji}</div>
      <h3>${c.title}</h3>
      <p>${c.desc}</p>
      <div class="cat-meta">${countByCat(c.id)} ресурсов</div>
    </button>`
  ).join('');

  $('#stat-total').textContent = RESOURCES.length;
  $('#stat-cats').textContent = CATEGORIES.length;
}

function resourceHTML(r) {
  const cat = catMap[r.cat];
  const tags = (r.tags || [])
    .filter((t) => ['ru', 'os', 'legal', 'free'].includes(t))
    .slice(0, 3)
    .map((t) => `<span class="tag ${t}">${t}</span>`)
    .join('');

  return `
    <a class="res" href="${r.url}" target="_blank" rel="noopener noreferrer" data-tags="${(r.tags || []).join(' ')}">
      <div class="res-ico">${cat?.emoji || '🔗'}</div>
      <div class="res-body">
        <b>${r.name}</b>
        <span>${r.desc}</span>
      </div>
      <div class="res-tags">${tags}</div>
      <div class="res-go">→</div>
    </a>`;
}

function renderCategory(catId) {
  const cat = catMap[catId];
  if (!cat) return;

  const page = $(`#page-${catId}`);
  const items = RESOURCES.filter((r) => r.cat === catId);

  page.innerHTML = `
    <div class="wrap">
      <div class="cat-top">
        <button class="back-btn" data-page="home" type="button" aria-label="Назад">←</button>
        <div>
          <h1>${cat.emoji} ${cat.title}</h1>
          <p>${cat.desc} · ${items.length} ресурсов</p>
        </div>
      </div>
      <div class="filters" data-cat="${catId}">
        <button class="filter-btn active" data-filter="all" type="button">Все</button>
        <button class="filter-btn" data-filter="legal" type="button">Легальные</button>
        <button class="filter-btn" data-filter="os" type="button">Open Source</button>
        <button class="filter-btn" data-filter="ru" type="button">RU</button>
      </div>
      <div class="res-list" id="list-${catId}">
        ${items.map(resourceHTML).join('') || '<div class="empty">Пока пусто</div>'}
      </div>
    </div>`;
}

function applyFilter(catId, filter) {
  const list = $(`#list-${catId}`);
  if (!list) return;

  $$('.res', list).forEach((el) => {
    const tags = (el.dataset.tags || '').split(/\s+/);
    const show = filter === 'all' || tags.includes(filter);
    el.style.display = show ? '' : 'none';
  });
}

function initSearch() {
  const input = $('#search-input');
  const box = $('#search-results');
  if (!input || !box) return;

  let timer;

  const render = (q) => {
    if (q.length < 2) {
      box.classList.remove('open');
      box.innerHTML = '';
      return;
    }

    const hits = RESOURCES.filter((r) => {
      const hay = `${r.name} ${r.desc} ${(r.tags || []).join(' ')}`.toLowerCase();
      return hay.includes(q);
    }).slice(0, 10);

    if (!hits.length) {
      box.innerHTML = `<div class="sr-item"><div class="sr-emoji">🔍</div><div><strong>Ничего не найдено</strong><small>Попробуй другое слово</small></div></div>`;
      box.classList.add('open');
      return;
    }

    box.innerHTML = hits
      .map((r) => {
        const cat = catMap[r.cat];
        return `
          <a class="sr-item" href="${r.url}" target="_blank" rel="noopener noreferrer">
            <div class="sr-emoji">${cat?.emoji || '🔗'}</div>
            <div>
              <strong>${r.name}</strong>
              <small>${cat?.title || r.cat} · ${r.desc}</small>
            </div>
          </a>`;
      })
      .join('');
    box.classList.add('open');
  };

  input.addEventListener('input', () => {
    clearTimeout(timer);
    const q = input.value.trim().toLowerCase();
    timer = setTimeout(() => render(q), 120);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) box.classList.remove('open');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName || '')) {
      e.preventDefault();
      input.focus();
    }
    if (e.key === 'Escape') box.classList.remove('open');
  });
}

function bindNav() {
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-page]');
    if (!tab) return;

    const page = tab.dataset.page;
    if (!page) return;

    if (page !== 'home' && page !== 'about' && !catMap[page]) return;

    e.preventDefault();
    showPage(page);

    if (catMap[page]) {
      const list = $(`#list-${page}`);
      if (!list) renderCategory(page);
    }
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    const bar = btn.closest('.filters');
    if (!bar) return;

    $$('.filter-btn', bar).forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(bar.dataset.cat, btn.dataset.filter);
  });
}

function init() {
  renderHome();
  CATEGORIES.forEach((c) => {
    const el = document.createElement('section');
    el.className = 'page';
    el.id = `page-${c.id}`;
    $('#app').appendChild(el);
  });
  initSearch();
  bindNav();
  showPage('home');
}

init();
