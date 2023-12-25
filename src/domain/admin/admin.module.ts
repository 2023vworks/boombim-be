import { Module } from '@nestjs/common';
import { AdminRepositoryPort, AdminRepository } from './admin.repository';
import { AdminFeedModule } from './feed/admin-feed.module';
import { AdminSlackModule } from './slack/admin-slack.module';

@Module({
  imports: [AdminFeedModule, AdminSlackModule],
  providers: [
    {
      provide: AdminRepositoryPort,
      useClass: AdminRepository,
    },
  ],
  exports: [AdminRepositoryPort],
})
export class AdminModule {}
