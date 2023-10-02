import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { DBError, Util, errorMessage } from '@app/common';
import { AuthService } from '../auth/auth.service';
import { UserEntityMapper } from './domain';
import {
  GetUserResponseDTO,
  PostUsersRequestDTO,
  PostUsersResponseDTO,
} from './domain/dto';
import { UserRepository, UserRepositoryToken } from './user.repository';

export const UserServiceToken = Symbol('UserServiceToken');
export interface UserService {
  createUser(postDto: PostUsersRequestDTO): Promise<PostUsersResponseDTO>;
  getUser(userId: number): Promise<GetUserResponseDTO>;
}

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async createUser(
    postDto: PostUsersRequestDTO,
  ): Promise<PostUsersResponseDTO> {
    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userRepository = this.userRepository.createTransactionRepo(manager);
      const newUser = await userRepository.createUser(postDto);
      const token = this.authService.issueToken({ id: newUser.id });
      const nickname = UserEntityMapper.toDomain(newUser).nickname;
      await userRepository.updateProperty(newUser.id, { token, nickname });

      await queryRunner.commitTransaction();
      return { mbtiType: postDto.mbtiType, nickname, token };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new DBError(error as Error);
    } finally {
      await queryRunner.release();
    }
  }

  async getUser(userId: number): Promise<GetUserResponseDTO> {
    const userEntity = await this.userRepository.findOneBy({ id: userId });
    if (!userEntity) throw new NotFoundException(errorMessage.E404_APP_001);

    const user = UserEntityMapper.toDomain(userEntity);
    const feedWritingCount = user.renewFeedWritingCount();
    await this.userRepository.updateProperty(user.id, { feedWritingCount });

    return Util.toInstance(GetUserResponseDTO, {
      ...user.props,
      feedWritingCount,
    });
  }
}
