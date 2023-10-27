import { ReportHistoryEntity } from '@app/entity';
import { AdminReportHistory } from '../admin-report-history.domain';

export class AdminReportHistoryEntityMapper {
  static toDomain(entity: ReportHistoryEntity): AdminReportHistory;
  static toDomain(entity: ReportHistoryEntity[]): AdminReportHistory[];
  static toDomain(
    entity: ReportHistoryEntity | ReportHistoryEntity[],
  ): AdminReportHistory | AdminReportHistory[] {
    return Array.isArray(entity)
      ? entity.map((e) => this.toDomain(e))
      : new AdminReportHistory({
          ...entity,
        }).setBase(entity.id, entity.createdAt, entity.updatedAt);
  }
}
