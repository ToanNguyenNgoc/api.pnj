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
import { CreateMessageDto } from 'src/api/messages/dto/create-message.dto';
import { MessagesService } from 'src/api/messages/messages.service';
import { TopicsService } from 'src/api/topics/topics.service';
import { User } from 'src/api/users/entities/user.entity';
import { jsonResponse } from 'src/commons';
import { CACHE_KEY_NAME } from 'src/constants';
import { CacheService, OAthService } from 'src/services';

@WebSocketGateway({ cors: { origin: '*' } }) // Allows cross-origin requests
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly cacheService: CacheService,
    private readonly topicService: TopicsService,
    private readonly oathService: OAthService,
    private readonly messageService: MessagesService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket Initialized');
  }
  async onAuth(token?: string) {
    if (!token) return;
    const user = await this.oathService.onUserToken(token);
    return user;
  }

  async handleConnection(client: Socket) {
    const user = await this.onAuth(client.handshake.headers.authorization);
    if (!user) return client.disconnect();
    await this.setUserOnline(user);
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    const user = await this.onAuth(client.handshake.headers.authorization);
    if (user) {
      await this.removeUserOnline(user);
    }
    console.log(`Client disconnect: ${client.id}`);
    return;
  }

  @SubscribeMessage('join_all')
  async handleJoinAll(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: any,
  ) {
    try {
      const user = await this.onAuth(client.handshake.headers.authorization);
      if (!user) return;
      const ids = await this.topicService.findAllTopicUser(user);
      ids.forEach((id) => {
        console.log(`Join_all topic_id: ${id}`);
        client.join(String(id));
      });
      console.log(await this.getUserOnline());
    } catch (error) {}
  }

  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: any,
  ) {
    try {
      const user = await this.onAuth(client.handshake.headers.authorization);
      if (!user) return;
      await this.topicService.onTopicUser(user.id, body.topic_id);
      client.join(String(body.topic_id));
    } catch (error) {}
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: CreateMessageDto,
  ) {
    try {
      const user = await this.onAuth(client.handshake.headers.authorization);
      if (!user) return;
      this.server
        .to(String(body.topic_id))
        .emit('message', jsonResponse({ ...body, user }));
      await this.messageService.create(user, body);
    } catch (error) {}
    return;
  }

  async getUserOnline() {
    const users =
      (await this.cacheService.getData<User[]>(CACHE_KEY_NAME.user_online)) ||
      [];
    return users;
  }
  async setUserOnline(user: User) {
    const users = await this.getUserOnline();
    const iIndex = users.findIndex((i) => i.id === user.id);
    if (iIndex < 0) {
      await this.cacheService.setData(CACHE_KEY_NAME.user_online, [
        ...users,
        user,
      ]);
    }
    return;
  }
  async removeUserOnline(user: User) {
    const users = await this.getUserOnline();
    await this.cacheService.setData(
      CACHE_KEY_NAME.user_online,
      users.filter((i) => i.id !== user.id),
    );
    return;
  }
}
