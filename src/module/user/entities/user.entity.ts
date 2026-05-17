import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../../../common/enums/role.enum';
import { Status_ACTIVE_LOCKED } from '../../../common/enums/status.enum';
import { Address, AddressSchema } from '../../../common/schemas/address.schema';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true, trim: true })
  fullName!: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Prop({
    type: String,
    enum: Status_ACTIVE_LOCKED,
    default: Status_ACTIVE_LOCKED.ACTIVE,
  })
  status!: Status_ACTIVE_LOCKED;

  @Prop()
  avatar?: string;

  @Prop()
  phone?: string;

  @Prop({
    type: [AddressSchema],
    default: [],
  })
  address!: Address[];
}

export const UserSchema = SchemaFactory.createForClass(User);
