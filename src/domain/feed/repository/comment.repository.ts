import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { BaseRepository, Util } from '@app/common';
import { CommentEntity } from '@app/entity';
import { Comment, CommentEntityMapper } from '../domain';
import { GetFeedCommentsRequestDTO, PostFeedCommentRequestDTO } from '../dto';

export abstract class CommentRepositoryPort extends BaseRepository<CommentEntity> {
  abstract findByFeedId(
    feedId: number,
    getDto: GetFeedCommentsRequestDTO,
  ): Promise<Comment[]>;
  abstract createOne(
    userId: number,
    feedId: number,
    postDto: PostFeedCommentRequestDTO,
  ): Promise<Comment>;
  abstract softDeleteByUserId(userId: number): Promise<void>;
}

@Injectable()
export class CommentRepository extends CommentRepositoryPort {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(CommentEntity, manager);
  }

  override async findByFeedId(
    feedId: number,
    getDto: GetFeedCommentsRequestDTO,
  ): Promise<Comment[]> {
    const { nextCursor, size, sort } = getDto;
    const qb = this.createQueryBuilder('comment');

    qb.select();
    qb.innerJoin('comment.user', 'user') //
      .addSelect(['user.id', 'user.nickname', 'user.mbtiType']);

    qb.where('comment.feedId = :feedId', { feedId });

    if (!Util.isNil(nextCursor)) {
      sort === 'ASC' && qb.andWhere('comment.id >= :id', { id: nextCursor });
      sort !== 'ASC' && qb.andWhere('comment.id <= :id', { id: nextCursor });
    }
    qb.limit(size);
    qb.orderBy('comment.id', sort);

    const comments = await qb.getMany();
    return CommentEntityMapper.toDomain(comments);
  }

  override async createOne(
    userId: number,
    feedId: number,
    postDto: PostFeedCommentRequestDTO,
  ): Promise<Comment> {
    const comment = this.create({
      ...postDto,
      user: { id: userId },
      feed: { id: feedId },
    });
    await this.save(comment);
    return CommentEntityMapper.toDomain(comment);
  }

  override async softDeleteByUserId(userId: number): Promise<void> {
    await this.createQueryBuilder()
      .where('comment."userId" = :userId', { userId })
      .softDelete()
      .execute();
  }
}
