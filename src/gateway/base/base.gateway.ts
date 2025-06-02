import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Notification } from 'src/api/notifications/entities/notification.entity';
import { WS_EVENT_NAME } from 'src/constants';
import { OAthService } from 'src/services';

@WebSocketGateway({ cors: { origin: '*' } })
export class BaseGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly oauthService: OAthService) {}

  @WebSocketServer() server: Server;

  async onAuth(token?: string) {
    if (!token) return;
    const user = await this.oauthService.onUserToken(token);
    return user;
  }

  afterInit() {
    console.log('WebSocket Initialized');
    return;
  }

  async handleConnection(client: Socket) {
    const user = await this.onAuth(client.handshake.headers.authorization);
    if (!user) return client.disconnect();
    if (user.roles.length > 0) {
      const roomOrg = `${WS_EVENT_NAME.notification_org}`;
      console.log(`Client join org: ${roomOrg}`);
      client.join(roomOrg);
    }
    const roomUser = `${WS_EVENT_NAME.notification}.${user.id}`;
    console.log(`Client join user: ${roomUser}`);
    client.join(roomUser);
    return;
  }

  async handleDisconnect(client: Socket) {
    const user = await this.onAuth(client.handshake.headers.authorization);
    console.log(`Client disconnect: ${client.id}, ${user.id}`);
    return;
  }

  sendNotificationOrg(notification: Notification) {
    const room = `${WS_EVENT_NAME.notification_org}`;
    return this.server.to(room).emit(room, notification);
  }

  sendNotificationUser(notification: Notification) {
    const room = `${WS_EVENT_NAME.notification}.${notification.recipient.id}`;
    return this.server.to(room).emit(room, notification);
  }
}
