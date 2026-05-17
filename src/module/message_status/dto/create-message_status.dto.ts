import { Message_Status } from '../../../common/enums/status.enum';

export class CreateMessageStatusDto {
  messageId!: string;
  userId!: string;
  status!: Message_Status;
}
