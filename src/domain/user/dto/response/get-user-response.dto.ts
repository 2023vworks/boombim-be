import { PickType } from '@nestjs/swagger';

import { User } from '@app/entity';

import { defaultResponseProperties } from '@app/common';

export class GetUserResponseDTO extends PickType(User, [
  ...defaultResponseProperties,
  'mbtiType',
  'nickname',
  'feedWritingCount',
  'lastFeedWrittenAt',
]) {}
