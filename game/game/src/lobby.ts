export default class Lobby {
    private players: { [id: string]: any };
    private public_queue: any[];
    private private_players: { [room_code: string]: any[] };
    private num_player: number;

    constructor() {
        this.players = {};
        this.public_queue = [];
        this.private_players = {};
        this.num_player = 0;
    }

    add_player(id: string, username: string, room_code: string = "public") {
        const player = {
            id: id,
            username: username,
            room_code: room_code,
        };

        if (player.room_code === "public") {
            this.players[id] = player;
            this.public_queue.push(player);
            this.num_player++;
        } else {
            if (this.private_players[room_code] == null) {
                this.private_players[room_code] = [];
            }
            this.private_players[room_code].push(player);
        }
    }

    remove_player(id: string) {
        if (this.players[id] != null) {
            this.public_queue.shift();
            delete this.players[id];
            this.num_player--;
        }
    }

    get_num_player() {
        return this.public_queue.length;
    }

    get_num_private_players(code: string) {
        return this.private_players[code] == null ? 0 : this.private_players[code].length;
    }
}
