import Ball from './ball';
import Player from './player';
export default class Room {
    player1: Player;
    player2: Player;
    ball: Ball;
    curr_state: string;
    id: string;
    io: any;
    game_done: boolean;
    players: Player[];
    constructor(p1: any, p2: any, io: any);
    init(): void;
    update(): void;
    disconnect(id: string): void;
    print_room(): void;
}
