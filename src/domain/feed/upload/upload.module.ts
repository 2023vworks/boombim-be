import { Module } from '@nestjs/common';
import { UploadService, UploadServiceUseCase } from './upload.service';

@Module({
  providers: [
    {
      provide: UploadServiceUseCase,
      useClass: UploadService,
    },
  ],
  exports: [UploadServiceUseCase],
})
export class UploadModule {}
