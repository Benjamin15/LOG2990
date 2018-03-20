import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class SceneService extends THREE.Scene {
    private materialPlane = new THREE.MeshStandardMaterial({
        opacity: 0.000001,
        premultipliedAlpha: false,
        transparent: true,
        color: 'white'
    });
    public planeV = new THREE.Mesh(new THREE.PlaneBufferGeometry(3000, 3000, 8, 8), this.materialPlane);

    constructor() {
        super();
    }

    public createScene(): void {

        this.add(new THREE.AmbientLight(0xf0f0f0));
        const light = new THREE.SpotLight(0xffffff, 1.5);
        light.position.set(0, 1500, 200);
        light.castShadow = true;
        light.shadow.bias = -0.000222;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        this.add(light);
        const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
        planeGeometry.rotateX(- Math.PI / 2);
        const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.y = -200;
        plane.receiveShadow = true;
        this.add(plane);
        this.fog = new THREE.Fog(0xcce0ff, 500, 10000);

        const axis = new THREE.AxisHelper(150);
        axis.position.set(0, - 199, 0);
        this.add(axis);
        this.background = new THREE.Color(0x000000);
        const helper = new THREE.GridHelper(3500, 100, 0x42f48f, 0x42f48f);
        helper.position.y = - 199;
        helper.material.opacity = 0.3;
        helper.material.transparent = true;
        helper.receiveShadow = true;
        this.add(helper);
        this.planeV.visible = true;
        this.add(this.planeV);
    }
}
