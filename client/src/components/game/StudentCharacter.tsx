import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { GLTFModel } from "./GLTFModel";

interface StudentCharacterProps {
  position?: [number, number, number];
  targetPosition?: [number, number, number];
  isInteracting?: boolean;
  isDragging?: boolean;
  onAnimationComplete?: () => void;
}

export function StudentCharacter({
  position = [0, 0, 0],
  targetPosition,
  isInteracting = false,
  isDragging = false,
  onAnimationComplete
}: StudentCharacterProps) {
  const characterRef = useRef<THREE.Group>(null);
  const [currentAnimation, setCurrentAnimation] = useState("idle");
  const moveStartTime = useRef<number>(0);
  const startPosition = useRef(new THREE.Vector3(...position));
  
  // Handle movement to target position
  useEffect(() => {
    if (targetPosition && characterRef.current) {
      moveStartTime.current = Date.now();
      startPosition.current.copy(characterRef.current.position);
      setCurrentAnimation("walking");
    }
  }, [targetPosition]);

  // Handle interaction animations
  useEffect(() => {
    if (isDragging) {
      setCurrentAnimation("dragging");
    } else if (isInteracting) {
      setCurrentAnimation("interacting");
      // Return to idle after interaction
      const timer = setTimeout(() => {
        setCurrentAnimation("idle");
        if (onAnimationComplete) onAnimationComplete();
      }, 2000);
      return () => clearTimeout(timer);
    } else if (!targetPosition) {
      setCurrentAnimation("idle");
    }
  }, [isInteracting, isDragging, targetPosition, onAnimationComplete]);

  // Animation loop
  useFrame(() => {
    if (!characterRef.current) return;
    
    // Handle movement animation
    if (targetPosition && moveStartTime.current > 0) {
      const elapsed = Date.now() - moveStartTime.current;
      const progress = Math.min(elapsed / 2000, 1); // 2 second walk duration
      
      // Interpolate position
      const start = startPosition.current;
      const end = new THREE.Vector3(...targetPosition);
      characterRef.current.position.lerpVectors(start, end, progress);
      
      // Look at target
      characterRef.current.lookAt(end.x, characterRef.current.position.y, end.z);
      
      // Complete movement
      if (progress >= 1) {
        moveStartTime.current = 0;
        setCurrentAnimation("idle");
        if (onAnimationComplete) onAnimationComplete();
      }
    }
    
    // Handle idle bobbing animation
    if (currentAnimation === "idle") {
      characterRef.current.position.y = position[1] + Math.sin(Date.now() * 0.005) * 0.02;
    }
  });

  return (
    <group ref={characterRef} position={position}>
      <GLTFModel 
        path="/models/student-character-female.glb" 
        scale={[0.8, 0.8, 0.8]}
        castShadow
        receiveShadow
      />
    </group>
  );
}