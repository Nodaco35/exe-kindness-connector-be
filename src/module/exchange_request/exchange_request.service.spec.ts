import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ExchangeRequestService } from './exchange_request.service';
import { ExchangeRequest } from './entities/exchange_request.entity';

describe('ExchangeRequestService', () => {
  let service: ExchangeRequestService;
  const exchangeRequestModel: any = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRequestService,
        {
          provide: getModelToken(ExchangeRequest.name),
          useValue: exchangeRequestModel,
        },
      ],
    }).compile();

    service = module.get<ExchangeRequestService>(ExchangeRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates an exchange request', async () => {
    const payload = {
      bookId: '507f1f77bcf86cd799439011',
      requesterId: '507f1f77bcf86cd799439012',
      ownerId: '507f1f77bcf86cd799439013',
      message: 'Can we exchange?',
    };

    exchangeRequestModel.create.mockResolvedValue(payload);

    await expect(service.create(payload as any)).resolves.toEqual(payload);
    expect(exchangeRequestModel.create).toHaveBeenCalledWith(expect.any(Object));
  });
});
