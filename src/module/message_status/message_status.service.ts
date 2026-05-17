import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateMessageStatusDto } from './dto/create-message_status.dto';
import { UpdateMessageStatusDto } from './dto/update-message_status.dto';
import { MessageStatus } from './entities/message_status.entity';

@Injectable()
export class MessageStatusService {
  constructor(
    @InjectModel(MessageStatus.name)
    private messageStatusModel: Model<MessageStatus>,
  ) {}

  async create(createMessageStatusDto: CreateMessageStatusDto) {
    return this.messageStatusModel.create({
      ...createMessageStatusDto,
      messageId: new mongoose.Types.ObjectId(createMessageStatusDto.messageId),
      userId: new mongoose.Types.ObjectId(createMessageStatusDto.userId),
    } as any);
  }

  async findAll() {
    return this.messageStatusModel.find().exec();
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException('Invalid id');
    const messageStatus = await this.messageStatusModel.findById(id).exec();
    if (!messageStatus) throw new NotFoundException('MessageStatus not found');
    return messageStatus;
  }

  async update(id: string, updateMessageStatusDto: UpdateMessageStatusDto) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException('Invalid id');
    const updated = await this.messageStatusModel
      .findByIdAndUpdate(id, updateMessageStatusDto as any, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('MessageStatus not found');
    return updated;
  }

  async remove(id: string) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException('Invalid id');
    const deleted = await this.messageStatusModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('MessageStatus not found');
    return { deleted: true };
  }
}
