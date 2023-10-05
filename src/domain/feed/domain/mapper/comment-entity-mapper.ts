import { CommentEntity } from '@app/entity';
import { Comment } from '../comment.domain';

export class CommentEntityMapper {
  static toDomain(entity: CommentEntity): Comment;
  static toDomain(entity: CommentEntity[]): Comment[];
  static toDomain(
    entity: CommentEntity | CommentEntity[],
  ): Comment | Comment[] {
    return Array.isArray(entity)
      ? entity.map((e) => this.toDomain(e))
      : new Comment({ ...entity }).setBase(
          entity.id,
          entity.createdAt,
          entity.updatedAt,
        );
  }
}
