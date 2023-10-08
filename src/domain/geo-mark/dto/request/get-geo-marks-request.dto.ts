import { CursorPaginationDTO } from '@app/common';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsIn,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetGeoMarksRequestDTO extends CursorPaginationDTO {
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
    테스트용( default = Coordinates ): 
    - Coordinates: 단순 좌표 검색
    - Polygon: Polygon 검색
    `,
    type: String,
  })
  @Expose()
  // @IntValidatorOptional() // TODO: 버그 개선 필요
  @IsOptional()
  @IsString()
  @IsIn(['Coordinates', 'Polygon'])
  readonly testType: 'Coordinates' | 'Polygon';

  @ApiHideProperty()
  @IsOptional()
  @Expose()
  readonly sort = 'DESC';
}
