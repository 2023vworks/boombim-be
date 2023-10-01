import { CoordType } from '../enum';
import { Feed } from '../feed';
import { Timestamp } from '../timestamp.entity';
import { Address } from './address.entity';
import { RegionInfo } from './region-info.entity';
import { RoadAddress } from './road-address.entity';

export class GeoMark extends Timestamp {
  /**
   * 경도
   * - Double
   * - x = longtitue = 경도
   */
  x: number;
  /**
   * 위도
   * - Double
   * - y = lattitue = 위도
   */
  y: number;
  /**
   * 좌표계 타입
   * - default 'WGS84'
   */
  type: CoordType;

  /**
   * 행정구역 정보
   */
  regionInfo: RegionInfo;

  /**
   * 주소 정보
   */
  address: Address;

  /**
   * 도로명 주소 정보
   */
  roadAddress?: RoadAddress | null;

  /* ========== 연관관계 ==========*/
  // 관계
  feed: Feed;
}
