import { GuiButtons } from './../../../../commun/models/Gui-buttons';
import { GuiInterface } from './gui.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import Stats = require('stats.js');
import { RendererService } from './renderer.service';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { CameraService } from './camera.service';
import { SceneService } from './scene.service';
import { ObjectsHandlerService } from './objects-handler.service';
import { Piste } from './../../../../commun/models/Piste';
import { SceneImporterService } from './scene-importer.service';
import { PisteSpecificationService } from './../pages/admin/piste/piste-specification.service';
import { SpeedBonus } from './speedBonus/SpeedBonus';
import { Puddle } from './puddle/puddle';
import { PotHole } from './potHole/potHole';

@Injectable()

export class RenderService {
    private container: HTMLDivElement;
    public speedBonus = new SpeedBonus();
    public puddle = new Puddle();
    public potHole = new PotHole();
    private stats: Stats;
    public controls: OrbitControls;
    public mouse = new THREE.Vector2();
    public canChangeCircuit = true;
    public firstPointMoving = false;
    public raycaster = new THREE.Raycaster();
    public circuitFinished = false;
    public canMoveCamera = false;
    public selection = null;
    public offset = new THREE.Vector3();
    public jsonExportScene: string;
    public jsonExportLinesArray = new Array();
    public roadDotsArray = new Array();
    public guiButtons = new GuiButtons(this);
    public interface = new GuiInterface(this.guiButtons);
    public speedBonusesArray = new Array();
    public puddlesArray = new Array();
    public potholesArray = new Array();
    public speedBonusesPositionArray = new Array();
    public puddlesPositionArray = new Array();
    public potholesPositionArray = new Array();

    constructor(private camera: CameraService, private sceneService: SceneService,
        private rendererService: RendererService, private pisteService: PisteSpecificationService,
        private sceneImporter: SceneImporterService, private objectHandler: ObjectsHandlerService) {
    }


    public getContainerRender(): HTMLDivElement {
        return this.container;
    }

    public getScene(): THREE.Scene {
        return this.sceneService;
    }

    private createScene(): void {
        this.sceneService.createScene();
        this.camera.setStartingPosition(this.sceneService.position);
        this.rendererService.initializeRenderer(this.container);
        this.controls = new OrbitControls(this.camera, this.rendererService.domElement);
        this.controls.enabled = false;
    }

    private getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }

    private startRenderingLoop(): void {
        this.rendererService.initializeRenderer(this.container);
        this.container.appendChild(this.rendererService.domElement);
        this.controls = new OrbitControls(this.camera, this.rendererService.domElement);
        this.controls.maxDistance = 7500;
        this.render();
    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.objectHandler.setSceneService(this.sceneService);
        this.sceneService = this.objectHandler.getSceneService();
        this.rendererService.render(this.sceneService, this.camera);
        this.rendererService.render(this.sceneService, this.camera);
        this.stats.update();

        if (this.canMoveCamera) {
            this.controls.enabled = true;
        } else {
            this.controls.enabled = false;
        }
    }

    private initStats(): void {
        this.stats = new Stats();
        this.stats.dom.style.position = 'absolute';
        this.container.appendChild(this.stats.dom);
    }

    public onResize(): void {
        this.camera.resizeCamera(this.getAspectRatio());
        this.rendererService.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    public initialize(container: HTMLDivElement, rotationX: number, rotationY: number): void {
        this.container = container;
        this.createScene();
        this.initStats();
        this.startRenderingLoop();
        this.interface.initGUI('', '', '');
        this.interface.addGuiButtons();
        this.interface.openGUI();
    }

    public getRealMouseCoordinates(abacuses: number, ordinates: number): THREE.Vector3 {
        const vector = new THREE.Vector3();
        vector.set((abacuses / window.innerWidth) * 2 - 1,
            - (ordinates / window.innerHeight) * 2 + 1, 0.5);
        vector.unproject(this.camera);
        const dir = vector.sub(this.camera.position).normalize();
        const distance = - this.camera.position.z / dir.z;
        const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
        return pos;
    }

    public drawLine(abacuses: number, ordinates: number, z: number): void {
        if (this.objectHandler.angleTable.length > 1) {
            this.objectHandler.correctAngle = this.objectHandler.angleTable[0]
                .angleTo(this.objectHandler.angleTable[1]) < Math.PI - (Math.PI / 4);
            this.objectHandler.angleTable[0] = this.objectHandler.angleTable[1];
            this.objectHandler.angleTable.pop();
        }
        if (this.objectHandler.correctAngle) {
            const line = new THREE.Line(this.objectHandler.figGeometry, new THREE.LineBasicMaterial({ color: 0x08a823, opacity: 400 }));
            this.objectHandler.lines.push(line);
            this.sceneService.add(line);
            this.objectHandler.linesArray.push(line.id);
            this.objectHandler.correctCircuit = true;
            this.objectHandler.colorArray.push('green');
        } else {
            const line = new THREE.Line(this.objectHandler.figGeometry, new THREE.LineBasicMaterial({ color: 0xf4020e, opacity: 400 }));
            this.objectHandler.lines.push(line);
            this.sceneService.add(line);
            this.objectHandler.linesArray.push(line.id);
            this.objectHandler.correctCircuit = false;
            this.objectHandler.colorArray.push('red');
        }
        this.objectHandler.figGeometry = new THREE.Geometry();
        this.objectHandler.figGeometry.vertices.push(new THREE.Vector3(abacuses, ordinates, z));
        this.objectHandler.checkLineLength();
    }

    public closeCircuit(position1: THREE.Vector3, position2: THREE.Vector3): void {
        this.objectHandler.figGeometry = new THREE.Geometry();
        this.objectHandler.figGeometry.vertices.push(position1, position2);
        this.objectHandler.vectorTable.push(this.objectHandler.createVector(this.objectHandler.figGeometry.vertices));
        this.objectHandler.angleTable.push(this.objectHandler.createVector(this.objectHandler.figGeometry.vertices));
        this.drawLine(position2.x, position2.y, 0);
        this.circuitFinished = true;
    }

    public drawPreviousEdition(array: Array<THREE.Vector3>): void {
        for (let i = 0; i < array.length; i++) {
            this.objectHandler.updateVertices(array[i]);
            if (this.objectHandler.startPointExists) {
                this.objectHandler.dotMaterial = new THREE.PointsMaterial({ color: 'blue', size: 30, sizeAttenuation: true });
                this.objectHandler.sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xdcd4f9 });
            } else {
                this.objectHandler.designateFirstPoint(array[i].x, array[i].y, array[i].z);
            }
            const dot = new THREE.Points(this.objectHandler.manyDotsGeometry, this.objectHandler.dotMaterial);
            if (this.objectHandler.dotGeometry.vertices.length > 1) {
                if (Math.abs(this.objectHandler.firstPoint.x - array[i].x) < 10 &&
                    Math.abs(this.objectHandler.firstPoint.y - array[i].y) < 10) {
                    this.closeCircuit(array[i], this.objectHandler.addPositions
                    [this.objectHandler.addPositions.length - 1]);
                }
            }
            if (this.objectHandler.figGeometry.vertices.length > 1 && this.circuitFinished === false) {

                this.objectHandler.vectorTable.push(this.objectHandler.createVector(this.objectHandler.figGeometry.vertices));
                this.objectHandler.angleTable.push(this.objectHandler.createVector(this.objectHandler.figGeometry.vertices));
                this.drawLine(array[i].x, array[i].y, array[i].z);
            }
            if (this.circuitFinished === true) {
                this.canChangeCircuit = false;
            }
            this.addDotsToScene(dot, array[i].x, array[i].y, array[i].z);
        }
    }

    public createPoint(x: number, y: number): void {
        if (this.canMoveCamera === false) {
            if (this.canChangeCircuit) {
                const pos = this.getRealMouseCoordinates(x, y);
                const elementToAdd = new THREE.Vector3(pos.x, pos.y, 0);
                this.objectHandler.updateVertices(elementToAdd);
                if (this.objectHandler.startPointExists) {
                    this.objectHandler.dotMaterial = new THREE.PointsMaterial({ color: 'blue', size: 30, sizeAttenuation: true });
                    this.objectHandler.sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xdcd4f9 });
                } else {
                    this.objectHandler.designateFirstPoint(pos.x, pos.y, 0);
                }
                const dot = new THREE.Points(this.objectHandler.manyDotsGeometry, this.objectHandler.dotMaterial);
                if (this.objectHandler.dotGeometry.vertices.length > 1) {
                    if (Math.abs(this.objectHandler.firstPoint.x - elementToAdd.x) < 10 &&
                        Math.abs(this.objectHandler.firstPoint.y - elementToAdd.y) < 10) {
                        this.closeCircuit(elementToAdd, this.objectHandler.addPositions[this.objectHandler.addPositions.length - 1]);
                    }
                }
                if (this.objectHandler.figGeometry.vertices.length > 1 && this.circuitFinished === false) {

                    this.objectHandler.vectorTable.push(this.objectHandler.createVector(this.objectHandler.figGeometry.vertices));
                    this.objectHandler.angleTable.push(this.objectHandler.createVector(this.objectHandler.figGeometry.vertices));
                    this.drawLine(pos.x, pos.y, 0);
                }
                if (this.circuitFinished === true) {
                    this.canChangeCircuit = false;
                }
                this.addDotsToScene(dot, elementToAdd.x, elementToAdd.y, elementToAdd.z);
            }
        }
        this.objectHandler.checkLineLength();
        this.objectHandler.checkLinesCollision();
        this.render();
    }

    public addDotsToScene(dotToAdd: THREE.Points, abacusesOfElement: number,
        ordinatesOfElement: number, positionZAxeOfElement: number): void {
        this.objectHandler.dots.push(dotToAdd);
        const object = new THREE.Mesh(this.objectHandler.sphereGeometry.clone(), this.objectHandler.sphereMaterial);
        object.position.x = abacusesOfElement;
        object.position.y = ordinatesOfElement;
        object.position.z = positionZAxeOfElement;
        this.objectHandler.sphereGeometry.computeBoundingBox();
        if (this.objectHandler.dotGeometry.vertices.length === 1) {
            const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x4b42f4, side: THREE.BackSide });
            const outlineMesh = new THREE.Mesh(this.objectHandler.sphereGeometry, outlineMaterial);
            outlineMesh.scale.multiplyScalar(1.60);
            object.add(outlineMesh);
        }

        this.objectHandler.listOfDotsArray.push(object.id);
        this.sceneService.add(object);
        this.objectHandler.addPositions.push(new THREE.Vector3(object.position.x, object.position.y, object.position.z));
        this.objectHandler.objectsArrayToDelete.push(object);
        this.objectHandler.objectsArray.push(object);
    }


    public showCoords(event) {
        const x = event.clientX;
        const y = event.clientY;
        this.createPoint(x, y);
    }

    public onDocumentMouseMove(event: MouseEvent): void {
        this.mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
        const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
        vector.unproject(this.camera);
        this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());
        if (this.selection) {
            const intersects = this.raycaster.intersectObject(this.sceneService.planeV);
            this.selection.position.copy(intersects[0].point.sub(this.offset));
            this.objectHandler.positions = this.selection.position;
        } else {
            const intersects = this.raycaster.intersectObjects(this.objectHandler.objectsArray);
            if (intersects.length > 0) {
                this.sceneService.planeV.position.copy(intersects[0].object.position);
                this.sceneService.planeV.lookAt(this.camera.position);
            }
        }
    }

    public onDocumentMouseUp(event): void {
        this.selection = null;
        if (this.objectHandler.mustUpdateLine) {
            this.objectHandler.lookForPoint();
        }
        if (this.objectHandler.mustUpdateFirstPoint) {
            this.objectHandler.updateFirstPoint();
        }
        if (this.objectHandler.positions === this.objectHandler.firstPoint && this.firstPointMoving === false) {
            this.circuitFinished = true;
        }
    }

    public onDocumentMouseDown(event): void {
        this.mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
        const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
        vector.unproject(this.camera);
        this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());
        const intersects = this.raycaster.intersectObjects(this.objectHandler.objectsArray);
        if (intersects.length > 0) {
            this.controls.enabled = false;
            this.objectHandler.mustUpdateLine = true;
            this.selection = intersects[0].object;
            this.objectHandler.dotdraggedX = this.selection.position.x;
            this.objectHandler.dotdraggedY = this.selection.position.y;
            this.objectHandler.dotdraggedZ = this.selection.position.z;
            if (this.objectHandler.dotdraggedX === this.objectHandler.firstPoint.x && this.objectHandler.dotdraggedY ===
                this.objectHandler.firstPoint.y && this.objectHandler.dotdraggedZ === this.objectHandler.firstPoint.z) {
                this.objectHandler.mustUpdateFirstPoint = true;
                this.firstPointMoving = true;
            } else {
                this.firstPointMoving = false;
            }
            const intersects2 = this.raycaster.intersectObject(this.sceneService.planeV);
            this.offset.copy(intersects2[0].point).sub(this.sceneService.planeV.position);
        }
    }

    public testRightClick(event): void {
        this.circuitFinished = false;
        for (let i = 0; i < this.speedBonusesArray.length; i++) {
            this.sceneService.remove(this.sceneService.getObjectById(this.speedBonusesArray[i]));
        }
        this.canChangeCircuit = true;
        this.sceneService.remove(this.sceneService.getObjectById(
            this.objectHandler.objectsArrayToDelete[this.objectHandler.objectsArrayToDelete.length - 1].id));
        this.objectHandler.objectsArrayToDelete.pop();
        this.objectHandler.listOfDotsArray.pop();
        this.objectHandler.figGeometry.vertices.pop();
        this.objectHandler.addPositions.pop();
        this.objectHandler.dotGeometry.vertices.pop();
        if (this.objectHandler.dotGeometry.vertices.length > 0) {
            this.objectHandler.figGeometry.vertices.push(new THREE.Vector3(this.objectHandler.dotGeometry.vertices
            [(this.objectHandler.dotGeometry.vertices.length) - 1].x,
                this.objectHandler.dotGeometry.vertices[(this.objectHandler.dotGeometry.vertices.length) - 1].y,
                this.objectHandler.dotGeometry.vertices[(this.objectHandler.dotGeometry.vertices.length) - 1].z));
        } else {
            this.objectHandler.startPointExists = false;
            this.objectHandler.dotGeometry = new THREE.Geometry();
        }
        if (this.objectHandler.lines.length !== 0) {
            this.sceneService.remove(this.sceneService.getObjectById(this.objectHandler.lines[this.objectHandler.lines.length - 1].id));
            this.objectHandler.lines.pop();
            this.objectHandler.linesArray.pop();
            this.objectHandler.updateVectorTableAfterRemove();
        }
        this.objectHandler.checkLinesCollision();
    }

    public async saveCircuit(): Promise<void> {
        this.objectHandler.correctCircuit = this.objectHandler.checkCircuit();
        if (this.circuitFinished && this.objectHandler.correctCircuit && this.objectHandler.correctLength
            && this.objectHandler.hasCollision === false) {
            this.jsonExportScene = JSON.stringify(this.objectHandler.addPositions);
            const puddles = JSON.stringify(this.puddlesPositionArray);
            const speedBonuses = JSON.stringify(this.speedBonusesPositionArray);
            const potholes = JSON.stringify(this.potholesPositionArray);
            const dataUrl = this.rendererService.domElement.toDataURL('image/png');
            const vignette = JSON.stringify(dataUrl);
            const piste = new Piste(this.interface.guiButtons.name, this.interface.guiButtons.type,
                this.interface.guiButtons.description, vignette, this.jsonExportScene, null, null,
                null, speedBonuses, potholes, puddles);
            const test = await this.pisteService.overwriteCircuit(this.interface.guiButtons.name);
            if (test === true) {
                const temp = await this.sceneImporter.getCircuitByName(this.interface.guiButtons.name);
                this.pisteService.delete(temp);
                this.pisteService.insert(piste);
            } else {
                this.pisteService.insert(piste);
                this.pisteService.insert(piste);
            }
            alert('Voici le circuit sauvegarde: ' + '\n ' + ' Nom: ' + piste.name + '\n' + ' Difficulte: ' +
                piste.type + '\n' + 'Description : ' + piste.description);
        } else {
            alert('Circuit impossible a sauvegarder , voici la liste des contraintes pour plus de détails : \n' +
                ' -Contrainte de longueur respectee : ' + this.objectHandler.correctLength +
                '\n -Contrainte d angle respectee : ' + this.objectHandler.correctCircuit +
                '\n -Contrainte de collision respectee (celle-ci se déclenche parfois sans raison evidente) :' +
                !this.objectHandler.hasCollision);
        }
    }

    public async importScene(name: string): Promise<void> {
        const piste = await this.sceneImporter.getCircuitByName(name);
        const array = JSON.parse(piste.circuit);
        this.interface.destroy();
        this.interface = new GuiInterface(this.guiButtons);
        this.interface.guiButtons.name = piste.name;
        this.interface.guiButtons.type = piste.type;
        this.interface.guiButtons.description = piste.description;
        this.interface.initGUI(piste.name, piste.type, piste.description);
        this.interface.addGuiButtons();
        this.interface.openGUI();
        this.interface.guiButtons.oldPiste = piste;
        this.drawPreviousEdition(array);
    }

    public updateI(oldPiste: Piste, name: string, type: string, description: string): void {
        const newPiste = new Piste(name, type, description, oldPiste.vignette, oldPiste.circuit,
            oldPiste.averageAppreciation, oldPiste.timesPlayes, oldPiste.bestTimes);
        this.pisteService.updateInfos(oldPiste, newPiste).subscribe(result => {
            if (result === true) {
                alert('mis a jour');
            } else {
                alert('echec');
            }
        });
    }

    public addRandomObjects(obstacleName: string): void {
        const lower = 1;
        let randomPosition = 0;
        const higher = this.objectHandler.addPositions.length;
        let index = Math.floor(Math.random() * (higher - lower) + lower);
        while (index === 0) {
            index = Math.floor(Math.random() * (higher - lower) + lower);
        }
        this.objectHandler.newLineGeometry = new THREE.Geometry();
        this.objectHandler.newLineGeometry.vertices.push(this.objectHandler.addPositions[index - 1],
            this.objectHandler.addPositions[index]);

        const randomVector = this.objectHandler.createVector(this.objectHandler.newLineGeometry.vertices);
        const distance = this.objectHandler.addPositions[index - 1].distanceTo(this.objectHandler.addPositions[index]);
        if (obstacleName === 'puddles' || obstacleName === 'potHole') {
            randomPosition = Math.random() * ((distance) - lower) + lower;
        } else if (obstacleName === 'speedBonus') {
            const randomLength = distance / 2;
            randomPosition = Math.random() * ((randomLength) - lower) + lower;
        }
        this.getObjectsPositions(randomVector, index, randomPosition, obstacleName);
    }
    public getObjectsPositions(randomVector, index: number, randomPosition, obstacleName): void {
        let bonus;
        randomVector.normalize();
        randomVector.x = this.objectHandler.addPositions[index - 1].x + (randomVector.x * randomPosition);
        randomVector.y = this.objectHandler.addPositions[index - 1].y + (randomVector.y * randomPosition);
        randomVector.z = this.objectHandler.addPositions[index - 1].z + (randomVector.z * randomPosition);
        if (obstacleName === 'puddles') {
            if (this.comparePositions(randomVector, this.speedBonus.positionsArray, this.potHole.positionsArray) === false) {
                this.addRandomObjects('puddles');
                return;
            }
            this.puddle.positionsArray.push(randomVector);
            bonus = new THREE.Mesh(this.puddle.geometry, this.puddle.material);
            this.addPuddleToScene(bonus, randomVector.x, randomVector.y, randomVector.z);
        } else if (obstacleName === 'speedBonus') {
            if (this.comparePositions(randomVector, this.puddle.positionsArray, this.potHole.positionsArray) === false) {
                this.addRandomObjects('speedBonus');
                return;
            }
            this.speedBonus.positionsArray.push(randomVector);
            bonus = new THREE.Mesh(this.speedBonus.geometry, this.speedBonus.material);
            this.addSpeedBonusToScene(bonus, randomVector.x, randomVector.y, randomVector.z);
        } else if (obstacleName === 'potHole') {
            if (this.comparePositions(randomVector, this.speedBonus.positionsArray, this.puddle.positionsArray) === false) {
                this.addRandomObjects('potHole');
                return;
            }
            this.potHole.positionsArray.push(randomVector);
            bonus = new THREE.Mesh(this.potHole.geometry, this.potHole.material);
            this.addPotholeToScene(bonus, randomVector.x, randomVector.y, randomVector.z);
        }
    }
    public comparePositions(vector: THREE.Vector3, arrayToCompare1: Array<THREE.Vector3>
        , arrayToCompare2: Array<THREE.Vector3>): boolean {
        let canKeepPosition = true;
        for (let i = 0; i < arrayToCompare1.length && arrayToCompare1.length >= 1; i++) {
            if (vector.distanceTo(arrayToCompare1[i]) < 35) {
                canKeepPosition = false;
            }
        }
        for (let i = 0; i < arrayToCompare2.length && arrayToCompare2.length >= 1; i++) {
            if (vector.distanceTo(arrayToCompare2[i]) < 35) {
                canKeepPosition = false;
            }
        }
        return canKeepPosition;


    }
    public addSpeedBonusToScene(circle: THREE.Mesh, abacusesOfElement: number,
        ordinatesOfElement: number, positionZAxeOfElement: number): void {
        circle.position.x = abacusesOfElement;
        circle.position.y = ordinatesOfElement;
        circle.position.z = positionZAxeOfElement;
        this.sceneService.add(circle);
        this.speedBonusesArray.push(circle.id);
        this.speedBonusesPositionArray.push(circle.position);
    }
    public addPotholeToScene(circle: THREE.Mesh, abacusesOfElement: number,
        ordinatesOfElement: number, positionZAxeOfElement: number): void {
        circle.position.x = abacusesOfElement;
        circle.position.y = ordinatesOfElement;
        circle.position.z = positionZAxeOfElement;
        this.sceneService.add(circle);
        this.potholesArray.push(circle.id);
        this.potholesPositionArray.push(circle.position);
    }
    public addPuddleToScene(circle: THREE.Mesh, abacusesOfElement: number,
        ordinatesOfElement: number, positionZAxeOfElement: number): void {
        circle.position.x = abacusesOfElement;
        circle.position.y = ordinatesOfElement;
        circle.position.z = positionZAxeOfElement;
        this.sceneService.add(circle);
        this.puddlesArray.push(circle.id);
        this.puddlesPositionArray.push(circle.position);
    }
    public generateRandomSpeedBonuses(total: number): void {
        if (this.circuitFinished) {
            for (let i = 0; i < this.speedBonusesArray.length; i++) {
                this.sceneService.remove(this.sceneService.getObjectById(this.speedBonusesArray[i]));
                this.speedBonusesPositionArray = new Array();
            }
            for (let i = 0; i < total; i++) {
                this.addRandomObjects('speedBonus');
            }
        }
    }
    public generateRandomPotholes(total: number): void {
        if (this.circuitFinished) {
            for (let i = 0; i < this.potholesArray.length; i++) {
                this.sceneService.remove(this.sceneService.getObjectById(this.potholesArray[i]));
                this.potholesPositionArray = new Array();
            }
            for (let i = 0; i < total; i++) {
                this.addRandomObjects('potHole');
            }
        }
    }
    public generatePuddle(total: number): void {
        if (this.circuitFinished) {
            for (let i = 0; i < this.puddlesArray.length; i++) {
                this.sceneService.remove(this.sceneService.getObjectById(this.puddlesArray[i]));
                this.puddlesPositionArray = new Array();
            }
            for (let i = 0; i < total; i++) {
                this.addRandomObjects('puddles');
            }
        }
    }
}
