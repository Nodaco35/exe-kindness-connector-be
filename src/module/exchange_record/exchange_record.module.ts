import { Module } from '@nestjs/common';
import { ExchangeRecordService } from './exchange_record.service';
import { ExchangeRecordController } from './exchange_record.controller';

@Module({
  controllers: [ExchangeRecordController],
  providers: [ExchangeRecordService],
})
export class ExchangeRecordModule {}
