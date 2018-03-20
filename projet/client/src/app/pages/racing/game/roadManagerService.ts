import * as THREE from 'three';
import { SceneRaceService } from './scene/scene.service';
import { PlaneCreatorService } from './environment/planeCreatorService';
import { ObstacleCreatorService } from './obstacleCreatorService';

const ROAD_TEXTURE = '/assets/dome/Brick.jpg';

export class RoadManagerService {
    public planeCreatorService: PlaneCreatorService;
    public obstacleCreatorService: ObstacleCreatorService;
    public roadDotsArray: Array<THREE.Vector3>;
    public planesArray: Array<THREE.Mesh>;
    public checkPointsArray: Array<THREE.Vector3>;
    public dots: Array<THREE.Vector3>;
    public outsideVectors: Array<THREE.Vector3>;

    constructor() {
        this.planeCreatorService = new PlaneCreatorService();
        this.roadDotsArray = new Array<THREE.Vector3>();
        this.planesArray = new Array<THREE.Mesh>();
        this.dots = new Array<THREE.Vector3>();
        this.outsideVectors = new Array<THREE.Vector3>();
        this.obstacleCreatorService = new ObstacleCreatorService();
        this.checkPointsArray = new Array<THREE.Vector3>();
    }

    public createRoads(array: Array<THREE.Vector3>, scene: SceneRaceService): void {
        this.checkPointsArray = array;
        for (let i = 0; i < array.length; i++) {
            this.roadDotsArray[0] = array[i];
            if (i + 1 < array.length) {
                this.roadDotsArray[1] = array[i + 1];
            }
            this.drawRoads(this.roadDotsArray, scene);
        }
        this.fillDotArray(array);
        this.createVectorTable();
    }

    public createSpeedBonusesObjects(array: Array<THREE.Vector3>, scene: SceneRaceService): void {
        this.obstacleCreatorService.createSpeedBonuses(array, scene);
    }

    public createPuddlesObjects(array: Array<THREE.Vector3>, scene: SceneRaceService): void {
        this.obstacleCreatorService.createPuddles(array, scene);
    }

    public createPotholesObjects(array: Array<THREE.Vector3>, scene: SceneRaceService): void {
        this.obstacleCreatorService.createPotholes(array, scene);
    }

    public drawRoads(array, scene: SceneRaceService): void {
        const width = 100, height = 1500, WIDTH_SEGMENTS = 1, HEIGHT_SEGMENTS = 1, COMPARATOR = 10;
        let plane = new THREE.PlaneGeometry(width, height, WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
        const v = 0, anisotropy = 4;
        if (Math.abs(array[1].z - array[0].z) > COMPARATOR && (array[1].z - array[0].z) < 0 &&
            Math.abs(array[1].x - array[0].x) > COMPARATOR && (array[1].x - array[0].x) < 0) {
            plane = this.planeCreatorService.widthOnXAndZ(array, plane, v);
        } else if (Math.abs(array[1].z - array[0].z) > COMPARATOR &&
            Math.abs(array[1].x - array[0].x) > COMPARATOR) {
            plane = this.planeCreatorService.widthOnXAndZDiagonal(array, plane, v);
        } else if (Math.abs(array[1].z - array[0].z) < COMPARATOR) {
            plane = this.planeCreatorService.widthOnZ(array, plane, v);
        } else if (Math.abs(array[1].x - array[0].x) < COMPARATOR) {
            plane = this.planeCreatorService.widthOnX(array, plane, v);
        }
        const material = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide, roughness: 0, metalness: 0,
            bumpScale: 0.0005
        });
        const loader = new THREE.TextureLoader();
        loader.load(ROAD_TEXTURE, function (map) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = anisotropy;
            map.repeat.set(COMPARATOR, width);
            material.map = map;
        });
        const mesh = new THREE.Mesh(plane, material);
        scene.add(mesh);
        this.planesArray.push(mesh);
    }

    public addTexture(url: string, plane: THREE.PlaneGeometry, scene: SceneRaceService): void {
        let mesh;
        const loader = new THREE.TextureLoader();
        loader.load(url, function (floorTexture) {
            floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
            floorTexture.repeat.set(1, 1);
            const trackMaterial = new THREE.MeshBasicMaterial({ map: floorTexture });
            const trackPlane = plane;
            mesh = new THREE.Mesh(trackPlane, trackMaterial);
            scene.add(mesh);
        });
    }

    public fillDotArray(array: Array<THREE.Vector3>): void {
        this.dots = array;
    }

    public createVectorTable(): void {
        for (let i = 0; i < this.dots.length - 1; i++) {
            const startPoint = this.dots[i];
            const nextPoint = this.dots[i + 1];
            let dir = new THREE.Vector3();
            dir = new THREE.Vector3(nextPoint.x - startPoint.x, nextPoint.y - startPoint.y, nextPoint.z - startPoint.z);
            this.outsideVectors.push(dir);
        }
    }

    public distance(point1: THREE.Vector3, point2: THREE.Vector3): number {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        const dz = point1.z - point2.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        return distance;
    }
}
