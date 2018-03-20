import { Crossword } from './../../../commun/models/Crossword';
import { Configuration } from './../../../commun/models/Configuration';
import { RoomManager } from './crossword/RoomManager';
import { Definition } from './../../../commun/models/Definition';
import { Position } from './../../../commun/models/Position';

const DYNAMIC = 'Dynamic';
const N_PLAYERS = 2;
const PATH = '/crossword';

export class ManageSocket {
    private roomManager: RoomManager;

    constructor(private io: any) {
        this.roomManager = new RoomManager();
    }

    public handleSocket(): void {
        this.io = this.io.of(PATH).on('connect', (socket: any) => {
            this.handleListRomms(socket);
            this.handleCreateGame(socket);
            this.handleJoinGame(socket);
            this.handleLeaveGame(socket);
            this.handleTimer(socket);
            this.handleCursor(socket);
            this.handleFindWord(socket);
            this.handleResetGame(socket);
        });
    }

    private handleTimer(socket: any): void {
        socket.on('setTimeRoom', (newTime: number, roomId: string) => {
            this.roomManager.getRoom(roomId).setTimer(newTime);
        });
    }

    private handleListRomms(socket: any): void {
        socket.on('getListRoom', () => {
            socket.emit('listRoom', this.roomManager.getListRoom());
        });
    }

    private handleCreateGame(socket: any): void {
        socket.on('createRoom', async (configuration: Configuration, namePlayer: string) => {
            const roomId = this.roomManager.createRoom(configuration, namePlayer);
            socket.emit('roomId', roomId);
            socket.join(roomId);
            if (configuration.nPlayer === N_PLAYERS) {
                socket.broadcast.emit('listRoom', new Array<Configuration>(configuration));
            } else {
                await this.roomManager.getRoom(roomId).startGame();
                this.startGame(roomId);
            }
        });
    }

    private handleJoinGame(socket: any): void {
        socket.on('joinRoom', async (roomId: string, namePlayer: string) => {
            socket.join(roomId);
            if (await this.roomManager.joinRoom(roomId, namePlayer)) {
                this.startGame(roomId);
            }
        });
    }

    private startGame(roomId: string) {
        this.io.in(roomId).emit('getPlayers', this.roomManager.getRoom(roomId).getPlayers());
        const crossword = new Crossword('', '');
        crossword.copyCrossword(this.roomManager.getRoom(roomId).getCrossword());
        crossword.correctTile();
        this.io.in(roomId).emit('gameStarted', crossword);
        if (this.roomManager.getRoom(roomId).getConfiguration().mode === DYNAMIC) {
            setInterval(() => {
                this.roomManager.updateGrill(roomId, this.io);
                this.io.in(roomId).emit('timer', this.roomManager.getRoom(roomId).getTimer());
            }, 1000);
        }
    }

    private handleLeaveGame(socket: any): void {
        socket.on('disconnect', (roomId: string) => {
            socket.leave(roomId);
        });
    }

    private handleCursor(socket: any): void {
        socket.on('sendPosition', (position: Array<Position>, roomId: string) => {
            socket.broadcast.in(roomId).emit('adversePosition', position);
        });
    }

    private handleFindWord(socket: any): void {
        socket.on('sendWordFind', (definition: Definition, roomId: string, namePlayer: string) => {
            this.roomManager.getRoom(roomId).wordFind(namePlayer, definition.word);
            socket.broadcast.in(roomId).emit('adverseWordFind', definition);
            this.io.in(roomId).emit('getPlayers', this.roomManager.getRoom(roomId).getPlayers());
            this.io.in(roomId).emit('endGame', this.roomManager.getRoom(roomId).endGame());
        });
    }

    private handleResetGame(socket: any): void {
        socket.on('resetGame', async (roomId: string) => {
            const reset = await this.roomManager.getRoom(roomId).resetGame();
            if (reset) {
                this.startGame(roomId);
            }
        });
    }
}
