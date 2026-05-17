import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Message_Status } from '../../../common/enums/status.enum';

@Schema({
  timestamps: {
    updatedAt: true,
    createdAt: false,
  },
})
export class MessageStatus {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  })
  messageId!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId!: mongoose.Types.ObjectId;

  @Prop({ type: String, enum: Message_Status, required: true })
  status!: Message_Status;
}
export const MessageStatusSchema = SchemaFactory.createForClass(MessageStatus);
