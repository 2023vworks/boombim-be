import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AdminModule } from '../admin/admin.module';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [JwtModule, UserModule, AdminModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
