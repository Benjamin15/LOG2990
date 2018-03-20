import { RoadManagerService } from './../roadManagerService';
import { SceneRaceService } from './../scene/scene.service';
import { PlayerVirtual } from './player-virtual';
import * as THREE from 'three';


const POSITION_PLAYER_1 = new THREE.Vector3(7, -18, 2);
const POSITION_PLAYER_2 = new THREE.Vector3(0, -18, -8);
const POSITION_PLAYER_3 = new THREE.Vector3(7, -18, -7);
const PLAYER_VIRTUAL = 'playerVirtual';
export class IaGenerator {
    public table: Array<THREE.Vector3>;

    constructor() {
        this.table = new Array<THREE.Vector3>();
        this.setTable();
    }

    private setTable(): void {
        this.table.push(POSITION_PLAYER_1);
        this.table.push(POSITION_PLAYER_2);
        this.table.push(POSITION_PLAYER_3);
    }

    public generateIaCars(scene: SceneRaceService, roadManager: RoadManagerService,
        playersVirtual: Array<PlayerVirtual>, difficulty: string,  turnNumber: number): void {
        for (let i = 0; i < playersVirtual.length; i++) {
            playersVirtual[i] = new PlayerVirtual(scene, roadManager, PLAYER_VIRTUAL + i, difficulty, turnNumber);
            playersVirtual[i].car.createObject(scene, this.table[i]);
        }
        for (let i = 0; i < playersVirtual.length; i++) {
            playersVirtual[i].car.launchPhysics(roadManager, scene);
        }
    }
}
