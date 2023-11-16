import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Equals, IsLatitude, IsLongitude } from 'class-validator';

import {
  EnumValidator,
  OffsetPaginationDTO,
  StringValidator,
} from '@app/common';
import { RegionType } from '@app/entity';

/**
 * 피드 리스트 조회 요청 DTO body
 */
export class GetFeedsRequestDTO extends OmitType(OffsetPaginationDTO, [
  'sort',
]) {
  @ApiProperty({
    description: '유저의 위치 - 경도(x좌표)',
    type: Number,
    minimum: -180,
    maximum: 180,
    default: 127.5,
  })
  @Expose()
  @IsLongitude()
  readonly centerX: number;

  @ApiProperty({
    description: '유저의 위치 - 위도(y좌표)',
    type: Number,
    minimum: -90,
    maximum: 90,
    default: 37,
  })
  @Expose()
  @IsLatitude()
  readonly centerY: number;

  @ApiProperty({
    description: `H 또는 B\n
    - H(행정동): 지원
    - B(범정동): 미지원
    `,
    type: String,
    default: RegionType.H,
  })
  @Expose()
  @EnumValidator(RegionType)
  @Equals(RegionType.H)
  regionType: RegionType.H;

  @ApiProperty({
    description: `조회할 행정동 정보\n
    - ,(콤마)를 사용하여 다중 조회 가능하다.
    `,
    type: String,
    default: '잠실6동,송파1동,석촌동,잠실3동',
  })
  @Expose()
  @Transform(({ value }) => value && value.split(','))
  @StringValidator({ minLength: 1 }, { each: true })
  dongs: string[];
}
