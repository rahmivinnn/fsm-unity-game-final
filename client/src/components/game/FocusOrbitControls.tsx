import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface FocusOrbitControlsProps {
  focusTarget?: THREE.Vector3;
  onFocusComplete?: () => void;
  [key: string]: any; // For spreading rest props
}

export function FocusOrbitControls({
  focusTarget,
  onFocusComplete,
  ...rest
}: FocusOrbitControlsProps) {
  const controlsRef = useRef<any>(null);
  
  useEffect(() => {
    if (focusTarget && controlsRef.current) {
      // Animate the camera to focus on the target
      const controls = controlsRef.current;
      const target = new THREE.Vector3(focusTarget.x, focusTarget.y, focusTarget.z);
      
      // Store original target
      const originalTarget = controls.target.clone();
      
      // Animate to new target
      const startTime = Date.now();
      const duration = 1000; // 1 second
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease function
        const ease = progress < 0.5 
          ? 4 * progress * progress * progress 
          : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
        
        // Interpolate target position
        controls.target.lerpVectors(originalTarget, target, ease);
        controls.update();
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else if (onFocusComplete) {
          onFocusComplete();
        }
      };
      
      animate();
    }
  }, [focusTarget, onFocusComplete]);
  
  return <OrbitControls ref={controlsRef} {...rest} />;
}