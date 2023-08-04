import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { UserRoles } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { getModelToken } from '@nestjs/mongoose';
import { RestaurantRepository } from './restaurant.repository';
import { NotFoundException } from '@nestjs/common';

const mockRestaurantsRepo = {
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
  let repo: RestaurantRepository;
  let model: Model<Restaurant>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        RestaurantRepository,
        {
          provide: getModelToken(Restaurant.name),
          useValue: mockRestaurantsRepo,
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    model = module.get<Model<Restaurant>>(getModelToken(Restaurant.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should return all restaurants', async () => {
  //   jest.spyOn(model, 'find').mockImplementationOnce(
  //     () =>
  //       ({
  //         limit: () => ({
  //           skip: () => ({
  //             sort: () => ({
  //               populate: () => ({
  //                 populate: () => jest.fn().mockResolvedValue([mockRestaurant]),
  //               }),
  //             }),
  //           }),
  //         }),
  //       } as any),
  //   );
  //
  //   const restaurants = await service.findAll({ keyword: 'MR-Meat' });
  // });

  describe('create restaurant', () => {
    const newRestaurant = {
      name: 'MR-Meat',
      email: 'mrmeat@gmail.com',
      description: 'All meat products are there',
      phoneNo: '01211484543',
      category: 'Fast Food',
    };
    it('should create restaurant', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(
        () =>
          ({
            populate: () => Promise.resolve(mockRestaurant as any),
          } as any),
      );

      const restaurant = await service.create(
        newRestaurant as any,
        mockUser as any,
      );
      expect(restaurant).toEqual(mockRestaurant);
      expect(restaurant).toBeDefined();
    });
  });

  describe('find By id', () => {
    it('should find by id', async () => {
      jest.spyOn(model, 'findById').mockImplementationOnce(
        () =>
          ({
            populate: () => ({
              populate: () => Promise.resolve(mockRestaurant as any),
            }),
          } as any),
      );
      const restaurant = await service.findById('64cc1b4d5dc6c917ae1486a5');
      expect(restaurant).toEqual(mockRestaurant);
      expect(restaurant).toBeDefined();
    });

    it('should throw wrong id', async () => {
      try {
        const restaurant = await service.findById('64cc1s');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should throw not found exception', async () => {
      jest.spyOn(model, 'findById').mockImplementationOnce(() => {
        throw new NotFoundException('Restaurant not found');
      });
      try {
        await service.findById('wqeqe12');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toEqual('Restaurant not found');
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('update restaurant by id', () => {
    it('should update restaurant', async () => {
      const newRes = {
        ...mockRestaurant,
        name: '' + 'MR-Meat',
        description: 'updated description',
      };
      const updatedItems = {
        name: '' + 'MR-Meat',
        description: 'updated description',
      };

      jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockResolvedValueOnce(newRes as any);

      const restaurant = await service.update(
        mockRestaurant._id,
        updatedItems as any,
        mockUser as any,
      );
      expect(restaurant).toEqual(newRes);
    });
  });

  describe('delete restaurant by id', () => {
    it('should delete restaurant', async () => {
      jest
        .spyOn(model, 'findByIdAndDelete')
        .mockResolvedValueOnce(mockRestaurant as any);
      const restaurant = await service.delete(mockRestaurant._id);
      console.log(restaurant);
    });
  });
});
