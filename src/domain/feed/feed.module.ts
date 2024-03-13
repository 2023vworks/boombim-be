import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CommentEntity,
  FeedEntity,
  RecommendHistoryEntity,
  ReportHistoryEntity,
} from '@app/entity';
import { UserModule } from '../user/user.module';
import { FeedController } from './feed.controller';
import { FeedService, FeedServiceUseCase } from './feed.service';
import {
  CommentRepository,
  CommentRepositoryPort,
  FeedRepository,
  FeedRepositoryPort,
  RecommendHistoryRepository,
  RecommendHistoryRepositoryPort,
  ReportHistoryRepository,
  ReportHistoryRepositoryPort,
} from './repository';
import { UploadModule } from './upload/upload.module';
import { FeedScheduler } from './scheduler/feed.scheduler';

const entities = [
  FeedEntity,
  CommentEntity,
  RecommendHistoryEntity,
  ReportHistoryEntity,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([...entities]),
    forwardRef(() => UserModule),
    UploadModule,
  ],
  controllers: [FeedController],
  providers: [
    {
      provide: FeedServiceUseCase,
      useClass: FeedService,
    },
    // Repository providers
    { provide: FeedRepositoryPort, useClass: FeedRepository },
    { provide: CommentRepositoryPort, useClass: CommentRepository },
    {
      provide: RecommendHistoryRepositoryPort,
      useClass: RecommendHistoryRepository,
    },
    {
      provide: ReportHistoryRepositoryPort,
      useClass: ReportHistoryRepository,
    },
    FeedScheduler,
  ],
  exports: [FeedRepositoryPort, CommentRepositoryPort],
})
export class FeedModule {}
