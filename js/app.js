(function () {
  let CATEGORIES = [];
  let RESOURCES = [];
  const FAV_KEY = 'mt_favorites';
  const OS_LABELS = { all: 'Все ОС', w: 'Windows', m: 'macOS', l: 'Linux', a: 'Android', i: 'iOS', any: 'Любая' };

  const state = { view: 'home', category: null, tag: 'all', os: 'all', favorites: loadFavorites() };

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
    } catch (e) { return []; }
  }

  function saveFavorites() {
    localStorage.setItem(FAV_KEY, JSON.stringify(state.favorites));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"');
  }

  function getCategory(id) {
    return CATEGORIES.find(function (item) { return item.id === id; });
  }

  function isFavorite(item) {
    return state.favorites.indexOf(item.url) !== -1;
  }

  function toggleFavorite(item) {
    var key = item.url;
    if (state.favorites.indexOf(key) !== -1) {
      state.favorites = state.favorites.filter(function (value) { return value !== key; });
    } else {
      state.favorites.push(key);
    }
    saveFavorites();
  }

  function detectOs() {
    var ua = navigator.userAgent;
    if (/Android/i.test(ua)) return 'a';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'i';
    if (/Mac/i.test(ua)) return 'm';
    if (/Linux/i.test(ua)) return 'l';
    return 'w';
  }

  function setupSuggestLinks() {
    var title = encodeURIComponent('[Ресурс] ');
    var body = encodeURIComponent('Название:\nСсылка:\nКатегория:\nПочему стоит добавить:\n');
    var href = 'https://github.com/Stintik-123/MegaThread/issues/new?title=' + title + '&body=' + body;
    if (el.suggest) el.suggest.href = href;
    if (el.suggestMobile) el.suggestMobile.href = href;
  }

  function setView(name) {
    state.view = name;
    Object.keys(el.views).forEach(function (key) {
      if (el.views[key]) el.views[key].classList.toggle('active', key === name);
    });
    document.querySelectorAll('[data-view]').forEach(function (node) {
      node.classList.toggle('active', node.getAttribute('data-view') === name);
    });
    if (name === 'favorites') renderFavorites();
    if (name === 'home' && el.searchResults) el.searchResults.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderHome() {
    if (el.metaTotal) el.metaTotal.textContent = String(RESOURCES.length);
    if (el.metaCats) el.metaCats.textContent = String(CATEGORIES.length);
    if (!el.catGrid) return;
    el.catGrid.innerHTML = CATEGORIES.map(function (cat) {
      var count = RESOURCES.filter(function (item) { return item.cat === cat.id; }).length;
      return '<button class="cat" type="button" data-open="' + cat.id + '">' +
        '<strong>' + escapeHtml(cat.title) + '</strong>' +
        '<span>' + escapeHtml(cat.desc) + '</span>' +
        '<div class="pill">Открыть →</div>' +
        '<small>' + count + ' ресурсов</small></button>';
    }).join('');
  }

  function uniqueTags(items) {
    var set = {};
    items.forEach(function (item) {
      (item.tags || []).forEach(function (tag) { set[tag] = true; });
    });
    return Object.keys(set).sort();
  }

  function uniqueOs(items) {
    var set = {};
    items.forEach(function (item) {
      (item.os || ['any']).forEach(function (os) { set[os] = true; });
    });
    return Object.keys(set);
  }

  function renderChips() {
    var items = RESOURCES.filter(function (item) { return item.cat === state.category; });
    var tags = uniqueTags(items);
    var osList = uniqueOs(items);
    el.filters.innerHTML = ['<button class="chip ' + (state.tag === 'all' ? 'active' : '') + '" type="button" data-tag="all">Все</button>']
      .concat(tags.map(function (tag) {
        return '<button class="chip ' + (state.tag === tag ? 'active' : '') + '" type="button" data-tag="' + escapeHtml(tag) + '">' + escapeHtml(tag) + '</button>';
      })).join('');
    el.osFilters.innerHTML = ['<button class="chip ' + (state.os === 'all' ? 'active' : '') + '" type="button" data-os="all">' + OS_LABELS.all + '</button>']
      .concat(osList.map(function (os) {
        var mine = detectOs() === os ? ' · ваша' : '';
        return '<button class="chip ' + (state.os === os ? 'active' : '') + '" type="button" data-os="' + escapeHtml(os) + '">' + escapeHtml(OS_LABELS[os] || os) + mine + '</button>';
      })).join('');
  }

  function filteredCategoryItems() {
    return RESOURCES.filter(function (item) {
      if (item.cat !== state.category) return false;
      if (state.tag !== 'all' && (item.tags || []).indexOf(state.tag) === -1) return false;
      if (state.os !== 'all') {
        var os = item.os || ['any'];
        if (os.indexOf(state.os) === -1 && os.indexOf('any') === -1) return false;
      }
      return true;
    });
  }

  function renderItem(item) {
    var fav = isFavorite(item);
    var tags = (item.tags || []).slice(0, 4).join(' · ');
    return '<div class="item">' +
      '<div><b>' + escapeHtml(item.name) + '</b><p>' + escapeHtml(item.desc) + '</p><div class="tags">' + escapeHtml(tags) + '</div></div>' +
      '<button class="star ' + (fav ? 'on' : '') + '" type="button" data-fav="' + escapeHtml(item.url) + '" aria-label="Избранное">' + (fav ? '★' : '☆') + '</button>' +
      '<a class="open" href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener noreferrer" aria-label="Открыть">→</a></div>';
  }

  function renderResources() {
    var items = filteredCategoryItems();
    el.resList.innerHTML = items.length ? items.map(renderItem).join('') : '<div class="empty">Ничего не найдено по фильтрам</div>';
  }

  function renderFavorites() {
    var items = RESOURCES.filter(function (item) { return state.favorites.indexOf(item.url) !== -1; });
    el.favList.innerHTML = items.length ? items.map(renderItem).join('') : '<div class="empty">Пока пусто. Добавляй ресурсы звёздочкой.</div>';
  }

  function openCategory(id) {
    var cat = getCategory(id);
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
    var q = query.trim().toLowerCase();
    if (q.length < 2) {
      el.searchResults.classList.remove('open');
      el.searchResults.innerHTML = '';
      return;
    }
    var hits = RESOURCES.filter(function (item) {
      return (item.name + ' ' + item.desc + ' ' + (item.tags || []).join(' ')).toLowerCase().indexOf(q) !== -1;
    }).slice(0, 12);
    if (!hits.length) {
      el.searchResults.innerHTML = '<div class="empty">Ничего не найдено</div>';
      el.searchResults.classList.add('open');
      return;
    }
    el.searchResults.innerHTML = hits.map(function (item) {
      var cat = getCategory(item.cat);
      return '<a class="hit" href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener noreferrer"><b>' + escapeHtml(item.name) + '</b><small>' + escapeHtml(cat ? cat.title : item.cat) + ' · ' + escapeHtml(item.desc) + '</small></a>';
    }).join('');
    el.searchResults.classList.add('open');
  }

  function bindEvents() {
    document.addEventListener('click', function (event) {
      var viewBtn = event.target.closest('[data-view]');
      if (viewBtn && viewBtn.tagName === 'BUTTON') {
        var view = viewBtn.getAttribute('data-view');
        if (view === 'home' || view === 'favorites') setView(view);
        return;
      }
      var openBtn = event.target.closest('[data-open]');
      if (openBtn) { openCategory(openBtn.getAttribute('data-open')); return; }
      var tagBtn = event.target.closest('[data-tag]');
      if (tagBtn) { state.tag = tagBtn.getAttribute('data-tag'); renderChips(); renderResources(); return; }
      var osBtn = event.target.closest('[data-os]');
      if (osBtn) { state.os = osBtn.getAttribute('data-os'); renderChips(); renderResources(); return; }
      var favBtn = event.target.closest('[data-fav]');
      if (favBtn) {
        var url = favBtn.getAttribute('data-fav');
        var item = RESOURCES.find(function (entry) { return entry.url === url; });
        if (!item) return;
        toggleFavorite(item);
        if (state.view === 'favorites') renderFavorites();
        else if (state.view === 'category') renderResources();
        return;
      }
      if (!event.target.closest('.search') && el.searchResults) el.searchResults.classList.remove('open');
    });

    var timer = null;
    if (el.search) {
      el.search.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () { search(el.search.value); }, 140);
      });
      el.search.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') { el.searchResults.classList.remove('open'); el.search.blur(); }
      });
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === '/' && document.activeElement && ['INPUT', 'TEXTAREA'].indexOf(document.activeElement.tagName) === -1) {
        event.preventDefault();
        if (el.search) el.search.focus();
      }
    });
  }

  function init() {
    setupSuggestLinks();
    renderHome();
    bindEvents();
  }

  function boot() {
    fetch('js/data.json', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        CATEGORIES = data.CATEGORIES || [];
        RESOURCES = data.RESOURCES || [];
        init();
      })
      .catch(function (err) {
        console.error(err);
        var grid = document.getElementById('cat-grid');
        if (grid) grid.innerHTML = '<div class="empty">Не удалось загрузить каталог</div>';
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
