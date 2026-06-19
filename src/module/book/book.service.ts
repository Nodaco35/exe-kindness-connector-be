import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { User } from '../user/entities/user.entity';
import { Book_Status } from '../../common/enums/status.enum';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const book = await this.bookModel.create(createBookDto as any);
    if (createBookDto.owner) {
      await this.userModel.findByIdAndUpdate(createBookDto.owner, {
        $inc: { points: 10 },
      });
    }
    return book;
  }

  async findAll(query?: any) {
    const filter: any = {};
    if (query?.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { author: { $regex: query.search, $options: 'i' } },
      ];
    }
    
    if (query?.status) {
      if (query.status !== 'all') {
        filter.status = query.status;
      }
    } else {
      filter.status = Book_Status.AVAILABLE;
    }

    return await this.bookModel.find(filter).populate('owner');
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid book id');
    }

    const book = await this.bookModel
      .findById(id)
      .populate('categories')
      .populate('advancedCategories')
      .populate('owner');

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async toggleLike(id: string, userId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid book id');
    }

    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const userObjId = new mongoose.Types.ObjectId(userId) as any;
    const likeIndex = book.likes?.findIndex(like => like.toString() === userId) ?? -1;

    if (likeIndex > -1) {
      // Đã like -> unlike
      book.likes.splice(likeIndex, 1);
    } else {
      // Chưa like -> like
      if (!book.likes) book.likes = [];
      book.likes.push(userObjId);
    }

    await book.save();
    return book.likes;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid book id');
    }

    const updatedBook = await this.bookModel.findByIdAndUpdate(
      id,
      updateBookDto,
      {
        new: true,
      },
    );

    if (!updatedBook) {
      throw new NotFoundException('Book not found');
    }

    return updatedBook;
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid book id');
    }

    const deletedBook = await this.bookModel.findByIdAndDelete(id);

    if (!deletedBook) {
      throw new NotFoundException('Book not found');
    }

    return {
      message: 'Delete book successfully',
    };
  }
}
