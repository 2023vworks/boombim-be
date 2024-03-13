import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PickType,
} from '@nestjs/swagger';

import {
  AddressEntity,
  FeedEntity,
  GeoMarkEntity,
  RegionInfoEntity,
  RoadAddressEntity,
} from '@app/entity';
import { Expose } from 'class-transformer';
import { InstanceValidator, InstanceValidatorOptional } from '@app/common';

class PostFeedWithRegionInfoRequestDTO extends OmitType(RegionInfoEntity, [
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'geoMark',
]) {}
class PostFeedWithAddressRequestDTO extends OmitType(AddressEntity, [
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'geoMark',
]) {}
class PostFeedWithRoadAddressRequestDTO extends OmitType(RoadAddressEntity, [
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'geoMark',
]) {}

/**
 * 피드 작성 요청에 사용하는 마커 데이터
 */
class PostFeedWithGeoMarkRequestDTO extends PickType(GeoMarkEntity, [
  'x',
  'y',
]) {
  @ApiProperty({
    description: '행정구역 정보',
    type: PostFeedWithRegionInfoRequestDTO,
  })
  @Expose()
  @InstanceValidator(PostFeedWithRegionInfoRequestDTO)
  regionInfo: PostFeedWithRegionInfoRequestDTO;

  @ApiProperty({
    description: '(구)주소 정보',
    type: PostFeedWithAddressRequestDTO,
  })
  @Expose()
  @InstanceValidator(PostFeedWithAddressRequestDTO)
  address: PostFeedWithAddressRequestDTO;

  @ApiPropertyOptional({
    description: '도로명 주소 정보',
    type: PostFeedWithRoadAddressRequestDTO,
  })
  @Expose()
  @InstanceValidatorOptional(PostFeedWithRoadAddressRequestDTO)
  roadAddress?: PostFeedWithRoadAddressRequestDTO;
}

export class PostFeedRequestDTO extends PickType(FeedEntity, [
  'content',
  'hashTags',
]) {
  @ApiProperty({
    description: '지도 마커 정보',
    type: PostFeedWithGeoMarkRequestDTO,
  })
  @Expose()
  @InstanceValidator(PostFeedWithGeoMarkRequestDTO)
  geoMark: PostFeedWithGeoMarkRequestDTO;
}
