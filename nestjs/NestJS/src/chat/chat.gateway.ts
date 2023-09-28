import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { clientInfo } from '../entities/clientInfo.entity'
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  private connectedClients: clientInfo[] = [];

  handleConnection(client: Socket) {
    // This method runs when a client connects to the WebSocket server.
    console.log(`Client connected: ${client.id}`);
    this.connectedClients.push({client, user: 'undefined'});
  }

  handleDisconnect(client: Socket) {
    // This method runs when a client disconnects from the WebSocket server.
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients = this.connectedClients.filter(cli => cli.client.id !== client.id);
  }

  @SubscribeMessage('chat')
  handleChatMessage(client: Socket, message: string): void {
    // This method runs when a client sends a 'chat' message.
    // Broadcast the message to all connected clients.
    console.log(this.chatService.getHello(message) + " ----");
    console.log("Chat: " + client.id + ": " + message);
    this.server.emit('chat', { message, sender: client.id });
  }

  // !we should get that one: payload: { message: string, targetClientId: string }
  @SubscribeMessage('priv')
  handleSpecialMessage(client: Socket, message: string ): void {
    // !this is for a while
    const targetClient = this.connectedClients[0].client;
    console.log("<priv>" + targetClient.id + ": " + message);

    targetClient.emit('priv', { message, sender: client.id });
  }
}
