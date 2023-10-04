import { OmitType } from '@nestjs/swagger';

import { RoadAddressEntity } from '@app/entity';
import { BaseDomain } from 'src/domain/base.domain';

export class RoadAddressProps extends OmitType(RoadAddressEntity, [
  'geoMark',
]) {}

export class RoadAddress extends BaseDomain<RoadAddressProps> {
  constructor(readonly props: RoadAddressProps) {
    super(props);
  }

  /**
   * 전체 도로명 주소
   */
  get addressName(): string {
    return this.props.addressName;
  }

  /**
   * 지역명1
   */
  get region1DepthName(): string {
    return this.props.region1DepthName;
  }

  /**
   * 지역명2
   */
  get region2DepthName(): string {
    return this.props.region2DepthName;
  }

  /**
   * 지역명3
   */
  get region3DepthName(): string {
    return this.props.region3DepthName;
  }

  /**
   * 도로명
   */
  get roadName(): string {
    return this.props.roadName;
  }

  /**
   * 지하 여부, Y 또는 N
   */
  get undergroundYn(): 'Y' | 'N' {
    return this.props.undergroundYn;
  }

  /**
   * 건물 본번
   */
  get mainBuildingNo(): string {
    return this.props.mainBuildingNo;
  }

  /**
   * 건물 부번, 없을 경우 빈 문자열("") 반환
   */
  get subBuildingNo(): string {
    return this.props.subBuildingNo;
  }

  /**
   * 건물 이름
   */
  get buildingName(): string {
    return this.props.buildingName;
  }

  /**
   * 우편번호(5자리)
   */
  get zoneNo(): string {
    return this.props.zoneNo;
  }
}
