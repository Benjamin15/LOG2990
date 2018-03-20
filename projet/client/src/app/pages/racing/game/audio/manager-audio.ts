import { Sound } from './sound';

const VOLUME_BIP = 10;
const SONGS = new Array<Sound>();
SONGS.push(new Sound('bip', '/assets/music/bip.ogg', false));
SONGS.push(new Sound('StartGame', '/assets/music/explode.wav', false));
SONGS.push(new Sound('MusicRace', '/assets/music/racing.ogg', true));
SONGS.push(new Sound('MusicEndRace', '/assets/music/finish.mp3', false));
SONGS.push(new Sound('MusicResult', '/assets/music/result.mp3', true));

export class ManagerAudio {

    public lastSound: Sound;

    constructor() {
        this.lastSound = SONGS[0];
        SONGS[0].source.setVolume(VOLUME_BIP);
    }

    public loadMusicRace(): void {
        this.play('MusicRace');
    }

    public loadMusicEndRace(): void {
        this.play('MusicEndRace');
    }

    public loadMusicResults(): void {
        this.play('MusicResult');
    }

    public loadCountdown(): void {
        this.play('bip');
    }

    public loadStartSound(): void {
        this.play('StartGame');
    }

    private play(name: string): void {
        for (let i = 0; i < SONGS.length; i++) {
            if (name === SONGS[i].name) {
                this.lastSound.stop();
                this.lastSound = SONGS[i];
                this.lastSound.play();
            }
        }
    }
}
