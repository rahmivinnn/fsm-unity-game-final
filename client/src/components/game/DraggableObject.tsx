import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { BoundingBoxHelper } from "@/lib/utils/boundingBox";
import { TweenHelper } from "@/lib/utils/tween";

interface DraggableObjectProps {
  children: React.ReactNode;
  position: [number, number, number];
  boundingBox: THREE.Box3;
  onCorrectPlacement?: () => void;
  onIncorrectPlacement?: () => void;
}

export function DraggableObject({
  children,
  position,
  boundingBox,
  onCorrectPlacement,
  onIncorrectPlacement
}: DraggableObjectProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [dragging, setDragging] = useState(false);
  const [correctPosition] = useState(new THREE.Vector3(...position));
  const initialPosition = useRef(new THREE.Vector3(...position));
  const dragOffset = useRef(new THREE.Vector3());
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // Set initial position
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...position);
    }
  }, [position]);

  // Handle mouse down event
  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    if (!meshRef.current) return;
    
    setDragging(true);
    
    // Calculate offset between mouse and object position
    raycaster.current.setFromCamera(mouse.current, e.camera);
    const intersection = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(
      new THREE.Plane(new THREE.Vector3(0, 1, 0), position[1]),
      intersection
    );
    dragOffset.current.subVectors(meshRef.current.position, intersection);
  };

  // Handle mouse up event
  const handlePointerUp = () => {
    if (!dragging || !meshRef.current) return;
    
    setDragging(false);
    
    // Check if object is within correct bounding box
    const objectBox = BoundingBoxHelper.createBoundingBox(meshRef.current);
    const isCorrect = BoundingBoxHelper.checkCollision(objectBox, boundingBox, 0.1);
    
    if (isCorrect) {
      // Snap to correct position with smooth animation
      TweenHelper.smoothTween(meshRef.current, correctPosition, 500, () => {
        if (onCorrectPlacement) onCorrectPlacement();
      });
    } else {
      // Return to initial position with smooth animation
      TweenHelper.smoothTween(meshRef.current, initialPosition.current, 500, () => {
        if (onIncorrectPlacement) onIncorrectPlacement();
      });
    }
  };

  // Handle mouse move event
  const handlePointerMove = (e: any) => {
    if (!dragging || !meshRef.current) return;
    
    // Update mouse position
    mouse.current.set(e.clientX, e.clientY);
    
    // Calculate new position
    raycaster.current.setFromCamera(mouse.current, e.camera);
    const intersection = new THREE.Vector3();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), position[1]);
    
    if (raycaster.current.ray.intersectPlane(plane, intersection)) {
      const newPosition = intersection.add(dragOffset.current);
      meshRef.current.position.copy(newPosition);
    }
  };

  // Update mouse position on move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handlePointerUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handlePointerUp);
    };
  }, [dragging]);

  return (
    <group
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'grab';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {children}
    </group>
  );
}