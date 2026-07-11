import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book, BookSchema } from './entities/book.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { Location, LocationSchema } from '../location/entities/location.entity';
import { Exchange, ExchangeSchema } from '../exchange/entities/exchange.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Book.name,
        schema: BookSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Location.name,
        schema: LocationSchema,
      },
      {
        name: Exchange.name,
        schema: ExchangeSchema,
      },
    ]),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
