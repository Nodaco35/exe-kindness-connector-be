import { UserRole } from '../../../common/enums/role.enum';
import { Status_ACTIVE_LOCKED } from '../../../common/enums/status.enum';
import { Address } from '../../../common/schemas/address.schema';

export class CreateUserDto {
  fullName!: string;
  email!: string;
  password!: string;
  role?: UserRole = UserRole.USER;
  status?: Status_ACTIVE_LOCKED = Status_ACTIVE_LOCKED.ACTIVE;
  avatar?: string;
  phone?: string;
  address?: Address[];
}
