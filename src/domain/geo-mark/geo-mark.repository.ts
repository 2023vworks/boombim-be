import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { CustomRepository, Util } from '@app/common';
import { FeedEntity, GeoMarkEntity } from '@app/entity';
import { GeoMark, GeoMarkEntityMapper } from './domain';
import { GetGeoMarksRequestDTO } from './dto';

export const GeoMarkRepositoryToken = Symbol('GeoMarkRepositoryToken');
export interface GeoMarkRepository extends CustomRepository<GeoMarkEntity> {
  /**
   * 좌표를 사용하여 단순 검색
   * - Limit  (cost=167.56..1435.06 rows=1000 width=108) (actual time=2.328..4.116 rows=1000 loops=1)
   * @param getDto
   */
  findByCoordinates(getDto: GetGeoMarksRequestDTO): Promise<GeoMark[]>;
  /**
   * PostGIS의 Polygon을 사용하여 검색
   * - Limit  (cost=0.56..26545.45 rows=1000 width=108) (actual time=0.043..4.919 rows=1000 loops=1)
   * @param getDto
   */
  findByPolygon(getDto: GetGeoMarksRequestDTO): Promise<GeoMark[]>;
}

export class GeoMarkRepositoryImpl
  extends CustomRepository<GeoMarkEntity>
  implements GeoMarkRepository
{
  constructor(
    @InjectEntityManager()
    readonly manager: EntityManager,
  ) {
    super(GeoMarkEntity, manager);
  }

  async findByCoordinates(getDto: GetGeoMarksRequestDTO): Promise<GeoMark[]> {
    const { minX, minY, maxX, maxY, nextCursor, size, sort } = getDto;
    const feedRepo = this.manager.getRepository(FeedEntity);
    const qb = feedRepo.createQueryBuilder('feed');
    qb.select(['feed.id', 'feed.activity']);
    qb.innerJoinAndSelect('feed.geoMark', 'mark');
    qb.where('1 = 1');
    qb.andWhere('mark.x BETWEEN :minX AND :maxX', { minX, maxX });
    qb.andWhere('mark.y BETWEEN :minY AND :maxY', { minY, maxY });
    qb.andWhere('feed."activationAt" >= now()');

    if (!Util.isNil(nextCursor)) {
      sort === 'DESC' && qb.andWhere('feed.id <= :id', { id: nextCursor });
      sort !== 'DESC' && qb.andWhere('feed.id >= :id', { id: nextCursor });
    }
    qb.limit(size);
    qb.orderBy('mark.id', sort);

    const feeds = await qb.getMany();
    return feeds.map((feed) =>
      GeoMarkEntityMapper.toDomain({
        ...feed.geoMark,
        activity: feed.activity,
      }),
    );
  }

  async findByPolygon(getDto: GetGeoMarksRequestDTO): Promise<GeoMark[]> {
    const { minX, minY, maxX, maxY, nextCursor, size, sort } = getDto;
    const feedRepo = this.manager.getRepository(FeedEntity);
    const qb = feedRepo.createQueryBuilder('feed');
    qb.select(['feed.id', 'feed.activity']);
    qb.innerJoinAndSelect('feed.geoMark', 'mark');
    qb.where(
      `ST_Contains(
          ST_MakeEnvelope(:minX, :minY, :maxX, :maxY, 4326),
          mark.point
        )`,
      { minX, minY, maxX, maxY },
    );
    qb.andWhere('feed."activationAt" >= now()');
    if (!Util.isNil(nextCursor)) {
      sort === 'DESC' && qb.andWhere('feed.id <= :id', { id: nextCursor });
      sort !== 'DESC' && qb.andWhere('feed.id >= :id', { id: nextCursor });
    }
    qb.limit(size);
    qb.orderBy('mark.id', 'DESC');

    const feeds = await qb.getMany();
    return feeds.map((feed) =>
      GeoMarkEntityMapper.toDomain({
        ...feed.geoMark,
        activity: feed.activity,
      }),
    );
  }
}

/*
SELECT *
FROM geo_data
WHERE ST_Contains(
    ST_MakeEnvelope(127.10646933077587, 37.51273616606448, 127.11595361763263, 37.516466400555935, 4326),
    coordinates
);
*/
