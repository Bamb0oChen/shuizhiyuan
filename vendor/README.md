# Vendored runtime

Three.js 0.180.0 is copied from the official npm package into `three/`.

- Source and package integrity: `three/version.json`
- Upstream: https://github.com/mrdoob/three.js
- License: `three/LICENSE` (MIT)
- Retained builds: `three.module.min.js` and its `three.core.min.js` import.

The application imports these local modules; it does not fetch a runtime CDN.
