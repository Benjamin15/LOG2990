import { SceneRaceService } from './../../scene/scene.service';
import { RendererRaceService } from './../../renderer/renderer.service';
import * as THREE from 'three';

const FAR = 1000;
const SCREEN = 10;
const NEAR = 1;
const CAMERA_Y = 100;
export class StateOrthographicCamera extends THREE.OrthographicCamera {

    constructor() {
        super(window.innerWidth / - SCREEN, window.innerWidth / SCREEN,
            window.innerHeight / SCREEN, window.innerHeight / - SCREEN, NEAR, FAR);
    }

    public render(renderer: RendererRaceService, scene: SceneRaceService) {
        renderer.render(scene, this);
    }

    public update(object: THREE.Object3D) {
        this.updateCameraPosition(object);
    }

    public apply(object: THREE.Object3D, scene: SceneRaceService): void {
        const bbox = new THREE.Box3().setFromObject(object);
        bbox.setFromCenterAndSize(object.position, bbox.getSize());
        this.lookAt(object.position);
        scene.add(this);
    }

    public updateCameraPosition(object: THREE.Object3D): void {
        const relativeCameraOffset = new THREE.Vector3(0, CAMERA_Y, 0);
        relativeCameraOffset.add(object.position);
        this.position.copy(relativeCameraOffset);
        this.lookAt(object.position);
        this.updateMatrix();
    }
}
