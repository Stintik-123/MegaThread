/* Оформление репозитория на GitHub: описание, теги, домашняя страница, Pages.
   Учётные данные берутся из git-credential-helper и НИКОГДА не печатаются.
   Запуск: node scripts/publish-repo.mjs */
import { spawn } from 'node:child_process';

const OWNER = 'Stintik-123';
const REPO = 'MegaThread';
const API = 'https://api.github.com';

const DESCRIPTION =
  'Пиратский сборник: 1386 ссылок в 9 разделах (торренты, кино, аниме, игры, книги, музыка, обход блокировок, инструменты, файлообменники). Поиск по Ctrl+K, избранное, PWA, работа офлайн.';
const TOPICS = [
  'static-site', 'pwa', 'catalog', 'resources', 'piracy',
  'russian-language', 'torrents', 'privacy', 'awesome-list',
  'vanilla-js', 'offline-first', 'no-build', 'directory', 'ru-piracy',
];
const HOMEPAGE = 'https://stintik-123.github.io/MegaThread/';

/** Просит git-хранилище учётных данных. Секрет возвращается, но не печатается. */
function getCredential() {
  return new Promise((resolve) => {
    const p = spawn('git', ['credential', 'fill'], { windowsHide: true });
    let out = '';
    p.stdout.on('data', (d) => (out += d.toString()));
    p.on('close', () => {
      const cred = {};
      for (const line of out.split('\n')) {
        const i = line.indexOf('=');
        if (i > 0) cred[line.slice(0, i)] = line.slice(i + 1);
      }
      resolve(cred.username && cred.password ? cred : null);
    });
    p.stdin.end('protocol=https\nhost=github.com\n\n');
  });
}

async function api(cred, method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'megathread-publisher',
      Authorization: 'Basic ' + Buffer.from(cred.username + ':' + cred.password).toString('base64'),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: res.status, data };
}

const cred = await getCredential();
if (!cred) {
  console.log('Учётные данные GitHub не найдены в git-хранилище. Пропускаю оформление.');
  process.exit(2);
}
console.log('Учётные данные найдены для пользователя: ' + cred.username);

/* --- описание, теги, домашняя страница --- */
const patch = await api(cred, 'PATCH', `/repos/${OWNER}/${REPO}`, {
  description: DESCRIPTION,
  homepage: HOMEPAGE,
  topics: TOPICS,
});
if (patch.status === 200) {
  console.log('Описание обновлено: ' + patch.data.description);
  console.log('Домашняя страница: ' + patch.data.homepage);
} else {
  console.log('Не удалось обновить описание — HTTP ' + patch.status);
  console.log(JSON.stringify(patch.data).slice(0, 300));
}

/* --- теги: отдельный эндпоинт --- */
const topics = await api(cred, 'PUT', `/repos/${OWNER}/${REPO}/topics`, { names: TOPICS });
if (topics.status === 200) {
  console.log('Темы: ' + (topics.data.names || []).join(', '));
} else {
  console.log('Не удалось поставить теги — HTTP ' + topics.status);
  console.log(JSON.stringify(topics.data).slice(0, 300));
}

/* --- GitHub Pages --- */
const pages = await api(cred, 'GET', `/repos/${OWNER}/${REPO}/pages`);
if (pages.status === 404) {
  const create = await api(cred, 'POST', `/repos/${OWNER}/${REPO}/pages`, {
    source: { branch: 'main', path: '/' },
  });
  console.log(
    create.status < 300
      ? 'Pages включены: ' + (create.data.html_url || HOMEPAGE)
      : 'Pages не включились автоматически — HTTP ' + create.status
  );
} else if (pages.status === 200) {
  console.log('Pages уже настроены: ' + pages.data.html_url);
} else {
  console.log('Не удалось проверить Pages — HTTP ' + pages.status);
}

/* --- проверка --- */
const check = await api(cred, 'GET', `/repos/${OWNER}/${REPO}`);
if (check.status === 200) {
  console.log('Итог: ' + check.data.full_name + ' · ' + check.data.description);
  console.log('Звёзд: ' + check.data.stargazers_count + ' · вилок: ' + check.data.forks_count);
}
