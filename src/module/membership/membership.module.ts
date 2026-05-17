import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { Membership, MembershipSchema } from './entities/membership.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Membership.name,
        schema: MembershipSchema,
      },
    ]),
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
})
export class MembershipModule {}
