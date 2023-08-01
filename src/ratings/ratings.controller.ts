import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    UseGuards,
    ValidationPipe
} from '@nestjs/common';
import {RatingsService} from "./ratings.service";
import {CreateRatingDto} from "./dtos/create-rating.dto";
import {CurrentUser} from "../auth/decorators/current-user.decorator";
import {User} from "../users/schemas/user.schema";
import {Review} from "./schemas/rating.schema";
import {AuthGuard} from "@nestjs/passport";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../auth/decorators/roles.decorator";
import {ParseObjectIdPipe} from "../users/pipes/object-id.pipe";
import {UpdateRatingDto} from "./dtos/update-rating.dto";

@Controller('ratings')
export class RatingsController {
    constructor(private RatingsService  : RatingsService){
    }

    @Post()
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @Roles('user')
    create(@Body(ValidationPipe) body:CreateRatingDto,@CurrentUser() user:User)  : Promise<Review>{
        return this.RatingsService.create(body,user)
    }

    @Patch('/:id')
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @Roles('user')
    update(@Param('id',ParseObjectIdPipe) id:string ,@Body(ValidationPipe) body:UpdateRatingDto,@CurrentUser() user:User){
        return this.RatingsService.update(id,body,user)
    }

    @Delete('/:id')
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @Roles('user')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id',ParseObjectIdPipe)id:string){
        return this.RatingsService.delete(id)
    }

}
