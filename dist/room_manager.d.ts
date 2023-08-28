import Room from './room';
export default class RoomManager {
    rooms: {
        [id: string]: Room;
    };
    num_rooms: number;
    io: any;
    constructor(io: any);
    create_room(p1: any, p2: any): void;
    destroy(room: Room): void;
    update(): void;
    find_room(to_find: string): Room;
    find_user(to_find: string): any;
    print_all_rooms(): void;
}
