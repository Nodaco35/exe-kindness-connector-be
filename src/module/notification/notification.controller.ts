import { Controller, Get, Patch, Post, Param, UseGuards, Req, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway
  ) {}

  @Get('unread')
  getUnread(@Req() req: any) {
    return this.notificationService.getUnreadForUser(req.user.userId);
  }

  @Patch('read-all')
  markAllAsRead(@Req() req: any) {
    return this.notificationService.markAllAsRead(req.user.userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Req() req: any) {
    return this.notificationService.markAsRead(id, req.user.userId);
  }
}
