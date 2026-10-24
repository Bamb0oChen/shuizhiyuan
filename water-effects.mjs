import * as THREE from './vendor/three/three.module.min.js';
import { coverUV, pointerToWater, renderQuality, canAnimate, RipplePool } from './water-model.mjs';
import { vertexShader, fragmentShader } from './water-shader.mjs';

const root = document.querySelector('#main');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const coarsePointer = matchMedia('(pointer: coarse)');
const interactiveSelector = 'a,button,input,select,textarea,dialog,nav,.hero-copy,.section-heading,.card-bottom,.meta,.collection-copy,.partner-content,.partner-principles,.integrated-footer';
const profiles = [
  { src: './assets/hero-water.png', waterLine: 0.54, strength: 0.85, tint: 0 },
  { src: './assets/experience-atmosphere.png', waterLine: 0.49, strength: 0.50, tint: 0 },
  { src: './assets/water-light.png', waterLine: 0.49, strength: 0.65, tint: 0 },
  { src: './assets/hero-water.png', waterLine: 0.57, strength: 0.75, tint: 1 }
];

let state = {
  home: document.body.classList.contains('is-home'),
  enabled: Boolean(document.querySelector('.hero.is-flowing')),
  panel: Number(document.querySelector('[data-go-panel][aria-current]')?.dataset.goPanel || 0),
  slide: [...document.querySelectorAll('[data-slide]')].findIndex(el => el.getAttribute('aria-pressed') === 'true')
};
let renderer, material, scene, camera, geometry, canvas;
let activeElement, activeProfile, activeTexture;
let frame = 0, lastFrame = 0, clock = 0, renderCount = 0;
let ready = false, lost = false, unsupported = false;
let requestId = 0, lastPointerTime = 0, previousPointer = null;
let lastAppliedKey = '';
let quality = { fps: 30, pixelRatio: 1 };
const ripples = new RipplePool();
const textures = new Map();
const controller = new AbortController();
const { signal } = controller;

function status(value) {
  root.dataset.waterStatus = value;
  document.dispatchEvent(new CustomEvent('water-effect-status', { detail: { status: value } }));
}

function permitted() {
  return canAnimate({ ...state, visible: !document.hidden, reduced: preference.matches, ready, lost });
}

function stop() {
  cancelAnimationFrame(frame);
  frame = 0;
  lastFrame = 0;
}

function fallback(reason = 'unavailable') {
  stop();
  ready = false;
  if (canvas) canvas.hidden = true;
  activeElement?.classList.remove('water-ready');
  status(reason);
}

function createRenderer() {
  if (unsupported) return false;
  if (renderer) return true;
  // Avoid asking Three.js to initialize an unsupported WebGL context.
  const candidate = document.createElement('canvas');
  let context;
  try {
    context = candidate.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'low-power' });
  } catch {
    unsupported = true;
    fallback('unsupported');
    return false;
  }
  if (!context) { unsupported = true; fallback('unsupported'); return false; }
  try {
    renderer = new THREE.WebGLRenderer({ canvas: candidate, context, alpha: false, antialias: false });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x173e53, 1);
    canvas = renderer.domElement;
    canvas.className = 'water-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.hidden = true;
    geometry = new THREE.PlaneGeometry(2, 2);
    material = new THREE.ShaderMaterial({
      vertexShader, fragmentShader, depthTest: false, depthWrite: false,
      uniforms: {
        uPhoto: { value: null }, uCoverScale: { value: new THREE.Vector2(1, 1) },
        uCoverOffset: { value: new THREE.Vector2() }, uResolution: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 }, uWaterLine: { value: 0.5 }, uStrength: { value: 0.6 },
        uPartnerTint: { value: 0 }, uRipples: { value: Array.from({ length: 8 }, () => new THREE.Vector4(0, 0, -100, 0)) }
      }
    });
    scene = new THREE.Scene();
    scene.add(new THREE.Mesh(geometry, material));
    camera = new THREE.Camera();
    renderer.debug.onShaderError = () => { unsupported = true; fallback('unsupported'); };
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      lost = true;
      fallback('context-lost');
    }, { signal });
    canvas.addEventListener('webglcontextrestored', () => {
      lost = false;
      lastAppliedKey = '';
      applyState();
    }, { signal });
    return true;
  } catch {
    unsupported = true;
    renderer?.dispose();
    renderer = null;
    fallback('unsupported');
    return false;
  }
}

function loadPhoto(src) {
  if (textures.has(src)) return textures.get(src);
  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      try {
        // Cap texture memory, independently of the CSS viewport and device DPR.
        const limit = coarsePointer.matches || innerWidth <= 650 ? 1024 : 1600;
        const ratio = Math.min(1, limit / Math.max(image.naturalWidth, image.naturalHeight));
        const buffer = document.createElement('canvas');
        buffer.width = Math.round(image.naturalWidth * ratio);
        buffer.height = Math.round(image.naturalHeight * ratio);
        const ctx = buffer.getContext('2d');
        if (!ctx) throw new Error('Image canvas unavailable');
        ctx.drawImage(image, 0, 0, buffer.width, buffer.height);
        const texture = new THREE.CanvasTexture(buffer);
        texture.colorSpace = THREE.NoColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        resolve({ texture, width: image.naturalWidth, height: image.naturalHeight });
      } catch (error) { reject(error); }
    };
    image.onerror = () => reject(new Error('Water image unavailable'));
    image.src = src;
  });
  textures.set(src, promise);
  promise.catch(() => textures.delete(src));
  return promise;
}

function resize() {
  if (!renderer || !activeElement?.isConnected || !activeTexture || lost) return;
  const rect = activeElement.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;
  quality = renderQuality(rect.width, rect.height, devicePixelRatio, coarsePointer.matches || rect.width <= 650, Boolean(navigator.connection?.saveData));
  renderer.setPixelRatio(quality.pixelRatio);
  renderer.setSize(rect.width, rect.height, false);
  const style = getComputedStyle(state.panel === 0 ? activeElement.querySelector('.hero-image.is-active') : activeElement);
  const position = (state.panel === 0 ? style.objectPosition : style.backgroundPosition).split(' ');
  const percent = (value, fallback) => value?.endsWith('%') ? Number.parseFloat(value) / 100 : fallback;
  const cover = coverUV(rect.width, rect.height, activeTexture.width, activeTexture.height, percent(position[0], 0.5), percent(position[1], 0.5));
  if (!cover) return;
  material.uniforms.uCoverScale.value.set(...cover.scale);
  material.uniforms.uCoverOffset.value.set(...cover.offset);
  material.uniforms.uResolution.value.set(rect.width, rect.height);
}

function renderFrame() {
  material.uniforms.uTime.value = clock;
  const values = ripples.values(clock);
  material.uniforms.uRipples.value.forEach((uniform, i) => {
    const item = values[i];
    if (item) uniform.set(item.x, item.y, item.time, item.strength);
    else uniform.set(0, 0, -100, 0);
  });
  try {
    renderer.render(scene, camera);
  } catch {
    unsupported = true;
    fallback('unsupported');
    return;
  }
  if (unsupported || lost) return;
  if (++renderCount % 15 === 0) canvas.dataset.frames = String(renderCount);
  canvas.dataset.ripples = String(values.length);
}

function tick(now) {
  frame = 0;
  if (!permitted()) return;
  const elapsed = lastFrame ? now - lastFrame : 1000 / quality.fps;
  if (elapsed >= 1000 / quality.fps - 0.5) {
    clock += Math.min(elapsed / 1000, 0.06);
    lastFrame = now;
    renderFrame();
  }
  if (permitted()) frame = requestAnimationFrame(tick);
}

function resume() {
  stop();
  if (permitted()) {
    canvas.hidden = false;
    activeElement.classList.add('water-ready');
    status('running');
    frame = requestAnimationFrame(tick);
  } else if (ready && !lost) {
    status(preference.matches ? 'reduced-motion' : document.hidden ? 'hidden' : 'paused');
  }
}

async function applyState() {
  const token = ++requestId;
  const element = state.home ? root.querySelector(`[data-panel="${state.panel}"]`) : null;
  // Morning and tea slides contain furniture/product scenes; keep those still.
  const profile = state.panel === 0 && state.slide !== 1 ? null : profiles[state.panel];
  if (!element || !profile) {
    activeElement?.classList.remove('water-ready');
    canvas?.remove();
    lastAppliedKey = '';
    fallback(element ? 'still-photo' : 'inactive');
    return;
  }
  const key = `${state.panel}:${state.slide}:${profile.src}`;
  if (element === activeElement && key === lastAppliedKey && ready) { resume(); return; }
  stop();
  activeElement?.classList.remove('water-ready');
  if (canvas) canvas.hidden = true;
  ready = false;
  activeElement = element;
  activeProfile = profile;
  ripples.clear();
  previousPointer = null;
  if (!state.enabled || preference.matches) { status(preference.matches ? 'reduced-motion' : 'paused'); return; }
  if (!createRenderer()) return;
  if (lost) { fallback('context-lost'); return; }
  status('loading');
  try {
    const photo = await loadPhoto(profile.src);
    if (token !== requestId || !element.isConnected) return;
    activeTexture = photo;
    material.uniforms.uPhoto.value = photo.texture;
    material.uniforms.uWaterLine.value = profile.waterLine;
    material.uniforms.uStrength.value = profile.strength;
    material.uniforms.uPartnerTint.value = profile.tint;
    element.append(canvas);
    resize();
    ready = true;
    lastAppliedKey = key;
    renderFrame();
    if (!unsupported) resume();
  } catch {
    if (token === requestId) fallback('image-unavailable');
  }
}

function pointer(event) {
  if (!permitted() || !activeProfile || event.target.closest(interactiveSelector)) return;
  // Never capture touch, prevent scrolling, or interfere with controls.
  if (event.pointerType === 'touch' && event.type !== 'pointerdown') return;
  const point = pointerToWater(event.clientX, event.clientY, activeElement.getBoundingClientRect(), activeProfile.waterLine - 0.025);
  if (!point) { previousPointer = null; return; }
  const now = performance.now();
  if (event.type !== 'pointerdown') {
    if (now - lastPointerTime < 85) return;
    if (previousPointer && Math.hypot(point.x - previousPointer.x, point.y - previousPointer.y) < 0.014) return;
  }
  ripples.add(point.x, point.y, clock, event.type === 'pointerdown' ? 1 : 0.65);
  previousPointer = point;
  lastPointerTime = now;
  canvas.dataset.lastInput = event.pointerType || 'mouse';
}

document.addEventListener('water-scene-change', event => {
  state = { ...state, ...event.detail };
  applyState();
}, { signal });
root.addEventListener('pointermove', pointer, { passive: true, signal });
root.addEventListener('pointerdown', pointer, { passive: true, signal });
document.addEventListener('visibilitychange', () => document.hidden ? (stop(), status('hidden')) : applyState(), { signal });
preference.addEventListener('change', () => {
  if (preference.matches) {
    ++requestId;
    fallback('reduced-motion');
    lastAppliedKey = '';
  } else applyState();
}, { signal });
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { resize(); if (ready && !lost && !document.hidden) renderFrame(); }, 100);
}, { signal });
window.addEventListener('pagehide', () => stop(), { signal });
window.addEventListener('pageshow', () => applyState(), { signal });

applyState();
