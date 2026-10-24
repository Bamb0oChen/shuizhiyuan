/* The member experience uses the site's local storage adapter; no remote account is implied. */
const WaterJourney = (() => {
  const RECORD_KEY = 'water-journey-records-v1';
  const PLAN_KEY = 'water-journey-plans-v1';
  const brands = [
    { id: 'origin', name: '若水汇', product: '杭城三泉', image: 'ruoshui/hangtags/water-hupao-card.png', scene: 'experience-morning.png', plan: '把每日一杯，记成日常', days: 7, description: '从第一杯水开始，为每天留一个从容的片刻。' },
    { id: 'spring', name: '山泉品牌 A', product: '联动饮用水', image: 'experience-source.png', scene: 'experience-source.png', plan: '21 天饮水记录计划', days: 21, description: '以水为引，在日常记录中认识水的来处。', demo: true },
    { id: 'natural', name: '天然水品牌 B', product: '联动饮用水', image: 'hero-water.png', scene: 'hero-water.png', plan: '14 天日常饮水计划', days: 14, description: '让每一杯都有迹可循，与喜欢的品牌慢慢同行。', demo: true }
  ];
  const tabs = [['daily', '日常记录'], ['activities', '我的活动'], ['brands', '品牌同行']];
  const periods = { month: '本月', week: '本周', all: '累计' };
  let period = 'month';
  let activityFilter = 'all';
  let selectedBrand = 'origin';
  let selectedAmount = '330';
  let customAmount = '';
  let lastSubmit = 0;
  let lastRecordSignature = '';
  let lastRenderedRoute = '';
  let removedRecord = null;

  function parse(key, fallback) {
    try { return JSON.parse(readLocal(key)) ?? fallback; } catch { return fallback; }
  }
  function records() {
    const value = parse(RECORD_KEY, []);
    return Array.isArray(value) ? value.filter(r => r && typeof r.id === 'string' && /^[a-zA-Z0-9-]{1,80}$/.test(r.id)
      && brands.some(b => b.id === r.brand) && Number.isInteger(r.amount) && r.amount > 0 && r.amount <= 5000
      && typeof r.at === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(r.at) && Number.isFinite(Date.parse(r.at))) : [];
  }
  function plans() {
    const value = parse(PLAN_KEY, {});
    const result = {};
    for (const b of brands) {
      const at = value && typeof value === 'object' ? value[b.id] : null;
      if (typeof at === 'string' && Number.isFinite(Date.parse(at))) result[b.id] = at;
    }
    return result;
  }
  function dayKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function recordDay(record) { return dayKey(new Date(record.at)); }
  function inPeriod(record) {
    if (period === 'all') return true;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (period === 'month') start.setDate(1);
    else start.setDate(start.getDate() - (start.getDay() + 6) % 7);
    const time = Date.parse(record.at);
    return time >= start.getTime() && time <= now.getTime();
  }
  function sum(list) { return list.reduce((total, record) => total + record.amount, 0); }
  function liters(amount) { return (amount / 1000).toLocaleString('en-US', { maximumFractionDigits: 3 }); }
  function number(amount) { return amount.toLocaleString('en-US'); }
  function recordedDays() {
    const days = new Set(records().map(recordDay));
    // Preserve the old check-in without inventing a volume for it.
    const legacy = readLocal('water-checkin');
    if (/^\d{4}-\d{2}-\d{2}$/.test(legacy || '')) days.add(legacy);
    return days;
  }
  function streak() {
    const days = recordedDays();
    const cursor = new Date();
    cursor.setHours(12, 0, 0, 0);
    if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    let total = 0;
    while (days.has(dayKey(cursor))) { total++; cursor.setDate(cursor.getDate() - 1); }
    return total;
  }
  function progress(brand) {
    const joined = plans()[brand.id];
    if (!joined) return 0;
    return Math.min(brand.days, new Set(records().filter(r => r.brand === brand.id && Date.parse(r.at) >= Date.parse(joined)).map(recordDay)).size);
  }
  function statusMessage(persisted, message) {
    toast(persisted ? message : `${message} 浏览器存储不可用，仅在本次页面会话有效。`);
  }
  function periodSelect(id) {
    return `<label class="journey-period" for="${id}"><span class="sr-only">统计时间范围</span><select id="${id}" data-journey-period>${Object.entries(periods).map(([value, label]) => `<option value="${value}" ${period === value ? 'selected' : ''}>${label}</option>`).join('')}</select></label>`;
  }
  function header(section) {
    return `<div class="journey-heading"><p class="eyebrow">MY WATER JOURNEY</p><h1>我的若水</h1><p>把日常的一杯水，慢慢记成生活。</p></div>
      <nav class="journey-tabs" aria-label="我的若水导航">${tabs.map(([id, label]) => `<a href="#/member${id === 'daily' ? '' : '/' + id}" ${section === id ? 'aria-current="page"' : ''}>${label}</a>`).join('')}${section === 'records' ? '<a href="#/member/records" aria-current="page">饮水足迹</a>' : ''}</nav>`;
  }
  function ritual() {
    const list = records();
    const today = sum(list.filter(r => recordDay(r) === dayKey()));
    const month = sum(list.filter(r => recordDay(r).slice(0, 7) === dayKey().slice(0, 7)));
    return `<section class="journey-ritual" aria-labelledby="ritual-title">
      <div class="journey-photo"><img src="./assets/experience-morning.png" alt="晨光下，山湖畔的一杯清水" width="1024" height="1024"><span class="scene-tag">每日一杯水</span></div>
      <div class="journey-ritual-copy"><p class="eyebrow">YOUR DAILY RITUAL</p><h2 id="ritual-title">从一杯水，开始今天。</h2><p class="journey-intro">记录与水相伴的片刻，也记住它的来处。</p>
        <p class="journey-today"><span>今日 <b>${number(today)}</b> mL</span><span>连续记录 <b>${streak()}</b> 天</span></p>
        <form id="water-record-form" class="journey-form">
          <div class="journey-field"><label for="water-brand">这一杯，来自</label><select id="water-brand" name="brand">${brands.map(b => `<option value="${b.id}" ${selectedBrand === b.id ? 'selected' : ''}>${b.name} · ${b.product}${b.demo ? '（示例）' : ''}</option>`).join('')}</select></div>
          <fieldset class="journey-amount"><legend>饮用量</legend><div class="journey-amount-options">${[['250', '250 mL'], ['330', '330 mL'], ['500', '500 mL'], ['custom', '自定义']].map(([value, label]) => `<label><input type="radio" name="amount" value="${value}" ${selectedAmount === value ? 'checked' : ''}><span>${label}</span></label>`).join('')}</div></fieldset>
          <div class="journey-custom" ${selectedAmount === 'custom' ? '' : 'hidden'}><label for="water-custom">自定义饮用量（mL）</label><input id="water-custom" name="custom" type="number" inputmode="numeric" min="1" max="5000" step="1" placeholder="输入毫升数" value="${customAmount}" ${selectedAmount === 'custom' ? 'required' : 'disabled'}></div>
          <button class="primary" type="submit">记录这一杯 ${icon('arrow-up-right')}</button>
        </form>
        <p class="journey-month">本月已记录 ${liters(month)} L <span>·</span> <a href="#/member/records">查看饮水足迹 ${icon('arrow-up-right')}</a></p>
        <p class="notice">按自己的节奏参与。记录仅保存在当前浏览器。</p>
      </div>
    </section>`;
  }
  function activityItems() {
    const days = recordedDays();
    const activePlans = plans();
    return [
      { id: 'morning', title: '每日第一杯水', image: 'experience-morning.png', tag: '每日习惯', detail: days.size ? `已连续记录 ${streak()} 天 · 累计 ${days.size} 天` : '从今天的第一杯水，开始记录', href: '#/member', ongoing: true, saved: false },
      ...brands.filter(b => b.demo).map(b => ({ id: b.id, title: `${b.name} × 若水汇`, image: b.scene, tag: '品牌联动 · 示例', detail: activePlans[b.id] ? `${b.days} 天记录计划 · 已完成 ${progress(b)} 天` : `${b.days} 天饮水记录计划 · 等你参与`, href: `#/brand/${b.id}`, ongoing: !!activePlans[b.id], saved: readLocal(`water-brand-saved-${b.id}`) === 'yes' })),
      ...['tea', 'source'].map(id => { const a = activities.find(item => item.id === id); return { id, title: a.title, image: activityImages[id], tag: '私享体验', detail: readLocal(`water-event-${id}`) === 'yes' ? '已收藏 · 具体安排筹备中' : '活动筹备中 · 可先收藏', href: `#/activity/${id}`, saved: readLocal(`water-event-${id}`) === 'yes', ongoing: false }; }),
      { id: 'origin', title: '若水汇 · 七日日常', image: 'experience-morning.png', tag: '日常计划', detail: activePlans.origin ? `七日记录计划 · 已完成 ${progress(brands[0])} 天` : '用七天，为生活留一份小小记录', href: '#/brand/origin', ongoing: !!activePlans.origin, saved: readLocal('water-brand-saved-origin') === 'yes' }
    ];
  }
  function activityCard(item) {
    return `<article class="journey-activity"><a href="${item.href}" class="journey-activity-link"><div class="journey-activity-image"><img src="./assets/${item.image}" alt="${item.title}" loading="lazy" width="640" height="420"><span class="scene-tag">${item.tag}</span></div><div class="journey-card-caption"><div><h3>${item.title}</h3><p>${item.detail}</p></div><span class="arrow-circle">${icon('arrow-up-right')}</span></div></a></article>`;
  }
  function activitySection(full = false) {
    const items = activityItems();
    const chosen = full ? items.filter(item => activityFilter === 'all' || (activityFilter === 'ongoing' ? item.ongoing : item.saved)) : [items[0], items[1], items[3]];
    const count = filter => items.filter(item => item[filter]).length;
    return `<section class="journey-section" aria-labelledby="journey-activities-title"><div class="journey-section-heading"><div><h2 id="journey-activities-title">我的活动</h2><p>日常里的小坚持，与值得期待的相聚。</p></div><div class="journey-section-actions">${full ? `<div class="journey-filters" aria-label="活动状态">${[['all', '全部', items.length], ['ongoing', '进行中', count('ongoing')], ['saved', '已收藏', count('saved')]].map(([value, label, n]) => `<button data-journey-filter="${value}" aria-pressed="${activityFilter === value}">${label} ${n}</button>`).join('')}</div>` : `<span>进行中 ${count('ongoing')} <span class="journey-count-gap">已收藏 ${count('saved')}</span></span><a href="#/member/activities">查看全部 ${icon('arrow-up-right')}</a>`}</div></div>
      ${chosen.length ? `<div class="journey-activity-grid">${chosen.map(activityCard).join('')}</div>` : '<div class="journey-empty"><h3>还没有收藏的活动。</h3><p>先看看有什么喜欢的，把下一次相聚留在这里。</p><button class="text-link" data-journey-filter="all">发现全部活动 ↗</button></div>'}</section>`;
  }
  function brandSection() {
    const list = records().filter(inPeriod);
    return `<section class="journey-section journey-brands" aria-labelledby="journey-brands-title"><div class="journey-section-heading"><div><p class="eyebrow">BRANDS IN YOUR EVERYDAY</p><h2 id="journey-brands-title">与好品牌，一起把日常延续。</h2><p>每一次记录，都能找到它的品牌与来处。</p></div><div class="journey-section-actions">${periodSelect('brand-period')}<a href="#/member/brands">探索品牌联动 ${icon('arrow-up-right')}</a></div></div>
      <div class="journey-brand-grid">${brands.map(b => `<article class="journey-brand"><a class="journey-brand-image" href="#/brand/${b.id}" aria-label="了解${b.name}"><img src="./assets/${b.image}" alt="${b.demo ? '联动品牌自然意象' : '若水汇饮用水概念包装'}" loading="lazy" width="240" height="300">${b.demo ? '<span>联动示例</span>' : ''}</a><div><h3>${b.name}</h3><p>${periods[period]}已记录 <b>${liters(sum(list.filter(r => r.brand === b.id)))}</b> L</p><a href="#/brand/${b.id}">查看品牌活动 ${icon('arrow-up-right')}</a></div></article>`).join('')}</div>
      <p class="notice">A、B 为联动示例品牌，饮水量根据你的自主记录汇总。</p></section>`;
  }
  function wishlist() {
    const saved = products.filter(p => readLocal(`water-product-${p.id}`) === 'yes');
    return `<section class="journey-section journey-wishlist" aria-labelledby="wishlist-title"><div class="journey-section-heading"><div><h2 id="wishlist-title">我的心愿单</h2><p>把喜欢的好物，留在日常里。</p></div><a class="text-link" href="#/products">发现若水好物 ${icon('arrow-up-right')}</a></div>${saved.length ? `<div class="journey-wishlist-items">${saved.map(p => `<a href="#/product/${p.id}">${art(p, true)}<span>${p.name}</span>${icon('arrow-up-right')}</a>`).join('')}</div>` : '<p class="notice">还没有收藏的好物。遇见喜欢的产品时，可以把它加入心愿单。</p>'}</section>`;
  }
  function history() {
    const list = records().filter(inPeriod).sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
    return `<section class="journey-section journey-history" aria-labelledby="history-title"><div class="journey-section-heading"><div><h2 id="history-title">我的饮水足迹</h2><p>${periods[period]} ${list.length} 次记录，共 ${liters(sum(list))} L。每一杯，都有来处。</p></div><div class="journey-section-actions">${periodSelect('history-period')}<a href="#/member">再记录一杯 ${icon('arrow-up-right')}</a></div></div>
      ${removedRecord ? '<p class="journey-undo" role="status">已撤销一条记录。<button data-journey-undo>恢复这条记录 ↗</button></p>' : ''}
      ${list.length ? `<ul class="journey-record-list">${list.map(r => { const b = brands.find(b => b.id === r.brand); const date = new Date(r.at); return `<li><time datetime="${r.at}">${date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}<span>${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })}</span></time><div><h3>${b.name} · ${b.product}</h3><p>${b.demo ? '联动示例品牌 · ' : ''}自主记录</p></div><strong>${number(r.amount)} <small>mL</small></strong><button data-journey-remove="${r.id}" aria-label="撤销${b.name}${r.amount}毫升的饮水记录">撤销</button></li>`; }).join('')}</ul>` : '<div class="journey-empty"><h3>这一页，等你慢慢写下。</h3><p>当前时间范围还没有饮水记录。</p><a class="text-link" href="#/member">记录第一杯水 ↗</a></div>'}
      <p class="notice">记录仅保存在当前浏览器；可撤销填错的记录，不代表经核验的实际饮用量。</p></section>`;
  }
  function renderPage(section = 'daily', brandId) {
    if (![...tabs.map(t => t[0]), 'records'].includes(section)) return notFound();
    if (location.hash !== lastRenderedRoute && brands.some(b => b.id === brandId)) selectedBrand = brandId;
    lastRenderedRoute = location.hash;
    return `<div class="journey">${header(section)}${section === 'daily' ? ritual() + activitySection() + brandSection() : section === 'activities' ? activitySection(true) : section === 'brands' ? brandSection() : history()}${section === 'daily' ? wishlist() : ''}<p class="journey-local-note">本机体验 · 记录、收藏与计划仅保存在此浏览器，未开通在线会员账户。</p></div>`;
  }
  function brandPage(id) {
    lastRenderedRoute = location.hash;
    const b = brands.find(item => item.id === id);
    if (!b) return notFound();
    const joined = !!plans()[id];
    const saved = readLocal(`water-brand-saved-${id}`) === 'yes';
    const list = records().filter(r => r.brand === id);
    return `<div class="journey"><div class="journey-brand-back"><a class="back" href="#/member/brands">${icon('arrow-left')} 返回品牌同行</a></div><article class="journey-brand-detail"><div class="journey-photo"><img src="./assets/${b.scene}" alt="${b.name}的生活意象" width="1024" height="1024"><span class="scene-tag">${b.demo ? '品牌联动 · 概念示例' : '若水日常'}</span></div><div class="journey-ritual-copy"><p class="eyebrow">TOGETHER, WE FLOW</p><h1>${b.demo ? b.name + ' × 若水汇' : '若水汇 · 七日日常'}</h1><h2 class="journey-plan-title">${b.plan}</h2><p class="journey-intro">${b.description}</p><ul class="fact-list"><li><b>参与方式</b><span>选择该品牌，记录每天的饮水量</span></li><li><b>活动节奏</b><span>${b.days} 个记录日，按自己的节奏参与</span></li><li><b>我的进度</b><span>${joined ? `已记录 ${progress(b)} / ${b.days} 天` : '尚未加入计划'}</span></li><li><b>饮水足迹</b><span>累计 ${list.length} 次 · ${liters(sum(list))} L</span></li></ul><div class="journey-plan-actions">${joined ? `<a class="primary" href="#/member/daily/${id}">记录这个品牌 ${icon('arrow-up-right')}</a><button class="text-link" data-journey-leave="${id}">结束参与</button>` : `<button class="primary" data-journey-join="${id}">加入饮水计划 ${icon('arrow-up-right')}</button>`}<button class="text-link" data-journey-save="${id}" aria-pressed="${saved}">${saved ? '已收藏 ✓' : '收藏计划 ＋'}</button></div><p class="notice">${b.demo ? '此为品牌联动概念示例，不代表已建立商业合作。' : ''}参与情况与饮水记录仅保存在当前浏览器。</p></div></article></div>`;
  }
  function refresh(focusSelector) {
    render();
    if (focusSelector) document.querySelector(focusSelector)?.focus({ preventScroll: true });
  }
  function init() {
    const root = document.querySelector('#main');
    root.addEventListener('change', event => {
      const target = event.target;
      if (target.matches('[data-journey-period]')) {
        if (Object.hasOwn(periods, target.value)) period = target.value;
        refresh(`#${target.id}`);
      }
      if (target.id === 'water-brand') selectedBrand = target.value;
      if (target.name === 'amount') {
        selectedAmount = target.value;
        const custom = root.querySelector('.journey-custom');
        const input = root.querySelector('#water-custom');
        custom.hidden = selectedAmount !== 'custom';
        input.disabled = selectedAmount !== 'custom';
        input.required = selectedAmount === 'custom';
        if (selectedAmount === 'custom') input.focus();
      }
    });
    root.addEventListener('input', event => {
      if (event.target.id === 'water-custom') customAmount = event.target.value;
    });
    root.addEventListener('submit', event => {
      if (event.target.id !== 'water-record-form') return;
      event.preventDefault();
      const form = event.target;
      const data = new FormData(form);
      const brand = String(data.get('brand'));
      const amount = Number(data.get('amount') === 'custom' ? data.get('custom') : data.get('amount'));
      if (!form.reportValidity() || !brands.some(b => b.id === brand) || !Number.isInteger(amount) || amount < 1 || amount > 5000) return;
      const signature = `${brand}-${amount}`;
      if (Date.now() - lastSubmit < 800 && signature === lastRecordSignature) return;
      lastSubmit = Date.now();
      lastRecordSignature = signature;
      const list = records();
      list.push({ id: crypto.randomUUID(), brand, amount, at: new Date().toISOString() });
      const persisted = writeLocal(RECORD_KEY, JSON.stringify(list));
      refresh('#water-record-form button[type="submit"]');
      statusMessage(persisted, `已记录 ${brands.find(b => b.id === brand).name} ${amount} mL。`);
    });
    root.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.hasAttribute('data-journey-filter')) {
        activityFilter = button.dataset.journeyFilter;
        refresh(`[data-journey-filter="${activityFilter}"]`);
      }
      for (const action of ['join', 'leave', 'save']) {
        const id = button.getAttribute(`data-journey-${action}`);
        if (!id || !brands.some(b => b.id === id)) continue;
        let persisted;
        if (action === 'save') persisted = writeLocal(`water-brand-saved-${id}`, readLocal(`water-brand-saved-${id}`) === 'yes' ? 'no' : 'yes');
        else {
          const value = plans();
          if (action === 'join') value[id] = new Date().toISOString();
          else delete value[id];
          persisted = writeLocal(PLAN_KEY, JSON.stringify(value));
          if (action === 'join') selectedBrand = id;
        }
        refresh(action === 'save' ? `[data-journey-save="${id}"]` : '.journey-plan-actions > :first-child');
        statusMessage(persisted, action === 'join' ? '已加入计划，接下来记录这个品牌的每一杯水。' : action === 'leave' ? '已结束参与，已有饮水记录仍然保留。' : '已更新计划收藏。');
      }
      if (button.hasAttribute('data-journey-remove')) {
        const list = records();
        removedRecord = list.find(r => r.id === button.dataset.journeyRemove) || null;
        if (!removedRecord) return;
        const persisted = writeLocal(RECORD_KEY, JSON.stringify(list.filter(r => r.id !== removedRecord.id)));
        refresh('[data-journey-undo]');
        statusMessage(persisted, '已撤销这条记录，统计已更新。');
      }
      if (button.hasAttribute('data-journey-undo') && removedRecord) {
        const list = records();
        if (!list.some(r => r.id === removedRecord.id)) list.push(removedRecord);
        const persisted = writeLocal(RECORD_KEY, JSON.stringify(list));
        removedRecord = null;
        refresh('#history-period');
        statusMessage(persisted, '已恢复这条记录。');
      }
    });
    window.addEventListener('storage', event => {
      if (event.key === null || [RECORD_KEY, PLAN_KEY, 'water-checkin'].includes(event.key) || event.key.startsWith('water-event-') || event.key.startsWith('water-brand-saved-') || event.key.startsWith('water-product-')) {
        if (event.key === null) for (const key of Object.keys(sessionMemory)) delete sessionMemory[key];
        else delete sessionMemory[event.key];
        if (['member', 'brand'].includes(route()[0]) || (route()[0] === 'activity' && route()[1] === 'morning')) refresh();
      }
    });
  }
  return { render: renderPage, brand: brandPage, init };
})();
