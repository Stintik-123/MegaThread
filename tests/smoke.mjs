/* Автотесты MegaThread: поднимает сервер, открывает сайт в headless Chromium
   и проверяет поведение. Запуск: node tests/smoke.mjs */
import { chromium } from 'playwright';
import { listen } from '../scripts/serve.mjs';
import { RESOURCES, CATEGORIES } from '../js/data.js';

/* Ожидания берём из самого каталога — тесты не расходятся с данными. */
const TOTAL = RESOURCES.length;
const CAT_COUNT = CATEGORIES.length;
const FIRST_CAT = CATEGORIES[0];
const TAGS = new Set(RESOURCES.flatMap((r) => r.tags || []));
const VPN_TAG = ['VPN', 'vpn', 'ВПН'].find((t) => TAGS.has(t));

const results = [];
let failures = 0;

function check(name, condition, detail = '') {
  const ok = Boolean(condition);
  if (!ok) failures++;
  results.push({ name, ok, detail });
  const mark = ok ? '  ok  ' : ' FAIL ';
  console.log(`[${mark}] ${name}${detail && !ok ? ' — ' + detail : ''}`);
}

const { server, port } = await listen(0);
const BASE = `http://127.0.0.1:${port}`;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message));

try {
  /* ---------- 1. главная страница ---------- */
  const res = await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  check('страница отдаёт 200', res.status() === 200, String(res.status()));
  check('заголовок содержит MegaThread', (await page.title()).includes('MegaThread'));

  /* ---------- 2. счётчики ---------- */
  const facts = await page.$$eval('.fact b', (nodes) => nodes.map((n) => n.textContent.trim()));
  check(`полоса фактов: ${TOTAL} ресурсов`, facts[0] === String(TOTAL), facts.join('/'));
  check(`полоса фактов: ${CAT_COUNT} разделов`, facts[1] === String(CAT_COUNT), facts.join('/'));
  check('полоса фактов: 4 показателя', facts.length === 4, String(facts.length));

  /* ---------- 3. плитка разделов ---------- */
  const cards = await page.$$('.catgrid .catcard');
  check(`${CAT_COUNT} карточек разделов отрисовано`, cards.length === CAT_COUNT, String(cards.length));

  /* ---------- 4. сайдбар ---------- */
  const sideLinks = await page.$$eval('#sidebar-cats .sidenav__link', (n) => n.length);
  check(`в сайдбаре ${CAT_COUNT} разделов`, sideLinks === CAT_COUNT, String(sideLinks));
  const sideCounts = await page.$$eval('#sidebar-cats .sidenav__count', (n) => n.length);
  check('у разделов в сайдбаре есть счётчики', sideCounts === CAT_COUNT, String(sideCounts));

  /* ---------- 5. весь каталог ---------- */
  await page.goto(BASE + '/index.html#/catalog', { waitUntil: 'networkidle' });
  await page.waitForSelector('#view-catalog.is-active', { timeout: 3000 });
  const total = await page.$$eval('#all-list .row', (n) => n.length);
  check('каталог выдаётся порциями по 48', total === 48, String(total));
  check('кнопка «показать ещё» видна', await page.isVisible('#more-btn'));
  await page.click('#more-btn');
  const total2 = await page.$$eval('#all-list .row', (n) => n.length);
  check('после «показать ещё» стало 96', total2 === 96, String(total2));

  /* ---------- 6. палитра поиска по Ctrl+K ---------- */
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.keyboard.press('Control+k');
  await page.waitForSelector('#palette[open]', { timeout: 3000 });
  check('Ctrl+K открывает палитру поиска', await page.isVisible('#palette[open]'));
  await page.fill('#palette-input', 'впн');
  await page.waitForSelector('#palette-results .palette__item', { timeout: 3000 });
  const hits = await page.$$eval('#palette-results .palette__item b', (nodes) =>
    nodes.map((n) => n.textContent.trim())
  );
  check('поиск «впн» что-то находит', hits.length > 0, hits.join(', '));
  const vpnNames = await page.evaluate(async (base) => {
    const mod = await import(base + '/js/data.js');
    return mod.RESOURCES.filter((r) => (r.tags || []).some((t) => /vpn/i.test(t))).map((r) => r.name);
  }, BASE);
  check(
    'в выдаче только VPN-ресурсы',
    vpnNames.length > 0 && hits.length > 0 && hits.every((h) => vpnNames.includes(h)),
    hits.join(', ')
  );

  /* ---------- 7. Enter открывает первый результат ---------- */
  await page.keyboard.press('Enter');
  await page.waitForSelector('#res-dialog[open]', { timeout: 3000 });
  const dialogTitle = await page.textContent('#res-dialog .modal__title');
  check('Enter открыл карточку найденного ресурса', Boolean(dialogTitle && dialogTitle.trim()), dialogTitle);
  check('палитра закрылась после Enter', !(await page.isVisible('#palette[open]')));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  check('Escape закрыл карточку', !(await page.isVisible('#res-dialog[open]')));

  /* ---------- 8. «/» тоже открывает палитру ---------- */
  await page.keyboard.press('/');
  await page.waitForSelector('#palette[open]', { timeout: 3000 });
  const focused = await page.evaluate(() => document.activeElement.id);
  check('«/» открывает палитру и фокусирует поле', focused === 'palette-input', focused);
  await page.keyboard.press('Escape');

  /* ---------- 9. избранное сохраняется между перезагрузками ---------- */
  await page.goto(BASE + '/index.html#/catalog', { waitUntil: 'networkidle' });
  await page.waitForSelector('#view-catalog.is-active', { timeout: 3000 });
  const firstFav = await page.$('#all-list .row .ico[aria-pressed]');
  await firstFav.click();
  await page.waitForTimeout(250);
  const badge = await page.textContent('#fav-badge');
  check('счётчик избранного вырос до 1', badge.trim() === '1', badge);
  await page.reload({ waitUntil: 'networkidle' });
  const badgeAfter = await page.textContent('#fav-badge');
  check('избранное пережило перезагрузку', badgeAfter.trim() === '1', badgeAfter);

  /* ---------- 10. страница избранного ---------- */
  await page.click('.nav__link[href="#/favorites"]');
  await page.waitForSelector('#view-favorites.is-active', { timeout: 3000 });
  const favRows = await page.$$eval('#fav-list .row', (n) => n.length);
  check('в избранном одна запись', favRows === 1, String(favRows));

  /* ---------- 11. раздел: докс-список с группами ---------- */
  await page.click('.nav__link[href="#/"]');
  await page.waitForSelector('#view-home.is-active', { timeout: 3000 });
  await page.click(`.catgrid .catcard[href="#/cat/${FIRST_CAT.id}"]`);
  await page.waitForSelector('#view-category.is-active', { timeout: 3000 });
  const catTitle = await page.textContent('#cat-title');
  check(`открылся раздел «${FIRST_CAT.title}»`, catTitle.trim() === FIRST_CAT.title, catTitle);
  const groups = await page.$$eval('#cat-list .docgroup', (n) => n.length);
  check('раздел разбит на группы', groups >= 2, String(groups));
  const aiItems = await page.$$eval('#cat-list .docitem', (n) => n.length);
  const aiCount = await page.textContent('#cat-count');
  check('все ресурсы раздела попали в список', aiItems === Number(aiCount.trim()), `${aiItems} vs ${aiCount}`);
  const docNames = await page.$$eval('#cat-list .docitem__name', (n) => n.length);
  check('у каждой позиции есть название-ссылка', docNames === aiItems, `${docNames} vs ${aiItems}`);

  /* ---------- 12. deep-link ---------- */
  await page.goto(BASE + '/index.html#/cat/torrents', { waitUntil: 'networkidle' });
  await page.waitForSelector('#view-category.is-active', { timeout: 3000 });
  const tTitle = await page.textContent('#cat-title');
  const torrentsCat = CATEGORIES.find((c) => c.id === 'torrents');
  check('deep-link открыл раздел Торренты', tTitle.trim() === (torrentsCat ? torrentsCat.title : 'Торренты'), tTitle);
  const torrentGroups = await page.$$eval('#cat-list .docgroup__title', (n) => n.map((x) => x.textContent.trim()));
  check('в разделе торрентов есть группы', torrentGroups.length >= 2, torrentGroups.join(' | '));

  /* ---------- 13. сортировка ---------- */
  await page.goto(BASE + '/index.html#/catalog', { waitUntil: 'networkidle' });
  await page.waitForSelector('#view-catalog.is-active', { timeout: 3000 });
  await page.selectOption('#sort-select', 'name');
  const names = await page.$$eval('#all-list .row__name', (n) => n.map((x) => x.textContent.trim()));
  const sorted = [...names].sort((a, b) => a.localeCompare(b, 'ru'));
  check('сортировка по названию работает', JSON.stringify(names) === JSON.stringify(sorted));
  await page.reload({ waitUntil: 'networkidle' });
  const sortAfter = await page.inputValue('#sort-select');
  check('сортировка запомнилась', sortAfter === 'name', sortAfter);

  /* ---------- 14. фильтры пишутся в URL ---------- */
  await page.click('#all-tags .chip');
  await page.waitForTimeout(250);
  const url = page.url();
  check('фильтр записан в URL', url.includes('tags='), url);

  /* ---------- 15. фильтр по метке сужает список ---------- */
  await page.goto(BASE + '/index.html#/catalog', { waitUntil: 'networkidle' });
  await page.waitForSelector('#view-catalog.is-active', { timeout: 3000 });
  await page.click('#all-tags .chip--more');
  await page.waitForTimeout(250);
  await page.click('#all-tags .chip:has-text("VPN")');
  await page.waitForTimeout(300);
  const vpnCount = await page.$$eval('#all-list .row', (n) => n.length);
  const vpnTotal = RESOURCES.filter((r) => (r.tags || []).includes('VPN')).length;
  check(
    'фильтр «VPN» сузил выдачу',
    vpnCount > 0 && vpnCount === Math.min(vpnTotal, 48),
    `${vpnCount} при ${vpnTotal}`
  );
  const vpnRows = await page.$$eval('#all-list .row', (rows) =>
    rows.map((r) => [...r.querySelectorAll('.row__tags .tag')].map((t) => t.textContent.trim()))
  );
  check(
    'в выдаче только VPN-ресурсы',
    vpnRows.length > 0 && vpnRows.every((tags) => tags.includes('VPN')),
    JSON.stringify(vpnRows)
  );

  /* ---------- 16. платформенный фильтр ---------- */
  await page.goto(BASE + '/index.html#/catalog', { waitUntil: 'networkidle' });
  await page.waitForSelector('#view-catalog.is-active', { timeout: 3000 });
  const osChips = await page.$$eval('#all-os .chip', (n) => n.length);
  check('панель платформ отрисована', osChips === 6, String(osChips));
  await page.click('#all-os .chip:has-text("Windows")');
  await page.waitForTimeout(300);
  const winRows = await page.$$eval('#all-list .row', (n) => n.length);
  check('фильтр «Windows» сузил выдачу', winRows > 0 && winRows < TOTAL, String(winRows));
  const osInRows = await page.$$eval('#all-list .row__os', (n) => n.map((x) => x.textContent.trim()));
  check(
    'в выдаче только Windows-совместимые',
    osInRows.length > 0 && osInRows.every((t) => /Windows/.test(t) || /любая/i.test(t)),
    osInRows.slice(0, 4).join(' | ')
  );

  /* ---------- 17. панель меток свёрнута и раскрывается ---------- */
  await page.goto(BASE + '/index.html#/catalog', { waitUntil: 'networkidle' });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#view-catalog.is-active', { timeout: 3000 });
  const collapsedChips = await page.$$eval('#all-tags .chip:not(.chip--more)', (n) => n.length);
  check('метки свёрнуты в превью', collapsedChips === 10, String(collapsedChips));
  await page.click('#all-tags .chip--more');
  await page.waitForTimeout(250);
  const expandedChips = await page.$$eval('#all-tags .chip:not(.chip--more)', (n) => n.length);
  check('метки раскрываются полностью', expandedChips >= TAGS.size, `${expandedChips} vs ${TAGS.size}`);

  /* ---------- 18. горячие клавиши ---------- */
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.keyboard.press('?');
  await page.waitForSelector('#help-dialog[open]', { timeout: 3000 });
  check('«?» открывает подсказку', await page.isVisible('#help-dialog[open]'));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  check('Escape закрывает подсказку', !(await page.isVisible('#help-dialog[open]')));

  /* ---------- 19. тема сохраняется ---------- */
  await page.click('#theme-toggle');
  await page.waitForTimeout(250);
  const theme = await page.getAttribute('html', 'data-theme');
  check('тема переключилась', theme === 'dark' || theme === 'light', String(theme));
  await page.reload({ waitUntil: 'networkidle' });
  const themeAfter = await page.getAttribute('html', 'data-theme');
  check('тема пережила перезагрузку', themeAfter === theme, String(themeAfter));

  /* ---------- 20. недавние ---------- */
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.click('#start-grid .pick__name');
  await page.waitForSelector('#res-dialog[open]', { timeout: 3000 });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(350);
  check('блок недавних появился', await page.isVisible('#recent-block'));

  /* ---------- 21. статусы доступности ---------- */
  await page.goto(BASE + '/index.html#/catalog', { waitUntil: 'networkidle' });
  await page.waitForSelector('#view-catalog.is-active', { timeout: 3000 });
  const ruBadges = await page.$$eval('#all-list .ru', (n) => n.length);
  check('у строк каталога есть метка доступности', ruBadges > 0, String(ruBadges));
  const ruStates = await page.$$eval('#all-list .ru', (n) =>
    [...new Set(n.map((x) => [...x.classList].find((c) => c.startsWith('ru--'))))]
  );
  check(
    'метки используют понятные состояния',
    ruStates.every((s) => ['ru--ok', 'ru--limited', 'ru--blocked', 'ru--mirror'].includes(s)),
    ruStates.join(',')
  );
  const novpnCards = await page.$$eval('#novpn-grid .novpn', (n) => n.length);
  check('блок «открывается напрямую» наполнен', novpnCards >= 9, String(novpnCards));

  /* ---------- 22. подборки ---------- */
  await page.click('.nav__link[href="#/collections"]');
  await page.waitForSelector('#view-collections.is-active', { timeout: 3000 });
  const colCards = await page.$$eval('#view-collections .colcard', (n) => n.length);
  check('подборок не меньше восьми', colCards >= 8, String(colCards));
  const colItems = await page.$$eval('#view-collections .colcard__list li', (n) => n.length);
  check('в подборках есть ресурсы', colItems > 0, String(colItems));

  /* ---------- 23. облако меток ---------- */
  await page.click('.nav__link[href="#/tags"]');
  await page.waitForSelector('#view-tags.is-active', { timeout: 3000 });
  const cloudItems = await page.$$eval('.tagcloud__item', (n) => n.length);
  check('облако меток отрисовано', cloudItems >= TAGS.size, `${cloudItems} vs ${TAGS.size}`);
  await page.click('.tagcloud__item');
  await page.waitForSelector('#view-search.is-active', { timeout: 3000 });
  const tagResults = await page.$$eval('#search-list .row', (n) => n.length);
  check('переход по метке даёт выборку', tagResults > 0, String(tagResults));

  /* ---------- 24. текстовые страницы ---------- */
  await page.goto(BASE + '/index.html#/about', { waitUntil: 'networkidle' });
  await page.waitForSelector('#view-about.is-active', { timeout: 3000 });
  const aboutText = await page.textContent('#view-about');
  check('страница «О проекте» содержит легенду статусов', /Открывается|оговорк|зеркал/i.test(aboutText));
  await page.goto(BASE + '/index.html#/rules', { waitUntil: 'networkidle' });
  await page.waitForSelector('#view-rules.is-active', { timeout: 3000 });
  const rulesText = await page.textContent('#view-rules');
  check('страница правил не пустая', rulesText.length > 500, String(rulesText.length));

  /* ---------- 25. карточка ресурса со скриншотом ---------- */
  await page.goto(BASE + '/index.html#/catalog', { waitUntil: 'networkidle' });
  await page.waitForSelector('#view-catalog.is-active', { timeout: 3000 });
  await page.click('#all-list .row__name');
  await page.waitForSelector('#res-dialog[open]', { timeout: 3000 });
  const cardName = await page.textContent('#res-dialog-title');
  check('в карточке есть название ресурса', Boolean(cardName && cardName.trim()), String(cardName));
  const shotSrc = await page.getAttribute('#res-dialog-body [data-shot]', 'src');
  check('в карточке есть скриншот сайта', Boolean(shotSrc && shotSrc.includes('previews/')), String(shotSrc));
  const cardMeta = await page.textContent('#res-dialog-body .modal__meta');
  check(
    'в карточке есть статус доступности',
    /Открывается|оговорк|зеркал|Заблокирован/i.test(cardMeta),
    cardMeta.slice(0, 60)
  );
  const cardUrl = await page.getAttribute('#res-dialog-body .modal__actions a', 'href');
  check('в карточке есть ссылка на сайт', Boolean(cardUrl && cardUrl.startsWith('http')), String(cardUrl));

  // закрытие кнопкой
  await page.click('#res-dialog-body [data-close-res]');
  await page.waitForTimeout(250);
  check('карточка закрывается кнопкой', !(await page.isVisible('#res-dialog[open]')));

  // закрытие кликом по фону
  await page.click('#all-list .row__name');
  await page.waitForSelector('#res-dialog[open]', { timeout: 3000 });
  await page.mouse.click(8, 8);
  await page.waitForTimeout(250);
  check('карточка закрывается кликом по фону', !(await page.isVisible('#res-dialog[open]')));

  // закрытие по Esc
  await page.click('#all-list .row__name');
  await page.waitForSelector('#res-dialog[open]', { timeout: 3000 });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  check('карточка закрывается по Esc', !(await page.isVisible('#res-dialog[open]')));

  /* ---------- 26. статическая версия ---------- */
  const noJsContext = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    javaScriptEnabled: false,
  });
  const noJs = await noJsContext.newPage();
  await noJs.goto(BASE + '/noscript.html', { waitUntil: 'domcontentloaded' });
  const noJsItems = await noJs.$$eval('li', (n) => n.length);
  check(`без JS видно все ${TOTAL} ресурсов`, noJsItems === TOTAL, String(noJsItems));
  const noJsCats = await noJs.$$eval('section', (n) => n.length);
  check(`без JS видно ${CAT_COUNT} категорий`, noJsCats === CAT_COUNT, String(noJsCats));
  const noJsRu = await noJs.$$eval('li small', (n) =>
    n.filter((x) => /открывается|оговорк|зеркал|заблокирован/i.test(x.textContent)).length
  );
  check('без JS видны статусы доступности', noJsRu === TOTAL, String(noJsRu));
  await noJsContext.close();

  /* ---------- 27. манифест и иконки ---------- */
  const manifest = await page.evaluate(async (base) => {
    const r = await fetch(base + '/manifest.json');
    return r.json();
  }, BASE);
  check('манифест читается', manifest.name.includes('MegaThread'), manifest.name);
  check('в манифесте 2 иконки', manifest.icons.length === 2, String(manifest.icons.length));
  for (const ic of manifest.icons) {
    const ok = await page.evaluate(async (p) => (await fetch(p)).ok, '/' + ic.src);
    check('иконка ' + ic.src + ' доступна', ok);
  }

  /* ---------- 28. нет битых внутренних ссылок ---------- */
  const broken = await page.evaluate(async () => {
    const urls = [...document.querySelectorAll('a[href]')]
      .map((a) => a.getAttribute('href'))
      .filter((h) => h && !h.startsWith('http') && !h.startsWith('#'));
    const out = [];
    for (const u of urls) {
      const r = await fetch(u);
      if (!r.ok) out.push(u);
    }
    return out;
  });
  check('внутренние ссылки не битые', broken.length === 0, broken.join(', '));

  /* ---------- 29. консоль чистая ---------- */
  const realErrors = consoleErrors.filter((e) => !/favicon|manifest|sw\.js/i.test(e));
  check('консоль без ошибок', realErrors.length === 0, realErrors.join(' | '));

  /* ---------- 30. мобильная вёрстка ---------- */
  const mobile = await context.newPage();
  await mobile.setViewportSize({ width: 390, height: 844 });
  await mobile.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  check('на мобильном видна кнопка меню', await mobile.isVisible('#burger'));
  const overflow = await mobile.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check('нет горизонтального скролла на мобильном', overflow <= 1, String(overflow));
  await mobile.click('#burger');
  await mobile.waitForTimeout(350);
  check('сайдбар открывается по кнопке меню', await mobile.evaluate(() => document.body.classList.contains('nav-open')));
  await mobile.close();

} catch (err) {
  failures++;
  console.log('[ FAIL ] непойманная ошибка — ' + err.message);
  console.log(err.stack);
} finally {
  await browser.close();
  server.close();
}

const passed = results.filter((r) => r.ok).length;
console.log('\n' + '='.repeat(52));
console.log(`Пройдено: ${passed} из ${results.length}. Провалено: ${failures}`);
console.log('='.repeat(52));

process.exit(failures > 0 ? 1 : 0);
