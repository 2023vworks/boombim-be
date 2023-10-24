import { FeedEntity, GeoMarkEntity } from '@app/entity';
import { AdminFeed } from '../admin-feed.domain';
import { AdminReportHistoryEntityMapper } from './admin-report-history-entity-mapper';

export class AdminFeedEntityMapper {
  static toDomain(entity: FeedEntity): AdminFeed;
  static toDomain(entity: FeedEntity[]): AdminFeed[];
  static toDomain(entity: FeedEntity | FeedEntity[]): AdminFeed | AdminFeed[] {
    return Array.isArray(entity)
      ? entity.map((e) => this.toDomain(e))
      : new AdminFeed({
          ...entity,
          reportHistories: entity.reportHistories
            ? AdminReportHistoryEntityMapper.toDomain(entity.reportHistories)
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
