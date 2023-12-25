import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@app/entity';
import { FeedModule } from '../feed/feed.module';
import { UserController } from './user.controller';
import { UserRepositoryPort, UserRepository } from './user.repository';
import { UserServiceUseCase, UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => FeedModule),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: UserServiceUseCase,
      useClass: UserService,
    },
    {
      provide: UserRepositoryPort,
      useClass: UserRepository,
    },
  ],
  exports: [UserRepositoryPort],
})
export class UserModule {}
