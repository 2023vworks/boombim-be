import { EntityManager } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { PolygonInfoEntity, RegionType } from '@app/entity';
import { Geo } from './polygon/geo.type';

//runOrm(createPolyGonInfo);

export async function createPolyGonInfo(
  txManager: EntityManager,
): Promise<void> {
  // 테스트 데이터 준비
  const seoulGeoDatas = getSeoulGeoDatas('seoul-city.geo-35%.geo.json');

  // polygon entity 생성
  const polygonRepo = txManager.getRepository(PolygonInfoEntity);
  const polygons = seoulGeoDatas.map(({ properties, geometry }) => {
    return polygonRepo.create({
      addressPart: properties.adm_nm,
      city: properties.sidonm,
      gu: properties.sggnm,
      dong: properties.temp.split(' ')[1],
      regionType: RegionType.H,
      polygon: {
        type: 'Polygon',
        coordinates: geometry.coordinates,
      },
    });
  });
  await polygonRepo.save(polygons);
  // NOTE: DBMS가 폴리곤이 저장된 테이블에 통계 수집하게 하여 쿼리 최적화를 수행한다.
  await polygonRepo.query('ANALYZE polygon_info;');
}

function readJsonFile(filename: string) {
  const jsonFillPath = path.join(__dirname, 'polygon', filename);
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
