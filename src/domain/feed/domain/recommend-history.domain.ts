import { OmitType } from '@nestjs/swagger';

import { RecommendHistoryEntity, RecommendType } from '@app/entity';
import { BaseDomain } from 'src/domain/base.domain';

export class RecommendHistoryProps extends OmitType(RecommendHistoryEntity, [
  'feed',
  'user',
]) {}

export class RecommendHistory extends BaseDomain<RecommendHistoryProps> {
  constructor(readonly props: RecommendHistoryProps) {
    super(props);
  }

  /**
   * 추천 타입
   * - 'Recommend' | 'Unrecommend'
   */
  get type(): RecommendType {
    return this.props.type;
  }
}
