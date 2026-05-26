import { Exchange_Status } from '../../../common/enums/status.enum';

export class CreateExchangeRequestDto {
    bookId!: string;
    requesterId!: string;
    ownerId!: string;
    message!: string;
    status?: Exchange_Status = Exchange_Status.PENDING;
    respondedAt?: Date;
    completedAt?: Date;
}
