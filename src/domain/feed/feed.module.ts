import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeedEntity } from '@app/entity';
import { FeedController } from './feed.controller';
import { FeedServiceImpl, FeedServiceToken } from './feed.service';
import { FeedRepositoryImpl, FeedRepositoryToken } from './feed.repository';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([FeedEntity]), AuthModule, UserModule],
  controllers: [FeedController],
  providers: [
    {
      provide: FeedServiceToken,
      useClass: FeedServiceImpl,
    },
    {
      provide: FeedRepositoryToken,
      useClass: FeedRepositoryImpl,
    },
  ],
})
export class FeedModule {}
