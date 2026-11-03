// Хэш-роутинг: #/, #/cat/<id>, #/favorites, #/res/<имя>.

export function parseHash(hash = location.hash) {
  const raw = String(hash || '').replace(/^#/, '');
  const [path, queryString = ''] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  const params = new URLSearchParams(queryString);

  if (!parts.length) return { name: 'home', params };
  if (parts[0] === 'favorites') return { name: 'favorites', params };
  if (parts[0] === 'collections') return { name: 'collections', params };
  if (parts[0] === 'tags') return { name: 'tags', params };
  if (parts[0] === 'about') return { name: 'about', params };
  if (parts[0] === 'rules') return { name: 'rules', params };
  if (parts[0] === 'search') return { name: 'search', params };
  if (parts[0] === 'cat' && parts[1]) return { name: 'category', cat: decodeURIComponent(parts[1]), params };
  if (parts[0] === 'res' && parts[1]) return { name: 'resource', res: decodeURIComponent(parts[1]), params };
  return { name: 'home', params };
}

export function buildHash(name, opts = {}) {
  switch (name) {
    case 'category':
      return '#/cat/' + encodeURIComponent(opts.cat);
    case 'favorites':
      return '#/favorites';
    case 'collections':
      return '#/collections';
    case 'tags':
      return '#/tags';
    case 'about':
      return '#/about';
    case 'rules':
      return '#/rules';
    case 'resource':
      return '#/res/' + encodeURIComponent(opts.res);
    case 'search': {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(opts.params || {})) {
        if (v) params.set(k, v);
      }
      const q = params.toString();
      return q ? '#/search?' + q : '#/search';
    }
    default: {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(opts.params || {})) {
        if (v && v.length) params.set(k, v.join(','));
      }
      const q = params.toString();
      return q ? '#/?' + q : '#/';
    }
  }
}

export function navigate(hash, { replace = false } = {}) {
  if (replace) {
    history.replaceState(null, '', hash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    location.hash = hash;
  }
}

/** Читает текущие фильтры из URL. */
export function readFilters(params) {
  const tags = params.get('tags');
  const os = params.get('os');
  return {
    tags: tags ? tags.split(',').filter(Boolean) : [],
    os: os ? os.split(',').filter(Boolean) : [],
  };
}

/** Записывает фильтры в URL (без перезагрузки и без записи в историю). */
export function writeFilters(filters) {
  const params = new URLSearchParams();
  if (filters.tags && filters.tags.length) params.set('tags', filters.tags.join(','));
  if (filters.os && filters.os.length) params.set('os', filters.os.join(','));
  const q = params.toString();
  const hash = q ? '#/?' + q : '#/';
  history.replaceState(null, '', hash);
}
