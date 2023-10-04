import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GeoMarkEntity } from '@app/entity';
import { GeoMarkController } from './geo-mark.controller';
import { GeoMarkServiceImpl, GeoMarkServiceToken } from './geo-mark.service';
import {
  GeoMarkRepositoryImpl,
  GeoMarkRepositoryToken,
} from './geo-mark.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GeoMarkEntity])],
  controllers: [GeoMarkController],
  providers: [
    {
      useClass: GeoMarkServiceImpl,
      provide: GeoMarkServiceToken,
    },
    {
      useClass: GeoMarkRepositoryImpl,
      provide: GeoMarkRepositoryToken,
    },
  ],
})
export class GeoMarkModule {}
