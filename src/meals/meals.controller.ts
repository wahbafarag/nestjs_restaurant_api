import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dtos/create-meal.dto';
import { User } from '../users/schemas/user.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ParseObjectIdPipe } from '../users/pipes/object-id.pipe';
import { UpdateMealDto } from './dtos/update-meal.dto';

@Controller('meals')
export class MealsController {
  constructor(private mealService: MealsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body(ValidationPipe) meal: CreateMealDto, @CurrentUser() user: User) {
    return this.mealService.create(meal, user);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body(ValidationPipe) meal: UpdateMealDto,
  ) {
    return this.mealService.update(id, meal);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() query: any) {
    return this.mealService.findAll(query);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  findById(@Param('id', ParseObjectIdPipe) id: string) {
    return this.mealService.findById(id);
  }

  @Get('/restaurant/:id')
  @UseGuards(AuthGuard('jwt'))
  allMealsAtRestaurant(@Param('id', ParseObjectIdPipe) id: string) {
    return this.mealService.allMealsAtRestaurant(id);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseObjectIdPipe) id: string) {
    return this.mealService.delete(id);
  }
}
