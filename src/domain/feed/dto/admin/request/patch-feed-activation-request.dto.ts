import { PickType } from '@nestjs/swagger';

import { FeedEntity } from '@app/entity';

export class AdminPatchFeedActivationRequestDTO extends PickType(FeedEntity, [
  'activationAt',
  'activity',
]) {}
