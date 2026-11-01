import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
for (const v of process.argv.slice(2)) {
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(String(e))); page.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await page.goto(`file:///workspace/outremer/docs/mockups/creation-${v}.html`); await page.waitForTimeout(200);
  const ov = await page.evaluate(() => { const p = document.querySelector('.phone'); return [p.scrollHeight, document.querySelector('.body').scrollHeight, document.querySelector('.body').clientHeight]; });
  await page.screenshot({ path: `/workspace/mockups/creation-${v}.png` });
  console.log(v, 'errors', errs, 'phone/body scroll/client', ov);
}
await browser.close();
