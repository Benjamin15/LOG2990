import { SceneRaceService } from './../../scene/scene.service';
import { Car } from './../car';
import * as THREE from 'three';

const ROUGHNESS = 0.2;
const METALNESS = 0.6;
const BUMP_SCALE = 0.0005;
export class ManageCarCreation {

    constructor() { }

    private removeUnusedFirstOjects(groupObject: THREE.Object3D): void {
        const group = groupObject;
        group.remove(group.getObjectByName('RearExhaust_Interior'));
        group.remove(group.getObjectByName('R_Wheels_Interior.001'));
        group.remove(group.getObjectByName('R_Wheels_Interior'));
        group.remove(group.getObjectByName('Null'));
        group.remove(group.getObjectByName('InteriorFlooring'));
        group.remove(group.getObjectByName('Interior_SteeringColumnGrey'));
        group.remove(group.getObjectByName('Interior_SteeringColumnDark'));
        group.remove(group.getObjectByName('Interior_Seats'));
        group.remove(group.getObjectByName('Interior_ScreenTrim'));
        group.remove(group.getObjectByName('Interior_ScreenControls'));
        group.remove(group.getObjectByName('Interior_Screen'));
        group.remove(group.getObjectByName('Interior_Roof'));
        group.remove(group.getObjectByName('Interior_RearViewMirror'));
        group.remove(group.getObjectByName('Interior_LeatherConsoleTrim'));
        group.remove(group.getObjectByName('Interior_Gauges'));
    }
    private removeUnusedSecondOjects(groupObject: THREE.Object3D): void {
        const group = groupObject;
        group.remove(group.getObjectByName('Interior_FrontMolding'));
        group.remove(group.getObjectByName('Interior_FrontLeather'));
        group.remove(group.getObjectByName('Interior_Effects'));
        group.remove(group.getObjectByName('Interior_DoorPanels'));
        group.remove(group.getObjectByName('Interior_CenterTrim'));
        group.remove(group.getObjectByName('Interior_CenterDark'));
        group.remove(group.getObjectByName('Interior_CenterConsoleGrayTrim'));
        group.remove(group.getObjectByName('Interior'));
        group.remove(group.getObjectByName('BrakeLightLS1'));
        group.remove(group.getObjectByName('BrakeLightLS2'));
        group.remove(group.getObjectByName('BrakeLightLS3'));
        group.remove(group.getObjectByName('BrakeLightLS4'));
        group.remove(group.getObjectByName('BrakeLightRS1'));
        group.remove(group.getObjectByName('BrakeLightRS2'));
        group.remove(group.getObjectByName('BrakeLightRS3'));
        group.remove(group.getObjectByName('BrakeLightRS4'));
        group.remove(group.getObjectByName('Underbody'));
        group.remove(group.getObjectByName('Plane'));
        group.remove(group.getObjectByName('Cylinder'));
        group.remove(group.getObjectByName('SpotLight'));
        group.remove(group.getObjectByName('SpotLight1'));
        group.remove(group.getObjectByName('Console_Center_Buttons'));
        group.remove(group.getObjectByName('Console_CenterTrim'));
        group.remove(group.getObjectByName('Console_CenterTrim.001'));
    }

    private adjustHeadLights(groupObject: THREE.Object3D): void {
        const group = groupObject;
        let object: any;
        object = group.getObjectByName('MainBody');
        const color = (Math.random() * (99999999));
        color.toString(16);
        const material = new THREE.MeshStandardMaterial({
            color: color, side: THREE.DoubleSide, roughness: ROUGHNESS, metalness: METALNESS,
            bumpScale: BUMP_SCALE
        });
        object.material = material;
    }

    public createCar(scene: SceneRaceService, position: THREE.Vector3, car: Car): void {
        const POSITIONY = -19.2;
        car.rotateY(-Math.PI / 2);
        car.position.set(position.x, POSITIONY, position.z);
        scene.add(car);
        const manager = new THREE.LoadingManager();
        manager.onProgress = function (item, loaded, total) { };
        const loader = new THREE.ObjectLoader(manager);
        const actu = this;
        const yFactor = 1.45;
        loader.load('/assets/lamborghini/lamborghini-aventador-irridescent-paint.json', function (group) {
            group.scale.set(1, yFactor, 1);
            group.name = 'lamborghini';
            group.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
            actu.removeUnusedFirstOjects(group);
            actu.removeUnusedSecondOjects(group);
            actu.adjustHeadLights(group);
            car.add(group);
        });
    }

    public setOpacity(car: Car, opacity: number): void {
        const group = car;
        let object: any;
        for (let i = 0; i < group.children.length; i++) {
            object = group.children[i].getObjectByName('MainBody');
            if (object !== undefined) {
                const material = new THREE.MeshStandardMaterial({
                     opacity: 0.2, transparent: true
                });
                material.fog = false;
                object.material = material;
            }
        }
    }
}
