import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';

import { StringValidator } from '@app/common';
import { BaseEntity } from '../base.entity';
import { UserEntity } from '../user';
import { FeedEntity } from './feed.entity';

@Entity('report_history')
export class ReportHistoryEntity extends BaseEntity {
  /**
   * 신고 사유
   */
  @ApiProperty({
    description: '신고 사유',
    type: String,
    minLength: 5,
    maxLength: 200,
  })
  @Expose()
  @StringValidator({ minLength: 5, maxLength: 200 })
  @Column('varchar', { comment: '신고 사유', length: 200 })
  reason: string;

  /* ========== 연관관계 ==========*/
  /**
   * 피드
   * - 피드가 삭제되도 신고 내역은 남아있는다.
   */
  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => FeedEntity, (feed) => feed.comments, {
    nullable: false,
    orphanedRowAction: 'nullify',
    onDelete: 'SET NULL',
  })
  feed: FeedEntity;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => UserEntity, (user) => user.recommendHistories, {
    nullable: false,
  })
  user: UserEntity;
}
