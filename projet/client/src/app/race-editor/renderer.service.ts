
import * as THREE from 'three';

export class RendererService extends THREE.WebGLRenderer {

    constructor() {
        super({preserveDrawingBuffer : true});
    }

    public initializeRenderer(domElement: HTMLDivElement) {
        this.setPixelRatio(devicePixelRatio);
        this.setSize(domElement.clientWidth, domElement.clientHeight);
    }
}
