import { FeedEntity, GeoMarkEntity } from '@app/entity';
import { GeoMarkEntityMapper } from 'src/domain/geo-mark/domain';
import { Feed } from '../feed.domain';
import { RecommendHistoryEntityMapper } from './recomend-history-entity-mapper';

export class FeedEntityMapper {
  static toDomain(entity: FeedEntity): Feed;
  static toDomain(entity: FeedEntity[]): Feed[];
  static toDomain(entity: FeedEntity | FeedEntity[]): Feed | Feed[] {
    return Array.isArray(entity)
      ? entity.map((e) => this.toDomain(e))
      : new Feed({
          ...entity,
          geoMarkId: entity.geoMark.id,
          geoMarkRegion: entity.geoMark.region,
          geoMark: this.isExistGeoMark(entity.geoMark)
            ? GeoMarkEntityMapper.toDomain({
                ...entity.geoMark,
                activity: entity.activity,
              })
            : null,
          recommendHistories: entity.recommendHistories
            ? RecommendHistoryEntityMapper.toDomain(entity.recommendHistories)
            : [],
        }).setBase(entity.id, entity.createdAt, entity.updatedAt);
  }

  private static isExistGeoMark(val: unknown): val is GeoMarkEntity {
    return (
      typeof val === 'object' &&
      'id' in val &&
      'x' in val &&
      'y' in val &&
      'type' in val &&
      'point' in val &&
      'srid' in val &&
      'regionInfo' in val &&
      'address' in val
    );
  }
}
