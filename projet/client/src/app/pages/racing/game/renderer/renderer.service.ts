import * as THREE from 'three';

export class RendererRaceService extends THREE.WebGLRenderer {

    constructor() {
        super();
    }

    public initializeRenderer(domElement: HTMLDivElement): void {
        this.setPixelRatio(window.devicePixelRatio);
        this.setPixelRatio(devicePixelRatio);
        this.setSize(domElement.clientWidth, domElement.clientHeight);
    }
}
