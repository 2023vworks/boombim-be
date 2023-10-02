import { PickType } from '@nestjs/swagger';

import { User } from '@app/entity';

export class PostUsersRequestDTO extends PickType(User, ['mbtiType']) {}
