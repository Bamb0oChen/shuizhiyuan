const main = document.querySelector('#main');
document.querySelector('.skip').addEventListener('click', event => { event.preventDefault(); main.focus(); main.scrollIntoView(); });
const activities = [
  { id: 'morning', category: '日常仪式', title: '每日第一杯水', headline: '让一天的美好，<br>从一杯水开始。', desc: '给清晨留一点空白，给自己一杯水。<br>与水知源一起，把平凡日常过成喜欢的模样。', short: '从一杯水开始，留一刻时间给自己。', tag: '每日参与', time: '每日 · 自选晨间时刻', mode: '线上生活记录', action: '记录今日第一杯水', detail: '为自己选一只喜欢的杯子，在清晨安静地喝一杯水。无需追赶，也不必比较；记录属于你的晨间片刻。', facts: [['参与方式', '点击记录，完成今日打卡'], ['活动节奏', '每天一次，按自己的节奏参与'], ['温馨提示', '饮水量与时间根据个人情况安排']] },
  { id: 'source', category: '溯源体验', title: '循水而行 · 探源之旅', headline: '循一脉清流，<br>赴一场山野之约。', desc: '走近水的来处，重新感受自然的节奏。<br>让一次旅行，成为与生活的温柔重逢。', short: '走进山野，认识每一滴水的来处。', tag: '活动筹备中', time: '时间待公布', mode: '线下小型体验', action: '收藏这场活动', detail: '一次从水源地出发的体验构想：沿着水的路径认识自然，与品牌一起了解产品的源头。具体地点、日程和接待安排将在活动确认后公布。', facts: [['活动状态', '筹备中，尚未开放报名'], ['计划内容', '水源探访、自然漫步、品牌交流'], ['适合人群', '关注自然与品质生活的朋友']] },
  { id: 'tea', category: '品味沙龙', title: '一水一茶 · 午后雅集', headline: '好水入茶，<br>慢享一刻清欢。', desc: '让水与茶相遇，让人与人相识。<br>在一盏茶的时间里，发现生活的另一种滋味。', short: '以水会友，在茶香里发现生活之美。', tag: '活动筹备中', time: '时间待公布', mode: '线下主题沙龙', action: '收藏这场活动', detail: '围绕水与茶的关系，策划一场轻松的小型品鉴。把注意力留给感受，把时间留给交流。主题、场地与嘉宾将在确认后公布。', facts: [['活动状态', '筹备中，尚未开放报名'], ['计划内容', '水与茶品鉴、生活方式分享'], ['参与形式', '小型预约制，名额待公布']] }
];
const products = [
  {id:'water', name:'水知源 · 饮用水', category:'饮用水', desc:'从日常一杯，认识水的来处。', intent:'为餐桌与日常饮用设计的产品方向。我们希望把来源信息、口感特点和适用场景清晰地呈现给每一位选择它的人。', facts:[['产品阶段','选品规划中'],['水源与工艺','待合作品牌与资料确认'],['规格与价格','待确定']], className:''},
  {id:'toner', name:'水知源 · 爽肤水', category:'日常护肤', desc:'把清透，留给日常。', intent:'以水为灵感的日常护理产品方向。以清晰的成分与使用信息，让每一次选择更从容。实际成分、适用肤质与使用方式以最终产品资料为准。', facts:[['产品阶段','包装概念已提供'],['成分与使用','待正式产品资料确认'],['规格与价格','待确定']], className:'toner'},
  {id:'mask', name:'水知源 · 面膜', category:'日常护肤', desc:'把片刻留给自己，也留给肌肤。', intent:'从水的灵感出发，探索日常护理产品。未来页面将展示完整成分、使用方式与相关产品资料，帮助用户了解后再选择。', facts:[['产品阶段','概念规划中'],['成分与功效','待正式产品资料确认'],['规格与价格','待确定']], className:'mask'}
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
  { title: '美好的一天，<br>从第一杯水开始。', subtitle: '水知源 · 每日饮水计划', action: '开启今日仪式' },
  { title: '循水而来，<br>与美好相遇。', subtitle: '水知源 · 私享生活体验', action: '探索本期体验' },
  { title: '一水一茶，<br>慢享一刻清欢。', subtitle: '水知源 · 午后雅集', action: '走近这场雅集' }
];
function art(product, mini=false) { return `<div class="${mini?'mini-art':'product-art'} ${product.id}"><img src="./assets/product-${product.id}-cutout.png" alt="${product.name}包装设计" ${mini?'':'loading="lazy"'} width="300" height="450"></div>`; }
function scene(activity) { return `<div class="scene scene-${activity.id}"><img src="./assets/${activityImages[activity.id]}" alt="${activity.id==='morning'?'晨光中的一杯清水':activity.id==='source'?'阳光照耀山野中的清澈溪流':'临水茶室中的茶席'}" loading="lazy"><span class="scene-tag">${activity.tag}</span></div>`; }
function activityCard(a) { return `<article class="activity-card"><a class="card-link" href="#/activity/${a.id}">${scene(a)}<div class="card-bottom"><h3>${a.title}</h3><span class="card-action">${a.id==='morning'?'参与仪式':'查看体验'} ${icon('arrow-up-right')}</span></div><p class="meta">${a.short}</p></a></article>`; }
function productCard(p) { return `<article class="product-card"><a href="#/product/${p.id}">${art(p)}<div class="product-bottom"><div><h3>${p.name}</h3><p>${p.desc}</p></div><span class="arrow-circle">${icon('arrow-up-right')}</span></div></a></article>`; }
function heading(en, title, link='', label='查看全部') {return `<div class="section-heading"><div><p class="eyebrow">${en}</p><h2>${title}</h2></div>${link?`<a class="text-link" href="${link}">${label} <span>↗</span></a>`:''}</div>`;}
function hero() {
  const a = activities[slide];
  const copy = heroCopy[slide];
  return `<section class="home-panel hero ${autoplay?'is-flowing':''}" data-panel="0" aria-label="水的日常" aria-roledescription="轮播">
    <div class="hero-images" aria-hidden="true">${heroImages.map((src,i)=>`<img src="./assets/${src}" class="hero-image ${i===slide?'is-active':''}" alt="" ${i===1?'fetchpriority="high"':''}>`).join('')}</div>
    <div class="hero-copy"><h1>${copy.title}</h1><p class="description">${copy.subtitle}</p><a class="primary light" href="#/activity/${a.id}">${copy.action} ${icon('arrow-up-right')}</a></div>
    <div class="hero-footer"><div class="slide-tabs" aria-label="选择活动">${['每日第一杯水','探源之旅','午后雅集'].map((title,i)=>`<button class="slide-tab" data-slide="${i}" aria-label="第${i+1}张：${activities[i].title}" aria-pressed="${slide===i}"><span>0${i+1}</span><span>${title}</span></button>`).join('')}</div><div class="slide-controls"><button class="icon-button" data-action="previous" aria-label="上一个活动">${icon('arrow-left')}</button><button class="icon-button" data-action="next" aria-label="下一个活动">${icon('arrow-right')}</button><button class="icon-button motion-toggle" data-action="autoplay" aria-label="${autoplay?'暂停':'开始'}自动轮播与水面动效">${icon(autoplay?'player-pause':'player-play')}</button></div></div>
    <a class="recommend" href="#/product/water" aria-label="本期知源之选：水知源饮用水，查看详情">${art(products[0],true)}<div><p class="eyebrow">本期知源之选</p><span class="short-rule"></span><h2>水知源饮用水</h2><span class="text-link">了解详情 ${icon('arrow-up-right')}</span></div></a>
  </section>`;
}
function home() { return `${hero()}
  <section class="home-panel section experiences" data-panel="1" aria-label="私享体验"><div class="section-heading"><h2>把时间，留给值得的相聚。</h2><p>以水为引，走进自然，走进生活。<br>在一场私享体验中，遇见更自在的自己。</p></div><div class="experience-grid">${activities.slice(1).map(activityCard).join('')}</div></section>
  <section class="home-panel collection" data-panel="2" aria-label="知源好物"><div class="collection-copy"><p class="eyebrow">SHUI ZHI YUAN</p><h2>从源头，到日常。</h2><p>以水为灵感，延展至生活的每一处。<br>水知源，陪伴你构建更有质感的日常。</p><a class="outline" href="#/products">探索知源好物 ${icon('arrow-up-right')}</a></div><div class="collection-products">${products.map(p=>`<a href="#/product/${p.id}" class="collection-product">${art(p)}<h3>${p.id==='water'?'饮用水':p.id==='toner'?'爽肤水':'面膜'}</h3></a>`).join('')}</div><span class="image-note">产品包装设计展示</span></section>
  ${partnerBand()}${panelNavigation()}`; }
function partnerBand() {
  return `<section class="home-panel partner-band partner-panel" data-panel="3" aria-label="品牌合作">
    <img class="partner-watermark" src="./assets/brand-emblem.png" alt="" aria-hidden="true">
    <div class="partner-content"><p class="eyebrow">TOGETHER, WE FLOW</p><h2>让好品牌，<br>在这里汇流。</h2><p class="partner-intro">以水为媒，连接志同道合的伙伴。<br>从一件好产品，到一场好体验，<br>共同探索更有质感的生活方式。</p><div class="band-links"><a class="primary light" href="#/partners">探索品牌合作 ${icon('arrow-up-right')}</a><a class="outline" href="#/dashboard">伙伴工作台 ${icon('arrow-up-right')}</a></div></div>
    <div class="partner-principles"><div><span>01</span><h3>产品共创</h3><p>以清晰的来源与产品资料，连接用心之物。</p></div><div><span>02</span><h3>体验共创</h3><p>从水源探访到午后雅集，让品牌走进生活。</p></div><div><span>03</span><h3>长期同行</h3><p>与理念相近的伙伴，持续打磨产品与服务。</p></div></div>
    <div class="integrated-footer"><a class="brand" href="#/story">水知源<small>SHUI ZHI YUAN</small></a><div><a href="#/story">品牌理念</a><a href="#/partners">合作伙伴</a><span>© 2026 水知源 · 前端概念预览</span></div></div>
  </section>`;
}
function panelNavigation() { return `<nav class="page-rail" aria-label="首页屏幕导航">${['水的日常','私享体验','知源好物','品牌合作'].map((name,i)=>`<button data-go-panel="${i}" aria-label="第${i+1}屏：${name}" ${i===0?'aria-current="step"':''}><span>${name}</span><i></i></button>`).join('')}</nav><button class="next-panel" data-next-panel aria-label="向下翻至下一屏"><span class="panel-counter">01 / 04</span><span class="next-label">向下探索</span>${icon('arrow-right')}</button>`; }

function listing(type) {const isActivity=type==='activities';const items=isActivity?activities:products;const categories=['全部',...new Set(items.map(i=>i.category))];if(!categories.includes(currentFilter))currentFilter='全部';return `<div class="page-head"><p class="eyebrow">${isActivity?'WATER & EVERYDAY':'THE CURATED COLLECTION'}</p><h1>${isActivity?'水与日常':'知源好物'}</h1><p>${isActivity?'用一场体验、一份记录，让水走进生活。把时间留给真正喜欢的事。':'以水为线索，探索饮用与日常护理。以下为规划中的产品方向，正式资料将在选品完成后更新。'}</p></div><section class="section"><div class="filters" aria-label="${isActivity?'活动':'产品'}分类">${categories.map(c=>`<button class="filter" data-filter="${c}" aria-pressed="${currentFilter===c}">${c}</button>`).join('')}</div><div class="${isActivity?'activity':'product'}-grid">${items.filter(i=>currentFilter==='全部'||i.category===currentFilter).map(isActivity?activityCard:productCard).join('')}</div></section>`;}
function localDate() {const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function activityDetail(id) {const a=activities.find(a=>a.id===id);if(!a)return notFound();const saved=a.id==='morning'?readLocal('water-checkin')===localDate():readLocal(`water-event-${id}`)==='yes';return `<div class="page-head"><a class="back" href="#/activities">← 返回水与日常</a></div><article class="detail">${scene(a)}<div class="detail-copy"><p class="eyebrow">${a.category} / ${a.mode}</p><h1>${a.title}</h1><p>${a.detail}</p><ul class="fact-list">${a.facts.map(([k,v])=>`<li><b>${k}</b><span>${v}</span></li>`).join('')}</ul><button class="primary" data-checkin="${id}" ${saved?'disabled':''}>${saved?(id==='morning'?'今日已记录 ✓':'已收藏 ✓'):a.action} ${saved?'':'↗'}</button><p class="notice">${id==='morning'?'记录仅保存在当前浏览器，不收集个人健康信息。':'收藏仅保存在当前浏览器；当前未开放实际预约。'}</p>${saved?`<p class="success">${id==='morning'?'今日的小小仪式，已完成。愿你从容开启这一天。':'已加入本机收藏。活动的具体安排仍在筹备中。'}</p>`:''}<div class="detail-note"><h2>与这一刻相配的好物</h2><p>${id==='tea'?'从一杯好水，开始一场好茶。':'从一杯日常饮用水，探索知源的选品方向。'}</p><a class="text-link" href="#/product/water">了解知源饮用水 ↗</a></div></div></article>`;}
function productDetail(id) {const p=products.find(p=>p.id===id);if(!p)return notFound();const saved=readLocal(`water-product-${id}`)==='yes';return `<div class="page-head"><a class="back" href="#/products">← 返回知源好物</a></div><article class="detail">${art(p)}<div class="detail-copy"><p class="eyebrow">${p.category} / CURATED BY SHUI ZHI YUAN</p><h1>${p.name}</h1><p>${p.intent}</p><span class="demo-badge">规划中的产品 · 包装为概念示意</span><ul class="fact-list">${p.facts.map(([k,v])=>`<li><b>${k}</b><span>${v}</span></li>`).join('')}</ul><button class="primary" data-save-product="${id}" ${saved?'disabled':''}>${saved?'已加入心愿单 ✓':'加入本机心愿单 ↗'}</button><p class="notice">当前为产品展示原型，尚未开放购买。心愿单仅保存在当前浏览器。</p><div class="detail-note"><h2>我们希望呈现的选品标准</h2><p>来源透明、资料完整、体验适宜。正式上架前，将补充可核实的品牌、生产与产品信息。</p></div></div></article>`;}
function story(){return `<div class="page-head"><p class="eyebrow">THE ORIGIN OF A GOOD LIFE</p><h1>水知源，知生活。</h1><p>一个以水为起点的品质生活品牌。我们相信，好的生活始于对日常的认真，也始于对来处的好奇。</p></div><section class="section story-layout"><div class="source-art">${waterScene('brand')}<span>知水之源<br>知生活之美</span></div><div class="values"><article><p class="eyebrow">01 / ORIGIN</p><h3>有源可循</h3><p>让产品的来处可了解，让选择有依据。用清晰的来源与产品资料，逐步建立信任。</p></article><article><p class="eyebrow">02 / RITUAL</p><h3>日常有意</h3><p>从每日第一杯水，到一场与朋友的雅集。在细微的日常中，为自己留一点时间。</p></article><article><p class="eyebrow">03 / CONNECTION</p><h3>与好品牌同行</h3><p>连接理念相近的合作伙伴，共同策划产品与体验，让水的故事走进更多生活场景。</p></article></div></section><section class="partner-band"><div><h2>让美好的想法，从这里汇流。</h2><p>欢迎饮水、饮品、护理与生活体验品牌探索合作。</p></div><a class="primary" href="#/partners">探索品牌合作 ↗</a></section>`;}
function partners(){return `<div class="page-head"><p class="eyebrow">PARTNER WITH US</p><h1>同源而生，共赴美好。</h1><p>与水知源一起，把好产品与好体验带给注重生活品质的人。我们期待用审慎的选品与长期的共创，建立有价值的连接。</p></div><section class="section partner-layout"><div><h2>从相识，到共同生长。</h2><ol class="steps"><li><b>01</b><h3>了解品牌</h3><p>认识品牌理念、产品方向与合作意愿。</p></li><li><b>02</b><h3>资料与产品评估</h3><p>核对来源、资质与产品资料，明确展示内容。</p></li><li><b>03</b><h3>共创体验</h3><p>围绕产品策划活动，连接真实的生活场景。</p></li><li><b>04</b><h3>看见反馈</h3><p>规划提供品牌自身的产品浏览与活动参与汇总。</p></li></ol><a class="text-link" href="#/dashboard">预览合作伙伴工作台 ↗</a></div><form class="form-card" id="partner-form"><h2>记录合作意向</h2><p class="notice">前端演示：仅生成本页预览，不会发送或保存联系方式。</p><label for="brand-name">品牌名称 *</label><input id="brand-name" name="brand" required maxlength="80" placeholder="输入您的品牌名称"><label for="category">产品或服务方向 *</label><select id="category" name="category" required><option value="">请选择合作方向</option><option>饮用水</option><option>饮品</option><option>护肤与日用</option><option>生活体验</option><option>其他水相关方向</option></select><label for="contact">联系邮箱 *</label><input id="contact" name="contact" type="email" required maxlength="120" placeholder="name@brand.com"><label for="idea">合作想法</label><textarea id="idea" name="idea" maxlength="500" placeholder="介绍您的产品，或想一起策划的活动"></textarea><button class="primary" type="submit">预览合作意向 <span>↗</span></button><div id="form-result" role="status"></div></form></section>`;}
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
}
function render(moveFocus=false){clearInterval(timer);const [page,rawId]=route();const id=rawId==='drink'?'toner':rawId;document.body.classList.toggle('is-home', !page);closeMenu();main.innerHTML=!page?home():page==='activities'||page==='products'?listing(page):page==='activity'?activityDetail(id):page==='product'?productDetail(id):page==='story'?story():page==='partners'?partners():page==='dashboard'?dashboard():notFound();decorateIcons(main);setupPanels();const active=page==='activity'?'activities':page==='product'?'products':page||'home';document.querySelectorAll('[data-nav]').forEach(a=>{if(a.dataset.nav===active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});const title=page==='activity'?activities.find(a=>a.id===id)?.title:page==='product'?products.find(p=>p.id===id)?.name:({activities:'水与日常',products:'知源好物',story:'关于水知源',partners:'品牌共生',dashboard:'合作伙伴工作台'})[page];document.title=`${title?title+' · ':''}水知源 · 好水，有源。生活，有知。`;if(moveFocus){scrollTo({top:0,behavior:'instant'});main.focus({preventScroll:true});}resetTimer();}
main.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;if(button.dataset.slide!==undefined){changeSlide(Number(button.dataset.slide));resetTimer();}if(button.dataset.action){const a=button.dataset.action;if(a==='autoplay')autoplay=!autoplay;changeSlide(slide+(a==='next'?1:a==='previous'?-1:0));resetTimer();}if(button.dataset.filter){currentFilter=button.dataset.filter;render();[...document.querySelectorAll('[data-filter]')].find(el=>el.dataset.filter===currentFilter)?.focus();}if(button.dataset.checkin){const id=button.dataset.checkin;const persisted=writeLocal(id==='morning'?'water-checkin':`water-event-${id}`,id==='morning'?localDate():'yes');render();main.focus({preventScroll:true});toast(persisted?(id==='morning'?'今日第一杯水，已记录。':'已收藏这场活动。'):'浏览器存储不可用，本次记录仅在当前页面会话有效。');}if(button.dataset.saveProduct){const persisted=writeLocal(`water-product-${button.dataset.saveProduct}`,'yes');render();main.focus({preventScroll:true});toast(persisted?'已加入当前浏览器的心愿单。':'浏览器存储不可用，心愿单仅在当前页面会话有效。');}});
main.addEventListener('submit',event=>{if(event.target.id!=='partner-form')return;event.preventDefault();const form=event.target;const data=new FormData(form);const brand=String(data.get('brand')||'').trim();if(!brand){form.elements.brand.setCustomValidity('请输入品牌名称');form.elements.brand.reportValidity();return;}const result=document.querySelector('#form-result');result.replaceChildren();const box=document.createElement('div');box.className='success';box.textContent=`意向预览：${brand} · ${data.get('category')}。联系邮箱：${data.get('contact')}。${data.get('idea')?'合作想法：'+data.get('idea')+'。':''}此内容仅在当前页面展示，未提交给平台。`;result.append(box);});
main.addEventListener('input',event=>{if(event.target.name==='brand')event.target.setCustomValidity('');});
window.addEventListener('hashchange',()=>{currentFilter='全部';render(true);});
document.addEventListener('visibilitychange',resetTimer);
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
document.querySelector('.header').addEventListener('click', event => {const link=event.target.closest('a');if(!link||route().length)return;const index={'#/':0,'#/activities':1,'#/products':2,'#/partners':3}[link.getAttribute('href')];if(index!==undefined){event.preventDefault();goPanel(index);closeMenu();}});
document.querySelector('#navigation').addEventListener('click', event => { if(event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if(event.key==='Escape') closeMenu(); });
const memberDialog = document.querySelector('#member-dialog');
function openMember() {
  const savedProducts = products.filter(p=>readLocal(`water-product-${p.id}`)==='yes');
  const savedEvents = activities.filter(a=>a.id==='morning'?readLocal('water-checkin')===localDate():readLocal(`water-event-${a.id}`)==='yes');
  document.querySelector('#member-content').innerHTML = `<h3>今日与收藏</h3>${savedEvents.length?savedEvents.map(a=>`<a class="saved-row" href="#/activity/${a.id}">${a.title}${icon('arrow-up-right')}</a>`).join(''):'<p class="empty-note">从每日第一杯水，开启你的知源日常。</p><a class="text-link" href="#/activity/morning">开启今日仪式 '+icon('arrow-up-right')+'</a>'}<h3>我的心愿单</h3>${savedProducts.length?savedProducts.map(p=>`<a class="saved-row" href="#/product/${p.id}">${art(p,true)}<span>${p.name}</span>${icon('arrow-up-right')}</a>`).join(''):'<p class="empty-note">还没有收藏的好物。</p><a class="text-link" href="#/products">发现知源好物 '+icon('arrow-up-right')+'</a>'}`;
  memberDialog.showModal();
}
document.querySelector('[data-open-member]').addEventListener('click',openMember);
document.querySelector('[data-close-member]').addEventListener('click',()=>memberDialog.close());
memberDialog.addEventListener('click',event=>{ if(event.target.closest('a')) memberDialog.close(); if(event.target===memberDialog){const r=memberDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)memberDialog.close();} });
reducedMotion.addEventListener('change',event=>{autoplay=!event.matches;changeSlide(slide);resetTimer();});
function reflectPanel(index) {
  const changed = activePanel !== index;
  activePanel = index;
  document.body.classList.toggle('home-light', index===1||index===2);
  document.querySelectorAll('.header [data-nav]').forEach(a=>{if(a.dataset.nav===['home','activities','products','partners'][index])a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  document.querySelectorAll('[data-go-panel]').forEach((button,i)=>{if(i===index)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
  const counter = document.querySelector('.panel-counter');
  if(counter)counter.textContent=`0${index+1} / 04`;
  const nextButton=document.querySelector('[data-next-panel]');
  if(nextButton){nextButton.setAttribute('aria-label',index===3?'返回首页第一屏':'向下翻至下一屏');nextButton.querySelector('.next-label').textContent=index===3?'回到起点':'向下探索';nextButton.classList.toggle('at-end',index===3);}
  if(changed)resetTimer();
}
function setupPanels() {
  panelObserver?.disconnect();
  clearTimeout(panelSettleTimer);
  panelSettling=false;
  if(route().length){document.body.classList.remove('home-light');return;}
  activePanel=0;
  main.scrollTop=0;
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
  if(!panels[next]||next===activePanel)return;
  panelSettling=true;
  clearTimeout(panelSettleTimer);
  main.scrollTo({top:panels[next].offsetTop,behavior:reducedMotion.matches?'instant':'smooth'});
  reflectPanel(next);
  panelSettleTimer=setTimeout(()=>{panelSettling=false;wheelTotal=0;},reducedMotion.matches?300:1050);
}
main.addEventListener('wheel',event=>{
  if(route().length||memberDialog.open||event.ctrlKey||event.metaKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||event.target.closest('input,textarea,select,dialog'))return;
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
  if(route().length||memberDialog.open||event.altKey||event.ctrlKey||event.metaKey||event.target.closest('input,textarea,select,button,a,[contenteditable="true"]'))return;
  const direction=['ArrowDown','PageDown',' '].includes(event.key)?1:['ArrowUp','PageUp'].includes(event.key)?-1:0;
  if(direction){event.preventDefault();if(!panelSettling)goPanel(activePanel+direction);}
  if(event.key==='Home'||event.key==='End'){event.preventDefault();goPanel(event.key==='Home'?0:3);}
});
render();
