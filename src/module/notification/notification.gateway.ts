import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server!: Server;

  constructor(
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService
  ) {}

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
  async sendNotificationToUser(userId: string, type: string, title: string, message: string) {
    // 1. Lưu vào Database trước để chống thất lạc
    const notification = await this.notificationService.createNotification(userId, type, title, message);

    // 2. Định dạng dữ liệu và bắn qua Socket
    const data = {
      id: notification._id.toString(),
      type,
      title,
      message,
      createdAt: (notification as any).createdAt,
      isRead: false,
    };
    this.server.to(`user_${userId}`).emit('new_notification', data);
    console.log(`[NotificationGateway] Emitted new_notification to user_${userId}`, title);
  }
}
