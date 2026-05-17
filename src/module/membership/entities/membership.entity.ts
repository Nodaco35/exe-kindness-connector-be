import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Membership_Status } from '../../../common/enums/status.enum';

export enum PaymentMethod {
  CASH = 'CASH',
  ONLINE = 'ONLINE',
}

@Schema({ _id: false })
export class Payment {
  @Prop({ type: String, enum: PaymentMethod, required: true })
  method!: PaymentMethod;

  @Prop()
  transactionId?: string;

  @Prop()
  amount?: number;

  @Prop()
  paidAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

@Schema({
  timestamps: true,
})
export class Membership {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId!: mongoose.Types.ObjectId;

  @Prop({ required: true })
  startDate!: Date;

  @Prop({ required: true })
  endDate!: Date;

  @Prop({ type: String, enum: Membership_Status, required: true })
  status!: Membership_Status;

  @Prop({ type: PaymentSchema, required: false })
  payment?: Payment;
}
export const MembershipSchema = SchemaFactory.createForClass(Membership);
