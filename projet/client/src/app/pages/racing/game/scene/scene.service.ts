import { Player } from './../players/player';
import { DayManager } from './../environment/day-manager';
import { ManageOffPiste } from './../environment/manager-off-piste';
import { RoadManagerService } from './../roadManagerService';
import * as THREE from 'three';

const OFFPISTE = 'offPiste';

export class SceneRaceService extends THREE.Scene {

    public dayManager: DayManager;

    constructor() {
        super();
        this.dayManager = new DayManager(this);
    }

    public createScene(roadManageService: RoadManagerService): void {
        const managerOffPiste = new ManageOffPiste(roadManageService.planesArray);
        managerOffPiste.createRelief();
        managerOffPiste.area.name = OFFPISTE;
        this.add(managerOffPiste.area);
        for (let i = 0; i < managerOffPiste.treesArray.length; i++) {
            managerOffPiste.createTree(managerOffPiste.treesArray[i], this);
        }
    }

    public switchDayCycle(player: Player): void {
        this.dayManager.switchMode(player);
    }
}
