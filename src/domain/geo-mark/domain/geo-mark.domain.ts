import { OmitType } from '@nestjs/swagger';

import { CoordType, GeoMarkEntity, RegionType } from '@app/entity';
import { BaseDomain } from 'src/domain/base.domain';
import { RegionInfo } from './region-info.domain';
import { Address } from './address.domain';
import { RoadAddress } from './road-address.domain';

export class GeoMarkProps extends OmitType(GeoMarkEntity, [
  'regionInfo',
  'address',
  'roadAddress',
]) {
  regionInfo: RegionInfo;
  address: Address;
  roadAddress: RoadAddress | null;
  activity: number;
}

export class GeoMark extends BaseDomain<GeoMarkProps> {
  constructor(readonly props: GeoMarkProps) {
    super(props);
  }

  /**
   * 경도
   * - Double
   * - x = longtitue = 경도
   */
  get x(): number {
    return this.props.x;
  }

  /**
   * 위도
   * - Double
   * - y = lattitue = 위도
   */
  get y(): number {
    return this.props.y;
  }
  /**
   * 좌표계 타입
   * - default 'WGS84'
   */
  get type(): CoordType {
    return this.props.type;
  }

  /** H(행정동) 또는 B(법정동) */
  get regionType(): RegionType {
    return this.props.regionType;
  }

  /** 마커가 속하는 지역 주소
   * regionType(행정동 or 법정동)에 따른 지역 명칭
   */
  get region(): string {
    return this.props.region;
  }

  /**
   * 행정구역 정보
   */
  get regionInfo(): RegionInfo {
    return this.props.regionInfo;
  }

  /**
   * 주소 정보
   */
  get address(): Address {
    return this.props.address;
  }

  /**
   * 도로명 주소 정보
   */
  get roadAddress(): RoadAddress | null {
    return this.props.roadAddress;
  }

  /* ================== custom ================== */
  get activity(): number {
    return this.props.activity;
  }
}
