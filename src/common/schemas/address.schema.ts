import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ _id: false })
export class Address {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  })
  cityId!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  })
  districtId!: mongoose.Types.ObjectId;

  @Prop()
  detail?: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
