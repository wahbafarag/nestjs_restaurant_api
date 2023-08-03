import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { UserRoles } from '../users/schemas/user.schema';

const mockResaurantsRepo = {
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

const mockRestaurant = {
  name: 'MR-Meat',
  email: 'mrmeat@gmail.com',
  description: 'All meat products are there',
  phoneNo: '01211484543',
  category: 'Fast Food',
  images: [],
  user: '64c51ce8eb808f46cf49bd59',
  meals: ['64c688c89e96a186ac54eb3c'],
  ratings: ['64c90487e772b3d506bcf26e'],
  ratingsAverage: 4.5,
  ratingsQuantity: 0,
  _id: '64cc1b4d5dc6c917ae1486a5',
  createdAt: '2023-08-03T21:25:33.907Z',
  updatedAt: '2023-08-03T21:25:33.907Z',
};

const mockUser = {
  _id: '64c51ce8eb808f46cf49bd59',
  name: 'admin',
  email: 'admin@gmail.com',
  role: UserRoles.ADMIN,
};

describe('RestaurantsService', () => {
  let service: RestaurantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantsService],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
