import { CommentEntity } from '@app/entity';
import { PickType } from '@nestjs/swagger';

export class PostFeedCommentRequestDTO extends PickType(CommentEntity, [
  'content',
]) {}
