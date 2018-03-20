import { SceneRaceService } from './scene/scene.service';
import * as THREE from 'three';

const POSITIONY = -19.49;
const SPEEDBONUS = {
    PATH: '/assets/dome/project-icon.jpg', RADIUS: 5, SEGMENTS: 32, ROUGHNESS: 0.2,
    METALNESS: 0.6, BUMPSCALE: 0.0005, ANISOTROPY: 4, REPETITIONS: 1, NAME: 'SpeedBonus'
};
const PUDDLES = {
    PATH: '/assets/dome/water.jpg', RADIUS: 2.1, SEGMENTS: 7, ROUGHNESS: 0,
    METALNESS: 0.6, BUMPSCALE: 0.0005, ANISOTROPY: 4, REPETITIONS: 1, NAME: 'puddles'
};
const POTHOLES = {
    PATH: '/assets/dome/pothole.jpg', RADIUS: 0.1, SEGMENTS: 32, ROUGHNESS: 0,
    METALNESS: 0.6, BUMPSCALE: 0.0005, ANISOTROPY: 4, REPETITIONS: 1, NAME: 'potholes',
    RANDOM_FACTOR: 2
};


export class ObstacleCreatorService {

    public speedBonusesArray: Array<THREE.Mesh>;
    public potholesArray: Array<THREE.Mesh>;
    public puddlesArray: Array<THREE.Mesh>;

    constructor() {
        this.speedBonusesArray = new Array<THREE.Mesh>();
        this.puddlesArray = new Array<THREE.Mesh>();
        this.potholesArray = new Array<THREE.Mesh>();
    }

    public createSpeedBonuses(array: Array<THREE.Vector3>, scene: SceneRaceService): void {
        for (let i = 0; i < array.length; i++) {
            const geometry = new THREE.CircleGeometry(SPEEDBONUS.RADIUS, SPEEDBONUS.SEGMENTS);
            const material = new THREE.MeshStandardMaterial({
                side: THREE.DoubleSide, roughness: SPEEDBONUS.ROUGHNESS,
                metalness: SPEEDBONUS.METALNESS, bumpScale: SPEEDBONUS.BUMPSCALE
            });
            const loader = new THREE.TextureLoader();
            loader.load(SPEEDBONUS.PATH, function (map) {
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = SPEEDBONUS.ANISOTROPY;
                map.repeat.set(SPEEDBONUS.REPETITIONS, SPEEDBONUS.REPETITIONS);
                material.map = map;
            });
            const circle = new THREE.Mesh(geometry, material);
            this.addCircleMesh(circle, array[i], scene, SPEEDBONUS.NAME);
            this.spotLightOnBonus(array, scene, i);
        }
    }

    public spotLightOnBonus(array: Array<THREE.Vector3>, scene: SceneRaceService, i: number): void {
        const LIGHT = {
            COLOR: 0xffeab5, DECAY: 1.7, INTENSITY: 2, CASTSHADOW: true, DISTANCE: 130, ANGLE: 0.9,
            PENUMBRA: 0.198, VISIBLE: true, TARGETVISIBLE: true, YTARGETPOSITION: 0.25, ZTARGETPOSITION: 2.5,
            YPOSITION: 15
        };
        const bulbLight = new THREE.SpotLight(LIGHT.COLOR);
        bulbLight.decay = LIGHT.DECAY;
        bulbLight.intensity = LIGHT.INTENSITY;
        bulbLight.distance = LIGHT.DISTANCE;
        bulbLight.angle = LIGHT.ANGLE;
        bulbLight.penumbra = LIGHT.PENUMBRA;
        bulbLight.position.set(array[i].x, -LIGHT.YPOSITION, array[i].z);
        bulbLight.target.position.set(array[i].x, POSITIONY,
            array[i].z);
        bulbLight.castShadow = LIGHT.CASTSHADOW;
        bulbLight.visible = LIGHT.VISIBLE;
        bulbLight.target.visible = LIGHT.TARGETVISIBLE;
        scene.add(bulbLight);
        scene.add(bulbLight.target);
    }

    public createPuddles(array: Array<THREE.Vector3>, scene: SceneRaceService): void {
        for (let i = 0; i < array.length; i++) {
            const geometry = new THREE.CircleGeometry(PUDDLES.RADIUS, PUDDLES.SEGMENTS);
            const material = new THREE.MeshStandardMaterial({
                side: THREE.DoubleSide, roughness: 0,
                metalness: 0, bumpScale: PUDDLES.BUMPSCALE
            });
            const loader = new THREE.TextureLoader();
            loader.load(PUDDLES.PATH, function (map) {
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = PUDDLES.ANISOTROPY;
                map.repeat.set(1, 1);
                material.map = map;
            });
            const circle = new THREE.Mesh(geometry, material);
            this.addCircleMesh(circle, array[i], scene, PUDDLES.NAME);
            scene.add(circle);
        }
    }
    public addCircleMesh(circle: THREE.Mesh, vector: THREE.Vector3, scene: SceneRaceService,
        object: string): void {
        circle.position.x = vector.x;
        circle.position.y = POSITIONY;
        circle.position.z = vector.z;
        const rotationVector = new THREE.Vector3(1, 0, 0);
        circle.rotateOnAxis(rotationVector, Math.PI / POTHOLES.RANDOM_FACTOR);
        if (object === PUDDLES.NAME) {
            this.puddlesArray.push(circle);
        } else if (object === POTHOLES.NAME) {
            this.potholesArray.push(circle);
        } else {
            this.speedBonusesArray.push(circle);
        }
        scene.add(circle);
    }
    public createPotholes(array: Array<THREE.Vector3>, scene: SceneRaceService): void {
        for (let i = 0; i < array.length; i++) {
            const geometry = new THREE.CircleGeometry(POTHOLES.RADIUS, POTHOLES.SEGMENTS);
            for (let j = 0; j < geometry.vertices.length; j++) {
                geometry.vertices[j].x = (Math.random() * (POTHOLES.RANDOM_FACTOR));
                geometry.vertices[j].y = (Math.random() * (POTHOLES.RANDOM_FACTOR));
            }
            const material = new THREE.MeshStandardMaterial({
                side: THREE.DoubleSide, roughness: 0,
                metalness: 0, bumpScale: POTHOLES.BUMPSCALE
            });
            const loader = new THREE.TextureLoader();
            loader.load(POTHOLES.PATH, function (map) {
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = POTHOLES.ANISOTROPY;
                map.repeat.set(1, 1);
                material.map = map;
            });
            const circle = new THREE.Mesh(geometry, material);
            this.addCircleMesh(circle, array[i], scene, POTHOLES.NAME);
        }
    }
}
