import { Expose } from 'class-transformer';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PickType,
} from '@nestjs/swagger';

import {
  InstanceValidator,
  InstanceValidatorOptional,
  IntValidator,
  defaultResponseProperties,
} from '@app/common';
import {
  AddressEntity,
  FeedEntity,
  GeoMarkEntity,
  RegionInfoEntity,
  RoadAddressEntity,
  UserEntity,
} from '@app/entity';

class PostFeedWithRegionInfoResponseDTO extends OmitType(RegionInfoEntity, [
  'geoMark',
]) {}
class PostFeedWithAddressResponseDTO extends OmitType(AddressEntity, [
  'geoMark',
]) {}
class PostFeedWithRoadAddressResponseDTO extends OmitType(RoadAddressEntity, [
  'geoMark',
]) {}
class PostFeedWithGeoMarkResponseDTO extends PickType(GeoMarkEntity, ['feed']) {
  @ApiProperty({
    description: '행정구역 정보',
    type: PostFeedWithRegionInfoResponseDTO,
  })
  @Expose()
  @InstanceValidator(PostFeedWithRegionInfoResponseDTO)
  regionInfo: PostFeedWithRegionInfoResponseDTO;

  @ApiProperty({
    description: '(구)주소 정보',
    type: PostFeedWithAddressResponseDTO,
  })
  @Expose()
  @InstanceValidator(PostFeedWithAddressResponseDTO)
  address: PostFeedWithAddressResponseDTO;

  @ApiPropertyOptional({
    description: '도로명 주소 정보',
    type: PostFeedWithAddressResponseDTO,
  })
  @Expose()
  @InstanceValidatorOptional(PostFeedWithAddressResponseDTO)
  roadAddress: PostFeedWithRoadAddressResponseDTO;
}

class GetFeedWithUserResponseDTO extends PickType(UserEntity, [
  'mbtiType',
  'nickname',
]) {}

export class GetFeedResponseDTO extends PickType(FeedEntity, [
  ...defaultResponseProperties,
  'activity',
  'content',
  'thumbnailImages',
  'images',
  'hashTags',
  'activationAt',
  'recommendCount',
  'unrecommendCount',
  'reportCount',
  'viewCount',
  'commentCount',
]) {
  @ApiProperty({
    description: '피드 작성자 정보',
    type: GetFeedWithUserResponseDTO,
  })
  @Expose()
  @InstanceValidator(GetFeedWithUserResponseDTO)
  user: GetFeedWithUserResponseDTO;

  @ApiProperty({
    description: '지도 마커 ID',
    type: Number,
    minimum: 1,
    maximum: 2147483647,
  })
  @IntValidator()
  @Expose()
  geoMarkId: number;

  @ApiProperty({
    description: '지도 마커 정보',
    type: PostFeedWithGeoMarkResponseDTO,
  })
  @Expose()
  @InstanceValidator(PostFeedWithGeoMarkResponseDTO)
  geoMark: PostFeedWithGeoMarkResponseDTO;
}
