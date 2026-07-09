import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification, NotificationSchema } from './entities/notification.entity';

import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    MailModule,
    UserModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationGateway, NotificationService],
})
export class NotificationModule {}
