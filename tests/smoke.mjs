/* Автотесты MegaThread: поднимает сервер, открывает сайт в headless Chromium
   и проверяет поведение. Запуск: node tests/smoke.mjs */
import { chromium } from 'playwright';
import { listen } from '../scripts/serve.mjs';

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
  check('полоса фактов: 237 ресурсов', facts[0] === '237', facts.join('/'));
  check('полоса фактов: 13 категорий', facts[1] === '13', facts.join('/'));
  check('полоса фактов: 4 показателя', facts.length === 4, String(facts.length));

  /* ---------- 3. категории ---------- */
  const cats = await page.$$('.catline');
  check('13 категорий отрисовано', cats.length === 13, String(cats.length));

  /* ---------- 4. каталог ---------- */
  const total = await page.$$eval('#all-list .row', (n) => n.length);
  check('каталог выдаётся порциями по 48', total === 48, String(total));
  const moreVisible = await page.isVisible('#more-btn');
  check('кнопка «показать ещё» видна', moreVisible);

  await page.click('#more-btn');
  const total2 = await page.$$eval('#all-list .row', (n) => n.length);
  check('после «показать ещё» стало 96', total2 === 96, String(total2));

  /* ---------- 5. поиск с синонимом ---------- */
  await page.fill('#search', 'впн');
  await page.waitForSelector('#search-results .hit', { timeout: 3000 });
  const hits = await page.$$eval('#search-results .hit', (nodes) =>
    nodes.map((n) => n.querySelector('b').textContent.trim())
  );
  check('поиск «впн» находит Proton VPN', hits.some((h) => /Proton VPN/i.test(h)), hits.join(', '));
  check('поиск «впн» находит Mullvad', hits.some((h) => /Mullvad/i.test(h)), hits.join(', '));
  const marked = await page.$$eval('#search-results mark', (n) => n.length);
  check('совпадения подсвечены', marked > 0, String(marked));
  const vpnNames = await page.evaluate(async (base) => {
    const mod = await import(base + '/js/data.js');
    return mod.RESOURCES.filter((r) => r.tags.includes('VPN')).map((r) => r.name);
  }, BASE);
  check(
    'в выдаче только VPN-ресурсы',
    hits.length >= 3 && hits.every((h) => vpnNames.includes(h)),
    hits.join(', ')
  );

  /* ---------- 6. Enter открывает первый результат ---------- */
  await page.press('#search', 'Enter');
  await page.waitForSelector('#res-dialog[open]', { timeout: 3000 });
  const dialogTitle = await page.textContent('#res-dialog .modal__title');
  check('Enter открыл карточку VPN-ресурса', /VPN/i.test(dialogTitle), dialogTitle);
  const firstHitName = await page.evaluate(() => {
    const el = document.querySelector('#search-results .hit b');
    return el ? el.textContent.trim() : '';
  });
  check('открыт именно первый результат выдачи', dialogTitle.trim() === firstHitName, `${dialogTitle} vs ${firstHitName}`);
  await page.keyboard.press('Escape');
  await page.waitForSelector('#res-dialog[open]', { state: 'detached', timeout: 2000 }).catch(() => {});
  check('Escape закрыл карточку', !(await page.isVisible('#res-dialog[open]')));

  /* ---------- 7. избранное сохраняется между перезагрузками ---------- */
  await page.fill('#search', '');
  const firstFav = await page.$('#all-list .row .ico[aria-pressed]');
  await firstFav.click();
  await page.waitForTimeout(200);
  const badge = await page.textContent('#fav-badge');
  check('счётчик избранного вырос до 1', badge.trim() === '1', badge);
  await page.reload({ waitUntil: 'networkidle' });
  const badgeAfter = await page.textContent('#fav-badge');
  check('избранное пережило перезагрузку', badgeAfter.trim() === '1', badgeAfter);

  /* ---------- 8. страница избранного ---------- */
  await page.click('.nav__link[href="#/favorites"]');
  await page.waitForSelector('#view-favorites.is-active', { timeout: 3000 });
  const favRows = await page.$$eval('#fav-list .row', (n) => n.length);
  check('в избранном одна запись', favRows === 1, String(favRows));

  /* ---------- 9. маршрут категории ---------- */
  await page.click('.nav__link[href="#/"]');
  await page.waitForSelector('#view-home.is-active', { timeout: 3000 });
  await page.click('.catline[data-cat="ai"]');
  await page.waitForSelector('#view-category.is-active', { timeout: 3000 });
  const catTitle = await page.textContent('#cat-title');
  check('открылась категория ИИ', catTitle.trim() === 'ИИ', catTitle);
  const catCount = await page.textContent('#cat-count');
  check('в категории ИИ 20 ресурсов', catCount.trim() === '20', catCount);
  const aiRows = await page.$$eval('#cat-list .row', (n) => n.length);
  check('строки категории отрисованы', aiRows === 20, String(aiRows));

  /* ---------- 10. deep-link ---------- */
  await page.goto(BASE + '/index.html#/cat/torrents', { waitUntil: 'networkidle' });
  await page.waitForSelector('#view-category.is-active', { timeout: 3000 });
  const tTitle = await page.textContent('#cat-title');
  check('deep-link открыл категорию Торренты', tTitle.trim() === 'Торренты', tTitle);

  /* ---------- 11. сортировка ---------- */
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.selectOption('#sort-select', 'name');
  const names = await page.$$eval('#all-list .row__name', (n) => n.map((x) => x.textContent.trim()));
  const sorted = [...names].sort((a, b) => a.localeCompare(b, 'ru'));
  check('сортировка по названию работает', JSON.stringify(names) === JSON.stringify(sorted));
  await page.reload({ waitUntil: 'networkidle' });
  const sortAfter = await page.inputValue('#sort-select');
  check('сортировка запомнилась', sortAfter === 'name', sortAfter);

  /* ---------- 12. фильтры пишутся в URL ---------- */
  await page.click('#all-tags .chip');
  await page.waitForTimeout(200);
  const url = page.url();
  check('фильтр записан в URL', url.includes('tags='), url);

  /* ---------- 13. фильтр по метке сужает список ---------- */
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.click('#all-tags .chip--more');
  await page.waitForTimeout(200);
  await page.click('#all-tags .chip:has-text("VPN")');
  await page.waitForTimeout(300);
  const vpnCount = await page.$$eval('#all-list .row', (n) => n.length);
  check('фильтр «VPN» сузил выдачу', vpnCount > 0 && vpnCount < 48, String(vpnCount));
  const vpnRows = await page.$$eval('#all-list .row', (rows) =>
    rows.map((r) => [...r.querySelectorAll('.row__tags .tag')].map((t) => t.textContent.trim()))
  );
  check(
    'в выдаче только VPN-ресурсы',
    vpnRows.length > 0 && vpnRows.every((tags) => tags.includes('VPN')),
    JSON.stringify(vpnRows)
  );

  /* ---------- 14. платформенный фильтр ---------- */
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  const osChips = await page.$$eval('#all-os .chip', (n) => n.length);
  check('панель платформ отрисована', osChips === 6, String(osChips));
  await page.click('#all-os .chip:has-text("Windows")');
  await page.waitForTimeout(300);
  const winRows = await page.$$eval('#all-list .row', (n) => n.length);
  check('фильтр «Windows» сузил выдачу', winRows > 0 && winRows < 237, String(winRows));
  const osInRows = await page.$$eval('#all-list .row__os', (n) => n.map((x) => x.textContent.trim()));
  check(
    'в выдаче только Windows-совместимые',
    osInRows.length > 0 && osInRows.every((t) => /Windows/.test(t) || /любая/i.test(t)),
    osInRows.slice(0, 4).join(' | ')
  );

  /* ---------- 15. панель меток свёрнута и раскрывается ---------- */
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  const collapsedChips = await page.$$eval('#all-tags .chip:not(.chip--more)', (n) => n.length);
  check('метки свёрнуты в превью', collapsedChips === 10, String(collapsedChips));
  await page.click('#all-tags .chip--more');
  await page.waitForTimeout(200);
  const expandedChips = await page.$$eval('#all-tags .chip:not(.chip--more)', (n) => n.length);
  check('метки раскрываются полностью', expandedChips > 30, String(expandedChips));

  /* ---------- 16. горячие клавиши ---------- */
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.keyboard.press('/');
  const focused = await page.evaluate(() => document.activeElement.id);
  check('«/» фокусирует поиск', focused === 'search', focused);

  await page.keyboard.press('Escape');
  await page.keyboard.press('?');
  await page.waitForSelector('#help-dialog[open]', { timeout: 3000 });
  check('«?» открывает подсказку', await page.isVisible('#help-dialog[open]'));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  check('Escape закрывает подсказку', !(await page.isVisible('#help-dialog[open]')));

  /* ---------- 15. тема сохраняется ---------- */
  await page.click('#theme-toggle');
  await page.waitForTimeout(200);
  const theme = await page.getAttribute('html', 'data-theme');
  check('тема переключилась', theme === 'dark' || theme === 'light', String(theme));
  await page.reload({ waitUntil: 'networkidle' });
  const themeAfter = await page.getAttribute('html', 'data-theme');
  check('тема пережила перезагрузку', themeAfter === theme, String(themeAfter));

  /* ---------- 16. недавние ---------- */
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.click('#start-grid .pick__name');
  await page.waitForSelector('#res-dialog[open]', { timeout: 3000 });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const recentVisible = await page.isVisible('#recent-block');
  check('блок недавних появился', recentVisible);

  /* ---------- 17. статусы доступности ---------- */
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
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

  /* ---------- 18. подборки ---------- */
  await page.click('.nav__link[href="#/collections"]');
  await page.waitForSelector('#view-collections.is-active', { timeout: 3000 });
  const colCards = await page.$$eval('.colcard', (n) => n.length);
  check('подборок не меньше восьми', colCards >= 8, String(colCards));
  const colItems = await page.$$eval('.colcard__list li', (n) => n.length);
  check('в подборках есть ресурсы', colItems > 0, String(colItems));

  /* ---------- 19. облако меток ---------- */
  await page.click('.nav__link[href="#/tags"]');
  await page.waitForSelector('#view-tags.is-active', { timeout: 3000 });
  const cloudItems = await page.$$eval('.tagcloud__item', (n) => n.length);
  check('облако меток отрисовано', cloudItems >= 40, String(cloudItems));
  await page.click('.tagcloud__item');
  await page.waitForSelector('#view-search.is-active', { timeout: 3000 });
  const tagResults = await page.$$eval('#search-list .row', (n) => n.length);
  check('переход по метке даёт выборку', tagResults > 0, String(tagResults));

  /* ---------- 20. текстовые страницы ---------- */
  await page.goto(BASE + '/index.html#/about', { waitUntil: 'networkidle' });
  await page.waitForSelector('#view-about.is-active', { timeout: 3000 });
  const aboutText = await page.textContent('#view-about');
  check('страница «О проекте» содержит легенду статусов', /Открывается|оговорк|зеркал/i.test(aboutText));
  await page.goto(BASE + '/index.html#/rules', { waitUntil: 'networkidle' });
  await page.waitForSelector('#view-rules.is-active', { timeout: 3000 });
  const rulesText = await page.textContent('#view-rules');
  check('страница правил не пустая', rulesText.length > 500, String(rulesText.length));

  /* ---------- 21. карточка ресурса со скриншотом ---------- */
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
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
  const previewBtns = await page.$$('#all-list [data-preview]');
  check('в строках каталога нет кнопки мини-окна', previewBtns.length === 0, String(previewBtns.length));

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

  /* ---------- 22. статическая версия ---------- */
  const noJsContext = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    javaScriptEnabled: false,
  });
  const noJs = await noJsContext.newPage();
  await noJs.goto(BASE + '/noscript.html', { waitUntil: 'domcontentloaded' });
  const noJsItems = await noJs.$$eval('li', (n) => n.length);
  check('без JS видно все 237 ресурсов', noJsItems === 237, String(noJsItems));
  const noJsCats = await noJs.$$eval('section', (n) => n.length);
  check('без JS видно 13 категорий', noJsCats === 13, String(noJsCats));
  const noJsRu = await noJs.$$eval('li small', (n) => n.filter((x) => /открывается|оговорк|зеркал|заблокирован/i.test(x.textContent)).length);
  check('без JS видны статусы доступности', noJsRu === 237, String(noJsRu));
  await noJsContext.close();

  /* ---------- 18. манифест и иконки ---------- */
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

  /* ---------- 19. нет битых внутренних ссылок ---------- */
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

  /* ---------- 20. консоль чистая ---------- */
  const realErrors = consoleErrors.filter((e) => !/favicon|manifest|sw\.js/i.test(e));
  check('консоль без ошибок', realErrors.length === 0, realErrors.join(' | '));

  /* ---------- 21. мобильная вёрстка ---------- */
  const mobile = await context.newPage();
  await mobile.setViewportSize({ width: 390, height: 844 });
  await mobile.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  const bottomNav = await mobile.isVisible('.bottom');
  check('на мобильном видна нижняя навигация', bottomNav);
  const overflow = await mobile.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check('нет горизонтального скролла на мобильном', overflow <= 1, String(overflow));
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


