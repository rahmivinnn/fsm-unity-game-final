import * as THREE from "three";

export class TweenHelper {
  static smoothTween(
    object: THREE.Object3D,
    targetPosition: THREE.Vector3,
    duration: number = 1000,
    onComplete?: () => void
  ): void {
    const startPosition = object.position.clone();
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out function for smooth animation
      const ease = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate position
      object.position.lerpVectors(startPosition, targetPosition, ease);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (onComplete) {
        onComplete();
      }
    };
    
    animate();
  }

  static smoothRotation(
    object: THREE.Object3D,
    targetRotation: THREE.Euler,
    duration: number = 1000,
    onComplete?: () => void
  ): void {
    const startRotation = object.rotation.clone();
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out function for smooth animation
      const ease = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate rotation
      object.rotation.x = THREE.MathUtils.lerp(startRotation.x, targetRotation.x, ease);
      object.rotation.y = THREE.MathUtils.lerp(startRotation.y, targetRotation.y, ease);
      object.rotation.z = THREE.MathUtils.lerp(startRotation.z, targetRotation.z, ease);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (onComplete) {
        onComplete();
      }
    };
    
    animate();
  }
}