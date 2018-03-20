import { Player } from './../../players/player';
import { PlayerVirtual } from './../../players/player-virtual';
import { IaGenerator } from './../../players/iaGenerator.service';
import { StartingGridService } from './../../scene/starting-grid.service';
import { SceneImporterService } from './../../../../../race-editor/scene-importer.service';
import { Camera } from './../../camera/camera';
import { StateGame } from './state-game';
import { RoadManagerService } from './../../roadManagerService';
import * as THREE from 'three';

const NIGHT_SKYBOX = 'Night';
const POSITION = new THREE.Vector3(0, -18, 0);
const N_CAR = 3;
const POSITION_Y = -19.5;
export class StateGameLoading extends StateGame {

    public startGrid: StartingGridService;
    public roadManager: RoadManagerService;
    public iaGenerator: IaGenerator;

    constructor(stateGame: StateGame) {
        super(stateGame);
        this.roadManager = new RoadManagerService();
        this.iaGenerator = new IaGenerator();
    }

    public async initialize(name: string, sceneImporter: SceneImporterService, difficulty: string, turnNumber: number): Promise<void> {
        const gridPath = '/assets/plansImages/damier.jpg';
        await this.importScene(name, sceneImporter);
        this.scene.createScene(this.roadManager);
        this.startGrid.createGrid(gridPath, this.scene);
        this.player = new Player(this.scene, this.roadManager);
        this.playerVirtuals = new Array<PlayerVirtual>(N_CAR);
        this.camera = new Camera(this.player.car, this.scene);
        this.player.car.createObject(this.scene, POSITION);
        this.iaGenerator.generateIaCars(this.scene, this.roadManager, this.playerVirtuals, difficulty, turnNumber);
        this.player.car.launchPhysics(this.roadManager, this.scene);
        this.player.camera.apply(this.player.car, this.scene);
        this.managerSkybox.generate(this.player.camera.cameraPerspective, NIGHT_SKYBOX);
        this.player.camera.cameraOrthogonal.add(this.managerSkybox.skyboxMesh);
        this.isLoading = true;
    }

    public async importScene(name: string, sceneImporter: SceneImporterService): Promise<void> {
        this.sceneImporter = sceneImporter;
        const piste = await this.sceneImporter.getCircuitByName(name);
        const array = <Array<THREE.Vector3>>JSON.parse(piste.circuit);
        const puddlesArray = <Array<THREE.Vector3>>JSON.parse(piste.puddles);
        const speedBonuses = <Array<THREE.Vector3>>JSON.parse(piste.speedBonuses);
        const potholes = <Array<THREE.Vector3>>JSON.parse(piste.potholes);
        array[0].y = POSITION_Y;
        for (let i = 1; i < array.length; i++) {
            array[i].y = array[0].y;
        }
        this.trackDots = array;
        this.startGrid = new StartingGridService(this.trackDots);
        this.roadManager.createRoads(array, this.scene);
        this.roadManager.createPuddlesObjects(puddlesArray, this.scene);
        this.roadManager.createSpeedBonusesObjects(speedBonuses, this.scene);
        this.roadManager.createPotholesObjects(potholes, this.scene);
    }
}
