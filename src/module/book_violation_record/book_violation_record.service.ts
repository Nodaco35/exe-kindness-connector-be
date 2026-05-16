import { Injectable } from '@nestjs/common';
import { CreateBookViolationRecordDto } from './dto/create-book_violation_record.dto';
import { UpdateBookViolationRecordDto } from './dto/update-book_violation_record.dto';

@Injectable()
export class BookViolationRecordService {
  create(createBookViolationRecordDto: CreateBookViolationRecordDto) {
    return 'This action adds a new bookViolationRecord';
  }

  findAll() {
    return `This action returns all bookViolationRecord`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookViolationRecord`;
  }

  update(
    id: number,
    updateBookViolationRecordDto: UpdateBookViolationRecordDto,
  ) {
    return `This action updates a #${id} bookViolationRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookViolationRecord`;
  }
}
