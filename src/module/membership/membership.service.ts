import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership } from './entities/membership.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectModel(Membership.name) private membershipModel: Model<Membership>,
  ) {}

  async create(createMembershipDto: CreateMembershipDto) {
    return this.membershipModel.create({
      ...createMembershipDto,
      userId: new mongoose.Types.ObjectId(createMembershipDto.userId),
    } as any);
  }

  async findAll() {
    return this.membershipModel.find().exec();
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException('Invalid id');
    const membership = await this.membershipModel.findById(id).exec();
    if (!membership) throw new NotFoundException('Membership not found');
    return membership;
  }

  async update(id: string, updateMembershipDto: UpdateMembershipDto) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException('Invalid id');
    const updated = await this.membershipModel
      .findByIdAndUpdate(id, updateMembershipDto as any, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Membership not found');
    return updated;
  }

  async remove(id: string) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException('Invalid id');
    const deleted = await this.membershipModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Membership not found');
    return { deleted: true };
  }
}
