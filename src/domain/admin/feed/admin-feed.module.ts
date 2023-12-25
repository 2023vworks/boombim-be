import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeedEntity } from '@app/entity';
import { AuthModule } from 'src/domain/auth/auth.module';
import { AdminFeedController } from './admin-feed.controller';
import {
  AdminFeedRepository,
  AdminFeedRepositoryPort,
} from './admin-feed.repository';
import {
  AdminFeedService,
  AdminFeedServiceUseCase,
} from './admin-feed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [AdminFeedController],
  providers: [
    {
      provide: AdminFeedServiceUseCase,
      useClass: AdminFeedService,
    },
    {
      provide: AdminFeedRepositoryPort,
      useClass: AdminFeedRepository,
    },
  ],
  exports: [AdminFeedServiceUseCase],
})
export class AdminFeedModule {}
