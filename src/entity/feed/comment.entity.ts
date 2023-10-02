import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';

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
  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => User, (user) => user.comments, {
    nullable: false,
  })
  user: User;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => Feed, (feed) => feed.comments, {
    nullable: false,
    onDelete: 'CASCADE',
    // Note: 연관관계 주인인 피드가 삭제되면 댓글도 삭제된다.
  })
  feed: Feed;
}
