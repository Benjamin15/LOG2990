import { Car } from './../car';
import * as THREE from 'three';


const BACK_POINT_LIGHT_LEFT = new THREE.Vector3(1.25, 0.25, -4);
const BACK_POINT_LIGHT_RIGHT = new THREE.Vector3(-1.25, 0.25, -4);
const FRONT_SPOT_LIGHT_LEFT = new THREE.Vector3(1.25, 0.25, +4);
const FRONT_SPOT_LIGHT_RIGHT = new THREE.Vector3(-1.25, 0.25, +4);
const BACK_LIGHT_RIGHT = 'backLightRight';
const BACK_LIGHT_LEFT = 'backLightLeft';
const SPOT_LIGHT_LEFT = 'spotLightLeft';
const SPOT_LIGHT_RIGHT = 'spotLightRight';
const FRONT_RIGHT_DETECTOR = 'frontRightDetector';

export class ManagerLight {
    public car: Car;
    public lightIsOn: boolean;

    constructor(car: Car) {
        this.car = car;
        this.lightIsOn = true;
        this.launchLights(car);
    }

    private launchLights(car: Car): void {
        this.addFrontSpotLight(BACK_POINT_LIGHT_LEFT, car, BACK_LIGHT_RIGHT);
        this.addFrontSpotLight(BACK_POINT_LIGHT_RIGHT, car, BACK_LIGHT_LEFT);
        this.addBackLights(FRONT_SPOT_LIGHT_LEFT, car, SPOT_LIGHT_LEFT);
        this.addBackLights(FRONT_SPOT_LIGHT_RIGHT, car, SPOT_LIGHT_RIGHT);
    }

    private addFrontSpotLight(vertex: THREE.Vector3, car: Car, name: string): void {
        const light = {
            color: 0xffeab5, decay: 1.7, intensity: 2, castShadow: true, distance: 130, angle: 0.70,
            penumbra: 0.198, visible: true, targetVisible: true, yTargetPosition: 0.25, zTargetPosition: 2.5,
            location: FRONT_RIGHT_DETECTOR
        };
        const bulbLight = new THREE.SpotLight(light.color);
        bulbLight.decay = light.decay;
        bulbLight.intensity = light.intensity;
        bulbLight.distance = light.distance;
        bulbLight.angle = light.angle;
        bulbLight.penumbra = light.penumbra;
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(car.getObjectByName(light.location).matrixWorld);
        bulbLight.position.set(vector.x + vertex.x, vector.y + vertex.y, vector.z + vertex.z);
        bulbLight.target.position.set(vector.x + vertex.x, vector.y + vertex.y - light.yTargetPosition,
            vector.z + vertex.z - light.zTargetPosition);
        bulbLight.name = name;
        bulbLight.castShadow = light.castShadow;
        bulbLight.visible = light.visible;
        bulbLight.target.visible = light.targetVisible;
        car.add(bulbLight);
        car.add(bulbLight.target);
    }

    private addBackLights(vertex: THREE.Vector3, car: Car, name: string): void {
        const light = { color: 0x680000, decay: 2, intensity: 0.8, castShadow: true, distance: 15,
        visible: true };
        const bulbLight = new THREE.PointLight(light.color);
        bulbLight.decay = light.decay;
        bulbLight.intensity = light.intensity;
        bulbLight.distance = light.distance;
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(car.getObjectByName(FRONT_RIGHT_DETECTOR).matrixWorld);
        bulbLight.position.set(vector.x + vertex.x, vector.y + vertex.y, vector.z + vertex.z);
        bulbLight.castShadow = light.castShadow;
        bulbLight.name = name;
        bulbLight.visible = light.visible;
        car.add(bulbLight);
    }

    public removeLights(): void {
        this.car.getObjectByName(BACK_LIGHT_RIGHT).visible = false;
        this.car.getObjectByName(BACK_LIGHT_LEFT).visible = false;
        this.car.getObjectByName(SPOT_LIGHT_LEFT).visible = false;
        this.car.getObjectByName(SPOT_LIGHT_RIGHT).visible = false;
        this.lightIsOn = false;
    }

    public activateLights(): void {
        this.car.getObjectByName(BACK_LIGHT_RIGHT).visible = true;
        this.car.getObjectByName(BACK_LIGHT_LEFT).visible = true;
        this.car.getObjectByName(SPOT_LIGHT_LEFT).visible = true;
        this.car.getObjectByName(SPOT_LIGHT_RIGHT).visible = true;
        this.lightIsOn = true;
    }
}
