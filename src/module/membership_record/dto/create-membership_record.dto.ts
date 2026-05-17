import { MembershipRecordAction } from '../entities/membership_record.entity';

export class CreateMembershipRecordDto {
  membershipId!: string;
  userId!: string;
  action!: MembershipRecordAction;
}
