"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = require("./room");
class RoomManager {
    constructor(io) {
        this.rooms = {};
        this.num_rooms = 0;
        this.io = io;
    }
    create_room(p1, p2) {
        const to_add = new room_1.default(p1, p2, this.io);
        to_add.init();
        console.log('Room Created!');
        this.rooms[to_add.id] = to_add;
        this.rooms[to_add.id].print_room();
        this.num_rooms++;
    }
    destroy(room) {
        this.num_rooms--;
        delete this.rooms[room.id];
    }
    update() {
        for (const id in this.rooms) {
            this.rooms[id].update();
        }
    }
    find_room(to_find) {
        let room;
        for (const id in this.rooms) {
            if (id.includes(to_find)) {
                room = this.rooms[id];
                return room;
            }
        }
        return room;
    }
    find_user(to_find) {
        let user;
        for (const id in this.rooms) {
            if (id.includes(to_find)) {
                const room = this.rooms[id];
                user = room.player1.id === to_find ? room.player1 : room.player2;
                return user;
            }
        }
        return user;
    }
    print_all_rooms() {
        for (const id in this.rooms) {
            this.rooms[id].print_room();
        }
        console.log("num rooms: " + this.num_rooms);
    }
}
exports.default = RoomManager;
//# sourceMappingURL=room_manager.js.map