import { Module } from '@nestjs/common';
import { BookViolationRecordService } from './book_violation_record.service';
import { BookViolationRecordController } from './book_violation_record.controller';

@Module({
  controllers: [BookViolationRecordController],
  providers: [BookViolationRecordService],
})
export class BookViolationRecordModule {}
