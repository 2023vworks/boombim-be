import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GeoMarkModule } from './geo-mark/geo-mark.module';

@Module({
  imports: [UserModule, AuthModule, GeoMarkModule],
})
export class DomainModule {}
