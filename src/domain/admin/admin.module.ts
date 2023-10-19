import { Module } from '@nestjs/common';
import { AdminRepositoryImpl, AdminRepositoryToken } from './admin.repository';

@Module({
  providers: [
    {
      provide: AdminRepositoryToken,
      useClass: AdminRepositoryImpl,
    },
  ],
  exports: [AdminRepositoryToken],
})
export class AdminModule {}
