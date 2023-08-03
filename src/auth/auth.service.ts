import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { User } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signToken(userId: string, jwtService: JwtService) {
    const payload = { id: userId };
    const token = await jwtService.sign(payload);
    return token;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async signUp(body: SignUpDto): Promise<{
    user: User;
    token: string;
  }> {
    const user = await this.usersService.create(body);
    const token = await this.signToken(user.id, this.jwtService);
    return { user, token };
  }

  async login(body: LoginDto): Promise<{ token: string }> {
    const { email, password } = body;
    const user = await this.userModel.findOne({ email }).populate('password');
    if (!user) throw new NotFoundException('Invalid Credentials');

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new NotFoundException('Invalid Credentials');

    return {
      token: await this.signToken(user.id, this.jwtService),
    };
  }
}
