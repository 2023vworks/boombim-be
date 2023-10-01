import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Column, Entity } from 'typeorm';

import { StringValidator } from '@app/common';
import { Timestamp } from '../timestamp.entity';
import { Feed } from './feed.entity';
import { User } from '../user';

@Entity('report_history')
export class ReportHistory extends Timestamp {
  /**
   * 신고 사유
   */
  @ApiProperty({
    description: '신고 사유',
    type: String,
    minLength: 10,
    maxLength: 200,
  })
  @Expose()
  @StringValidator({ minLength: 10, maxLength: 200 })
  @Column('varchar', { comment: '신고 사유', length: 200 })
  reason: string;

  /* ========== 연관관계 ==========*/
  feed: Feed; // 부모
  user: User;
}
