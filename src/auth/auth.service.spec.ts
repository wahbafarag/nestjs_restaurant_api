import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';

const mockNewUser = {
  user: {
    name: 'what123',
    age: 20,
    email: '222220@gmail.com',
    role: 'user',
    password: '123123123',
    _id: '64ca62bab42795b720385d50',
    createdAt: '2023-08-02T14:05:46.639Z',
    updatedAt: '2023-08-02T14:05:46.639Z',
    __v: 0,
  },
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0Y2E2MmJhYjQyNzk1YjcyMDM4NWQ1MCIsImlhdCI6MTY5MDk4NTE0NiwiZXhwIjoxNjkwOTkyMzQ2fQ.orozsEXwsE0q4MGuyRlPqJq_sRElm9Iu-NZ5oQLVoio',
};

const mockUsersService = {
  create: jest.fn().mockResolvedValue(mockNewUser.user),
};

const mockAuthService = {
  signUp: jest.fn().mockResolvedValue({ token: mockNewUser.token }),
  login: jest.fn().mockResolvedValue({ token: mockNewUser.token }),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret:
            'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should register new user', async () => {
      const hashedPass = '123123123';
      const { name, email, password, age } = mockNewUser.user;
      jest.spyOn(service, 'hashPassword').mockResolvedValueOnce(hashedPass);
      jest.spyOn(service, 'signToken').mockResolvedValueOnce(mockNewUser.token);

      const newUser = await service.signUp({ email, password, name, age });
      expect(newUser.token).toEqual(mockNewUser.token);
    });

    it('should return duplicate email error message', async () => {
      jest.spyOn(service, 'signUp').mockImplementationOnce(() => {
        throw new ConflictException(
          'This Email already exists,Use another one',
        );
      });
      const { name, email, password, age } = mockNewUser.user;

      try {
        await service.signUp({ name, email, password, age });
        fail('Expected an error to be thrown.');
      } catch (error) {
        expect(error.status).toEqual(409);
        expect(error.message).toEqual(
          'This Email already exists,Use another one',
        );
      }
    });
  });

  describe('login', () => {
    it('should login and return token', async () => {
      jest.spyOn(service, 'login').mockImplementationOnce((body: LoginDto) => {
        return Promise.resolve({ token: mockNewUser.token });
      });

      const { email, password } = mockNewUser.user;
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      const loggedIn = await service.login({ email, password });
      expect(loggedIn).toEqual({ token: mockNewUser.token });
    });
  });
});
