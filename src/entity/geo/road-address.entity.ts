import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, OneToOne } from 'typeorm';

import { StringValidator } from '@app/common';
import { BaseEntity } from '../base.entity';
import { GeoMarkEntity } from './geo-mark.entity';
import { IsIn } from 'class-validator';

/**
 * 도로명 주소 상세 정보
 * @docs https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-address-response-body-road-address
 */
@Entity('road_address')
export class RoadAddressEntity extends BaseEntity {
  /**
   * 전체 도로명 주소
   */
  @ApiProperty({ description: '전체 도로명 주소', type: String })
  @Expose()
  @StringValidator()
  @Column('varchar', { comment: '전체 도로명 주소' })
  addressName: string;

  /**
   * 지역명1
   */
  @ApiProperty({ description: '지역명1', type: String })
  @Expose()
  @StringValidator()
  @Column('varchar', { comment: '지역명1' })
  region1DepthName: string;

  /**
   * 지역명2
   */
  @ApiProperty({ description: '지역명2', type: String })
  @Expose()
  @StringValidator()
  @Column('varchar', { comment: '지역명2' })
  region2DepthName: string;

  /**
   * 지역명3
   */
  @ApiProperty({ description: '지역명3', type: String })
  @Expose()
  @StringValidator()
  @Column('varchar', { comment: '지역명3' })
  region3DepthName: string;

  /**
   * 도로명
   */
  @ApiProperty({ description: '도로명', type: String })
  @Expose()
  @StringValidator()
  @Column('varchar', { comment: '도로명' })
  roadName: string;

  /**
   * 지하 여부, Y 또는 N
   */
  @ApiProperty({
    description: '지하 여부, Y 또는 N',
    type: String,
    default: 'N',
  })
  @Expose()
  @StringValidator()
  @IsIn(['Y', 'N'])
  @Column('char', { comment: '지하 여부, Y 또는 N', length: 1 })
  undergroundYn: 'Y' | 'N';

  /**
   * 건물 본번
   */
  @ApiProperty({ description: '건물 본번', type: String })
  @Expose()
  @StringValidator()
  @Column('varchar', { comment: '건물 본번' })
  mainBuildingNo: string;

  /**
   * 건물 부번, 없을 경우 빈 문자열("") 반환
   */
  @ApiProperty({
    description: '건물 부번, 없을 경우 빈 문자열("") 반환',
    type: String,
  })
  @Expose()
  @StringValidator()
  @Column('varchar', { comment: '건물 부번, 없을 경우 빈 문자열("") 반환' })
  subBuildingNo: string;

  /**
   * 건물 이름
   */
  @ApiProperty({ description: '건물 이름', type: String })
  @Expose()
  @StringValidator()
  @Column('varchar', { comment: '건물 이름' })
  buildingName: string;

  /**
   * 우편번호(5자리)
   */
  @ApiProperty({
    description: '우편번호(5자리)',
    type: String,
    default: '12345',
  })
  @Expose()
  @StringValidator({ minLength: 5, maxLength: 5 })
  @Column('char', { comment: '우편번호(5자리)', length: 5 })
  zoneNo: string;

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
