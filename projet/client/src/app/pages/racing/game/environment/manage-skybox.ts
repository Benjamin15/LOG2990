import * as THREE from 'three';

export class ManageSkybox {
    public skyboxMesh: THREE.Mesh;

    constructor() {}

    public generate(camera: THREE.Camera, way: string): void {
        const route = './assets/Skybox/' + way + '/';
        const paths = [route + 'posx.jpg', route + 'negx.jpg', route + 'posy.jpg', route + 'negy.jpg',
        route + 'posz.jpg', route + 'negz.jpg'];
        const cubeMateriel = new THREE.CubeTextureLoader().load(paths);
        const shader = THREE.ShaderLib['cube'];
        shader.uniforms['tCube'].value = cubeMateriel;
        const material = new THREE.ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms, side: THREE.BackSide,
        });
        this.skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry(1500,
            1500, 1500), material);
        material.needsUpdate = true;
        camera.add(this.skyboxMesh);
    }
}
