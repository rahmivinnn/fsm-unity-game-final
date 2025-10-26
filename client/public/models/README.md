<<<<<<< HEAD
# Energy Quest - GLTF Models Setup

## Download Model Realistik dari URLs Berikut:

### Karakter
- **Japanese Schoolgirl**: https://sketchfab.com/3d-models/3d-character-of-a-japanese-high-school-girl-6cb1dd6ce3dc45248687c40947dbb150
  - Simpan sebagai: `characters/japanese-girl.glb`

### Rooms & Environments
- **Living Room Dark**: https://sketchfab.com/3d-models/livingroom-dark-interior-design-81a81d33930b4be59f25918e4c66baa8
  - Simpan sebagai: `rooms/livingroom-dark.glb`
- **Basement Door**: https://sketchfab.com/3d-models/outdoor-cellar-door-1d8736ede47149c0be75c99e47266047
  - Simpan sebagai: `rooms/basement-door.glb`

### Level 1 Items (Living Room)
- **Battery**: https://sketchfab.com/3d-models/battery-shutoff-switch-3cabc19beae64a81b646d111d31c2db8
  - Simpan sebagai: `items/battery-real.glb`
- **Old Light Switch**: https://sketchfab.com/3d-models/old-light-switch-e25a92428502412d9b3a4a395f74f668
  - Simpan sebagai: `items/switch-real.glb`
- **Old TV Vintage**: Search TurboSquid free old TV vintage
  - Simpan sebagai: `items/oldtv-real.glb`
- **Lamp**: https://free3d.com/3d-model/lamp- (pilih yang cocok)
  - Simpan sebagai: `items/lamp-real.glb`

### Level 2 Items (Kitchen)
Dari https://www.cgtrader.com/free-3d-models/kitchen-appliance (pilih realistik):
- **Fridge**: Simpan sebagai `items/fridge-real.glb`
- **Rice Cooker**: Simpan sebagai `items/ricecooker-real.glb`
- **Fan**: Simpan sebagai `items/fan-real.glb`
- **Iron**: Simpan sebagai `items/iron-real.glb`
- **Kitchen Room**: Simpan sebagai `rooms/kitchen-real.glb`

### Level 3 Items (Lab)
Dari https://www.blenderkit.com/free-lab-equipment (export GLTF):
- **AC Unit**: Simpan sebagai `items/ac-real.glb`
- **Lab Equipment**: Simpan sebagai `rooms/lab-real.glb`

### Special Items
- **Energy Key**: Buat simple sphere glowing atau download free model
  - Simpan sebagai: `items/key-glowing.glb`

### Sounds
Dari https://pixabay.com/sound-effects/search/mystery/:
- **Click Sound**: Simpan sebagai `sounds/click.mp3`
- **Buzz Sound**: Simpan sebagai `sounds/buzz.mp3`
- **Background Music**: Simpan sebagai `sounds/music.mp3`
- **Reporter Voice**: Simpan sebagai `sounds/reporter.mp3`
- **Scientist Voice**: Simpan sebagai `sounds/ilmuwan.mp3`

## Cara Download dari Sketchfab:
1. Kunjungi link model
2. Klik "Download 3D Model"
3. Pilih format "glTF" atau "GLB"
4. Download dan extract
5. Rename file sesuai dengan nama di atas
6. Paste ke folder yang sesuai

## Catatan Penting:
- Semua models harus dalam format GLB (binary GLTF) untuk performa optimal
- Pastikan scale dan orientation model sudah benar
- Test setiap model di Three.js editor terlebih dahulu jika perlu
- Models akan di-load dengan fixed positions (tidak random)
=======
# 3D Models for EnergyQuest

This directory contains realistic 3D models for the EnergyQuest educational game. All models should be in GLTF/GLB format for optimal performance with Three.js and React Three Fiber.

## Required Models by Level

### Level 1: Living Room
- **Battery Rack Metal Realistic** - Place near bookshelf on floor
- **Light Switch Metal Vintage** - Wall-mounted
- **Lamp Bulb Bohlam Glass Real** - Hanging ceiling lamp
- **Vintage Japanese CRT TV** - Wall-mounted in front of sofa

### Level 2: Kitchen
- **Stainless Steel Fridge with Door** - Corner of kitchen
- **White Round Rice Cooker** - On countertop
- **Plastic Table Fan** - Floor placement
- **Steam Iron** - On shelf/rack

### Level 3: Laboratory
- **White Wall Air Conditioner** - Wall-mounted
- **Rolled Paper Blueprint** - On table

### Level 4: Underground Cellar
- **Underground Wooden Hinged Cellar Door** - Center of room

## Model Sources

Recommended sources for free high-quality models:
- [Sketchfab](https://sketchfab.com/)
- [CGTrader](https://www.cgtrader.com/)
- [TurboSquid](https://www.turbosquid.com/)
- [Free3D](https://free3d.com/)
- [Clara.io](https://clara.io/)

## Implementation Guidelines

1. All models should be in GLTF/GLB format
2. Models should be optimized for web (under 5MB each)
3. Use proper scaling to match game world units
4. Include PBR materials for realistic lighting
5. Ensure models have proper UV mapping
6. Test models in game environment for performance

## Loading Models in React Three Fiber

Use the `useGLTF` hook from `@react-three/drei`:

```jsx
import { useGLTF } from '@react-three/drei'

function RealisticObject({ position }) {
  const { scene } = useGLTF('/models/object-name.glb')
  return <primitive object={scene} position={position} />
}
```

## Model Placement Specifications

All objects should be placed according to the design PDF with realistic positioning:
- Level 1: Battery near bookshelf, switch on wall, hanging lamp on ceiling, TV on wall in front of sofa
- Level 2: Fridge in kitchen corner, rice cooker on counter, fan on floor, iron on shelf
- Level 3: AC on lab wall, blueprint on table
- Level 4: Large door in center of underground room
>>>>>>> 4e9e68ff730d736a95310012339ce79485b0e153
