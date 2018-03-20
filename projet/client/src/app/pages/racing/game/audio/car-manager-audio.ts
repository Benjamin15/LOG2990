import { Sound } from './sound';

const SONGS = new Array<Sound>();
SONGS.push(new Sound('car start', '/assets/music/car start.mp3', false));
SONGS.push(new Sound('acceleration', '/assets/music/acceleration.mp3', false));
SONGS.push(new Sound('decceleration', '/assets/music/decceleration.mp3', true));
SONGS.push(new Sound('collision', '/assets/music/collision.wav', false));
SONGS.push(new Sound('limit', '/assets/music/limit.wav', false));
SONGS.push(new Sound('no speed', '/assets/music/no speed.mp3', true));
SONGS.push(new Sound('speed', '/assets/music/speed.mp3', true));
SONGS.push(new Sound('puddling', '/assets/music/puddle.mp3', false));
SONGS.push(new Sound('pothole', '/assets/music/pothole.mp3', false));
SONGS.push(new Sound('start nitro', '/assets/music/start nitro.mp3', false));
SONGS.push(new Sound('end nitro', '/assets/music/end nitro.mp3', false));

export class CarManagerAudio {
    public lastSound: Sound;
    public carSound: Sound;

    constructor() {
        this.lastSound = SONGS[0];
        this.carSound = SONGS[1];
    }

    public play(name: string) {
        for (let i = 0; i < SONGS.length; i++) {
            if (name === SONGS[i].name) {
                this.manageSound(SONGS[i]);
            }
        }
    }

    private manageSound(sound: Sound): void {
        if (sound.name === 'acceleration' || sound.name === 'speed' || sound.name === 'no speed' || sound.name === 'decceleration') {
            if (!sound.loop || sound.name !== this.carSound.name) {
                this.carSound.stop();
                this.carSound = sound;
                this.carSound.play();
            }
        } else {
            this.lastSound.stop();
            this.lastSound = sound;
            this.lastSound.play();
        }
    }
}
