// Мини-окно предпросмотра ресурса. Отдельная страница, открывается как popup.
// Читает имя ресурса из ?name=... и показывает превью, описание и статус доступности.

import { RESOURCES, CAT_BY_ID } from './data.js';
import { TAG_LABELS, OS_LABELS, RU_LABELS, RU_HINTS } from './labels.js';
import { findByName } from './catalog.js';
import { hostOf } from './search.js';
import { escapeHtml } from './search.js';

const $ = (sel) => document.querySelector(sel);

const tagLabel = (t) => TAG_LABELS[t] || t;
const osLabel = (o) => OS_LABELS[o] || o;
const ruLabel = (ru) => RU_LABELS[ru] || RU_LABELS.ok;

/** Имя файла превью: домен в kebab-case. */
export function previewFile(url) {
  const host = hostOf(url).toLowerCase();
  return host.replace(/[^a-z0-9]/g, '-') + '.jpg';
}

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('is-shown');
  setTimeout(() => t.classList.remove('is-shown'), 2200);
}

function render(r) {
  document.title = r.name + ' — MegaThread';
  const cat = CAT_BY_ID[r.cat];
  const ru = r.ru || 'ok';

  $('#pv-name').textContent = r.name;
  $('#pv-cat').textContent = cat ? cat.title : '';
  $('#pv-desc').textContent = r.desc;
  $('#pv-host').textContent = hostOf(r.url);

  const img = $('#pv-img');
  const shot = $('.pv__shot');
  img.src = 'previews/' + previewFile(r.url);
  img.alt = 'Скриншот сайта ' + r.name;
  img.addEventListener('error', () => {
    img.remove();
    shot.classList.add('pv__shot--empty');
    $('#pv-host').textContent = hostOf(r.url) + ' — превью недоступно';
  });

  $('#pv-meta').innerHTML =
    `<span class="ru ru--${ru}">${escapeHtml(ruLabel(ru))}</span>` +
    r.tags.map((t) => `<span class="tag">${escapeHtml(tagLabel(t))}</span>`).join('') +
    `<span class="tag tag--os">${escapeHtml(r.os.map(osLabel).join(', '))}</span>`;

  const note = $('#pv-note');
  if (r.note) {
    note.hidden = false;
    $('#pv-note-title').textContent = ruLabel(ru);
    $('#pv-note-text').textContent = r.note;
  } else {
    note.hidden = true;
  }

  $('#pv-open').href = r.url;

  const favBtn = $('#pv-fav');
  const syncFav = () => {
    const on = isFav(r.name);
    favBtn.textContent = on ? 'В избранном' : 'В избранное';
    favBtn.classList.toggle('is-star', on);
  };
  syncFav();
  favBtn.onclick = () => {
    toggleFav(r.name);
    syncFav();
    toast(isFav(r.name) ? 'Добавлено в избранное' : 'Убрано из избранного');
  };

  $('#pv-copy').onclick = async () => {
    try {
      await navigator.clipboard.writeText(r.url);
      toast('Скопировано');
    } catch {
      toast('Не удалось скопировать');
    }
  };

  $('#pv-full').href = 'index.html#/res/' + encodeURIComponent(r.name);

  const similar = RESOURCES.filter((x) => x.cat === r.cat && x.name !== r.name).slice(0, 5);
  if (similar.length) {
    $('#pv-similar').hidden = false;
    $('#pv-similar-list').innerHTML = similar
      .map(
        (s) => `<li>
        <a href="#" data-name="${escapeHtml(s.name)}">${escapeHtml(s.name)}</a>
        <span class="ru ru--${s.ru || 'ok'}">${escapeHtml(ruLabel(s.ru))}</span>
      </li>`
      )
      .join('');
    $('#pv-similar-list').addEventListener('click', (e) => {
      const a = e.target.closest('a[data-name]');
      if (!a) return;
      e.preventDefault();
      location.search = '?name=' + encodeURIComponent(a.dataset.name);
    });
  }

  document.body.classList.add('is-ready');
}

/* --- избранное: тот же ключ localStorage, что и у основного сайта --- */
const KEY = 'megathread.v1';

function readStore() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { favorites: [] };
    const p = JSON.parse(raw);
    return { favorites: Array.isArray(p.favorites) ? p.favorites : [] };
  } catch {
    return { favorites: [] };
  }
}

function writeStore(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* приватный режим */
  }
}

function isFav(name) {
  return readStore().favorites.includes(name);
}

function toggleFav(name) {
  const state = readStore();
  const i = state.favorites.indexOf(name);
  if (i >= 0) state.favorites.splice(i, 1);
  else state.favorites.unshift(name);
  writeStore(state);
  return i < 0;
}

/* --- старт --- */

const params = new URLSearchParams(location.search);
const name = params.get('name');
const resource = name ? findByName(name) : null;

if (resource) {
  render(resource);
} else {
  $('#pv-name').textContent = 'Ресурс не найден';
  $('#pv-desc').textContent = 'Такого ресурса нет в каталоге. Возможно, ссылка устарела.';
}

$('#pv-close').onclick = () => window.close();
$('#pv-catalog').onclick = () => window.close();

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') window.close();
});
