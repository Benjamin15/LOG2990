import { SceneImporterService } from './../../../race-editor/scene-importer.service';
import { RendererRaceService } from './renderer/renderer.service';
import { SceneRaceService } from './scene/scene.service';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { GameEngine } from './game-engine/game-engine';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import Stats = require('stats.js');
import OBJLoader = require('three-obj-loader');
import MTLLoader = require('three-mtl-loader');
OBJLoader(THREE);
MTLLoader(THREE);

const POSITION_ABSOLUTE = 'absolute';
const FRAME_BY_SECONDS = 1000 / 60;

@Injectable()
export class GameManager {
    public perspectiveCameraOn: boolean;
    public roadDotsArray: Array<THREE.Vector3>;
    public gameEngine: GameEngine;
    public container: HTMLDivElement;
    public controls: OrbitControls;
    public aspect: number;

    private stats: Stats;

    constructor(public sceneService: SceneRaceService,
        private rendererService: RendererRaceService,
        public sceneImporter: SceneImporterService) {
        this.aspect = window.innerWidth / window.innerHeight;
        this.perspectiveCameraOn = true;
        this.roadDotsArray = new Array();
    }

    public async initialize(container: HTMLDivElement, name: string, nTurn: number, difficulty: string): Promise<void> {
        this.container = container;
        this.rendererService.initializeRenderer(this.container);
        this.gameEngine = new GameEngine(this.rendererService, name, this.sceneImporter, difficulty, nTurn);
        this.gameEngine.difficulty = difficulty;
        this.gameEngine.turnNumber = nTurn;
        this.initStats();
        this.startRenderingLoop();
    }

    private initStats(): void {
        this.stats = new Stats();
        this.stats.dom.style.position = POSITION_ABSOLUTE;
        this.container.appendChild(this.stats.dom);
    }

    private startRenderingLoop(): void {
        this.rendererService.initializeRenderer(this.container);
        this.container.appendChild(this.rendererService.domElement);
        this.loop();
    }

    private loop(): void {
        const actu = this;
        this.gameEngine.update();
        this.gameEngine.render();
        setTimeout(function () {
            requestAnimationFrame(() => actu.loop());
        }, FRAME_BY_SECONDS);
    }
}
