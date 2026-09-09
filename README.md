# AK — Cinematic 3D Automotive Portfolio

A production-style React + Three.js / React Three Fiber portfolio landing page inspired by a luxury automotive studio.

## What changed
- Real-world automotive hero scene with a custom detailed 3D performance sedan
- Four animated wheels, brake accents, headlights, glass cabin and metallic body
- Night city skyline built from procedural 3D buildings
- 3D bridge and animated helicopter in the background
- Reflective showroom floor, architectural light strips and cinematic lighting
- Ambient 3D particles and subtle camera motion
- Mouse-driven parallax and scroll motion
- Bloom, chromatic aberration and vignette
- Luxury portfolio UI, side navigation, social rail and glass feature cards
- Responsive desktop/tablet/mobile layout

## Run locally

```bash
npm install
npm run dev
```

Then open the Vite localhost URL shown in the terminal.

## 3D asset direction

The project uses procedural Three.js geometry for the automotive hero so the repository stays self-contained. Three.js also supports production glTF/GLB assets through `GLTFLoader`, including modern compression and material extensions. For a future version, a properly licensed GLB automotive model can replace the procedural car while retaining the same lighting, camera and interaction system.

Reference asset sources researched for future replacement include Kenney's CC0 Car Kit and CC Attribution automotive models on Sketchfab. Always preserve the applicable attribution/license when importing third-party assets.
