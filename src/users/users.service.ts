import { Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  async create(user: CreateUserDto): Promise<User> {
    return await this.userRepository.create(user);
  }

  async find(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findByEmail(email);
  }

  async update(userData: UpdateUserDto, id: string): Promise<User> {
    return await this.userRepository.update(userData, id);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
