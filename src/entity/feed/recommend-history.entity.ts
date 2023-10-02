import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';

import { EnumValidator } from '@app/common';
import { BaseEntity } from '../base.entity';
import { RecommendType } from '../enum';
import { UserEntity } from '../user';
import { FeedEntity } from './feed.entity';

@Entity('recommend_history')
export class RecommendHistoryEntity extends BaseEntity {
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
  @ManyToOne(() => FeedEntity, (feed) => feed.comments, {
    nullable: false,
    onDelete: 'CASCADE',
    // Note: 연관관계 주인인 피드가 삭제되면 댓글도 삭제된다.
  })
  feed: FeedEntity; // 부모

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => UserEntity, (user) => user.recommendHistories, {
    nullable: false,
  })
  user: UserEntity;
}
