import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body(ValidationPipe) body: SignUpDto) {
    return await this.authService.signUp(body);
  }

  @Post('login')
  async login(@Body(ValidationPipe) body: LoginDto) {
    return await this.authService.login(body);
  }
}
