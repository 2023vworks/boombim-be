import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { BaseRepository } from '@app/common';
import { UserEntity } from '@app/entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { PostUsersRequestDTO } from './dto';
import { User, UserEntityMapper } from './domain';

export abstract class UserRepositoryPort extends BaseRepository<UserEntity> {
  abstract createUser(postDto: PostUsersRequestDTO): Promise<User>;
  abstract updateProperty(
    id: number,
    properties: Partial<UserEntity>,
  ): Promise<void>;
  abstract findOneByPK(id: number): Promise<User | null>;
}

@Injectable()
export class UserRepository extends UserRepositoryPort {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(UserEntity, manager);
  }

  override async createUser(postDto: PostUsersRequestDTO): Promise<User> {
    const user = this.create({ ...postDto });
    await this.save(user);
    return UserEntityMapper.toDomain(user);
  }

  override async updateProperty(
    id: number,
    properties: Partial<UserEntity>,
  ): Promise<void> {
    await this.update(id, { ...properties });
  }

  override async findOneByPK(id: number): Promise<User | null> {
    const user = await this.findOneBy({ id });
    return !!user ? UserEntityMapper.toDomain(user) : null;
  }
}
