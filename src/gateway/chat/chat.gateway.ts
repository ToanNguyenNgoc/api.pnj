/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TopicsService } from 'src/api/topics/topics.service';
import { OAthService } from 'src/services';

@WebSocketGateway({ cors: { origin: '*' } }) // Allows cross-origin requests
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private users = new Map<string, string>(); // Store connected users
  constructor(
    private readonly topicService: TopicsService,
    private readonly oathService: OAthService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket Initialized');
  }

  async handleConnection(client: Socket) {
    const user = await this.oathService.onUserToken(
      client.handshake.headers.authorization,
    );
    if (!user) return client.disconnect();
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    return;
  }

  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: any,
  ) {
    try {
      const user = await this.oathService.onUserToken(
        client.handshake.headers.authorization,
      );
      if (!user) return;
      await this.topicService.onTopicUser(user.id, body.topicId);
      console.log(`Join to room: ${body.topicId}`);
      client.join(body.topicId);
    } catch (error) {}
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: any,
  ) {
    try {
      const user = await this.oathService.onUserToken(
        client.handshake.headers.authorization,
      );
      if (!user) return;
      console.log(`Send message: ${JSON.stringify(body)}`);
      this.server.to(body.topicId).emit('message', { message: body.message });
    } catch (error) {}
    return;
  }
}
