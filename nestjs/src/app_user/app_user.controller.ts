import { Body, Controller, Post } from '@nestjs/common';
import { AppUserService } from './app_user.service';
import { LoginDto, RegisterDto } from './dto/app_user.dto';

@Controller('auth')
export class AppUserController {
  constructor(private readonly service: AppUserService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }
}
