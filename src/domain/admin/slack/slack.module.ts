import { Module, forwardRef } from '@nestjs/common';

import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';
import { AuthModule } from 'src/domain/auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [SlackController],
  providers: [SlackService],
})
export class SlackModule {}
