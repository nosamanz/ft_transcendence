import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from 'src/game/game.service';

export let queue: Socket[] = [];
export let connectedGameSockets: Socket[] = [];
let nextRoomID: number = 1;

@WebSocketGateway()
export class GameGateway {
	constructor( private gameService: GameService){}
	@WebSocketServer()
	server: Server;


	handleConnection(client: Socket){
	console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket): void {
		console.log(`Client disconnected: ${client.id}`);
		queue = queue.filter(cli => cli.id !== client.id);
		connectedGameSockets = connectedGameSockets.filter(cli => cli.id !== client.id);
		this.gameService.leaveRoom(this.server, client);
	}

	@SubscribeMessage('joinChannel')
	handleJoinChannel(client: Socket) {
		if (!queue.includes(client)) {
			queue.push(client);
			connectedGameSockets.push(client);
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