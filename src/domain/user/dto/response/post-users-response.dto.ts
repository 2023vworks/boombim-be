import { PickType } from '@nestjs/swagger';

import { defaultResponseProperties } from '@app/common';
import { UserEntity } from '@app/entity';

export class PostUsersResponseDTO extends PickType(UserEntity, [
  ...defaultResponseProperties,
  'mbtiType',
  'nickname',
  'token',
]) {}
