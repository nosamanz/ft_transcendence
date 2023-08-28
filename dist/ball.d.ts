export default class Ball {
    to_trans: {
        x: number;
        y: number;
    };
    speed: number;
    vel_x: number;
    vel_y: number;
    side: number;
    constructor(xpos: number, ypos: number);
    update(left_player: any, right_player: any, curr_state: string, io: any): string;
}
