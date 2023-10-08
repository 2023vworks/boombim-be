import { IntValidator, defaultResponseProperties } from '@app/common';
import { GeoMarkEntity } from '@app/entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetGeoMarksResponseDTO extends PickType(GeoMarkEntity, [
  ...defaultResponseProperties,
  'x',
  'y',
  'type',
]) {
  @ApiProperty({
    description: '피드 활성도',
    type: Number,
    minimum: 1,
    maximum: 5,
    default: 1,
  })
  @Expose()
  @IntValidator({ min: 1, max: 5 })
  activity: number;
}
