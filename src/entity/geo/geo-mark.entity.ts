import { Column, Entity, Point } from 'typeorm';

import { EnumValidator, NumberValidator } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { CoordType } from '../enum';
import { Feed } from '../feed';
import { Timestamp } from '../timestamp.entity';
import { Address } from './address.entity';
import { RegionInfo } from './region-info.entity';
import { RoadAddress } from './road-address.entity';

@Entity('geo_mark')
export class GeoMark extends Timestamp {
  /**
   * 경도(x좌표)
   * - Double
   * - x = longtitue = 경도
   * - 대한민국 x축 범위: 33 ~ 43
   */
  @ApiProperty({
    description: '경도(x좌표)',
    type: Number,
    minimum: 0,
  })
  @Expose()
  @NumberValidator({ min: 0 })
  @Column('decimal', { comment: '경도(x좌표)' })
  x: number;
  /**
   * 위도(y좌표)
   * - Double
   * - y = lattitue = 위도
   * - 대한민국 y축 범위: 124 ~ 132
   */
  @ApiProperty({
    description: '경위도(y좌표)',
    type: Number,
    minimum: 0,
  })
  @Expose()
  @NumberValidator({ min: 0 })
  @Column('decimal', { comment: '경위도(y좌표)' })
  y: number;

  /**
   * 좌표계 타입
   * - default 'WGS84'
   */
  @ApiProperty({
    description: '좌표계 타입',
    enum: CoordType,
  })
  @Expose()
  @EnumValidator(CoordType)
  @Column('enum', { enum: CoordType, comment: '좌표계 타입', default: 'WGS84' })
  type: CoordType;

  /**
   * Postgis의 geometry 타입
   * - point = POINT(x, y)
   * - POINT()는 postgresql의 내장함수이다.
   */
  @Exclude()
  @Column('geometry', { srid: 4326 })
  point: Point;

  /**
   * SRID 식별자
   * - SRID는 "Spatial Reference ID"의 약자로, 공간 데이터를 정의하는 데 사용되는 고유한 식별자이다.
   * - WGS84 기준으로 대한민국은 EPSG 코드는 4326이다.
   * - WGS84 좌표계가 GPS가 사용하는 좌표계이다.
   * - Postgrsql의 Geometry 함수에는 SRID를 사용해야 정확한 값이 나온다.
   */
  @Exclude()
  @Column('smallint', { comment: 'SRID 식별자', default: 4326 })
  srid: 4326 | number;

  /**
   * 행정구역 정보
   */
  regionInfo: RegionInfo;

  /**
   * 주소 정보
   */
  address: Address;

  /**
   * 도로명 주소 정보
   */
  roadAddress?: RoadAddress | null;

  /* ========== 연관관계 ==========*/
  // 관계
  feed: Feed;
}
