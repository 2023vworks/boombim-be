import { Global, Logger, Module } from '@nestjs/common';
import { CustomLoggerService } from './custom-logger.service';

@Global()
@Module({
  providers: [CustomLoggerService, Logger],
  exports: [CustomLoggerService],
})
export class CustomLoggerModule {}
