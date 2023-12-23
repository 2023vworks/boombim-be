import { Module } from '@nestjs/common';
import { BaseAdminRepository, AdminRepository } from './admin.repository';
import { FeedModule } from './feed/feed.module';
import { SlackModule } from './slack/slack.module';

@Module({
  imports: [FeedModule, SlackModule],
  providers: [
    {
      provide: BaseAdminRepository,
      useClass: AdminRepository,
    },
  ],
  exports: [BaseAdminRepository],
})
export class AdminModule {}
