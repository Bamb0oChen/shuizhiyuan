import test from 'node:test';
import assert from 'node:assert/strict';
import { coverUV, pointerToWater, renderQuality, canAnimate, RipplePool } from '../water-model.mjs';

const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.00001, `${actual} != ${expected}`);

test('cover crop matches CSS for landscape, portrait and off-center positions', () => {
  const landscape = coverUV(1600, 900, 1920, 1080);
  assert.deepEqual(landscape, { scale: [1, 1], offset: [0, 0] });
  const portrait = coverUV(390, 844, 1920, 1080, 0.63, 0.5);
  near(portrait.scale[0], 390 / (1920 * 844 / 1080));
  near(portrait.offset[0], (1 - portrait.scale[0]) * 0.63);
  assert.equal(portrait.scale[1], 1);
  const vertical = coverUV(1200, 400, 600, 600, 0.5, 0);
  near(vertical.scale[1], 1 / 3);
  near(vertical.offset[1], 2 / 3);
});

test('cover zoom crops safely and invalid dimensions fail closed', () => {
  const crop = coverUV(100, 100, 100, 100, 0.5, 0.5, 1.025);
  assert.ok(crop.scale[0] < 1 && crop.offset[0] > 0);
  assert.equal(coverUV(0, 100, 100, 100), null);
  assert.equal(coverUV(100, 100, NaN, 100), null);
});

test('pointer coordinates honor panel offsets and the water-only region', () => {
  const rect = { left: 20, top: 100, width: 400, height: 800 };
  assert.deepEqual(pointerToWater(220, 700, rect, 0.5), { x: 0.5, y: 0.25 });
  assert.equal(pointerToWater(220, 300, rect, 0.5), null);
  assert.equal(pointerToWater(19, 700, rect, 0.5), null);
  assert.equal(pointerToWater(220, 901, rect, 0.5), null);
  assert.equal(pointerToWater(NaN, 700, rect, 0.5), null);
  assert.equal(pointerToWater(220, 700, { ...rect, width: 0 }, 0.5), null);
});

test('GPU resolution is bounded even on a large retina screen', () => {
  const desktop = renderQuality(3840, 2160, 3, false, false);
  assert.ok(3840 * 2160 * desktop.pixelRatio ** 2 <= 1600001);
  assert.equal(desktop.fps, 45);
  const mobile = renderQuality(390, 844, 3, true, false);
  assert.equal(mobile.pixelRatio, 1);
  assert.equal(mobile.fps, 30);
  const saver = renderQuality(1920, 1080, 2, false, true);
  assert.ok(saver.pixelRatio < desktop.maxPixelRatio);
  assert.equal(saver.fps, 24);
});

test('animation stops for every pause/fallback/lifecycle condition', () => {
  const state = { home: true, enabled: true, visible: true, reduced: false, ready: true, lost: false };
  assert.equal(canAnimate(state), true);
  for (const [key, value] of [['home', false], ['enabled', false], ['visible', false], ['reduced', true], ['ready', false], ['lost', true]]) {
    assert.equal(canAnimate({ ...state, [key]: value }), false, key);
  }
});

test('pointer impulses stay bounded, expire, and reset across images', () => {
  const pool = new RipplePool(3, 3.5);
  for (let i = 0; i < 7; i++) pool.add(0.5, 0.25, i * 0.1, 1);
  assert.equal(pool.values(0.7).length, 3);
  assert.equal(pool.values(5).length, 0);
  assert.equal(pool.add(-1, 0.3, 5, 1), false);
  assert.equal(pool.add(0.3, 0.3, NaN, 1), false);
  pool.add(0.3, 0.3, 5, 100);
  assert.equal(pool.values(5)[0].strength, 1);
  pool.clear();
  assert.deepEqual(pool.values(5), []);
});
