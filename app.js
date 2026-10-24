const main = document.querySelector('#main');
document.querySelector('.skip').addEventListener('click', event => { event.preventDefault(); main.focus(); main.scrollIntoView(); });
const activities = [
  { id: 'morning', category: '日常仪式', title: '每日第一杯水', headline: '让一天的美好，<br>从一杯水开始。', desc: '给清晨留一点空白，给自己一杯水。<br>与若水汇一起，把平凡日常过成喜欢的模样。', short: '从一杯水开始，留一刻时间给自己。', tag: '每日参与', time: '每日 · 自选晨间时刻', mode: '线上生活记录', action: '记录今日第一杯水', detail: '为自己选一只喜欢的杯子，在清晨安静地喝一杯水。无需追赶，也不必比较；记录属于你的晨间片刻。', facts: [['参与方式', '点击记录，完成今日打卡'], ['活动节奏', '每天一次，按自己的节奏参与'], ['温馨提示', '饮水量与时间根据个人情况安排']] },
  { id: 'source', category: '溯源体验', title: '循水而行 · 探源之旅', headline: '循一脉清流，<br>赴一场山野之约。', desc: '走近水的来处，重新感受自然的节奏。<br>让一次旅行，成为与生活的温柔重逢。', short: '走进山野，认识每一滴水的来处。', tag: '活动筹备中', time: '时间待公布', mode: '线下小型体验', action: '收藏这场活动', detail: '一次从水源地出发的体验构想：沿着水的路径认识自然，与品牌一起了解产品的源头。具体地点、日程和接待安排将在活动确认后公布。', facts: [['活动状态', '筹备中，尚未开放报名'], ['计划内容', '水源探访、自然漫步、品牌交流'], ['适合人群', '关注自然与品质生活的朋友']] },
  { id: 'tea', category: '品味沙龙', title: '一水一茶 · 午后雅集', headline: '好水入茶，<br>慢享一刻清欢。', desc: '让水与茶相遇，让人与人相识。<br>在一盏茶的时间里，发现生活的另一种滋味。', short: '以水会友，在茶香里发现生活之美。', tag: '活动筹备中', time: '时间待公布', mode: '线下主题沙龙', action: '收藏这场活动', detail: '围绕水与茶的关系，策划一场轻松的小型品鉴。把注意力留给感受，把时间留给交流。主题、场地与嘉宾将在确认后公布。', facts: [['活动状态', '筹备中，尚未开放报名'], ['计划内容', '水与茶品鉴、生活方式分享'], ['参与形式', '小型预约制，名额待公布']] }
];
const products = [
  {
    "id": "water",
    "name": "若水汇 · 西湖·虎跑泉",
    "shortName": "虎跑泉",
    "category": "杭城三泉",
    "desc": "一瓶山水，一枚西湖纪念。",
    "intent": "以西湖与虎跑泉为设计主题，将青绿山水、亭阁插画与流苏小卡结合。330 mL 玻璃瓶搭配一枚同款小卡，让杭州的山水成为可以带走的日常纪念。",
    "image": "ruoshui/hangtags/water-hupao-card.png",
    "price": 28,
    "priceUnit": "套",
    "spec": "330 mL＋小卡 1 枚",
    "basePrice": 12,
    "facts": [
      [
        "产品系列",
        "杭城三泉 · 文旅设计"
      ],
      [
        "展示规格",
        "330 mL＋流苏小卡 1 枚"
      ],
      [
        "带卡零售价",
        "¥28 / 套"
      ],
      [
        "基础装零售价",
        "¥12 / 瓶（不含小卡）"
      ],
      [
        "产品资料",
        "水源、工艺与资质待确认"
      ]
    ]
  },
  {
    "id": "qiandao",
    "name": "若水汇 · 千岛·源水",
    "shortName": "千岛·源水",
    "category": "杭城三泉",
    "desc": "把一湖烟波，藏进一枚小卡。",
    "intent": "以千岛湖的湖光与群岛为设计主题，雾蓝瓶盖、轻淡山水瓶标与岛屿插画小卡相呼应。与虎跑泉、径山款组成杭城三泉系列。",
    "image": "ruoshui/hangtags/water-qiandao-card.png",
    "price": 28,
    "priceUnit": "套",
    "spec": "330 mL＋小卡 1 枚",
    "basePrice": 12,
    "facts": [
      [
        "产品系列",
        "杭城三泉 · 文旅设计"
      ],
      [
        "展示规格",
        "330 mL＋流苏小卡 1 枚"
      ],
      [
        "带卡零售价",
        "¥28 / 套"
      ],
      [
        "基础装零售价",
        "¥12 / 瓶（不含小卡）"
      ],
      [
        "产品资料",
        "水源、工艺与资质待确认"
      ]
    ]
  },
  {
    "id": "jingshan",
    "name": "若水汇 · 径山·龙泉",
    "shortName": "径山·龙泉",
    "category": "杭城三泉",
    "desc": "山寺茶韵，留一份温润纪念。",
    "intent": "以径山的层峦、古寺与茶韵为设计主题，米白瓶盖与暖灰金色山水相配。异形小卡、串珠与流苏延续整套文旅系列的收藏感。",
    "image": "ruoshui/hangtags/water-jingshan-card.png",
    "price": 28,
    "priceUnit": "套",
    "spec": "330 mL＋小卡 1 枚",
    "basePrice": 12,
    "facts": [
      [
        "产品系列",
        "杭城三泉 · 文旅设计"
      ],
      [
        "展示规格",
        "330 mL＋流苏小卡 1 枚"
      ],
      [
        "带卡零售价",
        "¥28 / 套"
      ],
      [
        "基础装零售价",
        "¥12 / 瓶（不含小卡）"
      ],
      [
        "产品资料",
        "水源、工艺与资质待确认"
      ]
    ]
  },
  {
    "id": "toner",
    "name": "若水汇 · 爽肤水",
    "shortName": "爽肤水",
    "category": "日常护肤",
    "desc": "把清透，留给日常。",
    "intent": "延续若水汇的米白纸感、雾蓝山水与细线标志，保留圆柱玻璃瓶与银色瓶盖。用于日常护理的产品设计方向，实际成分、适用肤质和使用方式以最终产品资料为准。",
    "image": "ruoshui/product-toner.png",
    "price": 128,
    "priceUnit": "瓶",
    "spec": "150 mL",
    "facts": [
      [
        "产品系列",
        "若水汇 · 日常护肤"
      ],
      [
        "展示规格",
        "150 mL / 瓶"
      ],
      [
        "零售价",
        "¥128 / 瓶"
      ],
      [
        "成分与使用",
        "待正式产品资料确认"
      ]
    ]
  },
  {
    "id": "mask",
    "name": "若水汇 · 面膜",
    "shortName": "面膜",
    "category": "日常护肤",
    "desc": "给自己，一段安静的护理时光。",
    "intent": "独立袋装面膜与同系列纸盒，采用米白底、雾蓝山水和若水汇新标志。每盒五片，成分、使用方式与适用肤质将在正式产品资料确认后补充。",
    "image": "ruoshui/product-mask.png",
    "price": 59,
    "priceUnit": "盒",
    "spec": "5 片装",
    "facts": [
      [
        "产品系列",
        "若水汇 · 日常护肤"
      ],
      [
        "展示规格",
        "5 片 / 盒"
      ],
      [
        "零售价",
        "¥59 / 盒"
      ],
      [
        "成分与使用",
        "待正式产品资料确认"
      ]
    ]
  },
  {
    "id": "cards",
    "name": "若水汇 · 杭城三泉小卡",
    "shortName": "文创小卡",
    "category": "文创好物",
    "desc": "三处山水，三枚可以留下的纪念。",
    "intent": "三枚异形山水插画小卡，分别对应西湖、千岛湖与径山。青绿、雾蓝与暖米色串珠流苏相配，可随瓶携带，也可独立收藏。",
    "image": "ruoshui/hangtags/hangtags-trio.png",
    "price": 48,
    "priceUnit": "套",
    "spec": "三款各 1 枚 · 含流苏",
    "facts": [
      [
        "产品系列",
        "杭城三泉 · 文创小卡"
      ],
      [
        "套装内容",
        "三款各 1 枚，配串珠与流苏"
      ],
      [
        "套装零售价",
        "¥48 / 套"
      ],
      [
        "制作阶段",
        "插画、材质与工艺待打样确认"
      ]
    ]
  }
];
const retailPriceList = [
  {
    "name": "饮用水基础装",
    "spec": "330 mL",
    "price": 12,
    "unit": "瓶"
  },
  {
    "name": "饮用水＋流苏小卡",
    "spec": "330 mL＋流苏小卡",
    "price": 28,
    "unit": "套"
  },
  {
    "name": "爽肤水",
    "spec": "150 mL",
    "price": 128,
    "unit": "瓶"
  },
  {
    "name": "面膜",
    "spec": "5 片装",
    "price": 59,
    "unit": "盒"
  },
  {
    "name": "三款流苏小卡",
    "spec": "三款各 1 枚",
    "price": 48,
    "unit": "套"
  },
  {
    "name": "三泉文旅礼盒",
    "spec": "三款水＋三枚小卡＋礼盒",
    "price": 88,
    "unit": "盒"
  },
  {
    "name": "日常护理套装",
    "spec": "爽肤水 150 mL＋面膜 5 片",
    "price": 168,
    "unit": "套"
  },
  {
    "name": "山水礼遇套装",
    "spec": "三泉文旅礼盒＋爽肤水＋面膜 5 片",
    "price": 258,
    "unit": "套"
  }
];

let slide = 1;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let timer;
let autoplay = !reducedMotion.matches;
let currentFilter = '全部';
let activePanel = 0;
let panelObserver;
let panelSettling = false;
let panelSettleTimer;
let wheelLast = 0;
let wheelTotal = 0;
let wheelDirection = 0;
const sessionMemory = {};
function readLocal(key) { if (Object.hasOwn(sessionMemory, key)) return sessionMemory[key]; try { return localStorage.getItem(key); } catch { return null; } }
function writeLocal(key, value) { sessionMemory[key] = value; try { localStorage.setItem(key, value); return true; } catch { return false; } }
function toast(message) { const el=document.querySelector('#toast'); el.textContent=message; el.classList.add('visible'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove('visible'),3500); }
function waterScene() { return '<img class="waterscape" src="./assets/hero-water.png" alt="深蓝水面与临水会客厅" loading="lazy">'; }
function icon(name) { return `<img class="icon" src="./assets/icons/${name}.svg" alt="" aria-hidden="true">`; }
const activityImages = { morning: 'experience-morning.png', source: 'experience-source.png', tea: 'experience-tea.png' };
const heroImages = ['experience-morning.png', 'hero-water.png', 'experience-tea.png'];
const heroCopy = [
  { title: '美好的一天，<br>从第一杯水开始。', subtitle: '若水汇 · 每日饮水计划', action: '开启今日仪式' },
  { title: '循水而来，<br>与美好相遇。', subtitle: '若水汇 · 私享生活体验', action: '探索本期体验' },
  { title: '一水一茶，<br>慢享一刻清欢。', subtitle: '若水汇 · 午后雅集', action: '走近这场雅集' }
];
function art(product, mini=false) { return `<div class="${mini?'mini-art':'product-art'} product-photo ${product.id}"><img src="./assets/${product.image}" alt="${product.name}${product.category==='杭城三泉'?'与流苏小卡':'新包装'}产品展示图" ${mini?'':'loading="lazy"'} width="${product.id==='cards'?1536:1024}" height="${product.id==='cards'?1024:1536}"></div>`; }
function scene(activity) { return `<div class="scene scene-${activity.id}"><img src="./assets/${activityImages[activity.id]}" alt="${activity.id==='morning'?'晨光中的一杯清水':activity.id==='source'?'阳光照耀山野中的清澈溪流':'临水茶室中的茶席'}" loading="lazy"><span class="scene-tag">${activity.tag}</span></div>`; }
function activityCard(a) { return `<article class="activity-card"><a class="card-link" href="#/activity/${a.id}">${scene(a)}<div class="card-bottom"><h3>${a.title}</h3><span class="card-action">${a.id==='morning'?'参与仪式':'查看体验'} ${icon('arrow-up-right')}</span></div><p class="meta">${a.short}</p></a></article>`; }
function productCard(p) { return `<article class="product-card"><a href="#/product/${p.id}">${art(p)}<div class="product-bottom"><div><h3>${p.name.replace('若水汇 · ','')}</h3><p>${p.desc}</p><p class="product-price"><span>零售价</span> ¥${p.price}<small> / ${p.priceUnit}</small></p><p class="product-spec">${p.spec}</p></div><span class="arrow-circle">${icon('arrow-up-right')}</span></div></a></article>`; }
function heading(en, title, link='', label='查看全部') {return `<div class="section-heading"><div><p class="eyebrow">${en}</p><h2>${title}</h2></div>${link?`<a class="text-link" href="${link}">${label} <span>↗</span></a>`:''}</div>`;}
function hero() {
  const a = activities[slide];
  const copy = heroCopy[slide];
  return `<section class="home-panel hero ${autoplay?'is-flowing':''}" data-panel="0" aria-label="水的日常" aria-roledescription="轮播">
    <div class="hero-images" aria-hidden="true">${heroImages.map((src,i)=>`<img src="./assets/${src}" class="hero-image ${i===slide?'is-active':''}" alt="" ${i===1?'fetchpriority="high"':''}>`).join('')}</div>
    <div class="hero-copy"><h1>${copy.title}</h1><p class="description">${copy.subtitle}</p><a class="primary light" href="#/activity/${a.id}">${copy.action} ${icon('arrow-up-right')}</a></div>
    <div class="hero-footer"><div class="slide-tabs" aria-label="选择活动">${['每日第一杯水','探源之旅','午后雅集'].map((title,i)=>`<button class="slide-tab" data-slide="${i}" aria-label="第${i+1}张：${activities[i].title}" aria-pressed="${slide===i}"><span>0${i+1}</span><span>${title}</span></button>`).join('')}</div><div class="slide-controls"><button class="icon-button" data-action="previous" aria-label="上一个活动">${icon('arrow-left')}</button><button class="icon-button" data-action="next" aria-label="下一个活动">${icon('arrow-right')}</button><button class="icon-button motion-toggle" data-action="autoplay" aria-label="${autoplay?'暂停':'开始'}自动轮播与水面动效">${icon(autoplay?'player-pause':'player-play')}</button></div></div>
    <a class="recommend" href="#/product/water" aria-label="本期若水之选：虎跑泉带卡文旅款，查看详情">${art(products[0],true)}<div><p class="eyebrow">本期若水之选</p><span class="short-rule"></span><h2>虎跑泉 · 文旅款</h2><span class="text-link">了解详情 ${icon('arrow-up-right')}</span></div></a>
  </section>`;
}
function home() { return `${hero()}
  <section class="home-panel section experiences" data-panel="1" aria-label="私享体验"><div class="section-heading"><h2>把时间，留给值得的相聚。</h2><p>以水为引，走进自然，走进生活。<br>在一场私享体验中，遇见更自在的自己。</p></div><div class="experience-grid">${activities.slice(1).map(activityCard).join('')}</div></section>
  <section class="home-panel collection" data-panel="2" aria-label="若水好物"><div class="collection-copy"><p class="eyebrow">RUO SHUI HUI</p><h2>从源头，到日常。</h2><p>以水为灵感，延展至生活的每一处。<br>若水汇，陪伴你构建更有质感的日常。</p><a class="outline" href="#/products">探索若水好物 ${icon('arrow-up-right')}</a></div><div class="collection-products">${products.filter(p=>['water','toner','mask'].includes(p.id)).map(p=>`<a href="#/product/${p.id}" class="collection-product">${art(p)}<h3>${p.id==='water'?'杭城三泉':p.shortName}</h3><p class="collection-price">¥${p.price} / ${p.priceUnit}</p></a>`).join('')}</div><span class="image-note">产品包装设计展示</span></section>
  ${partnerBand()}${panelNavigation()}`; }
function partnerBand() {
  return `<section class="home-panel partner-band partner-panel" data-panel="3" aria-label="品牌合作">
    <img class="partner-watermark" src="./assets/ruoshui/logo-symbol-transparent.png" alt="" aria-hidden="true">
    <div class="partner-content"><p class="eyebrow">TOGETHER, WE FLOW</p><h2>让好品牌，<br>在这里汇流。</h2><p class="partner-intro">以水为媒，连接志同道合的伙伴。<br>从一件好产品，到一场好体验，<br>共同探索更有质感的生活方式。</p><div class="band-links"><a class="primary light" href="#/partners">探索品牌合作 ${icon('arrow-up-right')}</a><a class="outline" href="#/dashboard">伙伴工作台 ${icon('arrow-up-right')}</a></div></div>
    <div class="partner-principles"><div><span>01</span><h3>产品共创</h3><p>以清晰的来源与产品资料，连接用心之物。</p></div><div><span>02</span><h3>体验共创</h3><p>从水源探访到午后雅集，让品牌走进生活。</p></div><div><span>03</span><h3>长期同行</h3><p>与理念相近的伙伴，持续打磨产品与服务。</p></div></div>
    <div class="integrated-footer"><a class="brand" href="#/about">若水汇<small>RUO SHUI HUI</small></a><div><a href="#/about">关于若水汇</a><a href="#/partners">合作伙伴</a><span>© 2026 若水汇 · 前端概念预览</span></div></div>
  </section>`;
}
function panelNavigation() { return `<nav class="page-rail" aria-label="首页屏幕导航">${['水的日常','私享体验','若水好物','品牌合作'].map((name,i)=>`<button data-go-panel="${i}" aria-label="第${i+1}屏：${name}" ${i===0?'aria-current="step"':''}><span>${name}</span><i></i></button>`).join('')}</nav><button class="next-panel" data-next-panel aria-label="向下翻至下一屏"><span class="panel-counter">01 / 04</span><span class="next-label">向下探索</span>${icon('arrow-right')}</button><button class="water-toggle" data-action="water-toggle" aria-pressed="${autoplay}" aria-label="${autoplay?'暂停':'开启'}水面动效">${icon('droplet')}<span>水面动效</span><span data-water-indicator>${autoplay?'开':'关'}</span></button>`; }

function listing(type) {const isActivity=type==='activities';const items=isActivity?activities:products;const categories=['全部',...new Set(items.map(i=>i.category))];if(!categories.includes(currentFilter))currentFilter='全部';return `<div class="page-head"><p class="eyebrow">${isActivity?'WATER & EVERYDAY':'THE RUO SHUI HUI COLLECTION'}</p><h1>${isActivity?'私享体验':'若水好物'}</h1><p>${isActivity?'用一场体验、一份记录，让水走进生活。把时间留给真正喜欢的事。':'杭城三泉、日常护肤与文创小卡。产品规格与零售价按当前方案展示，尚未开放购买。'}</p></div><section class="section"><div class="filters" aria-label="${isActivity?'活动':'产品'}分类">${categories.map(c=>`<button class="filter" data-filter="${c}" aria-pressed="${currentFilter===c}">${c}</button>`).join('')}</div><div class="${isActivity?'activity':'product'}-grid">${items.filter(i=>currentFilter==='全部'||i.category===currentFilter).map(isActivity?activityCard:productCard).join('')}</div>${!isActivity&&currentFilter==='全部'?bundlePricing():''}</section>`;}
function bundlePricing() { return `<section class="bundle-pricing" aria-labelledby="bundle-title"><p class="eyebrow">GIFT & EVERYDAY</p><h2 id="bundle-title">把喜欢的，放在一起。</h2><div class="bundle-grid"><article><h3>三泉文旅礼盒</h3><p>三款水各 1 瓶＋三枚小卡＋礼盒</p><strong>¥88<small> / 盒</small></strong><p class="notice">带卡单品合计 ¥84，另含礼盒包装。</p></article><article><h3>日常护理套装</h3><p>爽肤水 150 mL＋面膜 5 片</p><strong>¥168<small> / 套</small></strong><p class="notice">单品零售价合计 ¥187。</p></article><article><h3>山水礼遇套装</h3><p>三泉文旅礼盒＋爽肤水＋面膜 5 片</p><strong>¥258<small> / 套</small></strong><p class="notice">单品零售价合计 ¥275。</p></article></div><details class="retail-prices"><summary>查看完整零售价（8 项）</summary><div class="retail-table-wrap"><table><caption>若水汇产品零售价</caption><thead><tr><th scope="col">产品</th><th scope="col">规格</th><th scope="col">零售价</th></tr></thead><tbody>${retailPriceList.map(p=>`<tr><th scope="row">${p.name}</th><td>${p.spec}</td><td>¥${p.price} / ${p.unit}</td></tr>`).join('')}</tbody></table></div></details><p class="notice">以上为产品方案零售价，尚未开放购买。运费另计。</p></section>`; }
function localDate() {const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function activityDetail(id) {const a=activities.find(a=>a.id===id);if(!a)return notFound();const saved=a.id==='morning'?readLocal('water-checkin')===localDate():readLocal(`water-event-${id}`)==='yes';return `<div class="page-head"><a class="back" href="#/activities">← 返回私享体验</a></div><article class="detail">${scene(a)}<div class="detail-copy"><p class="eyebrow">${a.category} / ${a.mode}</p><h1>${a.title}</h1><p>${a.detail}</p><ul class="fact-list">${a.facts.map(([k,v])=>`<li><b>${k}</b><span>${v}</span></li>`).join('')}</ul><button class="primary" data-checkin="${id}" ${saved?'disabled':''}>${saved?(id==='morning'?'今日已记录 ✓':'已收藏 ✓'):a.action} ${saved?'':'↗'}</button><p class="notice">${id==='morning'?'记录仅保存在当前浏览器，不收集个人健康信息。':'收藏仅保存在当前浏览器；当前未开放实际预约。'}</p>${saved?`<p class="success">${id==='morning'?'今日的小小仪式，已完成。愿你从容开启这一天。':'已加入本机收藏。活动的具体安排仍在筹备中。'}</p>`:''}<div class="detail-note"><h2>与这一刻相配的好物</h2><p>${id==='tea'?'从一杯好水，开始一场好茶。':'从一杯日常饮用水，探索若水的选品方向。'}</p><a class="text-link" href="#/product/water">了解若水饮用水 ↗</a></div></div></article>`;}
function productDetail(id) {const p=products.find(p=>p.id===id);if(!p)return notFound();const saved=readLocal(`water-product-${id}`)==='yes';return `<div class="page-head"><a class="back" href="#/products">← 返回若水好物</a></div><article class="detail">${art(p)}<div class="detail-copy"><p class="eyebrow">${p.category} / RUO SHUI HUI</p><h1>${p.name}</h1><p>${p.intent}</p><div class="detail-price"><span>零售价</span><strong>¥${p.price}<small> / ${p.priceUnit}</small></strong><p>${p.spec}</p></div><span class="demo-badge">产品设计展示 · 零售价格方案</span><ul class="fact-list">${p.facts.map(([k,v])=>`<li><b>${k}</b><span>${v}</span></li>`).join('')}</ul><button class="primary" data-save-product="${id}" ${saved?'disabled':''}>${saved?'已加入心愿单 ✓':'加入本机心愿单 ↗'}</button><p class="notice">当前未开放购买。价格为产品方案零售价，心愿单仅保存在当前浏览器。</p><div class="detail-note"><h2>${p.category==='杭城三泉'?'把杭州的山水，一起带走。':'同一份山水，更多日常。'}</h2><p>${p.category==='杭城三泉'?'三款水各 1 瓶、三枚小卡与礼盒，文旅礼盒零售价 ¥88。':p.id==='cards'?'三款流苏小卡各 1 枚，套装零售价 ¥48。':'爽肤水与五片装面膜，护理套装零售价 ¥168。'}</p><a class="text-link" href="#/products">浏览完整产品线 ↗</a></div></div></article>`;}
function about() {
  return `<article class="about-page" aria-labelledby="about-title">
    <section class="about-hero">
      <div class="page-head about-heading"><p class="eyebrow">ABOUT RUO SHUI HUI</p><h1 id="about-title">关于若水汇</h1><p class="about-lead">从一杯杭州水，<br>到一段身心留白。</p><p>若水汇从杭州泉水文化出发，连接饮水、日常护理与山居体验。我们希望让长期投入脑力工作的人，在自然与日常的片刻里，给休息、思考和灵感留一点空间。</p></div>
      <figure class="about-cover"><img src="./assets/ruoshui/resort/resort-aerial.png" alt="若水汇康养山庄空间构想：林间低层建筑与临水庭院" width="1672" height="941"><figcaption>康养山庄空间构想 · 概念效果图</figcaption></figure>
    </section>
    <section class="about-section about-origin" aria-labelledby="origin-title">
      <div class="about-section-heading"><p class="eyebrow">01 / WHY WE STARTED</p><h2 id="origin-title">两个起点，汇成一个想法。</h2></div>
      <div class="about-origin-grid"><div><span class="about-number">01</span><h3>让身体放松，也让脑子松开。</h3><p>创始人、研究者、会议参与者，以及每一个长期高强度工作的人，是我们最初关注的人群。他们需要从紧绷的节奏里抽身，也希望休息能为重新梳理思绪创造条件。</p><p>我们想探索的，是让自然环境、安静空间和有节奏的体验，为身体放松和思绪舒展创造条件，让休息与思考、灵感自然相连。</p></div>
      <div><span class="about-number">02</span><h3>从杭州人取水的日常，看见地方的连接。</h3><p>品牌的另一个起点，来自一个朴素的观察：有人愿意专程到虎跑泉、径山等地取水、饮用，再把水带回生活里。</p><p>我们珍视这种人与一处山水的关系，希望将泉水背后的地方记忆、文化与审美，整理成可以了解、携带和分享的品牌体验。</p></div></div>
      <blockquote>让杭州的山水与人文，<br>走进可以感受的日常。</blockquote>
    </section>
    <section class="about-section" aria-labelledby="practice-title">
      <div class="about-section-heading"><p class="eyebrow">02 / WHAT WE ARE BUILDING</p><h2 id="practice-title">把想法，做成相互连接的体验。</h2><p>从可以带走的产品，到值得停留的空间，逐步展开若水汇的品牌构想。</p></div>
      <div class="about-practice-grid">
        <article><a class="about-practice-image" href="#/products"><img src="./assets/ruoshui/hangtags/hangtags-trio.png" alt="杭城三泉青绿、雾蓝与暖米色三款山水流苏小卡" width="1536" height="1024" loading="lazy"></a><div class="about-practice-copy"><p class="eyebrow">WATER & CULTURE</p><h3>一杯水，一份地方记忆。</h3><p>以杭城三泉为主题，把玻璃瓶、山水插画与文创小卡结合。饮水是日常的入口，小卡让旅途里的记忆有了可以留下的形状。</p><a class="text-link" href="#/products">了解杭城三泉 ↗</a></div></article>
        <article><a class="about-practice-image about-care-image" href="#/product/toner"><img src="./assets/ruoshui/product-toner.png" alt="若水汇爽肤水玻璃瓶与山水包装设计" width="1024" height="1536" loading="lazy"></a><div class="about-practice-copy"><p class="eyebrow">EVERYDAY CARE</p><h3>把照顾自己，留在日常里。</h3><p>将同一套山水语言延伸到爽肤水与面膜，让日常护理也成为一段安静的个人时间。产品资料与使用信息将在确认后逐步完善。</p><a class="text-link" href="#/product/mask">了解日常护理 ↗</a></div></article>
        <article><div class="about-practice-image"><img src="./assets/ruoshui/resort/resort-spa.png" alt="临山望水的水疗池与休息区空间概念效果图" width="1672" height="941" loading="lazy"><span>空间概念</span></div><div class="about-practice-copy"><p class="eyebrow">REST & INSPIRATION</p><h3>在山水之间，给自己留白。</h3><p>探索临水山居、水疗休息与小型交流相结合的康养空间。让人可以暂时放慢脚步，也为交流、思考与灵感留下余地。</p><p class="about-concept-note">山庄与水疗仍处于概念规划阶段。</p></div></article>
      </div>
    </section>
    <section class="about-section about-development" aria-labelledby="development-title">
      <div class="about-section-heading"><p class="eyebrow">03 / OUR NEXT STEPS</p><h2 id="development-title">我们正在推进的事。</h2><p>以产品与视觉为起点，通过实际体验和反馈，逐步推进品牌发展。</p></div>
      <ol class="about-roadmap"><li><span>当前方向</span><h3>打磨产品与品牌</h3><p>完善杭城三泉、文创小卡与护理系列的设计，逐项确认产品资料、包装材质与打样体验。</p></li><li><span>下一步</span><h3>验证小规模体验</h3><p>围绕水与茶、山野与休息策划体验，听取参与者的真实反馈，再逐步完善活动与服务。</p></li><li><span>长期探索</span><h3>连接山居与日常</h3><p>与理念相近的产品、文旅和空间伙伴交流，将山庄构想与日常产品连接成持续的品牌体验。</p></li></ol>
    </section>
    <section class="about-closing"><div><p class="eyebrow">LET GOOD IDEAS FLOW</p><h2>让好的想法，从这里汇流。</h2><p>如果你也关心地方文化、日常生活与身心休息，欢迎与若水汇一起探索。</p></div><a class="primary" href="#/partners">与我们交流 ↗</a></section>
  </article>`;
}
function partners(){return `<div class="page-head"><p class="eyebrow">PARTNER WITH US</p><h1>同源而生，共赴美好。</h1><p>与若水汇一起，把好产品与好体验带给注重生活品质的人。我们期待用审慎的选品与长期的共创，建立有价值的连接。</p></div><section class="section partner-layout"><div><h2>从相识，到共同生长。</h2><ol class="steps"><li><b>01</b><h3>了解品牌</h3><p>认识品牌理念、产品方向与合作意愿。</p></li><li><b>02</b><h3>资料与产品评估</h3><p>核对来源、资质与产品资料，明确展示内容。</p></li><li><b>03</b><h3>共创体验</h3><p>围绕产品策划活动，连接真实的生活场景。</p></li><li><b>04</b><h3>看见反馈</h3><p>规划提供品牌自身的产品浏览与活动参与汇总。</p></li></ol><a class="text-link" href="#/dashboard">预览合作伙伴工作台 ↗</a></div><form class="form-card" id="partner-form"><h2>记录合作意向</h2><p class="notice">前端演示：仅生成本页预览，不会发送或保存联系方式。</p><label for="brand-name">品牌名称 *</label><input id="brand-name" name="brand" required maxlength="80" placeholder="输入您的品牌名称"><label for="category">产品或服务方向 *</label><select id="category" name="category" required><option value="">请选择合作方向</option><option>饮用水</option><option>饮品</option><option>护肤与日用</option><option>生活体验</option><option>其他水相关方向</option></select><label for="contact">联系邮箱 *</label><input id="contact" name="contact" type="email" required maxlength="120" placeholder="name@brand.com"><label for="idea">合作想法</label><textarea id="idea" name="idea" maxlength="500" placeholder="介绍您的产品，或想一起策划的活动"></textarea><button class="primary" type="submit">预览合作意向 <span>↗</span></button><div id="form-result" role="status"></div></form></section>`;}
function dashboard(){return `<div class="page-head"><a class="back" href="#/partners">← 返回品牌合作</a><p class="eyebrow">PARTNER STUDIO / DEMO</p><h1>合作伙伴工作台</h1><p>以下均为示例数据，用于展示未来品牌查看产品表现与活动反馈的方式，不代表真实运营结果。</p></div><section class="section"><div class="section-heading"><h2>品牌概览</h2><span class="demo-badge">最近 7 天 · 示例数据</span></div><div class="metrics">${[['产品浏览','1,286','浏览次数'],['产品收藏','86','收藏次数'],['活动访问','324','访问次数'],['活动参与','52','参与次数']].map(([label,n,unit])=>`<div class="metric"><span>${label}</span><strong>${n}</strong><span>${unit} · 演示</span></div>`).join('')}</div><div class="dashboard-panels"><div><h2>产品浏览趋势</h2><div class="bar-chart" role="img" aria-label="示例数据：周一120，周二160，周三145，周四190，周五201，周六250，周日220次浏览">${[120,160,145,190,201,250,220].map((n,i)=>`<div class="bar" style="height:${n/2.5}%" title="${n} 次"><span>${['一','二','三','四','五','六','日'][i]}</span></div>`).join('')}</div></div><div><h2>合作活动</h2><table class="dashboard-table"><caption class="eyebrow">活动状态示例</caption><thead><tr><th scope="col">活动</th><th scope="col">阶段</th><th scope="col">详情</th></tr></thead><tbody>${activities.map(a=>`<tr><td>${a.title}</td><td>${a.id==='morning'?'日常体验':'筹备中'}</td><td><a href="#/activity/${a.id}" aria-label="查看${a.title}">查看 ↗</a></td></tr>`).join('')}</tbody></table></div></div></section>`;}
function notFound(){return `<section class="empty"><h1>这条水路，尚未抵达。</h1><p>页面不存在，请返回首页继续探索。</p><a class="primary" href="#/">返回首页 ↗</a></section>`;}
function route(){return (location.hash.slice(1)||'/').split('/').filter(Boolean);}
function resetTimer(){clearInterval(timer);if(!route().length&&activePanel===0&&autoplay&&!document.hidden){timer=setInterval(()=>{if(document.querySelector('.hero')?.matches(':hover,:focus-within'))return;changeSlide(slide+1);},9000);}}
function changeSlide(next) {
  slide = (next + activities.length) % activities.length;
  const heroElement = document.querySelector('.hero');
  if (!heroElement) return;
  heroElement.classList.toggle('is-flowing', autoplay);
  heroElement.querySelectorAll('.hero-image').forEach((img,i)=>img.classList.toggle('is-active', i===slide));
  heroElement.querySelectorAll('[data-slide]').forEach((button,i)=>button.setAttribute('aria-pressed', String(i===slide)));
  const copy = heroCopy[slide];
  heroElement.querySelector('h1').innerHTML = copy.title;
  heroElement.querySelector('.description').textContent = copy.subtitle;
  const link = heroElement.querySelector('.hero-copy .primary');
  link.href = `#/activity/${activities[slide].id}`;
  link.innerHTML = `${copy.action} ${icon('arrow-up-right')}`;
  const pause = heroElement.querySelector('[data-action="autoplay"]');
  pause.setAttribute('aria-label', `${autoplay?'暂停':'开始'}自动轮播与水面动效`);
  pause.innerHTML = icon(autoplay?'player-pause':'player-play');
  publishWaterState();
}
function render(moveFocus=false) {
  clearInterval(timer);
  const [page, rawId, brandId] = route();
  const id = rawId === 'drink' ? 'toner' : rawId;
  const memberPage = page === 'member' || page === 'brand' || (page === 'activity' && id === 'morning');
  document.body.dataset.page = memberPage ? 'member' : page || 'home';
  document.body.classList.toggle('is-home', !page);
  closeMenu();
  main.innerHTML = !page ? home()
    : page === 'member' ? WaterJourney.render(id || 'daily', brandId)
    : page === 'brand' ? WaterJourney.brand(id)
    : page === 'activity' && id === 'morning' ? WaterJourney.render()
    : page === 'activities' || page === 'products' ? listing(page)
    : page === 'activity' ? activityDetail(id)
    : page === 'product' ? productDetail(id)
    : page === 'about' || page === 'story' ? about()
    : page === 'partners' ? partners()
    : page === 'dashboard' ? dashboard() : notFound();
  decorateInnerPage(page);
  decorateIcons(main);
  setupPanels();
  const active = memberPage ? 'member' : page === 'activity' ? 'activities' : page === 'product' ? 'products' : page === 'story' ? 'about' : page || 'home';
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.dataset.nav === active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  const title = memberPage ? '我的若水' : page === 'activity' ? activities.find(a => a.id === id)?.title : page === 'product' ? products.find(p => p.id === id)?.name : ({activities:'私享体验',products:'若水好物',about:'关于若水汇',story:'关于若水汇',partners:'品牌共生',dashboard:'合作伙伴工作台'})[page];
  document.title = `${title ? title + ' · ' : ''}若水汇 · 好水，有源。生活，有知。`;
  if (moveFocus) { scrollTo({top:0,behavior:'instant'}); main.focus({preventScroll:true}); }
  resetTimer();
  // Membership rerenders must also stop/restart the shared water renderer.
  publishWaterState();
}

main.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;if(button.dataset.slide!==undefined){changeSlide(Number(button.dataset.slide));resetTimer();}if(button.dataset.action){const a=button.dataset.action;if(a==='autoplay'||a==='water-toggle')autoplay=!autoplay;changeSlide(slide+(a==='next'?1:a==='previous'?-1:0));resetTimer();}if(button.dataset.filter){currentFilter=button.dataset.filter;render();[...document.querySelectorAll('[data-filter]')].find(el=>el.dataset.filter===currentFilter)?.focus();}if(button.dataset.checkin){const id=button.dataset.checkin;const persisted=writeLocal(id==='morning'?'water-checkin':`water-event-${id}`,id==='morning'?localDate():'yes');render();main.focus({preventScroll:true});toast(persisted?(id==='morning'?'今日第一杯水，已记录。':'已收藏这场活动。'):'浏览器存储不可用，本次记录仅在当前页面会话有效。');}if(button.dataset.saveProduct){const persisted=writeLocal(`water-product-${button.dataset.saveProduct}`,'yes');render();main.focus({preventScroll:true});toast(persisted?'已加入当前浏览器的心愿单。':'浏览器存储不可用，心愿单仅在当前页面会话有效。');}});
main.addEventListener('submit',event=>{if(event.target.id!=='partner-form')return;event.preventDefault();const form=event.target;const data=new FormData(form);const brand=String(data.get('brand')||'').trim();if(!brand){form.elements.brand.setCustomValidity('请输入品牌名称');form.elements.brand.reportValidity();return;}const result=document.querySelector('#form-result');result.replaceChildren();const box=document.createElement('div');box.className='success';box.textContent=`意向预览：${brand} · ${data.get('category')}。联系邮箱：${data.get('contact')}。${data.get('idea')?'合作想法：'+data.get('idea')+'。':''}此内容仅在当前页面展示，未提交给平台。`;result.append(box);});
main.addEventListener('input',event=>{if(event.target.name==='brand')event.target.setCustomValidity('');});
window.addEventListener('hashchange',()=>{currentFilter='全部';render(true);});
document.addEventListener('visibilitychange',resetTimer);
function decorateInnerPage(page) {
  if (!page) return;
  const heading = main.querySelector('.page-head, .journey-heading');
  if (heading && !heading.querySelector('.back')) {
    heading.insertAdjacentHTML('afterbegin', `<a class="back" href="#/">${icon('arrow-left')} 返回水的日常</a>`);
  }
}
function decorateIcons(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) if (/[↗←→✓]/.test(walker.currentNode.textContent)) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const fragment = document.createDocumentFragment();
    for (const part of node.textContent.split(/([↗←→✓])/)) {
      const name = {'↗':'arrow-up-right','←':'arrow-left','→':'arrow-right','✓':'check'}[part];
      if (name) { const img = document.createElement('img'); img.src=`./assets/icons/${name}.svg`; img.alt=''; img.className='icon'; img.setAttribute('aria-hidden','true'); fragment.append(img); }
      else fragment.append(document.createTextNode(part));
    }
    node.replaceWith(fragment);
  }
}
function closeMenu() {
  document.body.classList.remove('menu-open');
  const toggle = document.querySelector('.menu-toggle');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', '打开导航');
  toggle.innerHTML = icon('menu-2');
}
document.querySelector('.menu-toggle').addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  const toggle = document.querySelector('.menu-toggle');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open?'关闭导航':'打开导航');
  toggle.innerHTML = icon(open?'x':'menu-2');
});
document.querySelector('.header').addEventListener('click', event => {const link=event.target.closest('a');if(!link||route().length)return;const index={'#/':0,'#/partners':3}[link.getAttribute('href')];if(index!==undefined){event.preventDefault();goPanel(index);closeMenu();}});
document.querySelector('#navigation').addEventListener('click', event => { if(event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if(event.key==='Escape') closeMenu(); });
reducedMotion.addEventListener('change',event=>{autoplay=!event.matches;changeSlide(slide);resetTimer();});
function reflectPanel(index) {
  const changed = activePanel !== index;
  activePanel = index;
  document.body.classList.toggle('home-light', index===1||index===2);
  document.querySelectorAll('[data-go-panel]').forEach((button,i)=>{if(i===index)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
  const counter = document.querySelector('.panel-counter');
  if(counter)counter.textContent=`0${index+1} / 04`;
  const nextButton=document.querySelector('[data-next-panel]');
  if(nextButton){nextButton.setAttribute('aria-label',index===3?'返回首页第一屏':'向下翻至下一屏');nextButton.querySelector('.next-label').textContent=index===3?'回到起点':'向下探索';nextButton.classList.toggle('at-end',index===3);}
  if(changed)resetTimer();
  publishWaterState();
}
function setupPanels() {
  panelObserver?.disconnect();
  clearTimeout(panelSettleTimer);
  panelSettling=false;
  if(route().length){document.body.classList.remove('home-light');return;}
  activePanel=0;
  main.scrollTo({top:0,behavior:'instant'});
  reflectPanel(0);
  panelObserver=new IntersectionObserver(entries=>{
    const visible=entries.filter(e=>e.isIntersecting&&e.intersectionRatio>.55).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(visible)reflectPanel(Number(visible.target.dataset.panel));
  },{root:main,threshold:[.55,.7]});
  main.querySelectorAll('[data-panel]').forEach(panel=>panelObserver.observe(panel));
}
function goPanel(index) {
  const panels=[...main.querySelectorAll('[data-panel]')];
  const next=Math.max(0,Math.min(panels.length-1,index));
  if(!panels[next]||(next===activePanel&&Math.abs(main.scrollTop-panels[next].offsetTop)<2))return;
  panelSettling=true;
  clearTimeout(panelSettleTimer);
  main.scrollTo({top:panels[next].offsetTop,behavior:reducedMotion.matches?'instant':'smooth'});
  reflectPanel(next);
  panelSettleTimer=setTimeout(()=>{panelSettling=false;wheelTotal=0;},reducedMotion.matches?300:1050);
}
main.addEventListener('wheel',event=>{
  if(route().length||event.ctrlKey||event.metaKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||event.target.closest('input,textarea,select,dialog'))return;
  event.preventDefault();
  const now=performance.now();
  const gap=now-wheelLast;
  wheelLast=now;
  if(panelSettling){wheelTotal=0;return;}
  const direction=Math.sign(event.deltaY);
  if(gap>180||direction!==wheelDirection)wheelTotal=0;
  wheelDirection=direction;
  wheelTotal+=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?main.clientHeight:1);
  if(Math.abs(wheelTotal)>=45){goPanel(activePanel+direction);wheelTotal=0;}
},{passive:false});
main.addEventListener('click',event=>{
  const panelButton=event.target.closest('[data-go-panel]');
  if(panelButton)goPanel(Number(panelButton.dataset.goPanel));
  if(event.target.closest('[data-next-panel]'))goPanel(activePanel===3?0:activePanel+1);
});
document.addEventListener('keydown',event=>{
  if(event.repeat||route().length||event.altKey||event.ctrlKey||event.metaKey||event.target.closest('input,textarea,select,button,a,[contenteditable="true"]'))return;
  const direction=['ArrowDown','PageDown',' '].includes(event.key)?1:['ArrowUp','PageUp'].includes(event.key)?-1:0;
  if(direction){event.preventDefault();if(!panelSettling)goPanel(activePanel+direction);}
  if(event.key==='Home'||event.key==='End'){event.preventDefault();goPanel(event.key==='Home'?0:3);}
});
let resizeTimer;
window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(!route().length){const target=main.querySelector(`[data-panel="${activePanel}"]`);if(target)main.scrollTo({top:target.offsetTop,behavior:'instant'});}},120);});
function publishWaterState() {
  const enabled=autoplay&&!reducedMotion.matches;
  const toggle=main.querySelector('.water-toggle');
  if(toggle){
    toggle.setAttribute('aria-pressed',String(enabled));
    toggle.setAttribute('aria-label',reducedMotion.matches?'已按系统偏好关闭水面动效':`${enabled?'暂停':'开启'}水面动效`);
    toggle.disabled=reducedMotion.matches;
    toggle.querySelector('[data-water-indicator]').textContent=enabled?'开':'关';
  }
  document.dispatchEvent(new CustomEvent('water-scene-change',{detail:{home:!route().length,panel:activePanel,slide,enabled}}));
}
document.addEventListener('water-effect-status',event=>{
  if(['unsupported','image-unavailable','context-lost'].includes(event.detail.status)){
    const toggle=main.querySelector('.water-toggle');
    if(toggle){toggle.querySelector('[data-water-indicator]').textContent='静态';toggle.setAttribute('aria-label','当前浏览器以静态水景展示');}
  }
});
WaterJourney.init();
render();
