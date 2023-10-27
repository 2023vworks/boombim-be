import { PartialType, PickType } from '@nestjs/swagger';

import { FeedEntity } from '@app/entity';

export class AdminPatchFeedActivationRequestDTO extends PickType(
  PartialType(FeedEntity),
  ['activationAt', 'activity'],
) {}
