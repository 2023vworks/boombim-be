import { Module } from '@nestjs/common';
import { AdminRepositoryPort, AdminRepository } from './admin.repository';
import { FeedModule } from './feed/feed.module';
import { SlackModule } from './slack/slack.module';

@Module({
  imports: [FeedModule, SlackModule],
  providers: [
    {
      provide: AdminRepositoryPort,
      useClass: AdminRepository,
    },
  ],
  exports: [AdminRepositoryPort],
})
export class AdminModule {}
