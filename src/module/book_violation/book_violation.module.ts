import { Module } from '@nestjs/common';
import { BookViolationService } from './book_violation.service';
import { BookViolationController } from './book_violation.controller';

@Module({
  controllers: [BookViolationController],
  providers: [BookViolationService],
})
export class BookViolationModule {}
