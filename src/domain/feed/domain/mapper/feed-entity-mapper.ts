import { FeedEntity } from '@app/entity';
import { Feed } from '../feed.domain';
import { CommentEntityMapper } from './comment-entity-mapper';
import { RecommendHistoryEntityMapper } from './recomend-history-entity-mapper';
import { GeoMarkEntityMapper } from 'src/domain/geo-mark/domain';

export class FeedEntityMapper {
  static toDomain(entity: FeedEntity): Feed;
  static toDomain(entity: FeedEntity[]): Feed[];
  static toDomain(entity: FeedEntity | FeedEntity[]): Feed | Feed[] {
    return Array.isArray(entity)
      ? entity.map((e) => this.toDomain(e))
      : new Feed({
          ...entity,
          comments: CommentEntityMapper.toDomain(entity.comments),
          recommendHistories: RecommendHistoryEntityMapper.toDomain(
            entity.recommendHistories,
          ),
          geoMark: GeoMarkEntityMapper.toDomain(entity.geoMark),
        }).setBase(entity.id, entity.createdAt, entity.updatedAt);
  }
}
