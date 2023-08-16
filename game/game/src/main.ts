import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Lobby from './game/lobby';
import RoomManager from './game/room_manager';

const app = express();
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer);
const lobby = new Lobby();
const roomManager = new RoomManager(io.of('/game'));

app.use(express.static('/images'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/menu.html');
});

let username = "default";
let room_code = "";

app.get('/public/:username/', (req, res) => {
  res.sendFile(__dirname + '/game.html');
  username = req.params.username;
  room_code = "public";
});

let room_codes: { [key: string]: number } = {};

app.get('/private/:room_code/:username', (req, res) => {
  res.sendFile(__dirname + '/game.html');
  username = req.params.username;
  room_code = req.params.room_code;
});

let mode = "public";

const menu_io = io.of('/menu');
menu_io.on('connection', async (socket) => {
  console.log(socket.id + " joined menu");

  let validate = 0;
  let message = "";

  let login = new Promise<string>((resolve, reject) => {
    socket.on('join_public', (username: string) => {
      message = "public";
      validate = 1;
      socket.emit('public_validation', validate, message);
    });

    socket.on('create_private', (username: string, room_code: string) => {
      if (room_codes[room_code] >= 1) {
        message = room_code + " already exists!";
        reject(message);
      } else {
        room_codes[room_code] = 1;
        validate = 1;
      }
      socket.emit('create_validation', validate, message);
    });

    socket.on('join_private', (username: string, room_code: string) => {
      if (room_codes[room_code] == null) {
        message = room_code + " does not exist!";
        reject(message);
      } else if (room_codes[room_code] == 1) {
        room_codes[room_code]++;
        validate = 1;
      } else if (room_codes[room_code] > 1) {
        message = "Room is full!";
        reject(message);
      }
      socket.emit('join_validation', validate, message);
    });

    resolve(message);
  });

  mode = await login;
});

const game_io = io.of('/game');
game_io.on('connection', (socket) => {
  console.log(socket.id + " joined game");

  // ... Diğer oyun işlemleri ...

  socket.on('disconnect', () => {
    // ... Kullanıcı ayrılma işlemleri ...
  });

  // ... Diğer oyun işlemleri ...
});

const update = setInterval(() => {
  // ... Oyun durumu güncelleme ...
}, 30);

const port = 3000;
httpServer.listen(port, () => {
  console.log("listening on port " + port);
});
