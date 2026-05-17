import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateMembershipRecordDto } from './dto/create-membership_record.dto';
import { UpdateMembershipRecordDto } from './dto/update-membership_record.dto';
import { MembershipRecord } from './entities/membership_record.entity';

@Injectable()
export class MembershipRecordService {
  constructor(
    @InjectModel(MembershipRecord.name)
    private membershipRecordModel: Model<MembershipRecord>,
  ) {}

  async create(createMembershipRecordDto: CreateMembershipRecordDto) {
    return this.membershipRecordModel.create({
      ...createMembershipRecordDto,
      membershipId: new mongoose.Types.ObjectId(
        createMembershipRecordDto.membershipId,
      ),
      userId: new mongoose.Types.ObjectId(createMembershipRecordDto.userId),
    } as any);
  }

  async findAll() {
    return this.membershipRecordModel.find().exec();
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException('Invalid id');
    const membershipRecord = await this.membershipRecordModel
      .findById(id)
      .exec();
    if (!membershipRecord)
      throw new NotFoundException('MembershipRecord not found');
    return membershipRecord;
  }

  async update(
    id: string,
    updateMembershipRecordDto: UpdateMembershipRecordDto,
  ) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException('Invalid id');
    const updated = await this.membershipRecordModel
      .findByIdAndUpdate(id, updateMembershipRecordDto as any, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('MembershipRecord not found');
    return updated;
  }

  async remove(id: string) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException('Invalid id');
    const deleted = await this.membershipRecordModel
      .findByIdAndDelete(id)
      .exec();
    if (!deleted) throw new NotFoundException('MembershipRecord not found');
    return { deleted: true };
  }
}
