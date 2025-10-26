import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";

export const MODEL_PATHS = {
  character: "/models/characters/japanese-girl.glb",
  livingRoom: "/models/rooms/livingroom-dark.glb",
  battery: "/models/items/battery-real.glb",
  switch: "/models/items/switch-real.glb",
  lamp: "/models/items/lamp-real.glb",
  oldTV: "/models/items/oldtv-real.glb",
  kitchen: "/models/rooms/kitchen-real.glb",
  fridge: "/models/items/fridge-real.glb",
  riceCooker: "/models/items/ricecooker-real.glb",
  fan: "/models/items/fan-real.glb",
  iron: "/models/items/iron-real.glb",
  lab: "/models/rooms/lab-real.glb",
  ac: "/models/items/ac-real.glb",
  basement: "/models/rooms/basement-door.glb",
  key: "/models/items/key-glowing.glb",
};

export interface ModelLoaderProps {
  modelPath: string;
  position: [number, number, number];
  scale?: [number, number, number] | number;
  rotation?: [number, number, number];
  onClick?: () => void;
  name?: string;
}

export function GLTFModel({ 
  modelPath, 
  position, 
  scale = 1, 
  rotation = [0, 0, 0],
  onClick,
  name
}: ModelLoaderProps) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  
  let scene: THREE.Group;
  
  try {
    const gltf = useGLTF(modelPath, true);
    scene = gltf.scene;
    
    if (!modelLoaded && scene) {
      setModelLoaded(true);
    }
  } catch (err) {
    if (!loadError) {
      console.warn(`Failed to load model: ${modelPath}. Model will not render.`, err);
      setLoadError(true);
    }
    return null;
  }
    
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      if (name) {
        scene.name = name;
      }
    }
  }, [scene, name]);

  if (loadError || !scene) {
    return null;
  }

  return (
    <primitive 
      object={scene.clone()} 
      position={position} 
      scale={scale} 
      rotation={rotation}
      onClick={onClick}
    />
  );
}

export function checkCollision(obj1: THREE.Object3D, obj2: THREE.Object3D, tolerance: number = 0.1): boolean {
  const box1 = new THREE.Box3().setFromObject(obj1);
  const box2 = new THREE.Box3().setFromObject(obj2);
  
  box1.expandByScalar(tolerance);
  box2.expandByScalar(tolerance);
  
  return box1.intersectsBox(box2);
}

export function getBoundingBox(obj: THREE.Object3D): THREE.Box3 {
  return new THREE.Box3().setFromObject(obj);
}
