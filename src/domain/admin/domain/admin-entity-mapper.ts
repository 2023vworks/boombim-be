import { AdminEntity } from '@app/entity';
import { Admin } from './admin.domain';

export class AdminEntityMapper {
  static toDomain(entity: AdminEntity): Admin {
    return new Admin({ ...entity }) //
      .setBase(entity.id, entity.createdAt, entity.updatedAt);
  }
}
