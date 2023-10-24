import { ReportHistoryEntity } from '@app/entity';
import { ReportHistory } from '../report-history.domain';

export class ReportHistoryEntityMapper {
  static toDomain(entity: ReportHistoryEntity): ReportHistory;
  static toDomain(entity: ReportHistoryEntity[]): ReportHistory[];
  static toDomain(
    entity: ReportHistoryEntity | ReportHistoryEntity[],
  ): ReportHistory | ReportHistory[] {
    return Array.isArray(entity)
      ? entity.map((e) => this.toDomain(e))
      : new ReportHistory({
          ...entity,
        }).setBase(entity.id, entity.createdAt, entity.updatedAt);
  }
}
