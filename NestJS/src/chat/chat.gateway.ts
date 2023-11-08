import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { clientInfo } from './entities/clientInfo.entity'
import { ChatService } from './chat.service';

export let connectedClients: clientInfo[] = [];

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	constructor(
		private chatService: ChatService,
		private userService: UserService
	) {}

	handleConnection(client: Socket){
		console.log(`Client connected: ${client.id}`);
		connectedClients.push({client, id: 0});
	}

	handleDisconnect(client: Socket): void {
		console.log(`Client disconnected: ${client.id}`);
		const departedClient = connectedClients.find((clientInfo) => clientInfo.client === client);
		if(!departedClient)
		{
			console.log("Departed Client couldn't be found in the list!");
			return;
		}
		console.log("The user " + departedClient.id + " has been left!")
		connectedClients = connectedClients.filter(cli => cli.client.id !== client.id);
	}

	@SubscribeMessage('chat')
		//data ={message: string, channelName: string}
		async handleChatMessage(client: Socket, data: any): Promise<void> {
		const userID = await this.chatService.getUserBySocket(client);
		const user = await this.userService.getUserByID(userID);
		await this.chatService.subscribeToChannel({...data, senderID: userID, senderNick: user.nick});
		await this.chatService.saveMessage({...data, senderID: userID, senderNick: user.nick});
		console.log("Chat: " + client.id + ": " + data.message + "<" + data.channelName + ">");
	}
}
