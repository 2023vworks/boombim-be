import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { Util, errorMessage } from '@app/common';
import { AuthServiceUseCase } from '../auth/auth.service';
import { CommentRepositoryPort, FeedRepositoryPort } from '../feed/repository';
import {
  GetUserFeedsResponseDTO,
  GetUserResponseDTO,
  PostUsersRequestDTO,
  PostUsersResponseDTO,
} from './dto';
import { UserRepositoryPort } from './user.repository';

export abstract class UserServiceUseCase {
  abstract getUser(userId: number): Promise<GetUserResponseDTO>;
  abstract getUserFeeds(userId: number): Promise<GetUserFeedsResponseDTO[]>;
  abstract createUser(
    postDto: PostUsersRequestDTO,
  ): Promise<PostUsersResponseDTO>;
  /**
   * 유저가 Soft Delete 되는 경우 자식인 feed와 comment를 같이 Soft Delete 한다.
   * @param userId
   * @version v0.0.3
   * @todo - RecommendHistory, ReportHistory도 Soft Delete 해야 하는가?
   */
  abstract softRemoveUser(userId: number): Promise<void>;
}

@Injectable()
export class UserService extends UserServiceUseCase {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly userRepo: UserRepositoryPort,
    private readonly feedRepo: FeedRepositoryPort,
    private readonly commentRepo: CommentRepositoryPort,
    private readonly authService: AuthServiceUseCase,
  ) {
    super();
  }

  async getUser(userId: number): Promise<GetUserResponseDTO> {
    const user = await this.userRepo.findOneByPK(userId);
    if (!user) throw new NotFoundException(errorMessage.E404_APP_001);
    if (user.isMaxFeedWritingCount) {
      return Util.toInstance(GetUserResponseDTO, { ...user.props });
    }

    const isRenewed = user.renewFeedWritingCount().isRenewedFeedWritingCount;
    isRenewed &&
      (await this.userRepo.updateProperty(user.id, {
        feedWritingCount: user.feedWritingCount,
        feedWritingCountRechargeStartAt: user.feedWritingCountRechargeStartAt,
      }));

    return Util.toInstance(GetUserResponseDTO, {
      ...user.props,
    });
  }

  async getUserFeeds(userId: number): Promise<GetUserFeedsResponseDTO[]> {
    const feeds = await this.feedRepo.findManyByUserId(userId);
    return Util.toInstance(GetUserFeedsResponseDTO, feeds);
  }

  async createUser(
    postDto: PostUsersRequestDTO,
  ): Promise<PostUsersResponseDTO> {
    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const txUserRepo = this.userRepo.createTransactionRepo(manager);
      const newUser = await txUserRepo.createUser(postDto);

      const token = this.authService.issueToken({ id: newUser.id });
      const nickname = newUser.generateNickname().nickname;
      await txUserRepo.updateProperty(newUser.id, { token, nickname });

      await queryRunner.commitTransaction();
      return { mbtiType: postDto.mbtiType, nickname, token };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async softRemoveUser(userId: number): Promise<void> {
    const user = await this.userRepo.findOneByPK(userId);
    if (!user) throw new NotFoundException(errorMessage.E404_APP_001);

    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const txUserRepo = this.userRepo.createTransactionRepo(manager);
      const txFeedRepo = this.feedRepo.createTransactionRepo(manager);
      const txCommentRepo = this.commentRepo.createTransactionRepo(manager);
      await txUserRepo.softDelete(user.id);
      await txFeedRepo.softDeleteByUserId(user.id);
      await txCommentRepo.softDeleteByUserId(user.id);

      await queryRunner.commitTransaction();
      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
