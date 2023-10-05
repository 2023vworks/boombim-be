import { ReportHistoryEntity } from '@app/entity';
import { PickType } from '@nestjs/swagger';

export class PostFeedReportRequestDTO extends PickType(ReportHistoryEntity, [
  'reason',
]) {}
