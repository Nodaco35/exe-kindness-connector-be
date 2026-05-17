import { MessageType } from '../../../common/enums/type.enum';

export class CreateMessageDto {
  conversationId!: string;
  senderId!: string;
  content!: string;
  type!: MessageType;
  sentAt?: Date;
  isDeleted?: boolean;
}
