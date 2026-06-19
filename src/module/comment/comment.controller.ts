import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('book/:bookId')
  create(
    @Param('bookId') bookId: string,
    @Body('content') content: string,
    @Req() req: any,
  ) {
    return this.commentService.create(req.user.userId, bookId, content);
  }

  @Get('book/:bookId')
  getByBookId(@Param('bookId') bookId: string) {
    return this.commentService.getCommentsByBookId(bookId);
  }
}
