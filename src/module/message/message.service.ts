import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    return this.messageModel.create({
      ...createMessageDto,
      conversationId: new mongoose.Types.ObjectId(
        createMessageDto.conversationId,
      ),
      senderId: new mongoose.Types.ObjectId(createMessageDto.senderId),
      sentAt: createMessageDto.sentAt ?? new Date(),
      isDeleted: createMessageDto.isDeleted ?? false,
    } as any);
  }

  async findAll() {
    return this.messageModel.find().exec();
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException('Invalid id');
    const message = await this.messageModel.findById(id).exec();
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException('Invalid id');
    const updated = await this.messageModel
      .findByIdAndUpdate(id, updateMessageDto as any, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Message not found');
    return updated;
  }

  async remove(id: string) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException('Invalid id');
    const deleted = await this.messageModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Message not found');
    return { deleted: true };
  }
}
