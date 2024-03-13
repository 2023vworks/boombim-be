import { UserEntity } from '@app/entity';
import { User } from './user.domain';

export class UserEntityMapper {
  static toDomain(entity: UserEntity[]): User[];
  static toDomain(entity: UserEntity): User;
  static toDomain(entity: UserEntity | UserEntity[]): User | User[] {
    return Array.isArray(entity)
      ? entity.map((e) => this.toDomain(e))
      : new User({ ...entity }) //
          .setBase(entity.id, entity.createdAt, entity.updatedAt);
  }
}
