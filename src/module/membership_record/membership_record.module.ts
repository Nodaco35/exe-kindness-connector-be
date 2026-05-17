import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MembershipRecordService } from './membership_record.service';
import { MembershipRecordController } from './membership_record.controller';
import {
  MembershipRecord,
  MembershipRecordSchema,
} from './entities/membership_record.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MembershipRecord.name,
        schema: MembershipRecordSchema,
      },
    ]),
  ],
  controllers: [MembershipRecordController],
  providers: [MembershipRecordService],
})
export class MembershipRecordModule {}
