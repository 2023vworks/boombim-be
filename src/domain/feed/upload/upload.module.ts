import { Module } from '@nestjs/common';
import { UploadServiceImpl, UploadServiceToken } from './upload.service';

@Module({
  providers: [
    {
      provide: UploadServiceToken,
      useClass: UploadServiceImpl,
    },
  ],
  exports: [UploadServiceToken],
})
export class UploadModule {}
