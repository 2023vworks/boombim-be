import { Module } from '@nestjs/common';
import { AdminRepositoryImpl, AdminRepositoryToken } from './admin.repository';
import { FeedModule } from './feed/feed.module';
import { SlackModule } from './slack/slack.module';

@Module({
  imports: [FeedModule, SlackModule],
  providers: [
    {
      provide: AdminRepositoryToken,
      useClass: AdminRepositoryImpl,
    },
  ],
  exports: [AdminRepositoryToken],
})
export class AdminModule {}
