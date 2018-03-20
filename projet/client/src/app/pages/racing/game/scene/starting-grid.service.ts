import { SceneRaceService } from './scene.service';
import * as THREE from 'three';

const POSITIONY = -19.40;
const REPEAT_X = 15;
const REPEAT_Y = 25;
const PLANE_WIDTH = 50;
const PLANE_HEIGHT = 100;
const WIDTH_HEIGHT_SEGMENT = 10;
const GRID_NAME = 'startingGrid';

export class StartingGridService {

    public dotsArray = new Array<THREE.Vector3>();

    constructor(array: Array<THREE.Vector3>) {
        this.dotsArray = array;
    }

    public createGrid(url: string, scene: SceneRaceService): void {
        const loader = new THREE.TextureLoader();
        loader.load(url, function (gridTexture) {
            gridTexture.wrapS = gridTexture.wrapT = THREE.RepeatWrapping;
            gridTexture.repeat.set(REPEAT_X, REPEAT_Y);
            const gridMaterial = new THREE.MeshStandardMaterial({ map: gridTexture, side: THREE.DoubleSide });
            const gridGeometry = new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT, WIDTH_HEIGHT_SEGMENT, WIDTH_HEIGHT_SEGMENT);
            const grid = new THREE.Mesh(gridGeometry, gridMaterial);
            grid.position.set(0, POSITIONY, 0);
            grid.rotateX(Math.PI / 2);
            grid.name = GRID_NAME;
            scene.add(grid);
        });
    }
}
