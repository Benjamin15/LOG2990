import { Particles } from './particles';
import * as THREE from 'three';
import { Scene } from 'three';

const COUNT = 25000;
const URL_TEXTURE = 'assets/textures/snowparticles.png';
const LENGTH_PISTE = 1500;
const MIN_Y = -20;
const MAX_Y = 100;
const INTERVAL_Y = 10;
const SPEED = 1;
const ROTATE = 0.005;
export class Snow implements Particles {

    public particles: THREE.Geometry;
    private particleSystem: any;
    constructor(scene: Scene) {
        this.particles = new THREE.Geometry();
        this.createParticles();
        scene.add(this.particleSystem);
        scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0004 );
    }

    public update(): void {
        const verts = this.particleSystem.geometry.vertices;
        for (let i = 0; i < verts.length; i++) {
            const vert = verts[i];
            if (vert.y < MIN_Y) {
                vert.y = Math.random() * MAX_Y + MIN_Y;
            }
            vert.y = vert.y - SPEED;
        }
        this.particleSystem.rotation.y -= ROTATE;
        this.particleSystem.geometry.verticesNeedUpdate = true;
    }

    private createParticles(): void {
        for (let i = 0; i < COUNT; i++) {
               const x = Math.random() * LENGTH_PISTE - LENGTH_PISTE / 2;
               const y = Math.random() * INTERVAL_Y * + (MIN_Y);
               const z = Math.random() * LENGTH_PISTE - LENGTH_PISTE / 2;
               const particle = new THREE.Vector3(x, y, z);
               this.particles.vertices.push(particle);
           }
           const particleMaterial = new THREE.PointsMaterial(
            {size: 0.2,
             fog: false,
            });
            const loader = new THREE.TextureLoader();
            loader.load(URL_TEXTURE, function (texture) {
                particleMaterial.map = texture;
            });
        this.particleSystem = new THREE.Points(this.particles, particleMaterial);
    }
}
