import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Column, Entity } from 'typeorm';

import { EnumValidator } from '@app/common';
import { RecommendType } from '../enum';
import { Timestamp } from '../timestamp.entity';
import { User } from '../user';
import { Feed } from './feed.entity';

@Entity('recommend_history')
export class RecommendHistory extends Timestamp {
  /**
   * 추천 타입
   * - 'Recommend' | 'Unrecommend'
   */
  @ApiProperty({
    description: 'MBTI 유형',
    enum: RecommendType,
  })
  @Expose()
  @EnumValidator(RecommendType)
  @Column('enum', { enum: RecommendType, comment: 'MBTI 유형' })
  type: RecommendType;

  /* ========== 연관관계 ==========*/
  feed: Feed; // 부모
  user: User;
}
