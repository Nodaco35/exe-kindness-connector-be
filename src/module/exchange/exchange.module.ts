import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

import { MongooseModule } from '@nestjs/mongoose';
import { Exchange, ExchangeSchema } from './entities/exchange.entity';
import { ChatModule } from '../chat/chat.module';
import { User, UserSchema } from '../user/entities/user.entity';
import { NotificationModule } from '../notification/notification.module';
import { Book, BookSchema } from '../book/entities/book.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exchange.name, schema: ExchangeSchema },
      { name: User.name, schema: UserSchema },
      { name: Book.name, schema: BookSchema }
    ]),
    ChatModule,
    NotificationModule,
  ],
  controllers: [ExchangeController],
  providers: [ExchangeService],
})
export class ExchangeModule {}
