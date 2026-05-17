import { Membership_Status } from '../../../common/enums/status.enum';
import { PaymentMethod } from '../entities/membership.entity';

export class CreateMembershipDto {
  userId!: string;
  startDate!: Date;
  endDate!: Date;
  status!: Membership_Status;
  payment?: {
    method: PaymentMethod;
    transactionId?: string;
    amount?: number;
    paidAt?: Date;
  };
}
