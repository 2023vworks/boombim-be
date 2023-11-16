import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@app/entity';
import { FeedModule } from '../feed/feed.module';
import { UserController } from './user.controller';
import { UserRepositoryImpl, UserRepositoryToken } from './user.repository';
import { UserServiceImpl, UserServiceToken } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => FeedModule),
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
