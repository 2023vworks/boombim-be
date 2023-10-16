import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { Util, errorMessage } from '@app/common';
import { AuthService } from '../auth/auth.service';
import {
  GetUserResponseDTO,
  PostUsersRequestDTO,
  PostUsersResponseDTO,
} from './dto';
import { UserRepository, UserRepositoryToken } from './user.repository';

export const UserServiceToken = Symbol('UserServiceToken');
export interface UserService {
  createUser(postDto: PostUsersRequestDTO): Promise<PostUsersResponseDTO>;
  createUser(
    postDto: PostUsersRequestDTO,
    oldId: number,
  ): Promise<PostUsersResponseDTO>;
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
    oldId?: number,
  ): Promise<PostUsersResponseDTO> {
    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userRepository = this.userRepository.createTransactionRepo(manager);
      const newUser = await userRepository.createUser(postDto);
      const token = this.authService.issueToken({ id: newUser.id });
      const nickname = newUser.generateNickname().nickname;

      const updateProperty = oldId
        ? { token, nickname, oldId }
        : { token, nickname };
      oldId && (await userRepository.softDelete(oldId));

      await userRepository.updateProperty(newUser.id, updateProperty);

      await queryRunner.commitTransaction();
      return { mbtiType: postDto.mbtiType, nickname, token };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUser(userId: number): Promise<GetUserResponseDTO> {
    const user = await this.userRepository.findOneByPK(userId);
    if (!user) throw new NotFoundException(errorMessage.E404_APP_001);
    if (user.isMaxFeedWritingCount) {
      return Util.toInstance(GetUserResponseDTO, { ...user.props });
    }

    const isRenewed = user.renewFeedWritingCount().isRenewedFeedWritingCount;
    isRenewed &&
      (await this.userRepository.updateProperty(user.id, {
        feedWritingCount: user.feedWritingCount,
        feedWritingCountRechargeStartAt: user.feedWritingCountRechargeStartAt,
      }));

    return Util.toInstance(GetUserResponseDTO, {
      ...user.props,
    });
  }
}
