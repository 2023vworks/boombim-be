import { Injectable } from '@nestjs/common';

import {
  CustomRepository,
  DateUtil,
  OffsetPaginationDTO,
  Util,
} from '@app/common';
import {
  CommentEntity,
  FeedEntity,
  RecommendHistoryEntity,
  RecommendType,
  ReportHistoryEntity,
} from '@app/entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, MoreThanOrEqual, Repository } from 'typeorm';
import { Comment, CommentEntityMapper, Feed, FeedEntityMapper } from './domain';
import {
  GetFeedCommentsRequestDTO,
  GetFeedsRequestDTO,
  PostFeedCommentRequestDTO,
  PostFeedReportRequestDTO,
  PostFeedRequestDTO,
} from './dto';

type FeedOmitGeomark = Omit<Feed, 'geoMark'>;

export const FeedRepositoryToken = Symbol('FeedRepositoryToken');
/**
 * FeedRepository#findByCoordinates vs FeedRepository#findByPolygon
 * - 조회되는 데이터는 같으나 정렬방식에 차이가 발생한다.
 * - 좌표를 사용한 경우 정확한 거리데이터가 도출되지 않는다고 한다.
 * @todo 향후 테스트와 실제 지도에 표시되는 데이터를 비교해보고 더 정확한 메서드를 사용해야 한다.
 */
export interface FeedRepository extends CustomRepository<FeedEntity> {
  findMany(option: OffsetPaginationDTO): Promise<Feed[]>;
  /**
   * 좌표를 사용하여 검색후 중심좌표 기준 정렬
   * @param getDto
   */
  findByCoordinates(getDto: GetFeedsRequestDTO): Promise<FeedOmitGeomark[]>;
  /**
   * PostGIS의 Polygon을 사용하여 검색후 중심좌표 기준 정렬
   * - 폴리곤을 사용한 경우 더 정확한 거리데이터가 도출된다고 한다.
   * @param getDto
   */
  findByPolygon(getDto: GetFeedsRequestDTO): Promise<FeedOmitGeomark[]>;

  existByUserId(feedId: number, userId: number): Promise<boolean>;
  findOneByGeoMarkId(geoMarkId: number): Promise<Feed | null>;
  findOneByPK(geoMarkId: number): Promise<Feed | null>;
  findOnePure(feedId: number): Promise<Feed | null>;
  createOne(userId: number, postDto: PostFeedRequestDTO): Promise<Feed | null>;
  updateProperty(
    feedId: number,
    properties: Partial<FeedEntity>,
  ): Promise<void>;

  findCommentsByFeedId(
    feedId: number,
    getDto: GetFeedCommentsRequestDTO,
  ): Promise<Comment[]>;
  createComment(
    userId: number,
    feedId: number,
    postDto: PostFeedCommentRequestDTO,
  ): Promise<Comment>;

  existRecommendHistory(
    userId: number,
    feedId: number,
    type: RecommendType,
  ): Promise<boolean>;
  createRecommendHistory(
    userId: number,
    feedId: number,
    type: RecommendType,
  ): Promise<void>;

  existReportHistory(userId: number, feedId: number): Promise<boolean>;
  createReportHistory(
    userId: number,
    feedId: number,
    postDto: PostFeedReportRequestDTO,
  ): Promise<void>;
}

@Injectable()
export class FeedRepositoryImpl
  extends CustomRepository<FeedEntity>
  implements FeedRepository
{
  private readonly commentRepo: Repository<CommentEntity>;
  private readonly recommendHistoryRepo: Repository<RecommendHistoryEntity>;
  private readonly reportHistoryRepo: Repository<ReportHistoryEntity>;

  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(FeedEntity, manager);
    this.commentRepo = manager.getRepository(CommentEntity);
    this.recommendHistoryRepo = manager.getRepository(RecommendHistoryEntity);
    this.reportHistoryRepo = manager.getRepository(ReportHistoryEntity);
  }

  async findMany(option: OffsetPaginationDTO): Promise<Feed[]> {
    const { page, pageSize, sort } = option;
    const qb = this.createQueryBuilder('feed');
    qb.select();
    qb.innerJoin('feed.user', 'user') //
      .addSelect(['user.id', 'user.mbtiType', 'user.nickname']);
    qb.innerJoin('feed.geoMark', 'mark') //
      .addSelect(['mark.id']);
    qb.leftJoinAndSelect('feed.reportHistories', 'report'); //

    qb.orderBy('feed.id', sort);

    if (page && pageSize) {
      qb.offset((page - 1) * pageSize).limit(pageSize);
    }
    const feeds = await qb.distinct(true).getMany();
    return FeedEntityMapper.toDomain(feeds);
  }

  async findByCoordinates(getDto: GetFeedsRequestDTO): Promise<Feed[]> {
    const { minX, minY, maxX, maxY, page, pageSize } = getDto;
    const qb = this.createQueryBuilder('feed');
    const centerPoint = this.makeCenterPoint(minX, minY, maxX, maxY);

    qb.select();
    qb.innerJoin('feed.user', 'user') //
      .addSelect(['user.id', 'user.mbtiType', 'user.nickname']);
    qb.innerJoin('feed.geoMark', 'mark') //
      .addSelect(['mark.id']);

    qb.where('feed."activationAt" >= now()');
    qb.andWhere('mark.x BETWEEN :minX AND :maxX', { minX, maxX });
    qb.andWhere('mark.y BETWEEN :minY AND :maxY', { minY, maxY });

    if (page && pageSize) {
      qb.offset((page - 1) * pageSize).limit(pageSize);
    }
    /* 1. 추천이 많은 순 > 2. 중심좌표 기준 가까운 거리 > 3. 남은 잔여시간이 많은 순 */
    qb.orderBy('feed.recommendCount', 'DESC');
    qb.addOrderBy(`ST_Distance(mark.point, ${centerPoint})`, 'DESC');
    qb.addOrderBy('feed.activationAt', 'DESC');

    const feeds = await qb.getMany();
    return FeedEntityMapper.toDomain(feeds);
  }

  async findByPolygon(getDto: GetFeedsRequestDTO): Promise<Feed[]> {
    const { minX, minY, maxX, maxY, page, pageSize } = getDto;
    const qb = this.createQueryBuilder('feed');
    const centerPoint = this.makeCenterPoint(minX, minY, maxX, maxY);

    qb.select();
    qb.innerJoin('feed.user', 'user') //
      .addSelect(['user.id', 'user.mbtiType', 'user.nickname']);
    qb.innerJoin('feed.geoMark', 'mark') //
      .addSelect(['mark.id']);

    qb.where('feed."activationAt" >= now()');
    qb.andWhere(
      `ST_Contains(
          ST_MakeEnvelope(:minX, :minY, :maxX, :maxY, 4326),
          mark.point
        )`,
      { minX, minY, maxX, maxY },
    );

    if (page && pageSize) {
      qb.offset((page - 1) * pageSize).limit(pageSize);
    }
    /* 1. 추천이 많은 순 > 2. 중심좌표 기준 가까운 거리 > 3. 남은 잔여시간이 많은 순 */
    qb.orderBy('feed.recommendCount', 'DESC');
    qb.addOrderBy(`ST_Distance(mark.point, ${centerPoint})`, 'DESC');
    qb.addOrderBy('feed.activationAt', 'DESC');

    const feeds = await qb.getMany();
    return FeedEntityMapper.toDomain(feeds);
  }

  async existByUserId(feedId: number, userId: number): Promise<boolean> {
    const count = await this.createQueryBuilder('feed')
      .where('feed.id = :feedId', { feedId })
      .andWhere('feed.user = :userId', { userId })
      .getCount();
    return !!count;
  }

  async findOneByGeoMarkId(geoMarkId: number): Promise<Feed | null> {
    const feed = await this.findOne({
      select: {
        user: { id: true, nickname: true, mbtiType: true },
      },
      where: {
        geoMark: { id: geoMarkId },
        activationAt: MoreThanOrEqual(new Date()),
      },
      relations: this.getRelationsByFeed(),
    });

    return feed ? FeedEntityMapper.toDomain(feed) : null;
  }

  async findOneByPK(feedId: number): Promise<Feed | null> {
    const feed = await this.findOne({
      select: {
        user: { id: true, nickname: true, mbtiType: true },
      },
      where: { id: feedId, activationAt: MoreThanOrEqual(new Date()) },
      relations: this.getRelationsByFeed(),
    });
    return feed ? FeedEntityMapper.toDomain(feed) : null;
  }

  async findOnePure(feedId: number): Promise<Feed | null> {
    const feed = await this.findOne({
      select: {
        user: { id: true, nickname: true, mbtiType: true },
        geoMark: { id: true },
      },
      where: { id: feedId, activationAt: MoreThanOrEqual(new Date()) },
      relations: { user: true, geoMark: true },
    });
    return feed ? FeedEntityMapper.toDomain(feed) : null;
  }

  async createOne(userId: number, postDto: PostFeedRequestDTO): Promise<Feed> {
    const { x, y } = postDto.geoMark;
    const feed = this.create({
      ...postDto,
      activationAt: DateUtil.addHours(6),
      geoMark: {
        ...postDto.geoMark,
        point: {
          type: 'Point',
          coordinates: [x, y],
        },
      },
      user: { id: userId },
    });
    await this.save(feed);
    return FeedEntityMapper.toDomain(feed);
  }

  async updateProperty(
    feedId: number,
    properties: Partial<FeedEntity>,
  ): Promise<void> {
    await this.update(feedId, { ...properties });
  }

  /* ======================== Comment ======================== */

  async createComment(
    userId: number,
    feedId: number,
    postDto: PostFeedCommentRequestDTO,
  ): Promise<Comment> {
    const comment = this.commentRepo.create({
      ...postDto,
      user: { id: userId },
      feed: { id: feedId },
    });
    await this.commentRepo.save(comment);
    return CommentEntityMapper.toDomain(comment);
  }

  async findCommentsByFeedId(
    feedId: number,
    getDto: GetFeedCommentsRequestDTO,
  ): Promise<Comment[]> {
    const { nextCursor, size, sort } = getDto;
    const qb = this.commentRepo.createQueryBuilder('comment');
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

  /* ======================== RecommendHistory ======================== */

  async existRecommendHistory(
    userId: number,
    feedId: number,
    type: RecommendType,
  ): Promise<boolean> {
    const qb = this.recommendHistoryRepo.createQueryBuilder('history');
    qb.where('history.user = :userId', { userId });
    qb.andWhere('history.feed = :feedId', { feedId });
    qb.andWhere('history.type = :type', { type });
    const count = await qb.getCount();
    return !!count;
  }

  async createRecommendHistory(
    userId: number,
    feedId: number,
    type: RecommendType,
  ): Promise<void> {
    const recommedHistory = this.recommendHistoryRepo.create({
      type,
      user: { id: userId },
      feed: { id: feedId },
    });
    await this.recommendHistoryRepo.save(recommedHistory);
  }

  /* ======================== ReportHistory ======================== */

  async existReportHistory(userId: number, feedId: number): Promise<boolean> {
    const qb = this.reportHistoryRepo.createQueryBuilder('history');
    qb.where('history.user = :userId', { userId });
    qb.andWhere('history.feed = :feedId', { feedId });
    const count = await qb.getCount();
    return !!count;
  }

  async createReportHistory(
    userId: number,
    feedId: number,
    postDto: PostFeedReportRequestDTO,
  ): Promise<void> {
    const reportHistory = this.reportHistoryRepo.create({
      ...postDto,
      user: { id: userId },
      feed: { id: feedId },
    });
    await this.reportHistoryRepo.save(reportHistory);
  }

  /* ======================== private ======================== */
  private makeCenterPoint(X: number, Y: number): string;
  private makeCenterPoint(
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
  ): string;
  private makeCenterPoint(
    a: number,
    b: number,
    c?: number,
    d?: number,
  ): string {
    return arguments.length === 2
      ? `ST_SetSRID(ST_MakePoint(${a}, ${b}), 4326)`
      : `ST_SetSRID(ST_MakePoint(${(a + b) / 2}, ${(c + d) / 2}), 4326)`;
  }

  private getRelationsByFeed() {
    return {
      user: true,
      comments: true,
      geoMark: {
        regionInfo: true,
        address: true,
        roadAddress: true,
      },
    };
  }
}
