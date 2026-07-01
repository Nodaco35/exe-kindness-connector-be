/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { User } from '../user/entities/user.entity';
import { getCoordinatesFromDistrict } from 'src/common/constants/district-coordinates';
import { Location } from '../location/entities/location.entity';
import { LocationType } from 'src/common/enums/location-type.enum';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Location.name) private readonly locationModel: Model<Location>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const bookData: any = { ...createBookDto };

    if (bookData.location && bookData.location.district) {
      const coords = await this.getCoordinatesFromLocationCollection(
        bookData.location.district,
      );
      if (coords) {
        bookData.geo = { type: 'Point', coordinates: coords };
      }
    }

    const book = await this.bookModel.create(bookData);
    if (createBookDto.owner) {
      await this.userModel.findByIdAndUpdate(createBookDto.owner, {
        $inc: { points: 10 },
      });
    }
    return book;
  }

  async findAll(query?: {
    district?: string;
    radius?: string;
    search?: string;
    owner?: string;
  }) {
    const filter: any = {};

    if (query?.search) {
      const searchStr = query.search;
      filter.$or = [
        { title: { $regex: searchStr, $options: 'i' } },
        { author: { $regex: searchStr, $options: 'i' } },
      ];
    }

    if (query?.owner) {
      filter.owner = query.owner;
    }

    // Chỉ hiển thị sách có trạng thái AVAILABLE trên trang chủ/search
    filter.status = 'AVAILABLE';

    const books = await this.bookModel.find(filter).populate('owner');

    if (query?.district) {
      const searchDistrict = query.district;

      if (query?.radius) {
        const centerCoords =
          await this.getCoordinatesFromLocationCollection(searchDistrict);
        if (!centerCoords) {
          return books;
        }

        const radiusLimit = parseFloat(query.radius);
        const filteredBooks: Book[] = [];

        for (const book of books) {
          if (book.location && book.location.district) {
            const bookCoords = await this.getCoordinatesFromLocationCollection(
              book.location.district,
            );
            if (bookCoords) {
              const dist = this.calculateDistance(
                centerCoords[1],
                centerCoords[0],
                bookCoords[1],
                bookCoords[0],
              );
              if (dist <= radiusLimit) {
                filteredBooks.push(book);
              }
            }
          }
        }
        return filteredBooks;
      } else {
        return books.filter((book) => {
          if (!book.location || !book.location.district) return false;

          const d1 = book.location.district
            .trim()
            .replace(/^(Quận|Huyện|Thị xã)\s+/i, '')
            .toLowerCase();
          const d2 = searchDistrict
            .trim()
            .replace(/^(Quận|Huyện|Thị xã)\s+/i, '')
            .toLowerCase();
          return d1 === d2;
        });
      }
    }

    return books;
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid book id');
    }

    // Tự động tăng viewCount lên 1 mỗi khi người dùng xem chi tiết sách
    const book = await this.bookModel
      .findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true })
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

    let updatedBook;
    if (likeIndex > -1) {
      // Đã like -> unlike
      updatedBook = await this.bookModel.findByIdAndUpdate(
        id,
        { $pull: { likes: userObjId } },
        { new: true, runValidators: false }
      );
    } else {
      // Chưa like -> like
      updatedBook = await this.bookModel.findByIdAndUpdate(
        id,
        { $addToSet: { likes: userObjId } },
        { new: true, runValidators: false }
      );
    }

    return updatedBook?.likes || [];
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid book id');
    }

    const updateData: any = { ...updateBookDto };
    if (updateData.location && updateData.location.district) {
      const coords = await this.getCoordinatesFromLocationCollection(
        updateData.location.district,
      );
      if (coords) {
        updateData.geo = { type: 'Point', coordinates: coords };
      }
    }

    const updatedBook = await this.bookModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

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

  async findFavorites(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    return this.bookModel
      .find({ likes: userObjectId as any })
      .populate('owner')
      .exec();
  }

  async findMyBooks(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    return this.bookModel
      .find({ owner: userObjectId as any })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getCoordinatesFromLocationCollection(
    districtName: string,
  ): Promise<[number, number] | undefined> {
    if (!districtName) return undefined;

    const searchDistrict = districtName.trim();
    const nakedDistrict = searchDistrict.replace(
      /^(Quận|Huyện|Thị xã)\s+/i,
      '',
    );

    try {
      const location = await this.locationModel.findOne({
        type: LocationType.DISTRICT,
        $or: [
          { name: { $regex: `^${searchDistrict}$`, $options: 'i' } },
          { name: { $regex: `^${nakedDistrict}$`, $options: 'i' } },
          {
            name: {
              $regex: `^(Quận|Huyện|Thị xã)\\s+${nakedDistrict}$`,
              $options: 'i',
            },
          },
        ],
      });

      if (location && location.geo && location.geo.coordinates) {
        return location.geo.coordinates as [number, number];
      }
    } catch (error) {
      console.error(
        'Failed to get coordinates from Location collection:',
        error,
      );
    }

    // Fallback to static coordinates list
    return getCoordinatesFromDistrict(districtName);
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
