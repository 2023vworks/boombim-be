import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeedEntity } from '@app/entity';
import { AuthModule } from '../auth/auth.module';
import { FeedController } from './feed.controller';
import { FeedServiceImpl, FeedServiceToken } from './feed.service';
import { FeedRepositoryImpl, FeedRepositoryToken } from './feed.repository';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([FeedEntity])],
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
