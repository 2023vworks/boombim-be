import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, OneToOne } from 'typeorm';

import { StringValidator } from '@app/common';
import { BaseEntity } from '../base.entity';
import { GeoMarkEntity } from './geo-mark.entity';

/**
 * 지번 주소 상세 정보
 * @docs https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-address-response-body-address
 */
@Entity('address')
export class AddressEntity extends BaseEntity {
  /**
   * 전체 지번 주소
   */
  @ApiProperty({ description: '전체 지번 주소', type: String })
  @Expose()
  @StringValidator()
  @Column('varchar', { comment: '전체 지번 주소' })
  addressName: string;

  /**
   * 지역 1 Depth, 시도 단위
   */
  @ApiProperty({ description: '지역 1 Depth, 시도 단위', type: String })
  @Expose()
  @StringValidator()
  @Column('varchar', { comment: '지역 1 Depth, 시도 단위' })
  region1DepthName: string;

  /**
   * 지역 2 Depth, 구 단위
   */
  @ApiProperty({ description: '지역 2 Depth, 시도 단위', type: String })
  @Expose()
  @StringValidator()
  @Column('varchar', { comment: '지역 2 Depth, 시도 단위' })
  region2DepthName: string;

  /**
   * 지역 3 Depth, 동 단위
   */
  @ApiProperty({ description: '지역 3 Depth, 동 단위', type: String })
  @Expose()
  @StringValidator()
  @Column('varchar', { comment: '지역 3 Depth, 동 단위' })
  region3DepthName: string;

  /**
   * 지역 3 Depth, 행정동 명칭
   */
  @ApiProperty({ description: '지역 3 Depth, 행정동 명칭', type: String })
  @Expose()
  @StringValidator()
  @Column('varchar', { comment: '지역 3 Depth, 행정동 명칭' })
  region3DepthHName: string;

  /**
   * 산 여부, Y 또는 N
   */
  @ApiProperty({ description: '산 여부, Y 또는 N', type: String })
  @Expose()
  @StringValidator()
  @Column('char', { comment: '산 여부, Y 또는 N', length: 1 })
  mountainYn: 'Y' | 'N';

  /**
   * 지번 주번지
   */
  @ApiProperty({ description: '지번 주번지', type: String })
  @Expose()
  @StringValidator()
  @Column('varchar', { comment: '지번 주번지' })
  mainAddressNo: string;

  /**
   *  지번 부번지, 없을 경우 빈 문자열("") 반환
   */
  @ApiProperty({
    description: '지번 부번지, 없을 경우 빈 문자열("") 반환',
    type: String,
  })
  @Expose()
  @StringValidator()
  @Column('varchar', { comment: '지번 부번지, 없을 경우 빈 문자열("") 반환' })
  subAddressNo: string;

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
