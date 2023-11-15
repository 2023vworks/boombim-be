import { CustomNamingStrategy } from '@app/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  Column,
  DataSource,
  Entity,
  Point,
  Polygon,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Geo } from './geo.type';

@Entity('polygon_test')
class PolygonTest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { comment: '시 구 동' })
  siDongGu: string;

  @Column('varchar', { comment: '구 이름' })
  gu: string;

  @Column('varchar', { comment: '동' })
  dong: string;

  @Column('geometry', { srid: 4326 })
  polygon: Polygon;
}

@Entity('point_test')
class PointTest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { comment: '경도(x좌표)' })
  x: number;

  @Column('decimal', { comment: '위도(y좌표)' })
  y: number;

  @Column('varchar', { comment: '주소' })
  address: string;

  @Column('varchar', { comment: '동' })
  dong: string;

  @Column('geometry', { srid: 4326 })
  point: Point;

  @Column('varchar', { comment: '매장명' })
  store: string;
}

const OrmDataSource = new DataSource({
  type: process.env.DATABASE_TYPE as any,
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  database: 'geo_test',
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  logging: 'all',
  entities: [PolygonTest, PointTest],
  dropSchema: true,
  synchronize: true,
  namingStrategy: new CustomNamingStrategy(),
});

// eslint-disable-next-line @typescript-eslint/ban-types
export const runOrm = (callback: Function) =>
  OrmDataSource.initialize()
    .then(async (dataSource) => {
      console.log('Data Source has been initialized!');
      await dataSource.transaction((txDataSource) => callback(txDataSource));
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
    })
    .finally(async () => {
      console.log('Data Source has been Destroy!');
      await OrmDataSource.destroy();
    });

runOrm(async (dataSource: DataSource) => {
  // 테스트 데이터 준비
  const seoulGeoDatas = getSeoulGeoDatas('seoul-city.geo-35%.geo.json');

  // polygon entity 생성
  const polygonRepo = dataSource.getRepository(PolygonTest);
  const polygons = seoulGeoDatas.map(({ properties, geometry }) => {
    return polygonRepo.create({
      siDongGu: properties.adm_nm,
      gu: properties.sggnm,
      dong: properties.temp.split(' ')[1],
      polygon: {
        type: 'Polygon',
        coordinates: geometry.coordinates,
      },
    });
  });
  await polygonRepo.save(polygons);

  // point entity 생성
  const pointRepo = dataSource.getRepository(PointTest);
  const addrDatas: any = readJsonFile('잠실-스타벅스-주소.json');

  const points = addrDatas.map(({ store, dong, hDong, address_name, x, y }) => {
    return pointRepo.create({
      dong: hDong ?? dong,
      address: address_name,
      x,
      y,
      point: {
        type: 'Point',
        coordinates: [x, y],
      },
      store,
    });
  });
  await pointRepo.save(points);
});

function readJsonFile(filename: string) {
  const jsonFillPath = path.join(__dirname, filename);
  const json = fs.readFileSync(jsonFillPath, 'utf-8');
  return JSON.parse(json);
}

/**
 * geoJson에서 폴리곤 데이터 가져오기
 * @param filename
 * @returns
 */
function getSeoulGeoDatas(filename: string): Geo[] {
  return readJsonFile(filename).features;
}
