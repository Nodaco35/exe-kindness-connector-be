import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) {}

  async createNotification(userId: string, type: string, title: string, message: string, url?: string) {
    return this.notificationModel.create({
      userId,
      type,
      title,
      message,
      url,
    });
  }

  async getUnreadForUser(userId: string) {
    return this.notificationModel.find({ userId, isRead: false }).sort({ createdAt: -1 });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.notificationModel.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
  }
}
