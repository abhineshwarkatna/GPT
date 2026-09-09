# Production Automotive GLB

The runtime expects the production car at:

`public/models/car.glb`

## Recommended high-detail source

Audi RS7 Sportback — Realistic Car 3D Model by DevPoly3D:
https://sketchfab.com/3d-models/audi-rs7-sportback-realistic-car-3d-model-e668437afccf4896aa1d2aac8a2daca2

The listing currently states approximately 1.4M triangles, 4K/8K PBR textures, and a Creative Commons Attribution (CC BY) license. Preserve the creator attribution and follow the asset page's current license terms when redistributing the downloaded asset.

## Install

1. Download the model from the source page.
2. Export/download the GLB version.
3. Rename the final file to `car.glb`.
4. Put it in `public/models/car.glb`.
5. Restart Vite if needed.

The app automatically checks for `/models/car.glb`. If it is not present, it keeps the existing procedural car so the page does not break.

## Runtime optimization

For a 60 FPS target, keep the high-detail master asset but create a web-optimized GLB when possible: Draco or Meshopt compression, resized/packed textures, and sensible texture resolution. Three.js GLTFLoader supports Draco, Meshopt, KTX2/BasisU and modern PBR material extensions.
