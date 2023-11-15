import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToOne, Point } from 'typeorm';

import { EnumValidator, NumberValidator, StringValidator } from '@app/common';
import { BaseEntity } from '../base.entity';
import { CoordType, RegionType } from '../enum';
import { FeedEntity } from '../feed';
import { AddressEntity } from './address.entity';
import { RegionInfoEntity } from './region-info.entity';
import { RoadAddressEntity } from './road-address.entity';

@Entity('geo_mark')
export class GeoMarkEntity extends BaseEntity {
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
    description: '위도(y좌표)',
    type: Number,
    minimum: 0,
  })
  @Expose()
  @NumberValidator({ min: 0 })
  @Column('decimal', { comment: '위도(y좌표)' })
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
   * H(행정동) 또는 B(법정동)
   */
  @ApiProperty({
    description: 'H(행정동) 또는 B(법정동)',
    enum: RegionType,
  })
  @Expose()
  @EnumValidator(RegionType)
  @Column('enum', { enum: RegionType, comment: 'H(행정동) 또는 B(법정동)' })
  regionType: RegionType;

  @ApiProperty({
    description: `GeoMark가 속하는 지역 이름 
    - regionType(행정동 or 법정동)에 따른 지역 명칭`,
    type: String,
  })
  @Expose()
  @StringValidator()
  @Column('varchar', {
    comment:
      'GeoMark가 속하는 지역 이름, regionType(행정동 or 법정동)에 따른 지역 명칭',
  })
  region: string;

  /**
   * 행정구역 정보
   * - 연관관계 주인은 마커이다.
   * @JoinColumn
   */
  @ApiHideProperty()
  @Exclude()
  @OneToOne(() => RegionInfoEntity, { cascade: true })
  @JoinColumn()
  regionInfo: RegionInfoEntity;

  /**
   * 주소 정보(구)
   * - 연관관계 주인은 마커이다.
   * @JoinColumn
   */
  @ApiHideProperty()
  @Exclude()
  @OneToOne(() => AddressEntity, { cascade: true })
  @JoinColumn()
  address: AddressEntity;

  /**
   * 도로명 주소 정보
   * - 연관관계 주인은 마커이다.
   * - 도로명 주소는 없을 수도 있다.
   * @JoinColumn
   */
  @ApiHideProperty()
  @Exclude()
  @OneToOne(() => RoadAddressEntity, { cascade: true, nullable: true })
  @JoinColumn()
  roadAddress?: RoadAddressEntity | null;

  /* ========== 연관관계 ==========*/
  /**
   * 피드
   * - 연관관계 주인은 피드이다.
   */
  @ApiHideProperty()
  @Exclude()
  @OneToOne(() => FeedEntity)
  feed: FeedEntity;
}
