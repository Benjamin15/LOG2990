import * as THREE from 'three';

export class CameraService extends THREE.PerspectiveCamera {

    constructor() {
        super();
    }

    public setStartingPosition(position: THREE.Vector3): void {
        this.position.z = 1000;
        this.position.x = 0;
        this.position.y = 0;
        this.lookAt(position);
    }

    public resizeCamera(ratio: number): void {
        this.aspect = ratio;
        this.updateProjectionMatrix();
    }
}
