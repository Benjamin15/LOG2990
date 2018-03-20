import { ObjectsHandlerService } from './objects-handler.service';
import { TestBed } from '@angular/core/testing';
import * as THREE from 'three';
import { assert } from 'chai';

let objectHandlerService: ObjectsHandlerService;

describe('Object Handler Service', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ObjectsHandlerService]
        });
    });

    it('should create Object Handler', () => {
        objectHandlerService = new ObjectsHandlerService();
    });

    it('should add position', () => {
        objectHandlerService = new ObjectsHandlerService();
        const position = new Array<THREE.Vector3>();
        position.push(new THREE.Vector3(0, 0, 0));
        position.push(new THREE.Vector3(1, 0, 0));
        objectHandlerService.addPositions = position;
        assert(objectHandlerService.addPositions.length === position.length);
    });

    it('should verify check line. Need to be false', () => {
        objectHandlerService = new ObjectsHandlerService();
        const position = new Array<THREE.Vector3>();
        position.push(new THREE.Vector3(0, 0, 0));
        position.push(new THREE.Vector3(1, 0, 0));
        objectHandlerService.addPositions = position;
        assert(objectHandlerService.checkLineLength() !== true);
    });

    it('should verify check line collision', () => {
        objectHandlerService = new ObjectsHandlerService();
        const position = new Array<THREE.Vector3>();
        position.push(new THREE.Vector3(0, 0, 0));
        position.push(new THREE.Vector3(200, 0, 0));
        position.push(new THREE.Vector3(50, 200, 0));
        position.push(new THREE.Vector3(50, -200, 0));
        objectHandlerService.addPositions = position;
        assert(objectHandlerService.checkLinesCollision());
    });

    it('should verify check line collision : need to be false', () => {
        objectHandlerService = new ObjectsHandlerService();
        const position = new Array<THREE.Vector3>();
        position.push(new THREE.Vector3(0, 0, 0));
        position.push(new THREE.Vector3(200, 0, 0));
        position.push(new THREE.Vector3(300, 200, 0));
        position.push(new THREE.Vector3(400, -200, 0));
        objectHandlerService.addPositions = position;
        assert(!objectHandlerService.checkLinesCollision());
    });
});
