import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { clientInfo } from '../entities/clientInfo.entity'
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
  // client.on("connection", (socket) => {
  //   console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  // });
	// This method runs when a client connects to the WebSocket server
  console.log(`Client connected: ${client.id}`);
  connectedClients.push({client, id: 0/* User id */});
  }

  handleDisconnect(client: Socket): void {
	// This method runs when a client disconnects from the WebSocket server.
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
  async handleChatMessage(client: Socket, data: any): Promise<void> {
	const userID = await this.chatService.getUserBySocket(client);
  const user = await this.userService.getUserByID(userID, true);
  console.log("989898");
  console.log(user);
	await this.chatService.subscribeToChannel(client, data.message, data.channelName, userID);
	await this.chatService.saveMessage(client, data.message, data.channelName);
	// This method runs when a client sends a 'chat' message.
	// Broadcast the message to all connected clients.
	console.log("Chat: " + client.id + ": " + data.message + "<" + data.channelName + ">");
	// this.server.emit('chat', { message: data.message, channelName: data.channelName, sender: client.id });
  }

  // // !we should get that one: payload: { message: string, targetClientId: string }
  // @SubscribeMessage('priv')
  // handleSpecialMessage(client: Socket, message: string ): void {
  //   // !this is for a while
  //   const targetClient = connectedClients[0].client;
  //   console.log("<priv>" + targetClient.id + ": " + message);

  //   targetClient.emit('priv', { message, sender: client.id });
  // }
}

// @WebSocketGateway()
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   constructor(private chatService: ChatService) {}

//   private connectedClients: clientInfo[] = [];

//   handleConnection(client: Socket) {
//     // This method runs when a client connects to the WebSocket server.
//     console.log(`Client connected: ${client.id}`);
//     this.connectedClients.push({client, user: 'undefined'});
//   }

//   handleDisconnect(client: Socket) {
//     // This method runs when a client disconnects from the WebSocket server.
//     console.log(`Client disconnected: ${client.id}`);
//     this.connectedClients = this.connectedClients.filter(cli => cli.client.id !== client.id);
//   }

//   @SubscribeMessage('chat')
//   handleChatMessage(client: Socket, message: string): void {
//     // This method runs when a client sends a 'chat' message.
//     // Broadcast the message to all connected clients.
//     console.log(this.chatService.getHello(message) + " ----");
//     console.log("Chat: " + client.id + ": " + message);
//     this.server.emit('chat', { message, sender: client.id });
//   }

//   // !we should get that one: payload: { message: string, targetClientId: string }
//   @SubscribeMessage('priv')
//   handleSpecialMessage(client: Socket, message: string ): void {
//     // !this is for a while
//     const targetClient = this.connectedClients[0].client;
//     console.log("<priv>" + targetClient.id + ": " + message);

//     targetClient.emit('priv', { message, sender: client.id });
//   }
// }
