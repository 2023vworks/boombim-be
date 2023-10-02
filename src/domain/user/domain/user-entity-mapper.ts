import { UserEntity } from '@app/entity';
import { User } from './user.domain';

export class UserEntityMapper {
  static toDomain(entity: UserEntity): User {
    return new User({ ...entity }) //
      .setBase(entity.id, entity.createdAt, entity.updatedAt);
  }

  static toEntity(domain: User): UserEntity {
    return {
      id: domain.id,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      ...domain.props,
    };
  }
}
