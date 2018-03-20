import { KeyGen } from './../../../../commun/models/KeyGen';
import { Configuration } from './../../../../commun/models/Configuration';
import { Player } from './../../../../commun/models/Player';
import { Room } from './Room';
import { Crossword } from '../../../../commun/models/Crossword';

const N_PLAYERS = 2;
const TIMER = 60;
export class RoomManager {
    private rooms: Map<string, Room>;

    constructor() {
        this.rooms = new Map<string, Room>();
    }

    public getListRoom(): Array<Configuration> {
        const list = new Array<Configuration>();
        this.rooms.forEach((room: Room) => {
            if (room.getPlayers().length < room.getConfiguration().nPlayer) {
                list.push(room.getConfiguration());
            }
        });
        return list;
    }

    public getRoom(roomId: string): Room {
        return this.rooms.get(roomId);
    }

    public createRoom(configuration: Configuration, namePlayer: string): string {
        configuration.roomId = KeyGen.generateUUID();
        this.rooms.set(configuration.roomId, new Room(namePlayer, configuration));
        return configuration.roomId;
    }

    public async joinRoom(roomId: string, namePlayer: string): Promise<boolean> {
        let succes = false;
        if (this.getRoom(roomId).getPlayers().length < N_PLAYERS) {
            this.getRoom(roomId).addPlayer(new Player(namePlayer));
            await this.getRoom(roomId).startGame();
            succes = true;
        }
        return succes;
    }

    public updateGrill(roomId: string, io: any): void {
        if (this.getRoom(roomId).getTimer() < 0) {
            this.getRoom(roomId).setTimer(TIMER);
            this.getRoom(roomId).startTimer();
            this.getRoom(roomId).switchCrossword();
            const crossword = new Crossword('', '');
            crossword.copyCrossword(this.getRoom(roomId).getCrossword());
            crossword.correctTile();
            io.in(roomId).emit('gameStarted', crossword);
            this.getRoom(roomId).generateNextCrossword();
        }
    }
}
