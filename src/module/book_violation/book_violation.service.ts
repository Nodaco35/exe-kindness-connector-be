import { Injectable } from '@nestjs/common';
import { CreateBookViolationDto } from './dto/create-book_violation.dto';
import { UpdateBookViolationDto } from './dto/update-book_violation.dto';

@Injectable()
export class BookViolationService {
  create(createBookViolationDto: CreateBookViolationDto) {
    return 'This action adds a new bookViolation';
  }

  findAll() {
    return `This action returns all bookViolation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookViolation`;
  }

  update(id: number, updateBookViolationDto: UpdateBookViolationDto) {
    return `This action updates a #${id} bookViolation`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookViolation`;
  }
}
