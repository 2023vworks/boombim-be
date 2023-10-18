import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeedEntity } from '@app/entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { AdminFeedController } from './admin-feed.controller';
import { FeedController } from './feed.controller';
import { FeedRepositoryImpl, FeedRepositoryToken } from './feed.repository';
import { FeedServiceImpl, FeedServiceToken } from './feed.service';
import { UploadModule } from './upload/upload.module';
import {
  AdminFeedServiceImpl,
  AdminFeedServiceToken,
} from './admin-feed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedEntity]),
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
    {
      provide: FeedRepositoryToken,
      useClass: FeedRepositoryImpl,
    },
  ],
})
export class FeedModule {}
