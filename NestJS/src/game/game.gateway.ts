import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { clientInfo } from 'src/chat/entities/clientInfo.entity';
import { GameService } from 'src/game/game.service';
import { GameModeService } from 'src/game/game-mode.service';

export let connectedGameSockets: clientInfo[] = [];
let queue: Socket[] = [];
let modeQueue: Socket[] = [];
let nextRoomID: number = 1;

@WebSocketGateway()
export class GameGateway {
	constructor(
		private gameService: GameService,
		private gameModeService: GameModeService
		){}

	@WebSocketServer()
	server: Server;

	handleDisconnect(client: Socket): void {
		this.gameService.leaveRoom(this.server, client);
		this.gameModeService.leaveRoom(this.server, client);
		queue = queue.filter(cli => cli.id !== client.id);
		modeQueue = modeQueue.filter(cli => cli.id !== client.id);
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
				this.gameService.createRoom(this.server, nextRoomID.toString(), player1, player2);
				nextRoomID++;
			}
		} else {
			console.log('Waiting for more players to join.');
		}
	}

	@SubscribeMessage('stopInterval')
	handleStopInterval(client: Socket, roomID: string) {
		this.gameService.stopGame(roomID);
	}

	@SubscribeMessage('joinModeChannel')
	handleJoinModeChannel(client: Socket, data: {id: number}) {
		if (!modeQueue.includes(client)) {
			modeQueue.push(client);
			connectedGameSockets.push({id: data.id, client: client});
			console.log(`Client ${client.id} joined the Mode queue.`);
		}

		if (modeQueue.length >= 2) {
			const player1 = modeQueue.shift();
			const player2 = modeQueue.shift();

			if (player1 && player2) {
				this.gameModeService.createRoom(this.server, nextRoomID.toString(), player1, player2)
				nextRoomID++;
			}
		} else {
			console.log('Waiting for more players to join.');
		}
	}

	@SubscribeMessage('stopModeInterval')
	handleStopModeInterval(client: Socket, roomID: string) {
		this.gameService.stopGame(roomID);
	}

	@SubscribeMessage('movePaddle')
	handleMovePaddle(client: Socket, obj: {rivalID: string, direction: string, location: string, roomID: string}) {
		this.gameService.changePaddleSpeed(this.server, client.id, obj)
	}

	@SubscribeMessage('stopPaddle')
	handleStopPaddle(client: Socket, obj: {rivalID: string, direction: string, location: string, roomID: string}) {
		this.gameService.stopPaddle(this.server, client.id, obj)
	}

	@SubscribeMessage('moveModePaddle')
	handleMoveModePaddle(client: Socket, obj: {rivalID: string, direction: string, location: string, roomID: string}) {
		this.gameModeService.changePaddleSpeed(this.server, client.id, obj)
	}

	@SubscribeMessage('stopModePaddle')
	handleStopModePaddle(client: Socket, obj: {rivalID: string, direction: string, location: string, roomID: string}) {
		this.gameModeService.stopPaddle(this.server, client.id, obj)
	}
}
