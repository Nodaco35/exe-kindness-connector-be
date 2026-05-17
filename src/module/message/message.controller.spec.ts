import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

describe('MessageController', () => {
  let controller: MessageController;
  const messageService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [{ provide: MessageService, useValue: messageService }],
    }).compile();

    controller = module.get<MessageController>(MessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates create to service', async () => {
    const payload = {
      conversationId: '507f1f77bcf86cd799439011',
      senderId: '507f1f77bcf86cd799439012',
      content: 'Hello',
      type: 'TEXT',
    };

    messageService.create.mockResolvedValue(payload);

    await expect(controller.create(payload as any)).resolves.toEqual(payload);
    expect(messageService.create).toHaveBeenCalledWith(payload);
  });
});
