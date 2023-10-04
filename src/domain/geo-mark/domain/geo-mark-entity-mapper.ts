import { Util } from '@app/common';
import {
  AddressEntity,
  GeoMarkEntity,
  RegionInfoEntity,
  RoadAddressEntity,
} from '@app/entity';
import { GeoMark } from './geo-mark.domain';
import { RegionInfo } from './region-info.domain';
import { Address } from './address.domain';
import { RoadAddress } from './road-address.domain';

export class GeoMarkEntityMapper {
  static toDomain(entity: GeoMarkEntity): GeoMark {
    return new GeoMark({
      ...entity,
      regionInfo: new RegionInfo(entity.regionInfo),
      address: new Address(entity.address),
      roadAddress: entity.roadAddress
        ? new RoadAddress(entity.roadAddress)
        : null,
    }).setBase(entity.id, entity.createdAt, entity.updatedAt);
  }

  static toEntity(domain: GeoMark): GeoMarkEntity {
    const { regionInfo, address, roadAddress, ...other } = domain.props;
    return {
      id: domain.id,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      ...other,
      point: {
        type: 'Point',
        coordinates: [domain.props.x, domain.props.y],
      },
      srid: 4326,
      regionInfo: Util.toInstance(RegionInfoEntity, { ...regionInfo }),
      address: Util.toInstance(AddressEntity, { ...address }),
      roadAddress: Util.toInstance(RoadAddressEntity, { ...roadAddress }),
      feed: undefined, // 연관관계 주인 feed
    };
  }
}
