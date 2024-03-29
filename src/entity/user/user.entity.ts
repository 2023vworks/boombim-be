import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';

import {
  DateValidator,
  EnumValidator,
  IntValidator,
  StringValidator,
} from '@app/common';
import { BaseEntity } from '../base.entity';
import { MbtiType } from '../enum';
import {
  CommentEntity,
  FeedEntity,
  RecommendHistoryEntity,
  ReportHistoryEntity,
} from '../feed';

@Entity('user')
export class UserEntity extends BaseEntity {
  /**
   * MBTI 유형
   */
  @ApiProperty({
    description: 'MBTI 유형',
    enum: MbtiType,
  })
  @Expose()
  @EnumValidator(MbtiType)
  @Column('enum', { enum: MbtiType, comment: 'MBTI 유형' })
  mbtiType: MbtiType;

  /**
   * 닉네임
   * - 000 + id,
   * - default 0000
   */
  @ApiProperty({
    description: '닉네임',
    type: String,
    default: '닉네임',
    maxLength: 50,
  })
  @Expose()
  @StringValidator({ maxLength: 50 })
  @Column('varchar', { comment: '닉네임', length: 50, default: '0000' })
  nickname: string;

  /**
   * JWT 토큰
   * - defalt ''
   */
  @ApiHideProperty()
  @Exclude()
  @StringValidator({ maxLength: 300 })
  @Column('varchar', { comment: 'JWT 토큰', length: 300, default: '' })
  token: string;

  /**
   * 마지막 접속일
   * - mvp에서는 생성시 추가
   * - default now
   */
  @ApiHideProperty()
  @Exclude()
  @DateValidator()
  @Column('timestamptz', { comment: '마지막 접속일', default: () => 'NOW()' })
  accessedAt: Date;

  /**
   * 피드 작성 가능 횟수
   * - min 0
   * - max 5
   * - default 5
   */
  @ApiProperty({
    description: '피드 작성 가능 횟수',
    type: Number,
    minimum: 0,
    maximum: 5,
    default: 5,
  })
  @Expose()
  @IntValidator({ min: 0, max: 5 })
  @Column('smallint', { comment: '피드 작성 가능 횟수', default: 5 })
  feedWritingCount: number;

  /**
   * feedWritingCount(피드 작성 가능 횟수) 충전 시작 시간
   * - 최초 생성시 now
   */
  @ApiHideProperty()
  @Exclude()
  @DateValidator()
  @Column('timestamptz', {
    comment: '피드 작성 횟수 충전 시작 시간 날짜',
    default: () => 'NOW()',
  })
  feedWritingCountRechargeStartAt: Date;

  @ApiHideProperty()
  @Expose()
  @Column('boolean', { comment: '약관 동의', default: false })
  agreementTerms: true;

  /* ========== 단순 연관관계 - 역방향 x ==========*/
  /**
   * 유저가 작성한 피드 내역
   * - 유저는 자신의 피드 soft delete에만 권한을 가진다, 연관관계 주인은 Feed이다.
   */
  @ApiHideProperty()
  @Exclude()
  @OneToMany(() => FeedEntity, (feed) => feed.user, {
    nullable: true,
    cascade: ['soft-remove'],
  })
  feeds: FeedEntity[];

  /**
   * 유저가 작성한 댓글 내역
   * - 유저는 자신의 댓글 soft delete에만 권한을 가진다, 연관관계 주인은 Feed이다.
   */
  @ApiHideProperty()
  @Exclude()
  @OneToMany(() => CommentEntity, (comment) => comment.user, {
    nullable: true,
    cascade: ['soft-remove'],
  })
  comments: CommentEntity[];

  /**
   * 유저 추천, 비추천 내역
   */
  @ApiHideProperty()
  @Exclude()
  @OneToMany(() => RecommendHistoryEntity, (history) => history.user, {
    nullable: true,
  })
  recommendHistories: RecommendHistoryEntity[];

  /**
   * 유저가 신고한 내역
   */
  @ApiHideProperty()
  @Exclude()
  @OneToMany(() => ReportHistoryEntity, (history) => history.user, {
    nullable: true,
  })
  reportHistories: ReportHistoryEntity[];
}
