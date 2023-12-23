import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { CustomRepository } from '@app/common';
import { AdminEntity } from '@app/entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { AdminEntityMapper } from './domain/admin-entity-mapper';
import { Admin } from './domain/admin.domain';

export abstract class BaseAdminRepository extends CustomRepository<AdminEntity> {
  abstract findOneByPK(id: number): Promise<Admin | null>;
  abstract updateProperty(
    id: number,
    properties: Partial<AdminEntity>,
  ): Promise<void>;
}

@Injectable()
export class AdminRepository extends BaseAdminRepository {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(AdminEntity, manager);
  }

  async findOneByPK(id: number): Promise<Admin | null> {
    const admin = await this.findOneBy({ id });
    return admin && AdminEntityMapper.toDomain(admin);
  }

  async updateProperty(
    id: number,
    properties: Partial<AdminEntity>,
  ): Promise<void> {
    await this.update(id, { ...properties });
  }
}
