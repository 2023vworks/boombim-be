import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { Expose } from 'class-transformer';

import { BooleanValidator, IntValidator, StringValidator } from '@app/common';
import { GeoMark } from '../geo';
import { Timestamp } from '../timestamp.entity';
import { User } from '../user';
import { Comment } from './comment.entity';
import { RecommendHistory } from './recommend-history.entity';
import { ReportHistory } from './report-history.entity';

@Entity('feed')
export class Feed extends Timestamp {
  /**
   * 피드 활성도
   * - 1 ~ 5
   * - default 1
   */
  @ApiProperty({
    description: '피드 활성도',
    type: Number,
    minimum: 1,
    maximum: 5,
    default: 1,
  })
  @Expose()
  @IntValidator({ min: 1, max: 5 })
  @Column('smallint', { comment: '피드 활성도', default: 1 })
  activity: number;

  /**
   * 피드 내용
   * - 140자
   * - 3byte * 140 = 420
   */
  @ApiProperty({
    description: '피드 내용',
    type: String,
    minLength: 3,
    maxLength: 420,
  })
  @Expose()
  @StringValidator({ minLength: 3, maxLength: 420 })
  @Column('varchar', { comment: '피드 내용', length: 420 })
  content: string;

  /**
   * 썸네일 이미지 리스트
   * - min 0
   * - max 5
   * - default []
   */
  @ApiProperty({
    description: '썸네일 이미지 리스트',
    type: [String],
    minItems: 0,
    maxItems: 5,
  })
  @Expose()
  @StringValidator({ arrayMinSize: 0, arrayMaxSize: 5 }, { each: true })
  @Column('text', {
    comment: '썸네일 이미지 리스트',
    array: true,
    default: '{}',
  })
  thumbnailImages: string[] | [];

  /**
   * 이미지 리스트
   * - min 0
   * - max 5
   * - default []
   */
  @ApiProperty({
    description: '이미지 리스트',
    type: [String],
    minItems: 0,
    maxItems: 5,
  })
  @Expose()
  @StringValidator({ arrayMinSize: 0, arrayMaxSize: 5 }, { each: true })
  @Column('text', {
    comment: '이미지 리스트',
    array: true,
    default: '{}',
  })
  images: string[] | [];

  /**
   * 해시태그 리스트
   * - default []
   */
  @ApiProperty({ description: '해시태그 리스트', type: [String] })
  @Expose()
  @StringValidator({}, { each: true })
  @Column('text', {
    comment: '해시태그 리스트',
    array: true,
    default: '{}',
  })
  hashTags: string[] | [];

  /**
   * 피드 활성화 여부
   * - default true
   * - 피드 남은 시간 0 이하면 false
   * - 피드 남은 시간 = 생성된 시간 + (추천수 * 30) - (비추천 * 15)
   */
  @ApiProperty({ description: '피드 활성화 여부', type: Boolean })
  @Expose()
  @BooleanValidator()
  @Column('boolean', { comment: '피드 활성화 여부', default: true })
  isActive: boolean;

  /**
   * 추천수
   * - default 0
   */
  @ApiProperty({ description: '추천수', type: Number })
  @Expose()
  @IntValidator({ min: 0 })
  @Column('integer', { comment: '추천수', default: 0 })
  recommendCount: number;

  /**
   * 비추천수
   * - default 0
   */
  @ApiProperty({ description: '비추천수', type: Number })
  @Expose()
  @IntValidator({ min: 0 })
  @Column('integer', { comment: '비추천수', default: 0 })
  unrecommendCount: number;

  /**
   * 신고수
   * - default 0
   */
  @ApiProperty({ description: '신고수', type: Number })
  @Expose()
  @IntValidator({ min: 0 })
  @Column('integer', { comment: '신고수', default: 0 })
  reportCount: number;

  /**
   * 조회수
   * - default 0
   */
  @ApiProperty({ description: '조회수', type: Number })
  @Expose()
  @IntValidator({ min: 0 })
  @Column('integer', { comment: '조회수', default: 0 })
  view: number;

  /* ========== 연관관계 ==========*/
  user: User;
  geoMark: GeoMark;
  comments: Comment[] | [];
  recommendHistories: RecommendHistory[] | [];
  reportHistories: ReportHistory[] | [];
}
