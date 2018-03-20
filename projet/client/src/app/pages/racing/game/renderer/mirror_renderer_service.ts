import * as THREE from 'three';

const MIRROR = {
    LENGTH: 100, WIDTH: 50
};

export class MirrorRendererService extends THREE.WebGLRenderer {

    constructor() {
        super();
    }

    public initializeRenderer(): void {
        this.setPixelRatio(window.devicePixelRatio);
        this.setPixelRatio(devicePixelRatio);
        this.setSize(MIRROR.LENGTH, MIRROR.WIDTH);
        this.setViewport(MIRROR.LENGTH, 0, MIRROR.LENGTH, MIRROR.WIDTH);
    }
}
