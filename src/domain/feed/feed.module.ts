import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CommentEntity,
  FeedEntity,
  RecommendHistoryEntity,
  ReportHistoryEntity,
} from '@app/entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { AdminFeedController } from './admin-feed.controller';
import { FeedController } from './feed.controller';
import { FeedServiceImpl, FeedServiceToken } from './feed.service';
import { UploadModule } from './upload/upload.module';
import {
  AdminFeedServiceImpl,
  AdminFeedServiceToken,
} from './admin-feed.service';
import {
  FeedRepositoryImpl,
  FeedRepositoryToken,
  CommentRepositoryImpl,
  CommentRepositoryToken,
  RecommendHistoryRepositoryImpl,
  RecommendHistoryRepositoryToken,
  ReportHistoryRepositoryImpl,
  ReportHistoryRepositoryToken,
} from './repository';

const entities = [
  FeedEntity,
  CommentEntity,
  RecommendHistoryEntity,
  ReportHistoryEntity,
];
const repositories = [
  { provide: FeedRepositoryToken, useClass: FeedRepositoryImpl },
  { provide: CommentRepositoryToken, useClass: CommentRepositoryImpl },
  {
    provide: RecommendHistoryRepositoryToken,
    useClass: RecommendHistoryRepositoryImpl,
  },
  {
    provide: ReportHistoryRepositoryToken,
    useClass: ReportHistoryRepositoryImpl,
  },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([...entities]),
    AuthModule,
    UserModule,
    UploadModule,
  ],
  controllers: [FeedController, AdminFeedController],
  providers: [
    {
      provide: FeedServiceToken,
      useClass: FeedServiceImpl,
    },
    {
      provide: AdminFeedServiceToken,
      useClass: AdminFeedServiceImpl,
    },
    ...repositories,
  ],
})
export class FeedModule {}
