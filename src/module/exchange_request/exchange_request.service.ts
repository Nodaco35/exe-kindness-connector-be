import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateExchangeRequestDto } from './dto/create-exchange_request.dto';
import { UpdateExchangeRequestDto } from './dto/update-exchange_request.dto';
import { ExchangeRequest } from './entities/exchange_request.entity';

@Injectable()
export class ExchangeRequestService {
  constructor(
    @InjectModel(ExchangeRequest.name)
    private exchangeRequestModel: Model<ExchangeRequest>,
  ) { }

  async create(createExchangeRequestDto: CreateExchangeRequestDto) {
    return this.exchangeRequestModel.create({
      ...createExchangeRequestDto,
      bookId: new mongoose.Types.ObjectId(createExchangeRequestDto.bookId),
      requesterId: new mongoose.Types.ObjectId(
        createExchangeRequestDto.requesterId,
      ),
      ownerId: new mongoose.Types.ObjectId(createExchangeRequestDto.ownerId),
    } as any);
  }

  async findAll() {
    return this.exchangeRequestModel.find().exec();
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) throw new NotFoundException('Invalid id');
    const exchangeRequest = await this.exchangeRequestModel.findById(id).exec();
    if (!exchangeRequest) throw new NotFoundException('ExchangeRequest not found');
    return exchangeRequest;
  }

  async update(id: string, updateExchangeRequestDto: UpdateExchangeRequestDto) {
    if (!mongoose.isValidObjectId(id)) throw new NotFoundException('Invalid id');
    const updated = await this.exchangeRequestModel
      .findByIdAndUpdate(id, updateExchangeRequestDto as any, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('ExchangeRequest not found');
    return updated;
  }

  async remove(id: string) {
    if (!mongoose.isValidObjectId(id)) throw new NotFoundException('Invalid id');
    const deleted = await this.exchangeRequestModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('ExchangeRequest not found');
    return { deleted: true };
  }
}
