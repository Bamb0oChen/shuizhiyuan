const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

export function coverUV(width, height, imageWidth, imageHeight, x = 0.5, y = 0.5, zoom = 1) {
  if (![width, height, imageWidth, imageHeight, zoom].every(n => Number.isFinite(n) && n > 0)) return null;
  const factor = Math.max(width / imageWidth, height / imageHeight) * Math.max(1, zoom);
  const scale = [width / (imageWidth * factor), height / (imageHeight * factor)];
  return { scale, offset: [(1 - scale[0]) * clamp(x, 0, 1), (1 - scale[1]) * (1 - clamp(y, 0, 1))] };
}

export function pointerToWater(clientX, clientY, rect, waterLine) {
  if (![clientX, clientY, rect.left, rect.top, rect.width, rect.height].every(Number.isFinite) || rect.width <= 0 || rect.height <= 0) return null;
  const x = (clientX - rect.left) / rect.width;
  const y = 1 - (clientY - rect.top) / rect.height;
  if (x < 0 || x > 1 || y < 0 || y > waterLine) return null;
  return { x, y };
}

export function renderQuality(width, height, deviceRatio = 1, coarse = false, saveData = false) {
  const maxPixels = saveData ? 450000 : coarse ? 650000 : 1600000;
  const maxPixelRatio = coarse ? 1 : 1.25;
  const area = Math.max(1, width * height);
  return { pixelRatio: Math.min(Math.max(0.1, deviceRatio), maxPixelRatio, Math.sqrt(maxPixels / area)), maxPixelRatio, fps: saveData ? 24 : coarse ? 30 : 45 };
}

export function canAnimate({ home, enabled, visible, reduced, ready, lost }) {
  return Boolean(home && enabled && visible && !reduced && ready && !lost);
}

export class RipplePool {
  constructor(capacity = 8, duration = 3.5) {
    this.capacity = capacity;
    this.duration = duration;
    this.items = [];
  }
  add(x, y, time, strength = 1) {
    if (![x, y, time, strength].every(Number.isFinite) || x < 0 || x > 1 || y < 0 || y > 1 || strength <= 0) return false;
    this.items.push({ x, y, time, strength: clamp(strength, 0, 1) });
    if (this.items.length > this.capacity) this.items.shift();
    return true;
  }
  values(time) {
    this.items = this.items.filter(item => time >= item.time && time - item.time < this.duration);
    return this.items;
  }
  clear() { this.items = []; }
}
