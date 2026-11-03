import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { listen } from './serve.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { server, port } = await listen(0);
const BASE = `http://127.0.0.1:${port}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(BASE + '/previews/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: path.join(ROOT, '.shots', '09-previews.png') });

// мини-окно
const p2 = await browser.newPage({ viewport: { width: 540, height: 760 } });
await p2.goto(BASE + '/preview.html?name=' + encodeURIComponent('Proton VPN'), { waitUntil: 'networkidle' });
await p2.waitForTimeout(900);
await p2.screenshot({ path: path.join(ROOT, '.shots', '10-preview-window.png') });

await browser.close();
server.close();
console.log('ok');
