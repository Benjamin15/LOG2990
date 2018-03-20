import * as THREE from 'three';

export class Puddle {
    public geometry = new THREE.SphereGeometry( 10, 32, 32 );
    public material = new THREE.MeshBasicMaterial( {color: 'blue'} );
    public positionsArray = new Array();

    constructor() {
    }
}







