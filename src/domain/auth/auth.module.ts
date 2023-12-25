import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AdminModule } from '../admin/admin.module';
import { UserModule } from '../user/user.module';
import { AuthService, AuthServiceUseCase } from './auth.service';

@Global()
@Module({
  imports: [JwtModule, UserModule, AdminModule],
  providers: [{ provide: AuthServiceUseCase, useClass: AuthService }],
  exports: [AuthServiceUseCase],
})
export class AuthModule {}
