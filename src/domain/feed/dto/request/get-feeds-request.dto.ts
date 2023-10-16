import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsIn, IsLatitude, IsLongitude, IsOptional } from 'class-validator';

import { OffsetPaginationDTO } from '@app/common';

/**
 * 피드 리스트 조회 요청 DTO body
 */
export class GetFeedsRequestDTO extends OffsetPaginationDTO {
  @ApiProperty({
    description: '경도(x좌표)',
    type: Number,
    minimum: -180,
    maximum: 180,
    default: 127,
  })
  @Expose()
  @IsLongitude()
  readonly minX: number;

  @ApiProperty({
    description: '경도(x좌표)',
    type: Number,
    minimum: -180,
    maximum: 180,
    default: 127.5,
  })
  @Expose()
  @IsLongitude()
  readonly maxX: number;

  @ApiProperty({
    description: '위도(y좌표)',
    type: Number,
    minimum: -90,
    maximum: 90,
    default: 37,
  })
  @Expose()
  @IsLatitude()
  readonly minY: number;

  @ApiProperty({
    description: '위도(y좌표)',
    type: Number,
    minimum: -90,
    maximum: 90,
    default: 37.7,
  })
  @Expose()
  @IsLatitude()
  readonly maxY: number;

  @ApiPropertyOptional({
    description: `
    테스트용( default = Polygon ): 
    - Coordinates: 단순 좌표 검색
    - Polygon: Polygon 검색
    `,
    type: String,
  })
  @Expose()
  @IsOptional()
  @IsIn(['Coordinates', 'Polygon'])
  readonly testType: 'Coordinates' | 'Polygon';
}
