import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { CustomRepository } from '@app/common';
import { UserEntity } from '@app/entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { PostUsersRequestDTO } from './dto';
import { User, UserEntityMapper } from './domain';

export const UserRepositoryToken = Symbol('UserRepositoryToken');
export interface UserRepository extends CustomRepository<UserEntity> {
  createUser(postDto: PostUsersRequestDTO): Promise<User>;
  updateProperty(id: number, properties: Partial<UserEntity>): Promise<void>;
  findOneByPK(id: number): Promise<User | null>;
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

  async createUser(postDto: PostUsersRequestDTO): Promise<User> {
    const user = this.create({ ...postDto });
    await this.save(user);
    return UserEntityMapper.toDomain(user);
  }

  async updateProperty(
    id: number,
    properties: Partial<UserEntity>,
  ): Promise<void> {
    await this.update(id, { ...properties });
  }

  async findOneByPK(id: number): Promise<User | null> {
    const user = await this.findOneBy({ id });
    return !!user ? UserEntityMapper.toDomain(user) : null;
  }
}
