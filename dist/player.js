"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(info, xpos = 0, ypos = 0) {
        this.to_trans = { x: xpos, y: ypos };
        this.points = 0;
        this.username = info.username;
        this.id = info.id;
        this.keypress = [];
        this.keyonce = [];
        this.width = 20;
        this.height = 100;
    }
}
exports.default = Player;
//# sourceMappingURL=player.js.map