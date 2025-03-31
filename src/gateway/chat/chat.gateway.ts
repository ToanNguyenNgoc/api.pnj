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
import { CACHE_KEY_NAME, WS_EVENT_NAME } from 'src/constants';
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
    //Join all topic
    const ids = await this.topicService.findAllTopicUser(user);
    ids.forEach((id) => {
      console.log(`Join_all topic_id: ${id}`);
      client.join(String(id));
    });
    //Emit new topic joined from other user
    client.join(`recipient_user.${user.id}`);
    console.log(`Client connected: ${client.id}`);
    console.log(`Join recipient_user.${user.id}`);
  }

  async handleDisconnect(client: Socket) {
    const user = await this.onAuth(client.handshake.headers.authorization);
    if (user) {
      await this.removeUserOnline(user);
    }
    console.log(`Client disconnect: ${client.id}`);
    return;
  }
  @SubscribeMessage(WS_EVENT_NAME.create_topic)
  async handleCreateTopic(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    body: {
      topic_id: number;
      recipient_id: number;
      group_name: string;
      msg: string;
      media_id: number;
    },
  ) {
    if (!body.msg && !body.media_id) return;
    const user = await this.onAuth(client.handshake.headers.authorization);
    if (!user) return;
    const userRecipient = await this.oathService.onUser(body.recipient_id);
    const newTopic = await this.messageService.createMessageWithoutTopic(
      user,
      userRecipient,
      body,
    );
    this.server
      .to(`recipient_user.${user.id}`)
      .emit(WS_EVENT_NAME.receive_topic, jsonResponse(newTopic));
    this.server
      .to(`recipient_user.${userRecipient.id}`)
      .emit(WS_EVENT_NAME.receive_topic, jsonResponse(newTopic));
    return;
  }

  @SubscribeMessage(WS_EVENT_NAME.join_all)
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
    } catch (error) {}
  }

  @SubscribeMessage(WS_EVENT_NAME.join)
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

  @SubscribeMessage(WS_EVENT_NAME.message)
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: CreateMessageDto,
  ) {
    try {
      const user = await this.onAuth(client.handshake.headers.authorization);
      if (!user) return;
      const message = await this.messageService.create(user, body);
      this.server
        .to(String(body.topic_id))
        .emit(WS_EVENT_NAME.message, message);
      this.server
        .to(String(body.topic_id))
        .emit(WS_EVENT_NAME.typing, jsonResponse({ user, is_typing: false }));
    } catch (error) {}
    return;
  }

  @SubscribeMessage(WS_EVENT_NAME.typing)
  async handleType(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { is_typing: boolean; topic_id: number },
  ) {
    const user = await this.onAuth(client.handshake.headers.authorization);
    if (!user) return;
    this.server
      .to(String(body.topic_id))
      .emit(WS_EVENT_NAME.typing, jsonResponse({ user, ...body }));
  }
  //
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
