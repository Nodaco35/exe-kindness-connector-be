import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MessageType } from '../../../common/enums/type.enum';

@Schema({ timestamps: false })
export class Message {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
  })
  conversationId!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  senderId!: mongoose.Types.ObjectId;

  @Prop({ required: true })
  content!: string;

  @Prop({ type: String, enum: MessageType, required: true })
  type!: MessageType;

  @Prop({ required: true })
  sentAt!: Date;

  @Prop({ default: false })
  isDeleted!: boolean;
}
export const MessageSchema = SchemaFactory.createForClass(Message);
