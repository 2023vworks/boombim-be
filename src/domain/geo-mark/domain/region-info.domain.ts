import { OmitType } from '@nestjs/swagger';

import { RegionInfoEntity } from '@app/entity';
import { BaseDomain } from 'src/domain/base.domain';

export class RegionInfoProps extends OmitType(RegionInfoEntity, ['geoMark']) {}

export class RegionInfo extends BaseDomain<RegionInfoProps> {
  constructor(readonly props: RegionInfoProps) {
    super(props);
  }

  /**
   * H(행정동) 또는 B(법정동)
   */
  get regionType(): string {
    return this.props.regionType;
  }
  /**
   * 전체 지역 명칭
   */
  get addressName(): string {
    return this.props.addressName;
  }
  /**
   * 지역 1Depth, 시도 단위 바다 영역은 존재하지 않음
   */
  get region1DepthName(): string {
    return this.props.region1DepthName;
  }
  /**
   * 지역 2Depth, 구 단위 바다 영역은 존재하지 않음
   */
  get region2DepthName(): string {
    return this.props.region2DepthName;
  }
  /**
   * 지역 3Depth, 동 단위 바다 영역은 존재하지 않음
   */
  get region3DepthName(): string {
    return this.props.region3DepthName;
  }
  /**
   * 지역 4Depth, 리 영역인 경우만 존재 regionType이 법정동이며;
   */
  get region4DepthName(): string {
    return this.props.region4DepthName;
  }
  /**
   * region 코드
   */
  get code(): string {
    return this.props.code;
  }
  /**
   * X 좌표값, 경위도인 경우 경도(longitude)
   * - Double
   */
  get x(): number {
    return this.props.x;
  }
  /**
   * Y 좌표값, 경위도인 경우 위도(latitude)
   * - Double
   */
  get y(): number {
    return this.props.y;
  }
}
