//anasini siktigim importlari calismiyor

import * as io from 'socket.io-client';
import * as $ from 'jquery';

const socket = io('/game');
let width = 0, height = 0, player_width = 0, player_height: number;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;
let ball: any;
let message = "";
let score1 = 0, score2 = 0;
let username: string[] = [];

let space_down = false;

$('body').on('keydown', (e) => {
    socket.emit('keydown', e.keyCode);
    console.log(e.keyCode);
    if (e.keyCode == 32) {
        let space = 0;
        if (space_down == false) {
            space = 1;
            space_down = true;
        } else {
            space = 0;
        }
        socket.emit('space_event', space);
    }
});

$('body').on('keyup', (e) => {
    socket.emit('keyup', e.keyCode);
    if (e.keyCode == 32) {
        space_down = false;
    }
});

class player {
    x: number;
    y: number;
    width: number;
    height: number;
    username: string;

    constructor(xpos = 0, ypos = 0) {
        this.x = xpos;
        this.y = ypos;
        this.width = 0;
        this.height = 0;
        this.username = "";
    }

    init() {
    }

    update() {
        this.width = player_width;
        this.height = player_height;
    }

    draw() {
        ctx.fillRect(this.x, this.y, this.width, this.height);//playeri ciziyorum
    }
}

ball = {
    x: null,
    y: null,
    vel: null,
    side: 0,
    speed: 8,
    update: function () {
    },

    draw: function () {
        ctx.fillRect(this.x, this.y, this.side, this.side);//topu ciziyorum
    }
};

let players: player[] = [];

function init() {
    ball.side = player_width;
    ball.x = (width - ball.side) / 2;
    ball.y = (height - ball.side) / 2;
    console.log(player_width);
    ball.vel = {
        x: ball.speed,
        y: 0
    };
}

function update() {
    ball.update();
    for (const p in players) {
        players[p].update();
    }
}

function draw() {
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.fillStyle = "#fff";

    for (const p in players) {
        players[p].draw();
    }

    ball.draw();

    var mid_width = 4;
    var x = (width - mid_width) * 0.5;
    var y = 0;
    var step = height / 20;

    while (y < height) {
        ctx.fillRect(x, y + step * 0.25, mid_width, step * 0.5);
        y += step;
    }
    ctx.font = "30px Arial";
    ctx.fillText(message, 0, height - 50);

    ctx.font = "50px Arial";
    ctx.fillText(score1.toString(), width / 4, height / 5);
    ctx.fillText(score2.toString(), 3 * width / 4, height / 5);

    ctx.font = "30px Arial";
    ctx.fillText(username[0], width / 4, height / 8);
    ctx.fillText(username[1], 3 * width / 4, height / 8);

    ctx.restore();
}

function main() {
    console.log("selam!!\n");
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    console.log("selam1!!\n");
    var loop = function () {
        console.log("selam2!!\n");
        canvas.width = width;
        canvas.height = height;
        update();
        draw();
        window.requestAnimationFrame(loop);
    };
    console.log("selam4!!\n");
    window.requestAnimationFrame(loop);
}

main();

socket.on('config', (config) => {
    width = config.screen_width;
    height = config.screen_height;
    player_width = config.player_width;
    player_height = config.player_height;
    init();
});

socket.on('usernames', (usernames) => {
    username.push(usernames[0]);
    username.push(usernames[1]);
});

socket.on('game_over', (msg) => {
    message = msg;
    let leave_button = document.createElement("button");
    leave_button.innerHTML = "Go Back To Menu";
    let body = document.getElementsByTagName("body")[0];
    body.appendChild(leave_button);
    leave_button.addEventListener("click", function () {
        window.location.href = '/';
    });
});

socket.on('score', (score_user) => {
    console.log(score_user);
    if (score_user == "ST_RIGHTBALL") {
        score1 += 1;
    } else if (score_user == "ST_LEFTBALL") {
        score2 += 1;
    }
});

socket.on('update', (ids, player_status, ball_status) => {
    console.log('update');
    const newPlayers: player[] = [];
    for (const id of ids) {
        if (players[id] == null || players[id] == undefined) {
            newPlayers[id] = new player(player_status[id].x, player_status[id].y);
        } else {
            players[id].x = player_status[id].x;
            players[id].y = player_status[id].y;
            newPlayers[id] = players[id];
        }
    }
    players = newPlayers;
    ball.x = ball_status.x;
    ball.y = ball_status.y;
});

