import { OmitType } from '@nestjs/swagger';

import { CommentEntity } from '@app/entity';
import { BaseDomain } from 'src/domain/base.domain';

export class CommentProps extends OmitType(CommentEntity, ['feed', 'user']) {}

export class Comment extends BaseDomain<CommentProps> {
  constructor(readonly props: CommentProps) {
    super(props);
  }
  /**
   * 댓글 내용
   * - 140자
   * - 3byte * 140
   */
  get content(): string {
    return this.props.content;
  }
}
