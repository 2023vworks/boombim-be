import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@app/entity';
import { UserController } from './user.controller';
import { UserRepositoryImpl, UserRepositoryToken } from './user.repository';
import { UserServiceImpl, UserServiceToken } from './user.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
  controllers: [UserController],
  providers: [
    {
      useClass: UserServiceImpl,
      provide: UserServiceToken,
    },
    {
      useClass: UserRepositoryImpl,
      provide: UserRepositoryToken,
    },
  ],
})
export class UserModule {}
