export default class Player {
    to_trans: {
        x: number;
        y: number;
    };
    points: number;
    username: string;
    id: string;
    keypress: boolean[];
    keyonce: boolean[];
    width: number;
    height: number;
    constructor(info: {
        id: string;
        username: string;
    }, xpos?: number, ypos?: number);
}
