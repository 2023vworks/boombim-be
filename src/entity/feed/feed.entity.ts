import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { BooleanValidator, IntValidator, StringValidator } from '@app/common';
import { BaseEntity } from '../base.entity';
import { GeoMarkEntity } from '../geo';
import { UserEntity } from '../user';
import { CommentEntity } from './comment.entity';
import { RecommendHistoryEntity } from './recommend-history.entity';
import { ReportHistoryEntity } from './report-history.entity';

@Entity('feed')
export class FeedEntity extends BaseEntity {
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
  thumbnailImages: string[];

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
  images: string[];

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
  hashTags: string[];

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

  /* ========== 연관관계 주인 ==========*/
  /**
   * 피드에 달린 댓글 리스트
   */
  @ApiHideProperty()
  @Exclude()
  @OneToMany(() => CommentEntity, (comment) => comment.feed, {
    nullable: true,
    cascade: true,
  })
  comments: CommentEntity[];

  /**
   * 피드에 추천, 비추천 내역
   */
  @ApiHideProperty()
  @Exclude()
  @OneToMany(() => RecommendHistoryEntity, (history) => history.feed, {
    nullable: true,
    cascade: true,
  })
  recommendHistories: RecommendHistoryEntity[];

  /**
   * 위치 정보
   * - 연관관계 주인은 피드이다.
   * @JoinColumn
   */
  @ApiHideProperty()
  @Exclude()
  @OneToOne(() => GeoMarkEntity)
  @JoinColumn()
  geoMark: GeoMarkEntity;

  /* ========== 단순 연관관계 - 조회 가능 ==========*/

  /**
   * 피드에 신고 내역
   * - 피드가 지워저도 신고 내역은 남아있는다.
   */
  @ApiHideProperty()
  @Exclude()
  @OneToMany(() => ReportHistoryEntity, (history) => history.feed, {
    nullable: true,
  })
  reportHistories: ReportHistoryEntity[];

  /**
   * 작성자
   */
  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => UserEntity, (user) => user.feeds, {
    nullable: false,
  })
  user: UserEntity;
}
