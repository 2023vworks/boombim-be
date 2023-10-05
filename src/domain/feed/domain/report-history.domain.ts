import { OmitType } from '@nestjs/swagger';

import { ReportHistoryEntity } from '@app/entity';
import { BaseDomain } from 'src/domain/base.domain';

export class ReportHistoryProps extends OmitType(ReportHistoryEntity, [
  'feed',
  'user',
]) {}

export class ReportHistory extends BaseDomain<ReportHistoryProps> {
  constructor(readonly props: ReportHistoryProps) {
    super(props);
  }

  /**
   * 신고 사유
   */
  get reason(): string {
    return this.props.reason;
  }
}
