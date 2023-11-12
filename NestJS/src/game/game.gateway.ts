import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { clientInfo } from 'src/chat/entities/clientInfo.entity';
import { GameService } from 'src/game/game.service';

export let queue: Socket[] = [];
export let connectedGameSockets: clientInfo[] = [];
let nextRoomID: number = 1;

@WebSocketGateway()
export class GameGateway {
	constructor( private gameService: GameService){}
	@WebSocketServer()
	server: Server;

	handleDisconnect(client: Socket): void {
		this.gameService.leaveRoom(this.server, client);
		queue = queue.filter(cli => cli.id !== client.id);
		connectedGameSockets = connectedGameSockets.filter(cli => cli.client.id !== client.id);
	}

	@SubscribeMessage('joinChannel')
	handleJoinChannel(client: Socket, data: {id: number}) {
		if (!queue.includes(client)) {
			queue.push(client);
			connectedGameSockets.push({id: data.id, client: client});
			console.log(`Client ${client.id} joined the queue.`);
		}

		if (queue.length >= 2) {
			const player1 = queue.shift();
			const player2 = queue.shift();

			if (player1 && player2) {
				this.gameService.createRoom(this.server, nextRoomID.toString(), player1, player2)
				nextRoomID++;
			}
		} else {
			console.log('Waiting for more players to join.');
		}
	}

	@SubscribeMessage('movePaddle')
	handleMovePaddle(client: Socket, obj: {rivalID: string, direction: string, location: string, roomID: string}) {
		this.gameService.movePaddle(this.server, client.id, obj)
	}
}