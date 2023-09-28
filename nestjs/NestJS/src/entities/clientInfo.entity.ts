import { type } from "os";
import { Socket } from 'socket.io';

export type clientInfo = {
  client: Socket,
  user: string
}
