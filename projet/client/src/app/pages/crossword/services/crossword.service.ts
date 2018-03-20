import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IConfiguration } from './../configuration/IConfiguration';
import { Configuration } from './../../../../../../commun/models/Configuration';
import { Definition } from './../../../../../../commun/models/Definition';
import { Crossword } from './../../../../../../commun/models/Crossword';
import { Position } from './../../../../../../commun/models/Position';
import { Player } from './../../../../../../commun/models/Player';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class CrosswordService {

    private socket: SocketIOClient.Socket;

    constructor() {
        const url = 'http://localhost:3000/crossword';
        this.socket = io.connect(url);
    }

    public getListRoom(): Observable<Array<Configuration>> {
        this.socket.emit('getListRoom');
        const observable = new Observable<Array<Configuration>>(observer => {
            this.socket.on('listRoom', (list: Array<Configuration>) => {
                observer.next(list);
            });
        });
        return observable;
    }

    public startTimer(): Observable<number> {
        this.socket.emit('startTimer');
        return this.getTimer();
    }

    public getTimer(): Observable<number> {
        const observable = new Observable<number>(observer => {
            this.socket.on('timer', (timer: number) => {
                observer.next(timer);
            });
        });
        return observable;
    }

    public setTimer(newTime: number): void {
        this.socket.emit('setTimeRoom', newTime, IConfiguration.roomID);
    }

    public createRoom(configuration: Configuration): Observable<Crossword> {
        this.socket.emit('createRoom', configuration, IConfiguration.namePlayer);
        this.socket.on('roomId', (roomId) => {
            IConfiguration.roomID = roomId;
        });
        return this.startGame();
    }

    public joinRoom(roomId: string, namePlayer: string): Observable<Crossword> {
        this.socket.emit('joinRoom', roomId, namePlayer);
        return this.startGame();
    }

    public startGame(): Observable<Crossword> {
        const observable = new Observable<Crossword>(observer => {
            this.socket.on('gameStarted', (crossword: Crossword) => {
                const result = new Crossword(crossword.mode, crossword.difficulty);
                result.copyCrossword(crossword);
                observer.next(result);
            });
        });
        return observable;
    }

    public sendPosition(positions: Array<Position>): void {
        this.socket.emit('sendPosition', positions, IConfiguration.roomID);
    }

    public getAdversePosition(): Observable<Array<Position>> {
        const observable = new Observable<Array<Position>>(observer => {
            this.socket.on('adversePosition', (positions: Array<Position>) => {
                observer.next(positions);
            });
        });
        return observable;
    }

    public sendWordFind(definition: Definition): void {
        this.socket.emit('sendWordFind', definition, IConfiguration.roomID, IConfiguration.namePlayer);
    }

    public getWordFind(): Observable<Definition> {
        const observable = new Observable<Definition>(observer => {
            this.socket.on('adverseWordFind', (definition: Definition) => {
                observer.next(definition);
            });
        });
        return observable;
    }

    public getPlayers(): Observable<Array<Player>> {
        const observable = new Observable<Array<Player>>(observer => {
            this.socket.on('getPlayers', (players: Array<Player>) => {
                if (players.length > 1 && players[1].name === IConfiguration.namePlayer) {
                    players.push(players.shift());
                }
                players.forEach(player => {
                    Object.assign(player, player);
                });
                observer.next(players);
            });
        });
        return observable;
    }

    public endGame(): Observable<boolean> {
        const observable = new Observable<boolean>(observer => {
            this.socket.on('endGame', (endGame: boolean) => {
                observer.next(endGame);
            });
        });
        return observable;
    }

    public resetGame(): void {
        this.socket.emit('resetGame', IConfiguration.roomID);
    }
}
