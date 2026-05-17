import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export enum MembershipRecordAction {
  CREATED = 'CREATED',
  RENEWED = 'RENEWED',
  CANCELED = 'CANCELED',
}

@Schema({
  timestamps: true,
})
export class MembershipRecord {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership',
  })
  membershipId!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId!: mongoose.Types.ObjectId;

  @Prop({ type: String, enum: MembershipRecordAction, required: true })
  action!: MembershipRecordAction;
}
export const MembershipRecordSchema =
  SchemaFactory.createForClass(MembershipRecord);
