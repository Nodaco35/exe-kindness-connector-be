import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async create(userId: string, bookId: string, content: string) {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new NotFoundException('Invalid book id');
    }
    const comment = await this.commentModel.create({
      userId,
      bookId,
      content,
    });
    return comment.populate('userId', 'fullName avatar');
  }

  async getCommentsByBookId(bookId: string) {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new NotFoundException('Invalid book id');
    }
    return this.commentModel
      .find({ bookId })
      .populate('userId', 'fullName avatar')
      .sort({ createdAt: -1 });
  }
}
