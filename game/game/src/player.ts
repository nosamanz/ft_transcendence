export default class Player {
    to_trans: { x: number; y: number };
    points: number;
    username: string;
    id: string;
    keypress: boolean[];
    keyonce: boolean[];
    width: number;
    height: number;

    constructor(info: { id: string; username: string }, xpos: number = 0, ypos: number = 0) {
        this.to_trans = { x: xpos, y: ypos };
        this.points = 0;

        this.username = info.username;
        this.id = info.id;
        this.keypress = [];
        this.keyonce = [];

        // HARD-CODED
        this.width = 20;
        this.height = 100;
    }
}
