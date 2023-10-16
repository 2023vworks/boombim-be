import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@app/entity';
import { UserController } from './user.controller';
import { UserRepositoryImpl, UserRepositoryToken } from './user.repository';
import { UserServiceImpl, UserServiceToken } from './user.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthModule),
  ],
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
  exports: [UserRepositoryToken],
})
export class UserModule {}
