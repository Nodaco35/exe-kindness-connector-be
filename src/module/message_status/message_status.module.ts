import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageStatusService } from './message_status.service';
import { MessageStatusController } from './message_status.controller';
import {
  MessageStatus,
  MessageStatusSchema,
} from './entities/message_status.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MessageStatus.name,
        schema: MessageStatusSchema,
      },
    ]),
  ],
  controllers: [MessageStatusController],
  providers: [MessageStatusService],
})
export class MessageStatusModule {}
