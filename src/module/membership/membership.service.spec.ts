import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MembershipService } from './membership.service';
import { Membership } from './entities/membership.entity';

describe('MembershipService', () => {
  let service: MembershipService;
  const membershipModel: any = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipService,
        { provide: getModelToken(Membership.name), useValue: membershipModel },
      ],
    }).compile();

    service = module.get<MembershipService>(MembershipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a membership', async () => {
    const payload = {
      userId: '507f1f77bcf86cd799439011',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      status: 'ACTIVE',
      payment: { method: 'ONLINE', transactionId: 'txn_1', amount: 100000 },
    };

    membershipModel.create.mockResolvedValue(payload);

    await expect(service.create(payload as any)).resolves.toEqual(payload);
    expect(membershipModel.create).toHaveBeenCalledWith(expect.any(Object));
  });
});
