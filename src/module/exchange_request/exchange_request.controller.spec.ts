import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRequestController } from './exchange_request.controller';
import { ExchangeRequestService } from './exchange_request.service';

describe('ExchangeRequestController', () => {
  let controller: ExchangeRequestController;
  const exchangeRequestService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeRequestController],
      providers: [
        { provide: ExchangeRequestService, useValue: exchangeRequestService },
      ],
    }).compile();

    controller = module.get<ExchangeRequestController>(
      ExchangeRequestController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates create to service', async () => {
    const payload = {
      bookId: '507f1f77bcf86cd799439011',
      requesterId: '507f1f77bcf86cd799439012',
      ownerId: '507f1f77bcf86cd799439013',
      message: 'Can we exchange?',
    };

    exchangeRequestService.create.mockResolvedValue(payload);

    await expect(controller.create(payload as any)).resolves.toEqual(payload);
    expect(exchangeRequestService.create).toHaveBeenCalledWith(payload);
  });
});
