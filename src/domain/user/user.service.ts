import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { DBError, Util, errorMessage } from '@app/common';
import { AuthService } from '../auth/auth.service';
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
      const nickname = newUser.generateNickname().nickname;
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

  /**
   * TODO: 알고리즘 개선이 필요하다.
   *
   * TODO: 테스트 필요하다.
   * - feedWritingCount가 5인 경우
   * - feedWritingCount가 5가 아닌 경우
   * - 1시간이 지나지 않은 경우
   * - 2시간이 지난 경우
   * - 작성횟수가 0일때 6시간 이상 지난 경우
   * - 작성횟수가 3일때 3시간 이상 지난 경우
   * - 유저가 짧은 시간에 동시에 여러 글을 쓴 경우
   * @param userId
   * @returns
   */
  async getUser(userId: number): Promise<GetUserResponseDTO> {
    const user = await this.userRepository.findOneByPK(userId);

    if (!user) throw new NotFoundException(errorMessage.E404_APP_001);

    if (user.feedWritingCount === 5) {
      return Util.toInstance(GetUserResponseDTO, { ...user.props });
    }

    user.renewFeedWritingCount();
    const isRenewed = user.feedWritingCount !== user.feedWritingCount;
    isRenewed &&
      (await this.userRepository.updateProperty(user.id, {
        feedWritingCount: user.feedWritingCount,
        feedWritingCountRechargeStartAt: user.feedWritingCountRechargeStartAt,
        isRechargeStart: user.isRechargeStart,
      }));

    return Util.toInstance(GetUserResponseDTO, {
      ...user.props,
    });
  }
}
