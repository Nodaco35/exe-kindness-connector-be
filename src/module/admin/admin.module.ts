import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/entities/user.entity';
import { Book, BookSchema } from '../book/entities/book.entity';
import { Membership, MembershipSchema } from '../membership/entities/membership.entity';
import { Exchange, ExchangeSchema } from '../exchange/entities/exchange.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Book.name, schema: BookSchema },
      { name: Membership.name, schema: MembershipSchema },
      { name: Exchange.name, schema: ExchangeSchema },
    ]),
    MailModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
