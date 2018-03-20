import { SceneRaceService } from './../../scene/scene.service';
import * as THREE from 'three';

export class DayCycle {
    public type: string;
    public directionalLight: THREE.DirectionalLight;

    protected hemisphereLight: THREE.HemisphereLight;
    protected ambiantLight: THREE.AmbientLight;
    protected spotLight: THREE.SpotLight;

    constructor(scene: SceneRaceService) {}
}
