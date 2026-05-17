import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';

describe('MembershipController', () => {
  let controller: MembershipController;
  const membershipService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipController],
      providers: [{ provide: MembershipService, useValue: membershipService }],
    }).compile();

    controller = module.get<MembershipController>(MembershipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates create to service', async () => {
    const payload = {
      userId: '507f1f77bcf86cd799439011',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      status: 'ACTIVE',
      payment: { method: 'ONLINE', transactionId: 'txn_1', amount: 100000 },
    };

    membershipService.create.mockResolvedValue(payload);

    await expect(controller.create(payload as any)).resolves.toEqual(payload);
    expect(membershipService.create).toHaveBeenCalledWith(payload);
  });
});
