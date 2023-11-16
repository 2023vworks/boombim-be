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
import { FeedServiceImpl, FeedServiceToken } from './feed.service';
import {
  CommentRepositoryImpl,
  CommentRepositoryToken,
  FeedRepositoryImpl,
  FeedRepositoryToken,
  RecommendHistoryRepositoryImpl,
  RecommendHistoryRepositoryToken,
  ReportHistoryRepositoryImpl,
  ReportHistoryRepositoryToken,
} from './repository';
import { UploadModule } from './upload/upload.module';

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
    forwardRef(() => UserModule),
    UploadModule,
  ],
  controllers: [FeedController],
  providers: [
    {
      provide: FeedServiceToken,
      useClass: FeedServiceImpl,
    },
    ...repositories,
  ],
  exports: [FeedRepositoryToken],
})
export class FeedModule {}
