import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@app/entity';
import { UserController } from './user.controller';
import { UserRepositoryImpl, UserRepositoryToken } from './user.repository';
import { UserServiceImpl, UserServiceToken } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
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
