import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/realtime' })
export class AppGateway implements OnGatewayInit {
  @WebSocketServer() server!: Server;
  afterInit() { /* hooks */ }

  @SubscribeMessage('ping')
  handlePing(): string { return 'pong'; }
}
