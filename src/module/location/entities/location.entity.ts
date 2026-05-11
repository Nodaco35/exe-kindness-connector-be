import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { LocationType } from 'src/common/enums/location-type.enum';

@Schema({
  timestamps: true,
})
export class Location {
  @Prop()
  name!: string;

  @Prop()
  type!: LocationType;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  })
  parent!: mongoose.Types.ObjectId;
}
