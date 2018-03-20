import { SceneRaceService } from './../../scene/scene.service';
import { DayCycle } from './day-cycle';
import * as THREE from 'three';

const LIGHT = {
    COLOR: 0xffffff, OFF: 'black', DIRECTION_INTENSITY: 0.2, DIRECTION_X: -10,
    DIRECTION_Y: 20, DIRECTION_Z: 30, DIRECTION_TOP: 10, DIRECTION_LEFT: 20,
    DIRECTION_HEIGHT_WIDTH: 512 * 2, DIRECTION_NEAR: 0.1, DIRECTION_FAR: 50,
    TYPE: 'NightMode', VISIBLE: true, CAST_SHADOW: true
};

export class NightMode extends DayCycle {

    constructor(scene: SceneRaceService) {
        super(scene);
        this.type = 'NightMode';
        this.directionalLight = new THREE.DirectionalLight(LIGHT.COLOR, LIGHT.DIRECTION_INTENSITY);
        this.initializeDirectionalLight();
        scene.add(this.directionalLight);
    }

    private initializeDirectionalLight(): void {
        this.directionalLight.position.set(LIGHT.DIRECTION_X, LIGHT.DIRECTION_Y, LIGHT.DIRECTION_Z);
        this.directionalLight.castShadow = LIGHT.CAST_SHADOW;
        this.directionalLight.shadow.mapSize.height = LIGHT.DIRECTION_HEIGHT_WIDTH;
        this.directionalLight.shadow.mapSize.width = LIGHT.DIRECTION_HEIGHT_WIDTH;
        this.directionalLight.shadow.camera.top = LIGHT.DIRECTION_TOP;
        this.directionalLight.shadow.camera.bottom = -LIGHT.DIRECTION_TOP;
        this.directionalLight.shadow.camera.left = LIGHT.DIRECTION_LEFT;
        this.directionalLight.shadow.camera.right = -LIGHT.DIRECTION_LEFT;
        this.directionalLight.shadow.camera.near = LIGHT.DIRECTION_NEAR;
        this.directionalLight.shadow.camera.far = LIGHT.DIRECTION_FAR;
        this.directionalLight.visible = LIGHT.VISIBLE;
    }
}
