import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity } from 'typeorm';

import {
  DateValidator,
  DateValidatorOptional,
  EnumValidator,
  IntValidator,
  StringValidator,
} from '@app/common';
import { MbtiType } from '../enum';
import { Comment, Feed } from '../feed';
import { Timestamp } from '../timestamp.entity';

@Entity('user')
export class User extends Timestamp {
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
   * 피드 마지막 작성 시간 날짜
   */
  @ApiPropertyOptional({
    description: '피드 마지막 작성 시간 날짜',
    type: Date,
  })
  @Expose()
  @DateValidatorOptional()
  @Column('timestamptz', {
    comment: '피드 마지막 작성 시간 날짜',
    nullable: true,
  })
  lastFeedWrittenAt?: Date | null;

  /* ========== 연관관계 ==========*/
  feeds: Feed[] | [];
  comments: Comment[] | [];
}
