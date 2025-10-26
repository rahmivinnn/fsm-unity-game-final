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