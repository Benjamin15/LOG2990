import * as THREE from 'three';
import { SceneService } from './scene.service';

export class ObjectsHandlerService {
    private sceneService: SceneService;
    public lines = new Array();
    public dots = new Array();
    public objectsArray = new Array();
    public objectsArrayToDelete = new Array();
    public linesArray = new Array();
    public listOfDotsArray = new Array();
    public figGeometry = new THREE.Geometry();
    public newLineGeometry = new THREE.Geometry();
    public dotGeometry = new THREE.Geometry();
    public manyDotsGeometry = new THREE.Geometry();
    public sphereGeometry = new THREE.SphereGeometry(10, 24, 24);
    public sphereMaterial = new THREE.MeshPhongMaterial();
    public mustUpdateLine = false;
    public mustUpdateFirstPoint = false;
    public dotMaterial = new THREE.PointsMaterial();
    public object = new THREE.Mesh;
    public positions = new THREE.Vector3;
    public addPositions = new Array<THREE.Vector3>();
    public geometry = new THREE.BoxGeometry(20, 20, 20);
    public angleTable = new Array<THREE.Vector3>();
    public alreadyFoundCollision = false;
    public correctAngle = true;
    public correctCircuit = true;
    public colorArray = new Array();
    public vectorTable = new Array<THREE.Vector3>();
    public firstPoint = new THREE.Vector3();
    public dotdraggedX = 0;
    public dotdraggedY = 0;
    public dotdraggedZ = 0;
    public startPointExists = false;
    public correctLength = false;
    public hasCollision = false;
    public hasCommunPoints = false;

    constructor() { }

    public updateFirstPoint(): void {
        this.firstPoint = this.positions;
    }

    public setSceneService(scene: SceneService): void {
        this.sceneService = scene;
    }

    public getSceneService(): SceneService {
        return this.sceneService;
    }

    public updatePreviousAndNext(index: number): void {
        this.sceneService.remove(this.sceneService.getObjectById(this.linesArray[index]));
        this.sceneService.remove(this.sceneService.getObjectById(this.linesArray[index - 1]));
        this.newLineGeometry.vertices.push(this.sceneService.getObjectById(
            this.listOfDotsArray[index + 1]).position, this.positions);
        const directorVector2 = this.createVector(this.newLineGeometry.vertices);
        const line2 = new THREE.Line(this.newLineGeometry, new THREE.LineBasicMaterial(
            { color: 0x08a823, opacity: 400 }));

        this.newLineGeometry = new THREE.Geometry;
        const line1 = new THREE.Line(this.newLineGeometry, new THREE.LineBasicMaterial
            ({ color: 0x08a823, opacity: 400 }));
        this.newLineGeometry.vertices.push(this.sceneService.getObjectById
            (this.listOfDotsArray[index - 1]).position, this.positions);
        const directorVector1 = this.createVector(this.newLineGeometry.vertices);
        this.vectorTable[index] = directorVector2;
        this.vectorTable[index - 1] = directorVector1;
        this.correctAngle = (directorVector1.angleTo(directorVector2) > Math.PI / 4);
        this.correctAccordingAngles(index, line1, line2);
    }

    public previousLineManager(index: number, line1: THREE.Line, line2: THREE.Line): void {
        if (this.correctAngle) {
            this.sceneService.remove(this.sceneService.getObjectById(this.linesArray[index - 2]));
            this.setLineColor(0x08a823, line1, line2, index);
            this.colorArray[index - 1] = 'green';
            this.colorArray[index - 2] = 'green';
        } else {
            this.sceneService.remove(this.sceneService.getObjectById(this.linesArray[index - 2]));
            this.setLineColor(0xf4020e, line1, line2, index);
            this.colorArray[index - 1] = 'red';
            this.colorArray[index - 2] = 'red';
        }
        this.sceneService.add(line1);
        this.linesArray[index - 1] = line1.id;
        this.lines[index - 1] = line1;
        this.checkLineLength();
    }

    public updatePrevious(index: number): void {
        this.figGeometry = new THREE.Geometry();
        this.figGeometry.vertices.push(this.positions);
        this.sceneService.remove(this.sceneService.getObjectById(this.linesArray[index - 1]));
        this.newLineGeometry.vertices.push(this.positions, this.sceneService.getObjectById(
            this.listOfDotsArray[index - 1]).position);
        const directorVector1 = this.createVector(this.newLineGeometry.vertices);
        const line1 = new THREE.Line(this.newLineGeometry, new THREE.LineBasicMaterial(
            { color: 0x6A25C8, opacity: 400 }));
        this.newLineGeometry = new THREE.Geometry;
        this.newLineGeometry.vertices.push(this.sceneService.getObjectById(
            this.listOfDotsArray[index - 1]).position, this.sceneService.getObjectById(
                this.listOfDotsArray[index - 2]).position);
        const directorVector2 = this.createVector(this.newLineGeometry.vertices);
        if (this.objectsArray.length > 2) {
            this.vectorTable[this.vectorTable.length - 1] = directorVector1;
            this.correctAngle = (
                directorVector1.angleTo(directorVector2) < (Math.PI - Math.PI / 4));
        }
        const line2 = new THREE.Line(this.newLineGeometry, new THREE.LineBasicMaterial(
            { color: 0x6A25C8, opacity: 400 }));
        this.previousLineManager(index, line1, line2);
    }

    public setLineColor(color: any, line1: THREE.Line, line2: THREE.Line, index: number): void {
        line1.material = new THREE.LineBasicMaterial({ color: color, opacity: 400 });
        this.lines[this.lines.length - 1].material =
            new THREE.LineBasicMaterial({ color: color, opacity: 400 });
        line2.material = new THREE.LineBasicMaterial({ color: color, opacity: 400 });
        this.lines[this.lines.length - 2].material =
            new THREE.LineBasicMaterial({ color: color, opacity: 400 });
        this.sceneService.add(line2);
        this.linesArray[index - 2] = line2.id;
        this.lines[index - 2] = line2;
    }

    public correctAccordingAngles(index: number, line1: THREE.Line, line2: THREE.Line): void {
        if (this.correctAngle) {
            line2.material = new THREE.LineBasicMaterial
                ({ color: 0x08a823, opacity: 400 });
            line1.material = new THREE.LineBasicMaterial
                ({ color: 0x08a823, opacity: 400 });
            this.sceneService.add(line2);
            this.linesArray[index] = line2.id;
            this.lines[index] = line2;
            this.sceneService.add(line1);
            this.linesArray[index - 1] = line1.id;
            this.lines[index - 1] = line1;
            this.colorArray[index] = 'green';
            this.colorArray[index - 1] = 'green';
        } else {
            line2.material = new THREE.LineBasicMaterial
                ({ color: 0xf4020e, opacity: 400 });
            line1.material = new THREE.LineBasicMaterial
                ({ color: 0xf4020e, opacity: 400 });
            this.sceneService.add(line2);
            this.linesArray[index] = line2.id;
            this.lines[index] = line2;
            this.sceneService.add(line1);
            this.linesArray[index - 1] = line1.id;
            this.lines[index - 1] = line1;
            this.colorArray[index] = 'red';
            this.colorArray[index - 1] = 'red';
        }
        this.checkLineLength();
    }

    public createVector(lineDots: THREE.Vector3[]): THREE.Vector3 {
        const dir = new THREE.Vector3();
        dir.subVectors(lineDots[1], lineDots[0]).normalize();
        return dir;
    }

    public updateNext(index: number): void {
        this.sceneService.remove(this.sceneService.getObjectById(this.linesArray[index]));
        this.newLineGeometry.vertices.push(this.sceneService.getObjectById(
            this.listOfDotsArray[1]).position, this.positions);
        const directorVector1 = this.createVector(this.newLineGeometry.vertices);
        const line1 = new THREE.Line(this.newLineGeometry, new THREE.LineBasicMaterial({
            color: 0x6A25C8, opacity: 400
        }));
        this.newLineGeometry = new THREE.Geometry;
        this.newLineGeometry.vertices.push(this.sceneService.getObjectById(
            this.listOfDotsArray[1]).position, this.sceneService.getObjectById(
                this.listOfDotsArray[2]).position);
        const directorVector2 = this.createVector(this.newLineGeometry.vertices);
        if (this.objectsArray.length > 2) {
            this.vectorTable[0] = directorVector1;
            this.correctAngle = (directorVector1.angleTo(directorVector2) > Math.PI /
                4);
        }
        const line2 = new THREE.Line(this.newLineGeometry, new THREE.LineBasicMaterial({
            color: 0x6A25C8, opacity: 400
        }));
        this.nextLineManager(index, line1, line2);
    }

    public nextLineManager(index: number, line1: THREE.Line, line2: THREE.Line): void {
        if (this.correctAngle) {
            this.sceneService.remove(this.sceneService.getObjectById(this.linesArray[index + 1]));
            this.setLineColor(0x08a823, line2, line1, index);
            this.colorArray[index] = 'green';
            this.colorArray[index + 1] = 'green';
        } else {
            this.setLineColor(0xf4020e, line2, line1, index);
            this.colorArray[index] = 'red';
            this.colorArray[index + 1] = 'red';
        }
        this.sceneService.add(line1);
        this.linesArray[0] = line1.id;
        this.lines[0] = line1;
        this.checkLineLength();
    }

    public updateVertices(vectorToAdd: THREE.Vector3): void {
        this.manyDotsGeometry = new THREE.Geometry();
        this.manyDotsGeometry.vertices.push(vectorToAdd);
        this.figGeometry.vertices.push(vectorToAdd);
        this.dotGeometry.vertices.push(vectorToAdd);
    }

    public lookForPoint(): void {
        for (let i = 0; i < this.addPositions.length; i++) {
            if (this.dotdraggedX === this.addPositions[i].x && this.dotdraggedY === this.addPositions[i].y
                && this.dotdraggedZ === this.addPositions[i].z) {
                this.newLineGeometry = new THREE.Geometry;
                if (this.addPositions[i + 1] != null && this.addPositions[i - 1] != null) {
                    this.updatePreviousAndNext(i);
                    this.checkLinesCollision();
                    this.checkLineLength();
                } else if (this.addPositions[i + 1] == null) {
                    this.updatePrevious(i);
                    this.checkLinesCollision();
                    this.checkLineLength();
                } else if (this.addPositions[i - 1] == null) {
                    this.updateNext(i);
                    this.checkLinesCollision();

                }
                this.updateArrays(i);
            }
        }
    }

    public updateVectorTableAfterRemove(): void {
        while (this.angleTable.length !== 0) {
            this.angleTable.pop();
        }
        this.vectorTable.pop();
        if (this.vectorTable.length !== 0) {
            this.angleTable.push(this.vectorTable[this.vectorTable.length - 1]);
        }
    }

    public checkCircuit(): boolean {
        this.correctCircuit = true;
        for (let i = 0; i < this.colorArray.length; i++) {
            if (this.colorArray[i] === 'red' || this.colorArray[i] === 'orange') {
                this.correctCircuit = false;
            }
        }
        return this.correctCircuit;
    }

    public updateArrays(index: number): void {
        this.addPositions[index].setX(this.positions.x);
        this.addPositions[index].setY(this.positions.y);
        this.addPositions[index].setZ(this.positions.z);
        this.dotGeometry.vertices[index].set(this.positions.x, this.positions.y, this.positions.z);
    }

    public designateFirstPoint(abacuses: number, ordinates: number, z: number): void {
        this.firstPoint = new THREE.Vector3(abacuses, ordinates, z);
        this.startPointExists = true;
        this.sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        this.dotMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 45, sizeAttenuation: true });
    }

    public checkLineLength(): boolean {
        if (this.addPositions.length > 0) {
            const LINE_MINIMUM_LENGTH = 100;
            for (let i = 1; i < this.addPositions.length; i++) {
                const vector1 = this.addPositions[i - 1];
                const vector2 = this.addPositions[i];
                let distance;
                distance = vector1.distanceTo(vector2);
                if (distance > (LINE_MINIMUM_LENGTH) && this.colorArray[i - 1] !== 'red') {
                    this.manageGreenLine(i);
                } else if (this.colorArray[i - 1] === 'green') {
                    this.manageOrangeLine(i);
                }
                distance = 0;
            }
            return this.correctLength;
        }
    }

    public manageGreenLine(i: number): void {
        this.sceneService.remove(this.sceneService.getObjectById(this.linesArray[i - 1]));
        this.newLineGeometry = new THREE.Geometry;
        this.newLineGeometry.vertices.push(this.sceneService.getObjectById(
            this.listOfDotsArray[i]).position, this.sceneService.getObjectById(
                this.listOfDotsArray[i - 1]).position);
        const line1 = new THREE.Line(this.newLineGeometry, new THREE.LineBasicMaterial(
            { color: 0x08a823, opacity: 400 }));
        this.sceneService.add(line1);
        this.linesArray[i - 1] = line1.id;
        this.lines[i - 1] = line1;
        this.correctLength = true;
        this.colorArray[i - 1] = 'green';
    }

    public manageOrangeLine(i: number): void {
        this.sceneService.remove(this.sceneService.getObjectById(this.linesArray[i - 1]));
        this.newLineGeometry = new THREE.Geometry;
        this.newLineGeometry.vertices.push(this.sceneService.getObjectById(
            this.listOfDotsArray[i]).position, this.sceneService.getObjectById(
                this.listOfDotsArray[i - 1]).position);
        const line1 = new THREE.Line(this.newLineGeometry, new THREE.LineBasicMaterial(
            { color: 0xf4020e, opacity: 400 }));
        this.sceneService.add(line1);
        this.linesArray[i - 1] = line1.id;
        this.lines[i - 1] = line1;
        this.correctLength = false;
        this.colorArray[i - 1] = 'orange';
    }

    public collisionManager(index: number): void {
        const nextFirstPoint = this.addPositions[index];
        const nextSecondPoint = this.addPositions[index + 1];
        for (let i = 0; i < this.addPositions.length - 1; i++) {
            const previousFirstPoint = this.addPositions[i];
            const previousSecondPoint = this.addPositions[i + 1];
            if (previousFirstPoint !== nextFirstPoint && nextSecondPoint !== previousSecondPoint && this.addPositions[index].z === 0
                && this.addPositions[index + 1].z === 0 && this.addPositions[i].z === 0 && this.addPositions[i + 1].z === 0) {
                const fract = (nextSecondPoint.y - nextFirstPoint.y) * (previousSecondPoint.x - previousFirstPoint.x)
                    - (nextSecondPoint.x - previousFirstPoint.x) * (previousSecondPoint.y - previousFirstPoint.y);
                const collisionA = ((nextSecondPoint.x - nextFirstPoint.x) * (previousFirstPoint.y - nextFirstPoint.y)
                    - (nextSecondPoint.y - nextFirstPoint.y) * (previousFirstPoint.x - nextFirstPoint.x)) / fract;
                const collisionB = ((previousSecondPoint.x - previousFirstPoint.x) * (previousFirstPoint.y - nextFirstPoint.y)
                    - (previousSecondPoint.y - previousFirstPoint.y) * (previousFirstPoint.x - nextFirstPoint.x)) / fract;
                this.hasCollision = (collisionA >= 0 && collisionA <= 1) && (collisionB >= 0 && collisionB <= 1);
                this.hasCommunPoints = (nextFirstPoint === previousSecondPoint || nextFirstPoint === previousFirstPoint
                    || nextSecondPoint === previousSecondPoint || nextSecondPoint === previousFirstPoint);
                if (this.hasCollision && !this.hasCommunPoints) {
                    this.alreadyFoundCollision = true;
                    this.hasCollision = true;
                } else if (this.alreadyFoundCollision === false) {
                    this.hasCollision = false;
                }
            }
        }
    }

    public checkLinesCollision(): boolean {
        this.alreadyFoundCollision = false;
        for (let index = 0; index < this.addPositions.length - 1 && this.addPositions.length > 3; index++) {
            this.collisionManager(index);
        }
        return this.hasCollision;
    }
}
