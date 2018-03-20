import { SceneRaceService } from './../scene/scene.service';
import * as THREE from 'three';

const POSITION_Z = -100;
const POSITION_X = -400;
const POSITION_Y = 150;
const FOV = 75;
const NEAR = 0.1;
const FAR = 20000;
const DIRECTION = new THREE.Vector3(0, 0, 1 );
const ORIENTATION = 0.08;
export class CameraStart extends THREE.PerspectiveCamera {
    public end: boolean;

    constructor( private scene: SceneRaceService) {
        super();
        this.end = false;
        this.position.z = POSITION_Z;
        this.position.x = POSITION_X;
        this.position.y = POSITION_Y;
        this.lookAt(this.scene.position);
        this.fov = FOV;
        this.aspect = window.innerWidth / window.innerWidth;
        this.near = NEAR;
        this.far = FAR;
        this.updateMatrix();
    }

    public start(): boolean {
        const axis =  DIRECTION;
        axis.normalize();
        this.translateOnAxis(axis , ORIENTATION);
        return this.end;
    }
}
