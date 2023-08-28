export default class Lobby {
    players: {
        [id: string]: any;
    };
    public_queue: any[];
    private_players: {
        [room_code: string]: any[];
    };
    num_player: number;
    constructor();
    add_player(id: string, username: string, room_code?: string): void;
    remove_player(id: string): void;
    get_num_player(): number;
    get_num_private_players(code: string): number;
}
