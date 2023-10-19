import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [JwtModule, forwardRef(() => UserModule), AdminModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
