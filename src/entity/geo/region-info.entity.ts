import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, OneToOne } from 'typeorm';

import { EnumValidator, NumberValidator, StringValidator } from '@app/common';
import { BaseEntity } from '../base.entity';
import { RegionType } from '../enum';
import { GeoMarkEntity } from './geo-mark.entity';

/**
 * 좌표로 행정구역정보 받기
 * @docs https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-district-response-body-document
 */
@Entity('region_info')
export class RegionInfoEntity extends BaseEntity {
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

  /**
   * 전체 지역 명칭
   */
  @ApiProperty({ description: '전체 지역 명칭', type: String })
  @Expose()
  @StringValidator()
  @Column('varchar', { comment: '전체 지역 명칭' })
  addressName: string;

  /**
   * 지역 1Depth, 시도 단위 바다 영역은 존재하지 않음
   */
  @ApiProperty({
    description: '지역 1Depth, 시도 단위 바다 영역은 존재하지 않음',
    type: String,
  })
  @Expose()
  @StringValidator()
  @Column('varchar', {
    comment: '지역 1Depth, 시도 단위 바다 영역은 존재하지 않음',
  })
  region1DepthName: string;

  /**
   * 지역 2Depth, 구 단위 바다 영역은 존재하지 않음
   */
  @ApiProperty({
    description: '지역 2Depth, 구 단위 바다 영역은 존재하지 않음',
    type: String,
  })
  @Expose()
  @StringValidator()
  @Column('varchar', {
    comment: '지역 2Depth, 구 단위 바다 영역은 존재하지 않음',
  })
  region2DepthName: string;

  /**
   * 지역 3Depth, 동 단위 바다 영역은 존재하지 않음
   */
  @ApiProperty({
    description: '지역 3Depth, 동 단위 바다 영역은 존재하지 않음',
    type: String,
  })
  @Expose()
  @StringValidator()
  @Column('varchar', {
    comment: '지역 3Depth, 동 단위 바다 영역은 존재하지 않음',
  })
  region3DepthName: string;

  /**
   * 지역 4Depth, 리 영역인 경우만 존재 regionType이 법정동이며;
   */
  @ApiProperty({
    description: '지역 4Depth, 리 영역인 경우만 존재 regionType이 법정동이며;',
    type: String,
  })
  @Expose()
  @StringValidator()
  @Column('varchar', {
    comment: '지역 4Depth, 리 영역인 경우만 존재 regionType이 법정동이며;',
  })
  region4DepthName: string;

  /**
   * region 코드
   */
  @ApiProperty({ description: 'region 코드', type: String })
  @Expose()
  @StringValidator()
  @Column('varchar', { comment: 'region 코드' })
  code: string;

  /**
   * X 좌표값, 경위도인 경우 경도(longitude)
   * - Double
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
   * Y 좌표값, 경위도인 경우 위도(latitude)
   * - Double
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

  /* ========== 연관관계 ==========*/
  /**
   * 마커
   * - 연관관계 주인은 마커이다.
   */
  @ApiHideProperty()
  @Exclude()
  @OneToOne(() => GeoMarkEntity)
  geoMark: GeoMarkEntity;
}
