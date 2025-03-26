import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) // Allows cross-origin requests
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private users = new Map<string, string>(); // Store connected users

  afterInit(server: Server) {
    console.log('WebSocket Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.users.delete(client.id);
    this.server.emit('userList', Array.from(this.users.values()));
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { sender: string; message: string }) {
    console.log(`Received message: ${data.message} from ${data.sender}`);
    this.server.emit('message', data); // Broadcast to all clients
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, @MessageBody() username: string) {
    if (!username) {
      client.emit('error', 'Username is required');
      return;
    }
    // this.users.set(client.id, username);
    console.log(`User joined: ${username}`);
    // Broadcast updated user list
    this.server.emit('userList', Array.from(this.users.values()));
  }
}
