import { OmitType } from '@nestjs/swagger';

import { AddressEntity } from '@app/entity';
import { BaseDomain } from 'src/domain/base.domain';

export class AddressProps extends OmitType(AddressEntity, ['geoMark']) {}

export class Address extends BaseDomain<AddressEntity> {
  constructor(readonly props: AddressEntity) {
    super(props);
  }

  /**
   * 전체 지번 주소
   */
  get addressName(): string {
    return this.props.addressName;
  }

  /**
   *  지역 1 Depth, 시도 단위
   */
  get region1DepthName(): string {
    return this.props.region1DepthName;
  }

  /**
   *  지역 2 Depth, 구 단위
   */
  get region2DepthName(): string {
    return this.props.region2DepthName;
  }

  /**
   *  지역 3 Depth, 동 단위
   */
  get region3DepthName(): string {
    return this.props.region3DepthName;
  }

  /**
   *  지역 3 Depth, 행정동 명칭
   */
  get region3DepthHName(): string {
    return this.props.region3DepthHName;
  }

  /**
   *  산 여부, Y 또는 N
   */
  get mountainYn(): string {
    return this.props.mountainYn;
  }

  /**
   *  지번 주번지
   */
  get mainAddressNo(): string {
    return this.props.mainAddressNo;
  }

  /**
   *  지번 부번지, 없을 경우 빈 문자열("") 반환
   */
  get subAddressNo(): string {
    return this.props.subAddressNo;
  }
}
