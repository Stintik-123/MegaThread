/* Обновляет подборки на старте, числа в OG и README под новый каталог. */
import fs from 'node:fs';
import { RESOURCES, CATEGORIES } from '../js/data.js';

const names = RESOURCES.map((r) => r.name);
const pick = (want) => names.find((n) => n.toLowerCase() === want.toLowerCase()) || names.find((n) => n.toLowerCase().includes(want.toLowerCase()));

const WANTS = ['RuTracker', 'rutor.info', 'LibGen', 'Nyaa', 'FitGirl Repacks', 'AmneziaVPN', "Anna's Archive", 'qBittorrent', 'uBlock Origin', 'TorrentGalaxy', 'Wotaku', 'Z-Library'];
const picks = WANTS.map(pick).filter(Boolean);

const tagCount = new Set(RESOURCES.flatMap((r) => r.tags)).size;
const okCount = RESOURCES.filter((r) => (r.ru || 'ok') === 'ok').length;

console.log('ресурсов', RESOURCES.length, '| разделов', CATEGORIES.length, '| меток', tagCount, '| открываются', okCount);
console.log('подборки на старте:', picks.join(', '));

// --- app.js: подборки на старте ---
let app = fs.readFileSync('js/app.js', 'utf8');
app = app.replace(
  /const START_PICKS = \[[\s\S]*?\];/,
  `const START_PICKS = [\n  ${picks.map((n) => `'${n.replace(/'/g, "\\'")}'`).join(', ')},\n];`
);
fs.writeFileSync('js/app.js', app, 'utf8');

// --- OG-обложка ---
let og = fs.readFileSync('scripts/make-og.mjs', 'utf8');
og = og.replace(/<b>\d+<\/b><span>ресурсов<\/span>/, `<b>${RESOURCES.length}</b><span>ресурсов</span>`);
og = og.replace(/<b>\d+<\/b><span>разделов<\/span>/, `<b>${CATEGORIES.length}</b><span>разделов</span>`);
og = og.replace(/<b>\d+<\/b><span>открываются сразу<\/span>/, `<b>${okCount}</b><span>открываются сразу</span>`);
og = og.replace(/<b>\d+<\/b><span>меток<\/span>/, `<b>${tagCount}</b><span>меток</span>`);
fs.writeFileSync('scripts/make-og.mjs', og, 'utf8');

// --- README ---
let readme = fs.readFileSync('README.md', 'utf8');
readme = readme.replace(/\*\*\d+ ресурсов? в \d+ категориях\.\*\*/, `**${RESOURCES.length} ссылок в ${CATEGORIES.length} пиратских разделах.**`);
readme = readme.replace(/13 категорий, \d+ ресурсов/, `${CATEGORIES.length} разделов, ${RESOURCES.length} ссылок`);
readme = readme.replace(/\d+ метки? и 5 платформ/, `${tagCount} меток и 5 платформ`);
readme = readme.replace(/13 карточек/, `${CATEGORIES.length} карточек`);
fs.writeFileSync('README.md', readme, 'utf8');

console.log('обновлено: app.js, make-og.mjs, README.md');
