"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ball_1 = require("./ball");
const player_1 = require("./player");
const fs = require('fs');
const path = require('path');
const configPath = path.resolve('/home/osarihan/Desktop/ft_transcendence-game/game/game/src/config.json');
const configData = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configData);
const screen_width = 700;
const screen_height = 600;
const player_width = 20;
const player_height = 100;
const end_point = 5;
const game_state = ["ST_IDLE", "ST_DISCONNECTED", "ST_ONGAME", "ST_LEFTBALL", "ST_RIGHTBALL"];
const UP = 38, DOWN = 40, SPACE = 32;
class Room {
    constructor(p1, p2, io) {
        this.player1 = new player_1.default(p1, config.player_width, (config.screen_height - config.player_height) / 2);
        this.player2 = new player_1.default(p2, config.screen_width - config.player_width * 2, (config.screen_height - config.player_height) / 2);
        this.ball = new ball_1.default((config.screen_width - config.player_width) / 2, (config.screen_height - config.player_width) / 2);
        this.curr_state = "ST_IDLE";
        this.id = p1.id + p2.id;
        this.io = io;
        this.game_done = false;
        this.players = [];
        this.players.push(this.player1);
        this.players.push(this.player2);
    }
    init() {
        const usernames = [this.player1.username, this.player2.username];
        this.io.to(this.player1.id).emit('usernames', usernames);
        this.io.to(this.player2.id).emit('usernames', usernames);
        this.io.to(this.player1.id).emit('config', config);
        this.io.to(this.player2.id).emit('config', config);
    }
    update() {
        const status = {};
        const ids = [];
        let start_player = this.player1;
        if (this.curr_state === "ST_RIGHTBALL") {
            start_player = this.player2;
        }
        this.players.forEach(player => {
            if (player.keypress[UP] && player.to_trans.y >= 0) {
                player.to_trans.y -= 7;
            }
            if (player.keypress[DOWN] && player_height + player.to_trans.y < config.screen_height) {
                player.to_trans.y += 7;
            }
            if (start_player.keypress[SPACE] && this.curr_state != "ST_ONGAME"
                && this.curr_state != "ST_GAMEOVER"
                && (this.curr_state == "ST_LEFTBALL" || this.curr_state == "ST_RIGHTBALL"
                    || this.curr_state == "ST_IDLE")) {
                this.ball.vel_x = this.ball.speed;
                this.curr_state = "ST_ONGAME";
            }
            ids.push(player.id);
            status[player.id] = player.to_trans;
        });
        if ((this.player1.points == config.end_point
            || this.player2.points == config.end_point)
            && this.curr_state != "ST_GAMEOVER"
            && this.game_done == false) {
            const winner = this.curr_state === "ST_RIGHTBALL" ? this.player1.username : this.player2.username;
            const winning_text = winner + ' Won!';
            this.curr_state = "ST_GAMEOVER";
            this.io.to(this.player1.id).emit('game_over', winning_text);
            this.io.to(this.player2.id).emit('game_over', winning_text);
            this.game_done = true;
        }
        if (this.game_done == false) {
            this.curr_state = this.ball.update(this.player1, this.player2, this.curr_state, this.io);
            this.io.to(this.player1.id).emit('update', ids, status, this.ball.to_trans);
            this.io.to(this.player2.id).emit('update', ids, status, this.ball.to_trans);
        }
    }
    disconnect(id) {
        this.curr_state = "ST_DISCONNECTED";
        const disconnected_user = (id === this.player1.id) ? this.player1.username : this.player2.username;
        const connected_id = (id === this.player1.id) ? this.player2.id : this.player1.id;
        const msg = disconnected_user + " has left the game";
        this.io.to(connected_id).emit('game_over', msg);
        console.log(msg);
    }
    print_room() {
        console.log("----------------------------------");
        console.log("Room ID: " + this.id);
        console.log("player 1: " + this.player1.username + "(" + this.player1.id + ")");
        console.log("player 2: " + this.player2.username + "(" + this.player2.id + ")");
        console.log("----------------------------------");
    }
}
exports.default = Room;
//# sourceMappingURL=room.js.map