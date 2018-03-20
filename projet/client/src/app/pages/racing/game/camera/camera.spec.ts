import { SceneRaceService } from './../scene/scene.service';
import { Camera } from './camera';
import * as THREE from 'three';

describe('Camera', () => {
    it('should be created', () => {
        const camera = new Camera(new THREE.Object3D(), new SceneRaceService());
        expect(camera).toBeTruthy();
    });
});
