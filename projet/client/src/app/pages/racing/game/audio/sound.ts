import * as THREE from 'three';

const VOLUME = 1;

export class Sound {
    public listener: THREE.AudioListener;
    public source: THREE.Audio;
    public name: string;
    public path: string;
    public loop: boolean;

    constructor(name: string, path: string, loop: boolean) {
        this.listener = new THREE.AudioListener();
        this.source = new THREE.Audio(this.listener);
        this.name = name;
        this.path = path;
        this.loop = loop;
        this.loadAudio();
    }

    private loadAudio(): void {
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load(this.path, (buffer) => {
            this.source.setBuffer(buffer);
            this.source.setLoop(this.loop);
            this.source.setVolume(VOLUME);
        }, () => { }, () => { });
    }


    public play(): void {
        this.source.play();
    }

    public stop(): void {
        if (this.source.isPlaying) {
            this.source.stop();
        }
    }
}
