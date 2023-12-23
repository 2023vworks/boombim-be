import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GeoMarkEntity } from '@app/entity';
import { GeoMarkController } from './geo-mark.controller';
import { GeoMarkServiceUseCase, GeoMarkService } from './geo-mark.service';
import {
  BaseGeoMarkRepository,
  GeoMarkRepository,
} from './geo-mark.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GeoMarkEntity])],
  controllers: [GeoMarkController],
  providers: [
    {
      provide: GeoMarkServiceUseCase,
      useClass: GeoMarkService,
    },
    {
      provide: BaseGeoMarkRepository,
      useClass: GeoMarkRepository,
    },
  ],
})
export class GeoMarkModule {}
