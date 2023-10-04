import { Module } from '@nestjs/common';
import { GeoMarkController } from './geo-mark.controller';
import { GeoMarkService } from './geo-mark.service';

@Module({
  controllers: [GeoMarkController],
  providers: [GeoMarkService],
})
export class GeoMarkModule {}
