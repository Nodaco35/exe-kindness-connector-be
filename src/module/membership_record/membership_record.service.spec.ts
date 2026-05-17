import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MembershipRecordService } from './membership_record.service';
import { MembershipRecord } from './entities/membership_record.entity';
import { CreateMembershipRecordDto } from './dto/create-membership_record.dto';

type MembershipRecordModelMock = {
  create: jest.Mock;
  find: jest.Mock;
  findById: jest.Mock;
  findByIdAndUpdate: jest.Mock;
  findByIdAndDelete: jest.Mock;
};

describe('MembershipRecordService', () => {
  let service: MembershipRecordService;
  const createMock = jest.fn();
  const membershipRecordModel: MembershipRecordModelMock = {
    create: createMock,
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipRecordService,
        {
          provide: getModelToken(MembershipRecord.name),
          useValue: membershipRecordModel,
        },
      ],
    }).compile();

    service = module.get<MembershipRecordService>(MembershipRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a membership record', async () => {
    const payload = {
      membershipId: '507f1f77bcf86cd799439011',
      userId: '507f1f77bcf86cd799439012',
      action: 'CREATED',
    } as unknown as CreateMembershipRecordDto;

    (
      createMock as unknown as { mockResolvedValue(value: unknown): void }
    ).mockResolvedValue(payload);

    await expect(service.create(payload)).resolves.toEqual(payload);
    expect(membershipRecordModel.create).toHaveBeenCalledTimes(1);
  });
});
