import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('register')
  handleRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: string },
  ) {
    if (!payload.userId) return;
    const roomName = `user_${payload.userId}`;
    client.join(roomName);
    console.log(`[NotificationGateway] Socket ${client.id} joined personal room: ${roomName}`);
  }

  @SubscribeMessage('test_send_notification')
  handleTestSendNotification(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { targetUserId: string },
  ) {
    const data = {
      id: Date.now().toString(),
      type: 'BOOK_REQUEST',
      title: 'Thông báo Test',
      message: `Đây là thông báo test được kích hoạt bằng hệ thống!`,
      createdAt: Date.now(),
      isRead: false,
    };
    // Emit to the target user's personal room
    this.server.to(`user_${payload.targetUserId}`).emit('new_notification', data);
    console.log(`[NotificationGateway] Sent test notification to user_${payload.targetUserId}`);
  }

  // Phương thức này cho phép các Service khác gọi vào để gửi thông báo thật
  sendNotificationToUser(userId: string, type: string, title: string, message: string) {
    const data = {
      id: Date.now().toString(),
      type,
      title,
      message,
      createdAt: Date.now(),
      isRead: false,
    };
    this.server.to(`user_${userId}`).emit('new_notification', data);
  }
}
