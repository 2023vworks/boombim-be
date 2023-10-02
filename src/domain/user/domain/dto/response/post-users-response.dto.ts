import { PickType } from '@nestjs/swagger';

import { UserEntity } from '@app/entity';

export class PostUsersResponseDTO extends PickType(UserEntity, [
  'mbtiType',
  'nickname',
  'token',
]) {}
