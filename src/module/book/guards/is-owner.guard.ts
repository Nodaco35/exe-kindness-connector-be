import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Book } from '../entities/book.entity';

@Injectable()
export class IsBookOwnerGuard implements CanActivate {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    const bookId = request.params.id;

    if (!userId) {
      throw new ForbiddenException('User is not authenticated');
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new NotFoundException('Invalid book ID');
    }

    const book = await this.bookModel.findById(bookId).exec();
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const role = request.user?.role;

    if (book.owner.toString() !== userId.toString() && role !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to modify this book');
    }

    return true;
  }
}
