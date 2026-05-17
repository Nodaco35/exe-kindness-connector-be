import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  const userModel: any = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a user', async () => {
    const payload = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'secret',
    };

    userModel.create.mockResolvedValue(payload);

    await expect(service.create(payload as any)).resolves.toEqual(payload);
    expect(userModel.create).toHaveBeenCalledWith(payload);
  });

  it('finds all users', async () => {
    const exec: any = jest.fn();
    exec.mockResolvedValue([{ email: 'test@example.com' }] as any);
    userModel.find.mockReturnValue({ exec });

    await expect(service.findAll()).resolves.toEqual([
      { email: 'test@example.com' },
    ]);
  });
});
