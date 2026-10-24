import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import vm from 'node:vm';

const memberSource = readFileSync(new URL('../member.js', import.meta.url), 'utf8');
const appSource = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const recordsKey = 'water-journey-records-v1';

// Run the real scripts together with isolated storage and inert DOM boundaries.
// Actual layout/clicks are checked separately in the browser on port 4174.
function boot({ hash = '#/member', stored = {}, storageUnavailable = false } = {}) {
  let now = Date.parse('2026-10-24T12:00:00.000Z');
  const storage = new Map(Object.entries(stored));
  const events = [];
  const element = () => ({
    innerHTML: '', dataset: {}, listeners: new Map(),
    classList: { add() {}, remove() {}, toggle() {} },
    addEventListener(type, fn) { this.listeners.set(type, [...(this.listeners.get(type) || []), fn]); },
    emit(type, event) { for (const fn of this.listeners.get(type) || []) fn(event); },
    querySelector() { return null; }, querySelectorAll() { return []; },
    setAttribute() {}, removeAttribute() {}, focus() {}, scrollTo() {}
  });
  const main = element();
  const nodes = new Map([['#main', main]]);
  const window = element();
  const document = {
    body: element(), hidden: false, title: '',
    querySelector(selector) {
      if (!['#main', '.skip', '.menu-toggle', '#navigation', '.header', '#toast'].includes(selector)) return null;
      if (!nodes.has(selector)) nodes.set(selector, element());
      return nodes.get(selector);
    },
    querySelectorAll() { return []; }, addEventListener() {},
    createTreeWalker() { return { nextNode() { return false; } }; },
    dispatchEvent(event) { events.push(event); }
  };
  const context = vm.createContext({
    document, window, location: { hash }, NodeFilter: { SHOW_TEXT: 4 },
    localStorage: {
      getItem(key) { if (storageUnavailable) throw new Error('disabled'); return storage.get(key) ?? null; },
      setItem(key, value) { if (storageUnavailable) throw new Error('disabled'); storage.set(key, value); }
    },
    Date: class extends Date { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } },
    crypto: { randomUUID },
    FormData: class { constructor(form) { this.values = form.values; } get(key) { return this.values[key] ?? null; } },
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init.detail; } },
    IntersectionObserver: class { observe() {} disconnect() {} },
    matchMedia() { return { matches: false, addEventListener() {} }; },
    setTimeout() { return 1; }, clearTimeout() {}, setInterval() { return 1; }, clearInterval() {},
    scrollTo() {}, console
  });
  vm.runInContext(memberSource, context, { filename: 'member.js' });
  vm.runInContext(appSource, context, { filename: 'app.js' });
  return {
    main, storage, events, document,
    navigate(hash) { context.location.hash = hash; vm.runInContext('render()', context); },
    click(attribute, value) {
      const key = attribute.replace(/^data-/, '').replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      const button = { dataset: { [key]: value }, hasAttribute: name => name === attribute, getAttribute: name => name === attribute ? value : null };
      main.emit('click', { target: { closest: selector => selector === 'button' ? button : null } });
    },
    record(brand, amount, valid = true) {
      now += 1000;
      main.emit('submit', { preventDefault() {}, target: { id: 'water-record-form', reportValidity: () => valid, values: { brand, amount: 'custom', custom: String(amount) } } });
    },
    externalClear() { storage.set(recordsKey, '[]'); window.emit('storage', { key: recordsKey }); }
  };
}

test('legacy check-in survives without inventing a volume; member routes stop water effects', () => {
  const app = boot({ hash: '#/activity/morning', stored: { 'water-checkin': '2026-10-24' } });
  assert.match(app.main.innerHTML, /今日 <b>0<\/b> mL/);
  assert.match(app.main.innerHTML, /连续记录 <b>1<\/b> 天/);
  assert.equal(app.document.body.dataset.page, 'member');
  assert.equal(app.events.at(-1).detail.home, false);
  app.navigate('#/');
  assert.equal(app.events.at(-1).detail.home, true);
  assert.match(app.main.innerHTML, /water-toggle/);
});

test('brand plan, amount totals, same-day progress, undo and restore work together', () => {
  const app = boot();
  app.record('origin', 250);
  app.navigate('#/brand/spring');
  app.click('data-journey-join', 'spring');
  app.navigate('#/member/daily/spring');
  app.record('spring', 500);
  app.record('spring', 125);
  assert.match(app.main.innerHTML, /今日 <b>875<\/b> mL/);
  app.navigate('#/brand/spring');
  assert.match(app.main.innerHTML, /已记录 1 \/ 21 天/);
  const last = JSON.parse(app.storage.get(recordsKey)).at(-1);
  app.navigate('#/member/records');
  app.click('data-journey-remove', last.id);
  assert.match(app.main.innerHTML, /2 次记录，共 0.75 L/);
  app.click('data-journey-undo', '');
  assert.match(app.main.innerHTML, /3 次记录，共 0.875 L/);
});

test('invalid and incomplete amounts never modify valid records', () => {
  const app = boot();
  app.record('origin', 250);
  const original = app.storage.get(recordsKey);
  for (const amount of [0, -1, 1.5, 5001, 'not-a-number']) app.record('origin', amount);
  app.record('unknown-brand', 250);
  app.record('origin', 500, false);
  assert.equal(app.storage.get(recordsKey), original);
});

test('disabled storage retains records for the session and explains the limitation', () => {
  const app = boot({ storageUnavailable: true });
  app.record('origin', 250);
  app.navigate('#/member');
  assert.match(app.main.innerHTML, /今日 <b>250<\/b> mL/);
  assert.equal(app.storage.size, 0);
});

test('cross-tab changes invalidate the memory cache and refresh member totals', () => {
  const app = boot();
  app.record('origin', 250);
  app.externalClear();
  assert.match(app.main.innerHTML, /今日 <b>0<\/b> mL/);
});

test('unknown member sections and brands use the existing not-found route', () => {
  const app = boot({ hash: '#/member/missing' });
  assert.match(app.main.innerHTML, /页面不存在/);
  app.navigate('#/brand/missing');
  assert.match(app.main.innerHTML, /页面不存在/);
});

test('current catalog keeps water, skincare and cards discoverable with valid local images', () => {
  const app = boot({ hash: '#/products' });
  assert.equal((app.main.innerHTML.match(/class="product-card"/g) || []).length, 6);
  const catalogHtml = app.main.innerHTML;
  for (const id of ['water', 'qiandao', 'jingshan', 'toner', 'mask', 'cards']) {
    assert.ok(catalogHtml.includes(`#/product/${id}`));
    app.navigate(`#/product/${id}`);
    assert.match(app.main.innerHTML, /建议零售价/);
    assert.match(app.main.innerHTML, /若水汇/);
    const image = app.main.innerHTML.match(/src="\.\/assets\/([^\"]+)" alt="若水汇/);
    assert.ok(image, `${id} has a branded product photo`);
    assert.ok(existsSync(new URL(`../assets/${image[1]}`, import.meta.url)), `${id} photo exists`);
    assert.doesNotMatch(app.main.innerHTML, /product-(water|mask|toner)-cutout|水知源/);
  }
  app.navigate('#/product/drink');
  assert.match(app.main.innerHTML, /爽肤水/);
});

test('existing water favorites survive the branding and image update', () => {
  const app = boot({ hash: '#/member', stored: { 'water-product-water': 'yes' } });
  assert.match(app.main.innerHTML, /我的心愿单/);
  assert.match(app.main.innerHTML, /ruoshui\/hangtags\/water-hupao-card\.png/);
  app.navigate('#/product/water');
  assert.match(app.main.innerHTML, /已加入心愿单/);
  assert.match(app.main.innerHTML, /¥28/);
});
