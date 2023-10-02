import { PickType } from '@nestjs/swagger';

import { defaultResponseProperties } from '@app/common';
import { User } from '@app/entity';

export class PostUsersResponseDTO extends PickType(User, [
  ...defaultResponseProperties,
  'mbtiType',
  'nickname',
  'token',
]) {}
