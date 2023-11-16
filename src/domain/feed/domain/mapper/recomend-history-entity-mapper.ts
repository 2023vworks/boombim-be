import { RecommendHistoryEntity } from '@app/entity';
import { RecommendHistory } from '../recommend-history.domain';

export class RecommendHistoryEntityMapper {
  static toDomain(entity: RecommendHistoryEntity): RecommendHistory;
  static toDomain(entity: RecommendHistoryEntity[]): RecommendHistory[];
  static toDomain(
    entity: RecommendHistoryEntity | RecommendHistoryEntity[],
  ): RecommendHistory | RecommendHistory[] {
    return Array.isArray(entity)
      ? entity.map((e) => this.toDomain(e))
      : new RecommendHistory({
          ...entity,
          userId: entity.user.id,
        }).setBase(entity.id, entity.createdAt, entity.updatedAt);
  }
}
