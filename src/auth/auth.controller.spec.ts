import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";

// const token =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzUxY2U4ZWI4MDhmNDZjZjQ5YmQ1OSIsImlhdCI6MTY5MDk4MzI5NCwiZXhwIjoxNjkwOTkwNDk0fQ.sBbMdf897Mc6UtBLWN0kODvMGgfmhzwunKyWHsVZ0Us';
//
// const mockUser = {
//   _id: '64c51ce8eb808f46cf49bd55',
//   name: 'bathwater',
//   email: 'thewahba12@gmail.com',
//   role: UserRoles.USER,
//   password: '123123123',
//   age: 25,
// };

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

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should register a user and return a token', async () => {
      const { email, password, age, name } = mockNewUser.user;
      const newUser = await controller.signUp(mockNewUser.user);

      expect(service.signUp).toHaveBeenCalled();
      expect(newUser).toBeDefined();
      expect(newUser.token).toEqual(mockNewUser.token);
      expect(({ body }) => {
        expect(body.email).toEqual(email);
        expect(body.age).toEqual(age);
        expect(body.name).toEqual(name);
      });
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      const { email, password } = mockNewUser.user;
      const loggedIn = await controller.login({ email, password });
      expect(service.login).toHaveBeenCalled();
      expect(loggedIn).toEqual({ token: mockNewUser.token });
      expect(({ body }) => {
        expect(body.email).toEqual(email);
        expect(body.password).toEqual(password);
      });
    });
  });
});
