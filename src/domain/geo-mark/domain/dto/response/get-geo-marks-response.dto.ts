import { defaultResponseProperties } from '@app/common';
import { GeoMarkEntity } from '@app/entity';
import { PickType } from '@nestjs/swagger';

export class GetGeoMarksResponseDTO extends PickType(GeoMarkEntity, [
  ...defaultResponseProperties,
  'x',
  'y',
  'type',
]) {}
