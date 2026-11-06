import { chromium } from 'playwright';

const url = process.argv[2] || 'https://stintik-123.github.io/MegaThread/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('console', (m) => console.log('CONSOLE', m.type(), m.text()));
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
page.on('requestfailed', (r) => console.log('REQFAIL', r.url(), r.failure()?.errorText));
await page.goto(url, { waitUntil: 'networkidle' });

const info = await page.evaluate(() => {
  const out = { sheets: [] };
  for (const s of document.styleSheets) {
    let n = -1, err = null;
    try { n = s.cssRules.length; } catch (e) { err = String(e); }
    out.sheets.push({ href: s.href, rules: n, err, disabled: s.disabled });
  }
  const pick = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { display: cs.display, width: cs.width, fontSize: cs.fontSize, color: cs.color, background: cs.backgroundColor, textAlign: cs.textAlign };
  };
  out.body = pick('body');
  out.shell = pick('.shell');
  out.sidebar = pick('.sidebar');
  out.searchbtn = pick('.searchbtn');
  out.hero = pick('.hero');
  out.headerInner = pick('.header__inner');
  out.rootVars = {
    bg: getComputedStyle(document.documentElement).getPropertyValue('--bg'),
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent'),
    fsBody: getComputedStyle(document.documentElement).getPropertyValue('--fs-body'),
  };
  return out;
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
