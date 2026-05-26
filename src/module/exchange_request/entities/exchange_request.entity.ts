import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Exchange_Status } from '../../../common/enums/status.enum';

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class ExchangeRequest {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  })
  bookId!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  requesterId!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  ownerId!: mongoose.Types.ObjectId;

  @Prop({ required: true })
  message!: string;

  @Prop({ type: String, enum: Exchange_Status, default: Exchange_Status.PENDING })
  status!: Exchange_Status;

  @Prop()
  respondedAt?: Date;

  @Prop()
  completedAt?: Date;
}
export const ExchangeRequestSchema =
  SchemaFactory.createForClass(ExchangeRequest);
