import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { CustomRepository } from '@app/common';
import { UserEntity } from '@app/entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { PostUsersRequestDTO } from './domain/dto';

export const UserRepositoryToken = Symbol('UserRepositoryToken');
export interface UserRepository extends CustomRepository<UserEntity> {
  createUser(postDto: PostUsersRequestDTO): Promise<UserEntity>;
}

@Injectable()
export class UserRepositoryImpl
  extends CustomRepository<UserEntity>
  implements UserRepository
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(UserEntity, manager);
  }

  async createUser(postDto: PostUsersRequestDTO): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
}
