/* Пересобирает noscript.html из js/data.js.
   Запуск: node scripts/generate-fallback.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const { CATEGORIES, RESOURCES } = await import(
  pathToFileURL(path.join(ROOT, 'js', 'data.js')).href + `?t=${Date.now()}`
);

const OS_LABELS = {
  w: 'Windows', m: 'macOS', l: 'Linux', a: 'Android', i: 'iOS', any: 'любая ОС',
};
const TAG_LABELS = {
  'APK': 'APK', 'P2P': 'P2P', 'ROM': 'ROM', 'VPN': 'VPN', 'adblock': 'adblock',
  'iOS': 'iOS', 'аниме': 'аниме', 'аудио': 'аудио', 'безопасность': 'безопасность',
  'бесплатно': 'бесплатно', 'браузеры': 'браузеры', 'видео': 'видео', 'гайды': 'гайды',
  'документация': 'документация', 'индексы': 'индексы', 'инструменты': 'инструменты',
  'картинки': 'картинки', 'клиенты': 'клиенты', 'книги': 'книги', 'комиксы': 'комиксы',
  'курсы': 'курсы', 'легально': 'легально', 'манга': 'манга', 'моды': 'моды',
  'наука': 'наука', 'поиск': 'поиск', 'почта': 'почта', 'приватность': 'приватность',
  'приложения': 'приложения', 'радио': 'радио', 'разработка': 'разработка',
  'расширения': 'расширения', 'русский': 'русский', 'системные': 'системные',
  'скачивание': 'скачивание', 'стриминг': 'стриминг', 'торренты': 'торренты',
  'трекеры': 'трекеры', 'утилиты': 'утилиты', 'файлообменники': 'файлообменники',
  'чаты': 'чаты', 'эмуляторы': 'эмуляторы',
};

const RU_LABELS = {
  ok: 'открывается',
  limited: 'работает с оговорками',
  blocked: 'заблокирован',
  mirror: 'нужно зеркало',
};

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const plural = (n) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'ресурс';
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'ресурса';
  return 'ресурсов';
};

const sections = CATEGORIES.map((cat) => {
  const items = RESOURCES.filter((r) => r.cat === cat.id);
  const li = items
    .map((r) => {
      const tags = r.tags.map((t) => TAG_LABELS[t] || t).join(', ');
      const os = r.os.map((o) => OS_LABELS[o] || o).join(', ');
      const ru = RU_LABELS[r.ru || 'ok'];
      const note = r.note ? `<em>${esc(r.note)}</em>` : '';
      return `    <li><a href="${esc(r.url)}" rel="noopener noreferrer">${esc(r.name)}</a>
      <span>${esc(r.desc)}</span>
      <small>${esc(tags)} · ${esc(os)} · ${esc(ru)}</small>${note ? '\n      ' + note : ''}</li>`;
    })
    .join('\n');
  return `  <section>
  <h2>${esc(cat.title)}</h2>
  <p class="cat-desc">${esc(cat.desc)} — ${items.length} ${plural(items.length)}</p>
  <ul>
${li}
  </ul>
</section>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MegaThread — каталог без JavaScript</title>
<meta name="description" content="Полный список бесплатных ресурсов MegaThread в виде обычной страницы.">
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/base.css">
<style>
  body { padding: var(--s6) var(--s4) var(--s8); }
  .wrap { width: min(880px, 100%); margin-inline: auto; }
  h1 { font-size: clamp(26px, 5vw, 38px); margin: 0 0 var(--s3); }
  h2 { font-size: 19px; margin: 0 0 var(--s2); }
  .lead { color: var(--fg-muted); margin: 0 0 var(--s6); }
  section { border-top: var(--border) solid var(--line); padding: var(--s5) 0; }
  .cat-desc { color: var(--fg-faint); font-size: 14px; margin: 0 0 var(--s3); }
  ul { display: grid; gap: var(--s3); }
  li { border: var(--border) solid var(--line); padding: var(--s3) var(--s4); }
  li a { font-weight: 600; }
  li a:hover { color: var(--accent); }
  li span { display: block; color: var(--fg-muted); font-size: 14px; }
  li small { display: block; color: var(--fg-faint); font-size: 12px; margin-top: 4px; }
  li em { display: block; color: var(--fg-muted); font-size: 12px; margin-top: 4px; font-style: normal; }
  .legend { border: var(--border) solid var(--line); padding: var(--s3); margin-bottom: var(--s5); font-size: 13px; }
  .legend b { display: block; margin-bottom: 4px; }
</style>
</head>
<body>
<div class="wrap">
  <h1>MegaThread — каталог бесплатных ресурсов</h1>
  <p class="lead">Эта страница работает без JavaScript: ${RESOURCES.length} ресурсов в ${CATEGORIES.length} категориях.
  <a href="index.html">Вернуться к интерактивной версии</a>.</p>
  <div class="legend">
    <b>Доступность</b>
    У каждого ресурса указана метка: «открывается», «работает с оговорками», «нужно зеркало».
    Если в заметке есть подробности — они идут под описанием.
  </div>
${sections}
</div>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'noscript.html'), html, 'utf8');
console.log(
  'noscript.html: ' + CATEGORIES.length + ' категорий, ' + RESOURCES.length + ' ресурсов'
);
