import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUserController } from './app_user.controller';
import { AppUserService } from './app_user.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AppUserController],
  providers: [AppUserService],
})
export class AppUserModule {}
