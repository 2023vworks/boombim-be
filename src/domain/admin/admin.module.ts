import { Module } from '@nestjs/common';
import { AdminRepositoryImpl, AdminRepositoryToken } from './admin.repository';
import { FeedModule } from './feed/feed.module';

@Module({
  imports: [FeedModule],
  providers: [
    {
      provide: AdminRepositoryToken,
      useClass: AdminRepositoryImpl,
    },
  ],
  exports: [AdminRepositoryToken],
})
export class AdminModule {}
