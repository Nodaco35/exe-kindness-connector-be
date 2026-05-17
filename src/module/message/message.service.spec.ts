import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';

describe('MessageService', () => {
  let service: MessageService;
  const messageModel: any = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        { provide: getModelToken(Message.name), useValue: messageModel },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a message', async () => {
    const payload = {
      conversationId: '507f1f77bcf86cd799439011',
      senderId: '507f1f77bcf86cd799439012',
      content: 'Hello',
      type: 'TEXT',
    };

    messageModel.create.mockResolvedValue(payload);

    await expect(service.create(payload as any)).resolves.toEqual(payload);
    expect(messageModel.create).toHaveBeenCalledWith(expect.any(Object));
  });
});
