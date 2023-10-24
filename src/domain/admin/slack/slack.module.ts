import { Module, forwardRef } from '@nestjs/common';

import { AuthModule } from 'src/domain/auth/auth.module';
import { SlackController } from './slack.controller';
import { FeedModule } from '../feed/feed.module';

@Module({
  imports: [forwardRef(() => AuthModule), FeedModule],
  controllers: [SlackController],
  providers: [],
})
export class SlackModule {}
