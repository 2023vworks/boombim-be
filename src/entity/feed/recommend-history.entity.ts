import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';

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

  /* ========== 단순 연관관계 - 역방향 x ==========*/
  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => Feed, (feed) => feed.comments, {
    nullable: false,
    onDelete: 'CASCADE',
    // Note: 연관관계 주인인 피드가 삭제되면 댓글도 삭제된다.
  })
  feed: Feed; // 부모

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => User, (user) => user.recommendHistories, {
    nullable: false,
  })
  user: User;
}
