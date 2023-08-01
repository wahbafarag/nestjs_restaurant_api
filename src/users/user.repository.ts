import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(userBody: CreateUserDto): Promise<User> {
    const { email, password, name, age } = userBody;
    const emailExist = await this.userModel.find({ email });
    if (emailExist.length > 0) {
      throw new ConflictException('This Email already exists,Use another one');
    }

    const hashedPass = await bcrypt.hash(password, 12);
    const user = await this.userModel.create({
      name,
      age,
      email,
      password: hashedPass,
    });
    user.password = undefined;
    return user;
  }

  async update(user: UpdateUserDto, id: string): Promise<User> {
    const { email } = user;
    if ((await this.userModel.find({ email })).length > 0) {
      throw new ConflictException('Email already in use');
    }

    return await this.userModel.findByIdAndUpdate(id, user, { new: true });
  }

  async find(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findByEmail(email: string): Promise<User> {
    if ((await this.userModel.find({ email })).length === 0)
      throw new BadRequestException('Invalid Email');
    return await this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }
}
