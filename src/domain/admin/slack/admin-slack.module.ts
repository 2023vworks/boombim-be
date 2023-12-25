import { Module, forwardRef } from '@nestjs/common';

import { AuthModule } from 'src/domain/auth/auth.module';
import { AdminSlackController } from './admin-slack.controller';
import { AdminFeedModule } from '../feed/admin-feed.module';

@Module({
  imports: [forwardRef(() => AuthModule), AdminFeedModule],
  controllers: [AdminSlackController],
  providers: [],
})
export class AdminSlackModule {}
