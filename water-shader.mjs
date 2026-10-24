export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Screen-space refraction of the actual photographic water, not a simulation
// of the DOM. The horizon mask leaves mountains and buildings stationary.
export const fragmentShader = `
  precision highp float;
  uniform sampler2D uPhoto;
  uniform vec2 uCoverScale;
  uniform vec2 uCoverOffset;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uWaterLine;
  uniform float uStrength;
  uniform float uPartnerTint;
  uniform vec4 uRipples[8];
  varying vec2 vUv;

  vec3 softLight(vec3 base, vec3 blend) {
    vec3 d = mix(((16.0 * base - 12.0) * base + 4.0) * base, sqrt(base), step(vec3(0.25), base));
    return mix(base - (1.0 - 2.0 * blend) * base * (1.0 - base), base + (2.0 * blend - 1.0) * (d - base), step(vec3(0.5), blend));
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    float water = 1.0 - smoothstep(uWaterLine - 0.10, uWaterLine + 0.015, vUv.y);
    vec2 p = vec2(vUv.x * aspect, vUv.y);

    // Low-amplitude long waves: distinct directions avoid a uniform image pan.
    float a = sin(p.x * 22.0 + p.y * 35.0 - uTime * 0.57);
    float b = sin(p.x * -13.0 + p.y * 48.0 + uTime * 0.39);
    vec2 displacement = vec2(a * 0.0012 + b * 0.00065, b * 0.0009 + a * 0.0004);
    float light = 0.0;

    for (int i = 0; i < 8; i++) {
      float age = uTime - uRipples[i].z;
      if (age >= 0.0 && age < 3.5 && uRipples[i].w > 0.0) {
        vec2 direction = p - vec2(uRipples[i].x * aspect, uRipples[i].y);
        float distance = length(direction);
        float radius = 0.018 + age * 0.145;
        float band = distance - radius;
        float envelope = exp(-band * band * 520.0) * exp(-age * 1.1);
        float wave = sin(band * 100.0) * envelope * uRipples[i].w;
        vec2 normal = direction / max(distance, 0.002);
        displacement += vec2(normal.x / max(aspect, 0.2), normal.y) * wave * 0.009;
        light += wave * 0.055;
      }
    }

    vec2 sampleUv = uCoverOffset + (vUv + displacement * water * uStrength) * uCoverScale;
    vec3 color = texture2D(uPhoto, clamp(sampleUv, vec2(0.001), vec2(0.999))).rgb;
    color = mix(color, softLight(vec3(0.258824, 0.419608, 0.509804), color), uPartnerTint);
    color += light * water * uStrength;
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;
