import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsBookOwnerGuard } from './guards/is-owner.guard';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBookDto: CreateBookDto, @Req() req: any) {
    createBookDto.owner = req.user.userId;
    return this.bookService.create(createBookDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.bookService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  getFavorites(@Req() req: any) {
    return this.bookService.findFavorites(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-books')
  getMyBooks(@Req() req: any) {
    return this.bookService.findMyBooks(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  toggleLike(@Param('id') id: string, @Req() req: any) {
    return this.bookService.toggleLike(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, IsBookOwnerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @UseGuards(JwtAuthGuard, IsBookOwnerGuard)
  @Patch(':id/reup')
  reup(@Param('id') id: string, @Req() req: any) {
    return this.bookService.reup(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, IsBookOwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }
}
