import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { MessageStatusController } from './message_status.controller';
import { MessageStatusService } from './message_status.service';

describe('MessageStatusController', () => {
  let controller: MessageStatusController;
  const messageStatusService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageStatusController],
      providers: [
        { provide: MessageStatusService, useValue: messageStatusService },
      ],
    }).compile();

    controller = module.get<MessageStatusController>(MessageStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates create to service', async () => {
    const payload = {
      messageId: '507f1f77bcf86cd799439011',
      userId: '507f1f77bcf86cd799439012',
      status: 'SENT',
    };

    messageStatusService.create.mockResolvedValue(payload);

    await expect(controller.create(payload as any)).resolves.toEqual(payload);
    expect(messageStatusService.create).toHaveBeenCalledWith(payload);
  });
});
