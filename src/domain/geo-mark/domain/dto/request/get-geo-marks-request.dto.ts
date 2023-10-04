import { CurserPaginationDTO } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsLatitude, IsLongitude } from 'class-validator';

export class GetGeoMarksRequestDTO extends CurserPaginationDTO {
  @ApiProperty({
    description: '경도(x좌표)',
    type: Number,
    minimum: -180,
    maximum: 180,
  })
  @Expose()
  @IsLongitude()
  readonly minX: number;

  @ApiProperty({
    description: '경도(x좌표)',
    type: Number,
    minimum: -180,
    maximum: 180,
  })
  @Expose()
  @IsLongitude()
  readonly maxX: number;

  @ApiProperty({
    description: '위도(y좌표)',
    type: Number,
    minimum: -90,
    maximum: 90,
  })
  @Expose()
  @IsLatitude()
  readonly minY: number;

  @ApiProperty({
    description: '위도(y좌표)',
    type: Number,
    minimum: -90,
    maximum: 90,
  })
  @Expose()
  @IsLatitude()
  readonly maxY: number;
}
