import { SceneRaceService } from './../../scene/scene.service';
import { RendererRaceService } from './../../renderer/renderer.service';
import * as THREE from 'three';

const CAMERA_NAME = 'MirrorPerspective';
const CAMERA_ESPACE = new THREE.Vector3(0, 3, 7);
const FOV = 75;
const NEAR = 0.01;
const FAR = 2000;
export class StateMirrorCamera extends THREE.PerspectiveCamera {

    constructor() {

        super(FOV, window.innerWidth / window.innerWidth, NEAR, FAR);
    }

    public render(renderer: RendererRaceService, scene: SceneRaceService): void {
        renderer.render(scene, this);
    }

    public apply(object: THREE.Object3D): void {
        this.rotateY(Math.PI);
        const relativeCameraOffset = CAMERA_ESPACE;
        const cameraOffset = relativeCameraOffset.applyMatrix4(object.matrixWorld);
        this.position.copy(cameraOffset);
        object.name = CAMERA_NAME;
        object.add(this);
    }

}
