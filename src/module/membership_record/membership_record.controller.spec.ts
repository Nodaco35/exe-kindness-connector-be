import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { MembershipRecordController } from './membership_record.controller';
import { MembershipRecordService } from './membership_record.service';

describe('MembershipRecordController', () => {
  let controller: MembershipRecordController;
  const membershipRecordService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipRecordController],
      providers: [
        {
          provide: MembershipRecordService,
          useValue: membershipRecordService,
        },
      ],
    }).compile();

    controller = module.get<MembershipRecordController>(
      MembershipRecordController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates create to service', async () => {
    const payload = {
      membershipId: '507f1f77bcf86cd799439011',
      userId: '507f1f77bcf86cd799439012',
      action: 'CREATED',
    };

    membershipRecordService.create.mockResolvedValue(payload);

    await expect(controller.create(payload as any)).resolves.toEqual(payload);
    expect(membershipRecordService.create).toHaveBeenCalledWith(payload);
  });
});
