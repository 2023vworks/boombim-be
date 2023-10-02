import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';

import { StringValidator } from '@app/common';
import { BaseEntity } from '../base.entity';
import { UserEntity } from '../user';
import { FeedEntity } from './feed.entity';

@Entity('comment')
export class CommentEntity extends BaseEntity {
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
  @ManyToOne(() => UserEntity, (user) => user.comments, {
    nullable: false,
  })
  user: UserEntity;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => FeedEntity, (feed) => feed.comments, {
    nullable: false,
    onDelete: 'CASCADE',
    // Note: 연관관계 주인인 피드가 삭제되면 댓글도 삭제된다.
  })
  feed: FeedEntity;
}
