import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { UsersRepository } from './user.repository';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

const mockNewUser = {
  _id: '64c51ce8eb808f46cf49bd55',
  name: 'admin',
  age: 20,
  email: 'admin1@gmail.com',
  role: 'admin',
  password: '123123123',
};

const mockUsersService = {
  create: jest.fn().mockResolvedValue(mockNewUser),
  find: jest.fn().mockResolvedValue([mockNewUser]),
  findById: jest.fn().mockResolvedValue(mockNewUser),
  update: jest.fn().mockResolvedValue(mockNewUser),
  delete: jest.fn().mockResolvedValue(true),
  findByIdAndUpdate: jest.fn().mockResolvedValue(mockNewUser),
  findByIdAndDelete: jest.fn().mockResolvedValue(mockNewUser),
};

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersRepository,
        {
          provide: getModelToken(User.name),
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find all users', () => {
    it('should return all users', async () => {
      jest.spyOn(model, 'find').mockResolvedValueOnce([mockNewUser]);
      const users = await service.find();
      expect(users.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('create new user', () => {
    const newUser = {
      name: 'admin',
      age: 20,
      email: 'admin@gmail.com',
      role: 'admin',
      password: '123123123',
    };

    // it('should create new user', async () => {
    //   jest.spyOn(model, 'create').mockResolvedValueOnce(newUser as any);
    //   const user = await service.create(mockNewUser);
    //   expect(user).toEqual(mockNewUser);
    //   expect(user).toBeDefined();
    //   expect(user).toHaveProperty('_id');
    //   expect(user).toHaveProperty('name');
    //   expect(user).toHaveProperty('age');
    //   expect(user).toHaveProperty('email');
    //   expect(user).toHaveProperty('role');
    //   expect(user).toHaveProperty('password');
    // });

    it('should return duplicate email error ', async () => {
      jest.spyOn(model, 'create').mockRejectedValueOnce(() => {
        throw new ConflictException(
          'This Email already exists,Use another one',
        );
      });
      // await expect(service.create(newUser as any)).rejects.toThrow(
      //   'Email already exists',
      // );
      try {
        await service.create(newUser);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual(
          'This Email already exists,Use another one',
        );
      }
    });
  });

  describe('find user by id', () => {
    it('should return user by id', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(mockNewUser);
      const user = await service.findById(mockNewUser._id);
      expect(user).toEqual(mockNewUser);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('age');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('password');
    });

    it('should return error message for bad mongoose id', async () => {
      try {
        const user = await service.findById('badass_ID');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Invalid Id');
      }
    });
  });

  describe('update user', () => {
    it('should update user by id', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(mockNewUser);
      const newUser = await service.update(mockNewUser, mockNewUser._id);
      expect(newUser).toBeDefined();
      expect(service.update).toHaveBeenCalled();
      expect(newUser.email).toEqual(mockNewUser.email);
    });

    it('should return conflict error message if email is in use', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockRejectedValueOnce(() => {
        throw new ConflictException('Email already in use');
      });
      try {
        await service.update(mockNewUser, mockNewUser._id);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual('Email already in use');
      }
    });

    it('should return invalid mongoose error id', async () => {
      try {
        const user = await service.findById('badass_ID');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual('Invalid Id');
      }
    });

    it('should return user not found', async () => {
      jest
        .spyOn(model, 'findById')
        .mockResolvedValue(new NotFoundException('User not found'));
      try {
        await service.findById(mockNewUser._id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('User not found');
      }
    });
  });

  describe('delete user by id', () => {
    it('should delete user by id', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValueOnce(mockNewUser);
      const user = await service.delete(mockNewUser._id);
    });

    it('should return invalid mongoose error id', async () => {
      try {
        const user = await service.findById('badass_ID');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual('Invalid Id');
      }
    });
  });
});
