import * as THREE from 'three';

export class PotHole {
    public geometry = new THREE.SphereGeometry(10, 32, 32);
    public material = new THREE.MeshBasicMaterial({ color: 'yellow' });
    public positionsArray = new Array();

    constructor() {
    }
}


