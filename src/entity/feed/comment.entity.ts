import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Column, Entity } from 'typeorm';

import { StringValidator } from '@app/common';
import { Timestamp } from '../timestamp.entity';
import { User } from '../user';
import { Feed } from './feed.entity';

@Entity('comment')
export class Comment extends Timestamp {
  /**
   * 댓글 내용
   * - 140자
   * - 3byte * 140
   */
  @ApiProperty({
    description: '댓글 내용',
    type: String,
    minLength: 3,
    maxLength: 420,
  })
  @Expose()
  @StringValidator({ minLength: 3, maxLength: 420 })
  @Column('varchar', { comment: '댓글 내용', length: 420 })
  content: string;

  /* ========== 연관관계 ==========*/
  user: User;
  feed: Feed;
}
