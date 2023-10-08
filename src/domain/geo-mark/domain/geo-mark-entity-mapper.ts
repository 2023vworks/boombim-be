import { GeoMarkEntity } from '@app/entity';
import { Address } from './address.domain';
import { GeoMark } from './geo-mark.domain';
import { RegionInfo } from './region-info.domain';
import { RoadAddress } from './road-address.domain';

type CustomGeoMarkEntity = GeoMarkEntity & { activity: number };

export class GeoMarkEntityMapper {
  static toDomain(entity: CustomGeoMarkEntity): GeoMark {
    return new GeoMark({
      ...entity,
      regionInfo: new RegionInfo(entity.regionInfo),
      address: new Address(entity.address),
      roadAddress: entity.roadAddress
        ? new RoadAddress(entity.roadAddress)
        : null,
    }).setBase(entity.id, entity.createdAt, entity.updatedAt);
  }
}
