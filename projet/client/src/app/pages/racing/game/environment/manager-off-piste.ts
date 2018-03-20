import * as THREE from 'three';

const OFF_PISTE = {
    PLANE_LENGTH: 1000, SEGMENT_LENGTH: 200, ROAD_HEIGHT: 19.5, ENVIRONNEMENT_HEIGHT: 15,
    REPEAT_X: 80, REPEAT_Y: 250, TEXTURE_NAME: 'grass', TREE_TEXTURE_NAME: 'tree',
    NUMBER_MAX_TREES: 20, CHANCES_TREE_APPEAR: 9900, LIGHT_NAME: 'LightPreset',
    DECORATIONS_NAME: '3dboom', DECORATION_LIGHT: 'Light01', LIGHT_INTENSITY : 0.01
};

export class ManageOffPiste {

    public area: THREE.Mesh;
    public numberOfTrees: number;
    public tree: THREE.Mesh;
    public treesArray: Array<THREE.Vector3>;

    private raycaster: THREE.Raycaster;

    constructor(private pistes: Array<THREE.Mesh>) {
        this.area = new THREE.Mesh();
        this.tree = new THREE.Mesh();
        this.numberOfTrees = 0;
        this.treesArray = new Array<THREE.Vector3>();
    }

    public createRelief(): void {
        const geometry = new THREE.PlaneGeometry(OFF_PISTE.PLANE_LENGTH, OFF_PISTE.PLANE_LENGTH,
            OFF_PISTE.SEGMENT_LENGTH, OFF_PISTE.SEGMENT_LENGTH);
        geometry.rotateX(-Math.PI / 2);
        for (let i = 0; i < OFF_PISTE.SEGMENT_LENGTH * OFF_PISTE.SEGMENT_LENGTH; i++) {
            if (!this.isInPiste(geometry.vertices[i])) {
                geometry.vertices[i].y = -(Math.random() * (OFF_PISTE.ROAD_HEIGHT - OFF_PISTE.ENVIRONNEMENT_HEIGHT) +
                    OFF_PISTE.ENVIRONNEMENT_HEIGHT);
                const putTree = (Math.random() * (10000) + 1);
                if (this.numberOfTrees < OFF_PISTE.NUMBER_MAX_TREES && this.checkIfOnCircuit(geometry.vertices[i]) &&
                    putTree >= OFF_PISTE.CHANCES_TREE_APPEAR) {
                    this.treesArray.push(geometry.vertices[i]);
                    this.numberOfTrees++;
                }
            } else {
                geometry.vertices[i].y = - (OFF_PISTE.ROAD_HEIGHT + 0.1);
            }
        }
        geometry.computeFaceNormals();
        const url = '/assets/textures/' + OFF_PISTE.TEXTURE_NAME + '.jpg';
        this.addFloorTexture(url, geometry);
    }

    private checkIfOnCircuit(position: THREE.Vector3): boolean {
        const lenght = 250;
        if (position.x < lenght && position.x > -lenght && position.y < lenght &&
            position.y > -lenght && position.z < lenght && position.z > -lenght) {
            return true;
        } else {
            return false;
        }
    }

    public createObject(url, geometry: THREE.PlaneGeometry): void {
        const group = new THREE.Group();
        this.area.add(group);
        const manager = new THREE.LoadingManager();
        manager.onProgress = function (item, loaded, total) { };
        const loader = new THREE.ObjectLoader(manager);
        const path = '/assets/object3d/', type = '.json';
        loader.load(path + OFF_PISTE.TEXTURE_NAME + type, function (result) {
            result.scale.set(1, 1, 1);
            result.name = OFF_PISTE.TEXTURE_NAME;
            group.add(result);
        });
    }

    public createTree(position: THREE.Vector3, scene: THREE.Scene): void {
        const group = new THREE.Mesh();
        group.position.set(position.x, -19, position.z);
        const manager = new THREE.LoadingManager();
        manager.onProgress = function (item, loaded, total) { };
        const loader = new THREE.ObjectLoader(manager);
        const path = '/assets/trees/', type = '.json';
        loader.load(path + OFF_PISTE.TREE_TEXTURE_NAME + type, function (result) {
            result.scale.set(0.01, 0.01, 0.01);
            result.remove(result.getObjectByName(OFF_PISTE.LIGHT_NAME));
            let light: any;
            light = result.getObjectByName(OFF_PISTE.DECORATIONS_NAME).getObjectByName(OFF_PISTE.DECORATION_LIGHT);
            light.intensity = OFF_PISTE.LIGHT_INTENSITY;
            group.add(result);
            scene.add(group);
        });
    }

    private isInPiste(vertice: THREE.Vector3): boolean {
        this.generate(vertice);
        for (const piste of this.pistes) {
            if (this.raycaster.intersectObject(piste).length !== 0) {
                return true;
            }
        }
        return false;
    }

    private generate(position: THREE.Vector3): void {
        const vector = new THREE.Vector3(0, -1, 0);
        this.raycaster = new THREE.Raycaster(position, vector);
    }


    private addFloorTexture(url: string, geometry: THREE.PlaneGeometry): void {
        const loader = new THREE.TextureLoader();
        const actu = this;
        loader.load(url, function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(OFF_PISTE.REPEAT_X, OFF_PISTE.REPEAT_Y);
            const material = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(geometry, material);
            actu.area.add(mesh);
        });
    }
}
