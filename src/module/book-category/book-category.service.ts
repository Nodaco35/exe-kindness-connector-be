import { Injectable } from '@nestjs/common';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';

@Injectable()
export class BookCategoryService {
  create(createBookCategoryDto: CreateBookCategoryDto) {
    return 'This action adds a new bookCategory';
  }

  findAll() {
    return `This action returns all bookCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookCategory`;
  }

  update(id: number, updateBookCategoryDto: UpdateBookCategoryDto) {
    return `This action updates a #${id} bookCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookCategory`;
  }
}
