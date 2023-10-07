import { FeedEntity } from '@app/entity';
import { GeoMarkEntityMapper } from 'src/domain/geo-mark/domain';
import { Feed } from '../feed.domain';
import { CommentEntityMapper } from './comment-entity-mapper';

export class FeedEntityMapper {
  static toDomain(entity: FeedEntity): Feed;
  static toDomain(entity: FeedEntity[]): Feed[];
  static toDomain(entity: FeedEntity | FeedEntity[]): Feed | Feed[] {
    return Array.isArray(entity)
      ? entity.map((e) => this.toDomain(e))
      : new Feed({
          ...entity,
          comments: entity.comments
            ? CommentEntityMapper.toDomain(entity.comments)
            : [],
          geoMark: entity.geoMark
            ? GeoMarkEntityMapper.toDomain(entity.geoMark)
            : null,
        }).setBase(entity.id, entity.createdAt, entity.updatedAt);
  }
}
