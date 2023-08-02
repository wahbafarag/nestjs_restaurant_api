import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { RestaurantsService } from './restaurants.service';
import { User } from '../users/schemas/user.schema';
import { ParseObjectIdPipe } from '../users/pipes/object-id.pipe';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantService: RestaurantsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  create(
    @Body(ValidationPipe) body: CreateRestaurantDto,
    @CurrentUser() user: User,
  ) {
    return this.restaurantService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  update(
    @Body(ValidationPipe) body: UpdateRestaurantDto,
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.restaurantService.update(id, body, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseObjectIdPipe) id: string) {
    return this.restaurantService.delete(id);
  }

  @Get()
  findAll(@Query() query) {
    return this.restaurantService.findAll(query);
  }

  @Get('/:id')
  findById(@Param('id', ParseObjectIdPipe) id: string) {
    return this.restaurantService.findById(id);
  }

  @Get('/All/Stats')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  stats() {
    return this.restaurantService.restaurantsStats();
  }

  @Get('All/Top-5-Cheapest')
  @UseGuards(AuthGuard('jwt'))
  getCheapestRestaurants() {
    return this.restaurantService.getCheapestRestaurants();
  }

  @Get('/All/Top-5-Expensive')
  @UseGuards(AuthGuard('jwt'))
  getFiveExpensive() {
    return this.restaurantService.getFiveExpensive();
  }
}
