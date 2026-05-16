import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import mongoose from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto as any);
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException('Invalid id');
    const found = await this.userModel.findById(id).exec();
    if (!found) throw new NotFoundException('User not found');
    return found;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException('Invalid id');
    const updated = await this.userModel
      .findByIdAndUpdate(id, updateUserDto as any, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async remove(id: string) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException('Invalid id');
    const deleted = await this.userModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('User not found');
    return { deleted: true };
  }
}
