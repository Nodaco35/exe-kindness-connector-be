import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from 'src/common/enums/role.enum';
import { Status_ACTIVE_LOCKED } from 'src/common/enums/status.enum';
import { Address, AddressSchema } from '../../../common/schemas/address.schema';


@Schema({
    timestamps: true
})
export class User {
  @Prop()
  email!: string;

  @Prop()
  password!: string;

  @Prop()
  fullName!: string;

  @Prop()
  role!: UserRole;

  @Prop()
  status!: Status_ACTIVE_LOCKED;

  @Prop()
  avatar!: string;

  @Prop({
    type: [AddressSchema]
  })
  address!: Address[]
  

}

export const UserSchema = SchemaFactory.createForClass(User);