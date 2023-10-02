import { PickType } from '@nestjs/swagger';

import { UserEntity } from '@app/entity';

export class PostUsersRequestDTO extends PickType(UserEntity, ['mbtiType']) {}
