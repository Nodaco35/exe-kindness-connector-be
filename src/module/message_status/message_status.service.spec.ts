import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MessageStatusService } from './message_status.service';
import { MessageStatus } from './entities/message_status.entity';

describe('MessageStatusService', () => {
  let service: MessageStatusService;
  const messageStatusModel: any = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageStatusService,
        {
          provide: getModelToken(MessageStatus.name),
          useValue: messageStatusModel,
        },
      ],
    }).compile();

    service = module.get<MessageStatusService>(MessageStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a message status', async () => {
    const payload = {
      messageId: '507f1f77bcf86cd799439011',
      userId: '507f1f77bcf86cd799439012',
      status: 'SENT',
    };

    messageStatusModel.create.mockResolvedValue(payload);

    await expect(service.create(payload as any)).resolves.toEqual(payload);
    expect(messageStatusModel.create).toHaveBeenCalledWith(expect.any(Object));
  });
});
