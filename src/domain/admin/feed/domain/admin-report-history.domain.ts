import { OmitType } from '@nestjs/swagger';

import { ReportHistoryEntity } from '@app/entity';
import { BaseDomain } from 'src/domain/base.domain';

export class AdminReportHistoryProps extends OmitType(ReportHistoryEntity, [
  'feed',
  'user',
]) {}

export class AdminReportHistory extends BaseDomain<AdminReportHistoryProps> {
  constructor(readonly props: AdminReportHistoryProps) {
    super(props);
  }

  /**
   * 신고 사유
   */
  get reason(): string {
    return this.props.reason;
  }
}
