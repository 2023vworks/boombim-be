import { Module } from '@nestjs/common';
import { CustomLoggerModule } from './logger';

@Module({
  imports: [CustomLoggerModule],
  exports: [CustomLoggerModule],
})
export class GlobalModule {}
