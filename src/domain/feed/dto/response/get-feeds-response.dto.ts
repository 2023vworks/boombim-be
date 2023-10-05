import { PickType } from '@nestjs/swagger';

import { defaultResponseProperties } from '@app/common';
import { FeedEntity } from '@app/entity';

export class GetFeedsResponseDTO extends PickType(FeedEntity, [
  ...defaultResponseProperties,
  'activity',
  'hashTags',
  'activationAt',
  'recommendCount',
  'unrecommendCount',
  'reportCount',
  'viewCount',
  'commentCount',
]) {}
