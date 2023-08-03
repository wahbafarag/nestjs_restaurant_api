import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';
import { User, UserRoles } from '../users/schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { RestaurantsService } from './restaurants.service';
import { query } from 'express';
import { Category } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { ForbiddenException } from '@nestjs/common';

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

const mockResturantsService = {
  create: jest.fn().mockResolvedValue(mockRestaurant),
  findAll: jest.fn().mockResolvedValue([mockRestaurant]),
  findById: jest.fn().mockResolvedValueOnce(mockRestaurant),
  update: jest.fn().mockResolvedValue(mockRestaurant),
  delete: jest.fn().mockResolvedValueOnce(true),
  findOne: jest.fn().mockResolvedValue(mockRestaurant),
};

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let service: RestaurantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [RestaurantsController],
      providers: [
        {
          provide: RestaurantsService,
          useValue: mockResturantsService,
        },
      ],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('return all restaurants', () => {
    it('should return all restaurants', async () => {
      const resaurants = await controller.findAll(query);
      expect(service.findAll).toBeCalled();
      expect(resaurants).toBeDefined();
      expect(resaurants).toEqual([mockRestaurant]);
    });
  });

  describe('create new restaurants', () => {
    const newRestaurant = {
      name: 'the eagle',
      email: 'theeagle@gmail.com',
      description: 'this is description',
      phoneNo: '01125478952',
      category: Category.FINE_DINNING,
    };
    it('should create new restaurants', async () => {
      const newRes = await controller.create(
        newRestaurant as CreateRestaurantDto,
        mockUser as User,
      );
      expect(service.create).toBeCalled();
      expect(newRes).toBeDefined();
      expect(newRes).toEqual(mockRestaurant);
      expect(({ body }) => {
        expect(newRes.name).toEqual(newRestaurant.name);
        expect(newRes.email).toEqual(newRestaurant.email);
        expect(newRes.description).toEqual(newRestaurant.description);
        expect(newRes.phoneNo).toEqual(newRestaurant.phoneNo);
        expect(newRes.category).toEqual(newRestaurant.category);
      });
    });
    it('should throw forbidden exception for non admin users', async () => {
      const user = {
        ...mockUser,
        id: '64c51ce8eb808f46cf49bd25',
      };
      try {
        await controller.create(
          newRestaurant as CreateRestaurantDto,
          user as User,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('find Restaurant by id', () => {
    it('should return restaurant by id', async () => {
      const restaurant = await controller.findById(mockRestaurant._id);
      expect(restaurant).toBeDefined();
      expect(service.findById).toBeCalled();
      expect(restaurant).toEqual(mockRestaurant);
    });
  });

  describe('update restaurant', () => {
    const newRestaurant = {
      ...mockRestaurant,
      name: 'this is updated name',
      description: 'this is a bad  description',
    };
    const updatedItems = {
      name: 'this is updated name',
      description: 'this is a bad  description',
    };

    it('should update user by id', async () => {
      jest.spyOn(service, 'update').mockResolvedValueOnce(newRestaurant as any);

      const newRes = await controller.update(
        updatedItems as UpdateRestaurantDto,
        mockRestaurant._id,
        mockRestaurant.user as any,
      );

      expect(service.update).toBeCalled();
      expect(newRes).toBeDefined();
      expect(newRes).toEqual(newRestaurant);
      expect(newRes.name).toEqual(updatedItems.name);
      expect(newRes.description).toEqual(updatedItems.description);
    });

    it('should throw forbidden exception for non admin user', async () => {
      const user = {
        ...mockUser,
        _id: '64c51ce8eb808f46cf49bd25',
      };
      try {
        await controller.update(
          updatedItems as UpdateRestaurantDto,
          mockRestaurant._id,
          user as any,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('delete restaurant by id', () => {
    it('should delete restaurant by its id', async () => {
      const deleted = await controller.delete(mockRestaurant._id);
      expect(service.delete).toBeCalled();
      expect(deleted).toEqual(true);
    });
  });
});
