/* Проверяет живость всех доменов каталога и вычищает мёртвые.
   Запуск: node scripts/probe-catalog.mjs */
import fs from 'node:fs';
import { RESOURCES } from '../js/data.js';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const unique = new Map();
for (const r of RESOURCES) {
  const host = new URL(r.url).hostname.replace(/^www\./, '');
  if (!unique.has(host)) unique.set(host, r.url);
}

const items = [...unique].map(([host, url]) => ({ host, url }));
console.log('доменов к проверке:', items.length);

const dead = new Set();
let done = 0;
let alive = 0;

async function check(item) {
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 12000);
    const res = await fetch(item.url, {
      method: 'GET',
      redirect: 'follow',
      signal: ctl.signal,
      headers: { 'User-Agent': UA, 'Accept-Language': 'ru,en;q=0.8' },
    });
    clearTimeout(timer);
    if (res.status >= 500) throw new Error('status ' + res.status);
    await res.arrayBuffer();
    alive++;
  } catch {
    dead.add(item.host);
  }
  done++;
  if (done % 50 === 0) console.log(`  проверено ${done}/${items.length}, живых ${alive}`);
}

const queue = [...items];
await Promise.all(
  Array.from({ length: 16 }, async () => {
    while (queue.length) {
      const item = queue.shift();
      await check(item);
    }
  })
);

fs.writeFileSync('scripts/dead-domains.json', JSON.stringify([...dead], null, 2), 'utf8');
console.log('живых:', alive, '| мёртвых:', dead.size);
