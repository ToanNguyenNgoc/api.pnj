import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { BaseGateway } from '../base/base.gateway';
import { WS_EVENT_NAME } from 'src/constants';
import { Socket } from 'socket.io';
import { Message } from 'src/api/messages/entities/message.entity';
import { User } from 'src/api/users/entities/user.entity';

@WebSocketGateway()
export class MessageGateway extends BaseGateway {
  @SubscribeMessage(WS_EVENT_NAME.chat_topic)
  handleJoinTopic(
    @ConnectedSocket() client: Socket,
    @MessageBody() topic_id: number,
  ) {
    const room = `${WS_EVENT_NAME.chat_topic}.${topic_id}`;
    console.log(`Client join to topic: `, room);
    return client.join(room);
  }

  @SubscribeMessage(WS_EVENT_NAME.chat_topic_typing)
  handleTypingTopic(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { topicId: number; isTyping: boolean; user: User },
  ) {
    const room = `${WS_EVENT_NAME.chat_topic}.${body.topicId}`;
    return this.server.to(room).emit(room, body);
  }

  @SubscribeMessage(WS_EVENT_NAME.leave_topic)
  handleLeaveTopic(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    console.log(`Client leave topic: `, room);
    return client.leave(room);
  }

  async sendMessageToTopic(message: Message) {
    const room = `${WS_EVENT_NAME.chat_topic}.${message.topic.id}`;
    return this.server.to(room).emit(room, message);
  }
}
