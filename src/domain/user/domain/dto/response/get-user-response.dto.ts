import { PickType } from '@nestjs/swagger';

import { UserEntity } from '@app/entity';

import { defaultResponseProperties } from '@app/common';

export class GetUserResponseDTO extends PickType(UserEntity, [
  ...defaultResponseProperties,
  'mbtiType',
  'nickname',
  'feedWritingCount',
  'lastFeedWrittenAt',
]) {}
