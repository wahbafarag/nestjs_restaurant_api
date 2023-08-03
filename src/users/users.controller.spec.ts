import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PassportModule } from '@nestjs/passport';

const mockNewUser = {
  _id: '64c51ce8eb808f46cf49bd55',
  name: 'admin',
  age: 20,
  email: 'admin@gmail.com',
  role: 'admin',
  password: '123123123',
};

const mockUsersService = {
  create: jest.fn().mockResolvedValue(mockNewUser),
  find: jest.fn().mockResolvedValue([mockNewUser]),
  findById: jest.fn().mockResolvedValue(mockNewUser),
  update: jest.fn().mockResolvedValue(mockNewUser),
  delete: jest.fn().mockResolvedValue(true),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get all users as admin', () => {
    it('should return all users', async () => {
      const users = await controller.find();
      expect(users.length).toBeGreaterThanOrEqual(0);
      expect(service.find).toHaveBeenCalled();
    });
  });

  describe('create new user as admin', () => {
    it('should create new user', async () => {
      const user = await controller.createUser(mockNewUser);
      expect(user).toEqual(mockNewUser);
      expect(service.create).toHaveBeenCalled();
      expect(({ body }) => {
        expect(body.name).toEqual(mockNewUser.name);
        expect(body.age).toEqual(mockNewUser.age);
        expect(body.email).toEqual(mockNewUser.email);
        expect(body.role).toEqual(mockNewUser.role);
        expect(body.password).toEqual(mockNewUser.password);
      });
    });
  });

  describe('get user by id as admin', () => {
    it('should return user by id', async () => {
      const user = await controller.findById(mockNewUser._id);
      expect(user).toEqual(mockNewUser);
      expect(service.findById).toHaveBeenCalled();
      expect(({ query }) => {
        expect(query._id).toEqual(mockNewUser._id);
      });
    });
  });

  describe('update user by id as admin', () => {
    it('should update user by id', async () => {
      const user = await controller.update(mockNewUser, mockNewUser._id);
      expect(user).toEqual(mockNewUser);
      expect(service.update).toHaveBeenCalled();
      expect(({ query }) => {
        expect(query._id).toEqual(mockNewUser._id);
      });
    });
  });

  describe('delete user by id as admin', () => {
    it('should delete user by id', async () => {
      await controller.delete(mockNewUser._id);
      expect(service.delete).toHaveBeenCalled();
      expect(({ query }) => {
        expect(query._id).toEqual(mockNewUser._id);
      });
    });
  });
});
