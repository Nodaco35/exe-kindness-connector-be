import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExchangeRequestService } from './exchange_request.service';
import { ExchangeRequestController } from './exchange_request.controller';
import {
  ExchangeRequest,
  ExchangeRequestSchema,
} from './entities/exchange_request.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ExchangeRequest.name,
        schema: ExchangeRequestSchema,
      },
    ]),
  ],
  controllers: [ExchangeRequestController],
  providers: [ExchangeRequestService],
})
export class ExchangeRequestModule { }
