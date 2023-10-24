import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GeoMarkModule } from './geo-mark/geo-mark.module';
import { FeedModule } from './feed/feed.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [UserModule, AuthModule, GeoMarkModule, FeedModule, AdminModule],
})
export class DomainModule {}
