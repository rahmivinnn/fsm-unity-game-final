import * as THREE from "three";

export class BoundingBoxHelper {
  static createBoundingBox(object: THREE.Object3D): THREE.Box3 {
    const box = new THREE.Box3();
    box.setFromObject(object);
    return box;
  }

  static checkCollision(
    box1: THREE.Box3,
    box2: THREE.Box3,
    tolerance: number = 0.1
  ): boolean {
    // Expand box2 by tolerance
    const expandedBox2 = box2.clone();
    expandedBox2.expandByScalar(tolerance);
    
    // Check if boxes intersect
    return expandedBox2.intersectsBox(box1);
  }

  static isWithinBounds(
    object: THREE.Object3D,
    bounds: THREE.Box3,
    tolerance: number = 0.1
  ): boolean {
    const objectBox = this.createBoundingBox(object);
    const expandedBounds = bounds.clone();
    expandedBounds.expandByScalar(tolerance);
    
    return expandedBounds.containsBox(objectBox);
  }

  static getCenter(box: THREE.Box3): THREE.Vector3 {
    return box.getCenter(new THREE.Vector3());
  }

  static getSize(box: THREE.Box3): THREE.Vector3 {
    return box.getSize(new THREE.Vector3());
  }
}