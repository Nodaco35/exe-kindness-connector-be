import { Injectable } from '@nestjs/common';
import { CreateExchangeRecordDto } from './dto/create-exchange_record.dto';
import { UpdateExchangeRecordDto } from './dto/update-exchange_record.dto';

@Injectable()
export class ExchangeRecordService {
  create(createExchangeRecordDto: CreateExchangeRecordDto) {
    return 'This action adds a new exchangeRecord';
  }

  findAll() {
    return `This action returns all exchangeRecord`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exchangeRecord`;
  }

  update(id: number, updateExchangeRecordDto: UpdateExchangeRecordDto) {
    return `This action updates a #${id} exchangeRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} exchangeRecord`;
  }
}
